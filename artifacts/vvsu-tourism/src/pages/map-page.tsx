import { useState } from "react";
import { GeoCircle, GhostText, DotGrid } from "@/components/GraphicAccents";
import { motion } from "framer-motion";
import { useListMapPoints, useListMapRoutes } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const categoryConfig: Record<string, { color: string; label: string; mark: string }> = {
  landmark:   { color: "#2563eb", label: "Достопримечательность", mark: "ДОС" },
  nature:     { color: "#16a34a", label: "Природа",               mark: "ПРИ" },
  museum:     { color: "#9333ea", label: "Музей",                 mark: "МУЗ" },
  hotel:      { color: "#d97706", label: "Отель",                 mark: "ОТЕ" },
  restaurant: { color: "#e11d48", label: "Ресторан",              mark: "РЕС" },
};

const pointPhotos: Record<string, string> = {
  "Золотой мост":                        "/map-photos/russky-bridge.jpg",
  "Морской вокзал":                      "/map-photos/sea-station.jpg",
  "Остров Русский":                      "/map-photos/russky-island.jpg",
  "Дальневосточный морской заповедник":  "/map-photos/marine-reserve.jpg",
  "Приморский музей им. Арсеньева":      "/map-photos/arsenyev-museum.jpg",
  "Мыс Тобизина":                        "/map-photos/tobizina.jpg",
  "Набережная Спортивной гавани":        "/map-photos/sports-harbor.jpg",
  "Маяк Эгершельда":                    "/map-photos/egersheld.jpg",
  "ДВФУ Кампус":                         "/map-photos/fefu-campus.jpg",
  "Покровский собор":                    "/map-photos/pokrovsky.jpg",
  "Видовая площадка Орлиное гнездо":     "/map-photos/eagle-nest.jpg",
  "Русский мост":                        "/map-photos/russky-bridge.jpg",
};

export default function MapPage() {
  const { data: points, isLoading: pointsLoading } = useListMapPoints();
  const { data: routes, isLoading: routesLoading } = useListMapRoutes();
  const [activeTab, setActiveTab] = useState<"points" | "routes">("points");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const difficultyLabel: Record<string, string> = {
    easy: "Лёгкий", medium: "Средний", hard: "Сложный",
  };

  const enrichedPoints = (points ?? []).map(p => {
    const cat = categoryConfig[p.category] ?? categoryConfig.landmark;
    return { ...p, catConfig: cat };
  });

  const selectedPoint = enrichedPoints.find(p => p.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Editorial hero banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8" style={{ background: "#0A0A0A", border: "3px solid #0A0A0A" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 16, padding: "12px clamp(16px, 4vw, 32px)", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Туристические объекты</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span className="hidden sm:inline" style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", whiteSpace: "nowrap" }}>→ Владивосток</span>
          </div>
          <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", animation: "marquee-reverse 30s linear infinite", width: "max-content", padding: "10px 0" }}>
              {Array.from({ length: 4 }).flatMap((_, ri) =>
                ["ВЛАДИВОСТОК", "→", "ЗОЛОТОЙ РОГ", "→", "ОСТРОВ РУССКИЙ", "→", "ПРИМОРЬЕ", "→", "ТУРИСТСКИЕ МАРШРУТЫ", "→", "ЛЕГЕНДЫ ГОРОДА", "→"].map((w, wi) => (
                  <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "→" ? "#FF007F" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>{w}</span>
                ))
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px clamp(16px, 4vw, 32px)", position: "relative", overflow: "hidden" }}>
            <GhostText text="ГОРОД" size={160} color="#C6FF00" opacity={0.06} bottom={-30} right={20} />
            <GeoCircle size={240} color="#0057B8" opacity={0.1} shape="full" top={-120} right={-40} animate />
            <GeoCircle size={90} color="#C6FF00" opacity={0.2} shape="quarter-bl" bottom={-1} right={80} />
            <DotGrid cols={5} rows={3} color="#C6FF00" opacity={0.15} top={16} right={200} />
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 48, color: "#C6FF00", display: "block", lineHeight: 1 }}>⚓</span>
            </motion.div>
            <div style={{ position: "relative", zIndex: 1, minWidth: 0, flex: 1 }}>
              <h1 style={{ fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", marginBottom: 8, wordBreak: "break-word" }}>
                Объекты <span style={{ color: "#C6FF00" }}>Владивостока</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.5 }}>
                Достопримечательности, маршруты и легенды Приморского края
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "points" ? "default" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setActiveTab("points")}
          >
            Объекты
          </Button>
          <Button
            variant={activeTab === "routes" ? "default" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setActiveTab("routes")}
          >
            Маршруты
          </Button>
        </div>

        {/* Points grid */}
        {activeTab === "points" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pointsLoading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))
              : enrichedPoints.map(p => {
                  const photo = pointPhotos[p.name];
                  const isSelected = selectedId === p.id;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card
                        className={`rounded-2xl border-border/60 cursor-pointer transition-all hover-elevate overflow-hidden ${
                          isSelected ? "ring-2 ring-accent shadow-lg" : ""
                        }`}
                        onClick={() => setSelectedId(isSelected ? null : p.id)}
                      >
                        {photo && (
                          <div className="h-36 overflow-hidden">
                            <img src={photo} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white shrink-0"
                              style={{ background: p.catConfig.color }}
                            >
                              <span className="text-[7px] font-black">{p.catConfig.mark}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">{p.catConfig.label}</span>
                          </div>
                          <div className="font-semibold text-sm mb-1">{p.name}</div>
                          {p.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                          )}
                          {isSelected && p.legend && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 p-3 rounded-xl"
                              style={{ background: "#fffbeb", borderLeft: "3px solid #f59e0b" }}
                            >
                              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide mb-1">📜 Легенда</div>
                              <p className="text-[11px] text-amber-900 italic">{p.legend}</p>
                            </motion.div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
          </div>
        )}

        {/* Routes list */}
        {activeTab === "routes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))
              : routes?.map(r => (
                  <Card key={r.id} className="rounded-2xl border-border/60 p-5 hover-elevate transition-all">
                    <div className="font-semibold text-sm mb-2">{r.name}</div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{r.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {difficultyLabel[r.difficulty] ?? r.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        ◷ {r.durationHours} ч
                      </span>
                    </div>
                  </Card>
                ))}
          </div>
        )}

        {/* Legend */}
        {activeTab === "points" && (
          <div className="mt-6">
            <Card className="rounded-xl border-border/60 p-4 inline-flex flex-wrap gap-4">
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white shrink-0"
                    style={{ background: cfg.color }}
                  >
                    <span className="text-[7px] font-black">{cfg.mark}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{cfg.label}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
