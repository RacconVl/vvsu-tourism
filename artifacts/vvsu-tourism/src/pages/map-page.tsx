import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { YMaps, Map, Placemark, Polyline } from "react-yandex-maps";
import { useListMapPoints, useListMapRoutes } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, BookOpen, Mountain, Building2, TreePine, Utensils, Scroll, Route, Clock } from "lucide-react";

const categoryConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  landmark: { color: "#2563eb", label: "Достопримечательность", icon: <Building2 className="h-4 w-4" /> },
  nature: { color: "#16a34a", label: "Природа", icon: <TreePine className="h-4 w-4" /> },
  museum: { color: "#9333ea", label: "Музей", icon: <BookOpen className="h-4 w-4" /> },
  hotel: { color: "#d97706", label: "Отель", icon: <Mountain className="h-4 w-4" /> },
  restaurant: { color: "#e11d48", label: "Ресторан", icon: <Utensils className="h-4 w-4" /> },
};

const pointCoordinates: Record<string, [number, number]> = {
  "Золотой мост": [43.1126, 131.8869],
  "Морской вокзал": [43.1112, 131.8854],
  "Остров Русский": [43.0214, 131.9043],
  "Дальневосточный морской заповедник": [42.6175, 131.1422],
  "Приморский музей им. Арсеньева": [43.1167, 131.8847],
  "Мыс Тобизина": [42.9745, 131.9952],
  "Набережная Спортивной гавани": [43.1163, 131.8765],
  "Маяк Эгершельда": [43.0710, 131.8418],
  "ДВФУ Кампус": [43.0247, 131.8911],
  "Покровский собор": [43.1217, 131.8929],
  "Видовая площадка Орлиное гнездо": [43.1175, 131.8841],
  "Русский мост": [43.0535, 131.8869],
};

export default function MapPage() {
  const { data: points, isLoading: pointsLoading } = useListMapPoints();
  const { data: routes, isLoading: routesLoading } = useListMapRoutes();
  const [activeTab, setActiveTab] = useState<"points" | "routes">("points");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<number | null>(null);
  const [mapInstance, setMapInstance] = useState<{ setCenter: (c: number[], z: number, opts?: object) => void } | null>(null);

  const difficultyLabel: Record<string, string> = {
    easy: "Лёгкий", medium: "Средний", hard: "Сложный",
  };

  const enrichedPoints = useMemo(() => {
    if (!points) return [];
    return points.map(p => {
      const cat = categoryConfig[p.category] ?? categoryConfig.landmark;
      const coords = pointCoordinates[p.name] ?? [
        Number((p as { latitude?: number | string }).latitude ?? 43.115),
        Number((p as { longitude?: number | string }).longitude ?? 131.886),
      ];
      return { ...p, coords: coords as [number, number], catConfig: cat };
    });
  }, [points]);

  const activeRoute = routes?.find(r => r.id === activeRouteId);
  const routeCoords = useMemo<[number, number][]>(() => {
    if (!activeRoute || !points) return [];
    const ids = (activeRoute as { pointIds?: (number | string)[] }).pointIds ?? [];
    return ids
      .map(id => {
        const p = enrichedPoints.find(pt => pt.id === Number(id));
        return p?.coords;
      })
      .filter((c): c is [number, number] => Array.isArray(c));
  }, [activeRoute, points, enrichedPoints]);

  function handlePointClick(p: { id: number; coords: [number, number] }) {
    setSelectedId(p.id);
    if (mapInstance) {
      mapInstance.setCenter(p.coords, 14, { duration: 800 });
    }
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MapIcon className="h-6 w-6 text-accent" />
            <span className="text-muted-foreground uppercase tracking-widest text-xs">Навигация</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Карта Владивостока</h1>
          <p className="text-muted-foreground mt-1">
            Интерактивная карта Приморского края на Яндекс.Картах
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Yandex Map */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div className="relative" style={{ height: "640px" }}>
                {pointsLoading ? (
                  <Skeleton className="absolute inset-0" />
                ) : (
                  <YMaps query={{ lang: "ru_RU", load: "package.full" }}>
                    <Map
                      state={{ center: [43.0815, 131.87], zoom: 11 }}
                      width="100%"
                      height="640px"
                      instanceRef={(ref: unknown) => {
                        if (ref) setMapInstance(ref as typeof mapInstance);
                      }}
                      options={{ suppressMapOpenBlock: true }}
                    >
                      {enrichedPoints.map(p => (
                        <Placemark
                          key={p.id}
                          geometry={p.coords}
                          properties={{
                            balloonContentHeader: p.name,
                            balloonContentBody: [
                              `<div style="min-width:200px">`,
                              `<div style="font-size:12px;color:#666;margin-bottom:6px">${p.catConfig.label}</div>`,
                              p.description
                                ? `<p style="font-size:12px;color:#333;margin-bottom:8px">${p.description}</p>`
                                : "",
                              p.legend
                                ? `<div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:8px;border-radius:4px">
                                     <div style="font-size:11px;font-weight:600;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">📜 Легенда</div>
                                     <p style="font-size:11px;color:#78350f;font-style:italic;margin:0">${p.legend}</p>
                                   </div>`
                                : "",
                              `</div>`,
                            ].join(""),
                            hintContent: p.name,
                          }}
                          options={{
                            preset: "islands#blueCircleDotIcon",
                            iconColor: p.catConfig.color,
                            balloonPanelMaxMapArea: 0,
                          }}
                          onClick={() => handlePointClick(p)}
                        />
                      ))}

                      {routeCoords.length > 1 && (
                        <Polyline
                          geometry={routeCoords}
                          options={{
                            strokeColor: "#EB7124",
                            strokeWidth: 5,
                            strokeOpacity: 0.85,
                            strokeStyle: "dash",
                          }}
                        />
                      )}
                    </Map>
                  </YMaps>
                )}
              </div>
            </Card>
            <p className="text-xs text-muted-foreground mt-2 px-1">
              © Яндекс.Карты. Используйте колесо мыши для масштабирования, перетаскивание для перемещения.
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "points" ? "default" : "outline"}
                size="sm"
                className="flex-1 rounded-xl"
                onClick={() => setActiveTab("points")}
              >
                <MapIcon className="h-4 w-4 mr-1.5" /> Объекты
              </Button>
              <Button
                variant={activeTab === "routes" ? "default" : "outline"}
                size="sm"
                className="flex-1 rounded-xl"
                onClick={() => setActiveTab("routes")}
              >
                <Route className="h-4 w-4 mr-1.5" /> Маршруты
              </Button>
            </div>

            {activeTab === "points" && (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {pointsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))
                  : enrichedPoints.map(p => (
                      <Card
                        key={p.id}
                        className={`rounded-xl border-border/60 cursor-pointer transition-all hover-elevate ${
                          selectedId === p.id ? "ring-2 ring-accent" : ""
                        }`}
                        onClick={() => handlePointClick(p)}
                      >
                        <div className="p-3 flex items-center gap-3">
                          <span
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white shrink-0"
                            style={{ background: p.catConfig.color }}
                          >
                            {p.catConfig.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.catConfig.label}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
              </div>
            )}

            {activeTab === "routes" && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {routesLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-xl" />
                    ))
                  : routes?.map(r => (
                      <Card
                        key={r.id}
                        className={`rounded-xl border-border/60 cursor-pointer transition-all hover-elevate ${
                          activeRouteId === r.id ? "ring-2 ring-accent" : ""
                        }`}
                        onClick={() => setActiveRouteId(r.id === activeRouteId ? null : r.id)}
                      >
                        <div className="p-4">
                          <div className="font-semibold text-sm mb-1">{r.name}</div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{r.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-[10px]">
                              {difficultyLabel[r.difficulty] ?? r.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {r.durationHours} ч
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
              </div>
            )}

            {/* Legend */}
            {activeTab === "points" && (
              <Card className="rounded-xl border-border/60 p-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Легенда
                </div>
                <div className="space-y-1.5">
                  {Object.entries(categoryConfig).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white shrink-0"
                        style={{ background: cfg.color }}
                      >
                        <span className="scale-75">{cfg.icon}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "routes" && activeRoute && (
              <Card className="rounded-xl border-border/60 p-3 bg-accent/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Scroll className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-semibold text-accent">Активный маршрут</span>
                </div>
                <div className="text-sm font-semibold mb-1">{activeRoute.name}</div>
                <div className="text-xs text-muted-foreground">{routeCoords.length} точек на карте</div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
