import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListMapPoints, useListMapRoutes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, MapPin, BookOpen, Mountain, Building2, TreePine, Utensils, Scroll, Route, Clock, ChevronRight } from "lucide-react";

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  landmark: { icon: <Building2 className="h-4 w-4" />, color: "bg-blue-500", label: "Достопримечательность" },
  nature: { icon: <TreePine className="h-4 w-4" />, color: "bg-green-500", label: "Природа" },
  museum: { icon: <BookOpen className="h-4 w-4" />, color: "bg-purple-500", label: "Музей" },
  hotel: { icon: <Mountain className="h-4 w-4" />, color: "bg-amber-500", label: "Отель" },
  restaurant: { icon: <Utensils className="h-4 w-4" />, color: "bg-rose-500", label: "Ресторан" },
};

// SVG positions mapped to Vladivostok geography (simplified)
const mapPositions: Record<string, { x: number; y: number }> = {
  "Золотой мост": { x: 48, y: 38 },
  "Морской вокзал": { x: 46, y: 44 },
  "Остров Русский": { x: 60, y: 68 },
  "Дальневосточный морской заповедник": { x: 25, y: 80 },
  "Приморский музей им. Арсеньева": { x: 44, y: 35 },
  "Мыс Тобизина": { x: 72, y: 82 },
  "Набережная Спортивной гавани": { x: 50, y: 42 },
};

export default function MapPage() {
  const { data: points, isLoading: pointsLoading } = useListMapPoints();
  const { data: routes, isLoading: routesLoading } = useListMapRoutes();
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"points" | "routes">("points");

  const selectedPoint = points?.find(p => p.id === selected);

  const difficultyLabel: Record<string, string> = {
    easy: "Лёгкий", medium: "Средний", hard: "Сложный"
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MapIcon className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Навигация</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Карта Владивостока</h1>
          <p className="text-muted-foreground mt-1">Интерактивная карта туристических объектов Приморского края</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map SVG */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800" style={{ paddingBottom: "66%" }}>
                <div className="absolute inset-0">
                  {/* Water texture */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85].map(y => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y + 2} stroke="white" strokeWidth="0.3" strokeDasharray="2,4" />
                    ))}
                  </svg>

                  {/* Vladivostok peninsula silhouette */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Main peninsula */}
                    <polygon
                      points="35,20 65,20 70,30 75,45 68,60 55,72 45,75 35,65 30,50 32,35"
                      fill="#2a5a3a" stroke="#3a7a4a" strokeWidth="0.3"
                    />
                    {/* Russky Island */}
                    <polygon
                      points="52,58 70,58 75,70 72,80 58,85 48,78 50,65"
                      fill="#2a5a3a" stroke="#3a7a4a" strokeWidth="0.3"
                    />
                    {/* Golden Horn bay */}
                    <path d="M40,38 Q48,42 46,50 Q44,55 40,58" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                    {/* Labels */}
                    <text x="45" y="30" fill="white" fontSize="3" textAnchor="middle" className="font-bold" opacity="0.8">Владивосток</text>
                    <text x="60" y="70" fill="white" fontSize="2.5" textAnchor="middle" opacity="0.7">о. Русский</text>
                    <text x="43" y="47" fill="#93c5fd" fontSize="2" textAnchor="middle" opacity="0.8">Золотой</text>
                    <text x="43" y="50" fill="#93c5fd" fontSize="2" textAnchor="middle" opacity="0.8">Рог</text>
                    <text x="20" y="55" fill="#93c5fd" fontSize="2.5" textAnchor="middle" opacity="0.6">Амурский</text>
                    <text x="20" y="58" fill="#93c5fd" fontSize="2.5" textAnchor="middle" opacity="0.6">залив</text>
                    <text x="80" y="50" fill="#93c5fd" fontSize="2.5" textAnchor="middle" opacity="0.6">Уссурийский</text>
                    <text x="80" y="53" fill="#93c5fd" fontSize="2.5" textAnchor="middle" opacity="0.6">залив</text>
                  </svg>

                  {/* Map Points */}
                  {!pointsLoading && points?.map((point) => {
                    const pos = mapPositions[point.name] ?? { x: 50, y: 50 };
                    const cfg = categoryConfig[point.category] ?? categoryConfig.landmark;
                    const isSelected = selected === point.id;

                    return (
                      <button
                        key={point.id}
                        onClick={() => setSelected(isSelected ? null : point.id)}
                        data-testid={`map-point-${point.id}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        <motion.div
                          animate={{ scale: isSelected ? 1.4 : 1 }}
                          whileHover={{ scale: 1.2 }}
                          className={`h-7 w-7 rounded-full ${cfg.color} text-white flex items-center justify-center shadow-lg ring-2 ring-white/30 ${isSelected ? "ring-white" : ""}`}
                        >
                          {cfg.icon}
                        </motion.div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {point.name}
                        </div>
                      </button>
                    );
                  })}

                  {/* Compass Rose */}
                  <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-white/60 text-xs font-bold">
                    С
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="p-4 border-t border-border/40 flex flex-wrap gap-3">
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className={`h-3 w-3 rounded-full ${cfg.color}`} />
                    {cfg.label}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Detail panel */}
            <AnimatePresence>
              {selectedPoint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="rounded-2xl border-accent/30 bg-accent/5">
                    <div className="h-36 overflow-hidden rounded-t-2xl">
                      <img src={selectedPoint.imageUrl} alt={selectedPoint.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-bold text-foreground">{selectedPoint.name}</h3>
                      <Badge className={`${categoryConfig[selectedPoint.category]?.color ?? "bg-gray-500"} text-white border-0 text-xs`}>
                        {categoryConfig[selectedPoint.category]?.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{selectedPoint.description}</p>
                      {selectedPoint.legend && (
                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Scroll className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Легенда</span>
                          </div>
                          <p className="text-xs text-muted-foreground italic leading-relaxed">{selectedPoint.legend}</p>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => setSelected(null)}>
                        Закрыть
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2">
              <Button variant={activeTab === "points" ? "default" : "outline"} size="sm" className="flex-1 rounded-xl" onClick={() => setActiveTab("points")}>
                <MapPin className="h-4 w-4 mr-1" /> Объекты
              </Button>
              <Button variant={activeTab === "routes" ? "default" : "outline"} size="sm" className="flex-1 rounded-xl" onClick={() => setActiveTab("routes")}>
                <Route className="h-4 w-4 mr-1" /> Маршруты
              </Button>
            </div>

            {activeTab === "points" && (
              <div className="space-y-2">
                {pointsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />) :
                  points?.map(point => (
                    <button
                      key={point.id}
                      onClick={() => setSelected(selected === point.id ? null : point.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${selected === point.id ? "border-accent bg-accent/5" : "border-border/60 hover:border-accent/40 hover:bg-muted/30"}`}
                      data-testid={`list-point-${point.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-7 w-7 rounded-full ${categoryConfig[point.category]?.color ?? "bg-gray-500"} text-white flex items-center justify-center flex-shrink-0`}>
                          {categoryConfig[point.category]?.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{point.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryConfig[point.category]?.label}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      </div>
                    </button>
                  ))
                }
              </div>
            )}

            {activeTab === "routes" && (
              <div className="space-y-3">
                {routesLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />) :
                  routes?.map(route => (
                    <Card key={route.id} className="rounded-xl border-border/60">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm text-foreground">{route.name}</h4>
                          {route.isStudentCreated && (
                            <Badge variant="outline" className="text-xs">Студент</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{route.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {route.durationHours}ч</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {route.pointIds.length} точек</span>
                          <span>{difficultyLabel[route.difficulty] ?? route.difficulty}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Автор: {route.authorName}</p>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
