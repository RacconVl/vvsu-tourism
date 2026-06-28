import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { YMaps, Map, Placemark, Polyline } from "react-yandex-maps";
import { useListMapPoints, useListMapRoutes } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const floatingMarks = [
  { char: "⚓", x: "8%",  y: "20%", delay: 0,    dur: 4.0, size: 22, color: "#0057B8" },
  { char: "⛵", x: "88%", y: "15%", delay: 0.6,  dur: 5.2, size: 26, color: "#EB7124" },
  { char: "✦",  x: "5%",  y: "70%", delay: 1.2,  dur: 3.8, size: 18, color: "#7c3aed" },
  { char: "〜",  x: "92%", y: "65%", delay: 0.3,  dur: 6.0, size: 20, color: "#0891b2" },
  { char: "✦",  x: "50%", y: "8%",  delay: 1.8,  dur: 4.4, size: 16, color: "#16a34a" },
  { char: "✦",  x: "75%", y: "80%", delay: 0.9,  dur: 5.6, size: 14, color: "#d97706" },
];

const categoryConfig: Record<string, { color: string; label: string; mark: string }> = {
  landmark: { color: "#2563eb", label: "Достопримечательность", mark: "ДОС" },
  nature:   { color: "#16a34a", label: "Природа",               mark: "ПРИ" },
  museum:   { color: "#9333ea", label: "Музей",                 mark: "МУЗ" },
  hotel:    { color: "#d97706", label: "Отель",                 mark: "ОТЕ" },
  restaurant:{ color: "#e11d48", label: "Ресторан",             mark: "РЕС" },
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

const pointPhotos: Record<string, string> = {
  "Золотой мост": "/map-photos/russky-bridge.jpg",
  "Морской вокзал": "/map-photos/sea-station.jpg",
  "Остров Русский": "/map-photos/russky-island.jpg",
  "Дальневосточный морской заповедник": "/map-photos/marine-reserve.jpg",
  "Приморский музей им. Арсеньева": "/map-photos/arsenyev-museum.jpg",
  "Мыс Тобизина": "/map-photos/tobizina.jpg",
  "Набережная Спортивной гавани": "/map-photos/sports-harbor.jpg",
  "Маяк Эгершельда": "/map-photos/egersheld.jpg",
  "ДВФУ Кампус": "/map-photos/fefu-campus.jpg",
  "Покровский собор": "/map-photos/pokrovsky.jpg",
  "Видовая площадка Орлиное гнездо": "/map-photos/eagle-nest.jpg",
  "Русский мост": "/map-photos/russky-bridge.jpg",
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
        {/* Editorial hero banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8" style={{ background: "#0A0A0A", border: "3px solid #0A0A0A" }}>
          {/* Label strip */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "16px 32px", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Интерактивная карта</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>→ Владивосток</span>
          </div>
          {/* Marquee */}
          <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", animation: "marquee-reverse 30s linear infinite", width: "max-content", padding: "10px 0" }}>
              {Array.from({ length: 4 }).flatMap((_, ri) =>
                ["ВЛАДИВОСТОК", "→", "ЗОЛОТОЙ РОГ", "→", "ОСТРОВ РУССКИЙ", "→", "ПРИМОРЬЕ", "→", "ТУРИСТСКИЕ МАРШРУТЫ", "→", "ЛЕГЕНДЫ ГОРОДА", "→"].map((w, wi) => (
                  <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "→" ? "#FF007F" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>{w}</span>
                ))
              )}
            </div>
          </div>
          {/* Content row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "28px 32px" }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ flexShrink: 0 }}>
              <span style={{ fontSize: 48, color: "#C6FF00", display: "block", lineHeight: 1 }}>⚓</span>
            </motion.div>
            <div>
              <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 8 }}>
                Карта <span style={{ color: "#C6FF00" }}>Владивостока</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.5 }}>
                Интерактивная карта Приморского края — легенды, маршруты, точки интереса
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Yandex Map */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden" style={{ border: "3px solid var(--border)" }}>
              <div className="relative" style={{ height: "640px" }}>
                {pointsLoading ? (
                  <Skeleton className="absolute inset-0" />
                ) : (
                  <YMaps query={{ lang: "ru_RU", load: "package.full", apikey: import.meta.env.VITE_YANDEX_MAPS_KEY }}>
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
            </div>
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
                Объекты
              </Button>
              <Button
                variant={activeTab === "routes" ? "default" : "outline"}
                size="sm"
                className="flex-1 rounded-xl"
                onClick={() => setActiveTab("routes")}
              >
                Маршруты
              </Button>
            </div>

            {activeTab === "points" && (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {pointsLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
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
                            className={`rounded-xl border-border/60 cursor-pointer transition-all hover-elevate overflow-hidden ${
                              isSelected ? "ring-2 ring-accent shadow-lg" : ""
                            }`}
                            onClick={() => handlePointClick(p)}
                          >
                            {/* Photo strip — show only when selected */}
                            {isSelected && photo && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 140, opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <img
                                  src={photo}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            )}
                            <div className="p-3 flex items-center gap-3">
                              {/* Thumbnail when not selected */}
                              {!isSelected && photo ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                  <img src={photo} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <span
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white shrink-0"
                                  style={{ background: p.catConfig.color }}
                                >
                                  <span className="text-[8px] font-black">{p.catConfig.mark}</span>
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate">{p.name}</div>
                                <div className="text-xs text-muted-foreground">{p.catConfig.label}</div>
                              </div>
                              {isSelected && (
                                <span
                                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white shrink-0"
                                  style={{ background: p.catConfig.color }}
                                >
                                  <span className="text-[7px] font-black">{p.catConfig.mark}</span>
                                </span>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
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
                              ◷ {r.durationHours} ч
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
                        <span className="text-[7px] font-black">{cfg.mark}</span>
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
                  <span className="text-accent font-black text-sm">◆</span>
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
