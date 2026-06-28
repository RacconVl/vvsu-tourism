import { useState, useMemo, useEffect } from "react";
import { GeoCircle, GhostText, DotGrid } from "@/components/GraphicAccents";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useListMapPoints, useListMapRoutes } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Fix leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const categoryConfig: Record<string, { color: string; label: string; mark: string }> = {
  landmark:   { color: "#2563eb", label: "Достопримечательность", mark: "ДОС" },
  nature:     { color: "#16a34a", label: "Природа",               mark: "ПРИ" },
  museum:     { color: "#9333ea", label: "Музей",                 mark: "МУЗ" },
  hotel:      { color: "#d97706", label: "Отель",                 mark: "ОТЕ" },
  restaurant: { color: "#e11d48", label: "Ресторан",              mark: "РЕС" },
};

const pointCoordinates: Record<string, [number, number]> = {
  "Золотой мост":                        [43.1126, 131.8869],
  "Морской вокзал":                      [43.1112, 131.8854],
  "Остров Русский":                      [43.0214, 131.9043],
  "Дальневосточный морской заповедник":  [42.6175, 131.1422],
  "Приморский музей им. Арсеньева":      [43.1167, 131.8847],
  "Мыс Тобизина":                        [42.9745, 131.9952],
  "Набережная Спортивной гавани":        [43.1163, 131.8765],
  "Маяк Эгершельда":                    [43.0710, 131.8418],
  "ДВФУ Кампус":                         [43.0247, 131.8911],
  "Покровский собор":                    [43.1217, 131.8929],
  "Видовая площадка Орлиное гнездо":     [43.1175, 131.8841],
  "Русский мост":                        [43.0535, 131.8869],
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

function makeColorIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function FlyToPoint({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 14, { duration: 0.8 });
  }, [coords, map]);
  return null;
}

export default function MapPage() {
  const { data: points, isLoading: pointsLoading } = useListMapPoints();
  const { data: routes, isLoading: routesLoading } = useListMapRoutes();
  const [activeTab, setActiveTab] = useState<"points" | "routes">("points");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<number | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const difficultyLabel: Record<string, string> = {
    easy: "Лёгкий", medium: "Средний", hard: "Сложный",
  };

  const enrichedPoints = useMemo(() => {
    if (!points) return [];
    return points.map(p => {
      const cat = categoryConfig[p.category] ?? categoryConfig.landmark;
      const coords = pointCoordinates[p.name] ?? [43.115, 131.886] as [number, number];
      return { ...p, coords: coords as [number, number], catConfig: cat };
    });
  }, [points]);

  const activeRoute = routes?.find(r => r.id === activeRouteId);
  const routeCoords = useMemo<[number, number][]>(() => {
    if (!activeRoute || !points) return [];
    const ids = (activeRoute as { pointIds?: (number | string)[] }).pointIds ?? [];
    return ids
      .map(id => enrichedPoints.find(pt => pt.id === Number(id))?.coords)
      .filter((c): c is [number, number] => Array.isArray(c));
  }, [activeRoute, points, enrichedPoints]);

  function handlePointClick(p: { id: number; coords: [number, number] }) {
    setSelectedId(p.id);
    setFlyTo(p.coords);
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Editorial hero banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8" style={{ background: "#0A0A0A", border: "3px solid #0A0A0A" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 16, padding: "12px clamp(16px, 4vw, 32px)", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Интерактивная карта</span>
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
            <GhostText text="КАРТА" size={160} color="#C6FF00" opacity={0.06} bottom={-30} right={20} />
            <GeoCircle size={240} color="#0057B8" opacity={0.1} shape="full" top={-120} right={-40} animate />
            <GeoCircle size={90} color="#C6FF00" opacity={0.2} shape="quarter-bl" bottom={-1} right={80} />
            <DotGrid cols={5} rows={3} color="#C6FF00" opacity={0.15} top={16} right={200} />
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 48, color: "#C6FF00", display: "block", lineHeight: 1 }}>⚓</span>
            </motion.div>
            <div style={{ position: "relative", zIndex: 1, minWidth: 0, flex: 1 }}>
              <h1 style={{ fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", marginBottom: 8, wordBreak: "break-word" }}>
                Карта <span style={{ color: "#C6FF00" }}>Владивостока</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.5 }}>
                Интерактивная карта Приморского края — легенды, маршруты, точки интереса
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaflet Map */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden" style={{ border: "3px solid var(--border)" }}>
              <div style={{ height: "560px" }}>
                {pointsLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <MapContainer
                    center={[43.0815, 131.87]}
                    zoom={11}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FlyToPoint coords={flyTo} />

                    {enrichedPoints.map(p => (
                      <Marker
                        key={p.id}
                        position={p.coords}
                        icon={makeColorIcon(p.catConfig.color)}
                        eventHandlers={{ click: () => handlePointClick(p) }}
                      >
                        <Popup>
                          <div style={{ minWidth: 200 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{p.catConfig.label}</div>
                            {p.description && (
                              <p style={{ fontSize: 12, color: "#333", marginBottom: 8 }}>{p.description}</p>
                            )}
                            {p.legend && (
                              <div style={{ background: "#fffbeb", borderLeft: "3px solid #f59e0b", padding: "8px", borderRadius: 4 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>📜 Легенда</div>
                                <p style={{ fontSize: 11, color: "#78350f", fontStyle: "italic", margin: 0 }}>{p.legend}</p>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {routeCoords.length > 1 && (
                      <Polyline
                        positions={routeCoords}
                        pathOptions={{ color: "#EB7124", weight: 5, opacity: 0.85, dashArray: "10 6" }}
                      />
                    )}
                  </MapContainer>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1">
              © OpenStreetMap. Колесо мыши — масштаб, перетаскивание — перемещение.
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
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
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
                            {isSelected && photo && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 140, opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <img src={photo} alt={p.name} className="w-full h-full object-cover" />
                              </motion.div>
                            )}
                            <div className="p-3 flex items-center gap-3">
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
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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

            {activeTab === "points" && (
              <Card className="rounded-xl border-border/60 p-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Легенда</div>
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
