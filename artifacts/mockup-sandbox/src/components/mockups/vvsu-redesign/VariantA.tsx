import "./vvsu.css";

const NAVY = "#172E46";
const BLUE = "#033F7E";
const ORANGE = "#EB7124";
const LIME = "#C6FF00";
const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";

export function VariantA() {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: WHITE, minHeight: "100vh", overflow: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{ background: BLACK, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: ORANGE, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div>
            <div style={{ color: WHITE, fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>ВВГУ</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" }}>Институт туризма</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Направления", "Карта", "Рейтинг", "Сообщество"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: 0.5, cursor: "pointer", fontWeight: 500 }}>{item}</span>
          ))}
          <button style={{ background: ORANGE, color: WHITE, border: "none", borderRadius: 24, padding: "9px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: 0.3 }}>
            Войти →
          </button>
        </div>
      </nav>

      {/* HERO — GEOMETRIC MOSAIC */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 560 }}>
        {/* LEFT: Big text + orange block */}
        <div style={{ background: BLACK, display: "grid", gridTemplateRows: "1fr auto", position: "relative", overflow: "hidden" }}>
          {/* Top text */}
          <div style={{ padding: "52px 52px 32px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ color: LIME, fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>ВВГУ · ИТИКИ · 2024</div>
            <div style={{ color: WHITE, fontSize: 68, fontWeight: 900, lineHeight: 1.0, letterSpacing: -2 }}>
              Институт<br/>
              <span style={{ color: ORANGE }}>Туризма</span><br/>
              и Дизайна
            </div>
          </div>
          {/* Geometric accent: lime circle */}
          <div style={{ position: "absolute", bottom: 40, right: -60, width: 200, height: 200, borderRadius: "50%", background: LIME, opacity: 0.9 }} />
          {/* Bottom strip */}
          <div style={{ background: NAVY, padding: "18px 52px", display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 1 }}>Владивосток · Дальний Восток · АТР</span>
          </div>
        </div>

        {/* RIGHT: 2x2 mosaic */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
          {/* Cell 1: Orange block */}
          <div style={{ background: ORANGE, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
            <div style={{ color: WHITE, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>850+</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>студентов</div>
          </div>
          {/* Cell 2: Lime block */}
          <div style={{ background: LIME, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(0,0,0,0.12)" }} />
            <div style={{ color: BLACK, fontSize: 40, fontWeight: 900, lineHeight: 1 }}>6</div>
            <div style={{ color: "rgba(0,0,0,0.55)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>Курсов</div>
          </div>
          {/* Cell 3: Navy block */}
          <div style={{ background: NAVY, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 100, height: 100, border: `3px solid ${LIME}`, borderRadius: "50%", opacity: 0.3 }} />
            <div style={{ color: WHITE, fontSize: 32, fontWeight: 900, lineHeight: 1 }}>94%</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>Трудоустройство</div>
          </div>
          {/* Cell 4: Photo simulation with overlay */}
          <div style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLACK})`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(198,255,0,0.06) 12px, rgba(198,255,0,0.06) 13px)` }} />
            <div style={{ color: LIME, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>→ Карта</div>
            <div style={{ color: WHITE, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>Интерактивная карта Владивостока</div>
          </div>
        </div>
      </div>

      {/* TICKER BAR */}
      <div style={{ background: LIME, overflow: "hidden", height: 44, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 60, alignItems: "center", padding: "0 40px", whiteSpace: "nowrap" }}>
          {["Туризм", "·", "Дизайн", "·", "Гостиничное дело", "·", "Маркетинг", "·", "Гастрономия", "·", "Экотуризм", "·", "Маршрутостроение", "·"].map((t, i) => (
            <span key={i} style={{ color: BLACK, fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* SECTION: PROGRAMS */}
      <div style={{ padding: "80px 40px", background: WHITE }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ color: ORANGE, fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>→ Образовательные программы</div>
            <div style={{ color: BLACK, fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2 }}>
              Выбери<br/><span style={{ color: NAVY }}>направление</span>
            </div>
          </div>
          <button style={{ background: BLACK, color: WHITE, border: "none", borderRadius: 28, padding: "14px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 0.3 }}>
            Все направления →
          </button>
        </div>

        {/* 3-column cards with bold geometric top strips */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {[
            { title: "Туризм", sub: "Бакалавриат · Магистратура", color: ORANGE, icon: "🌏", places: "25 бюджет." },
            { title: "Дизайн & Арт", sub: "Бакалавриат · Магистратура", color: LIME, icon: "🎨", places: "15 бюджет.", dark: true },
            { title: "Гостиничное дело", sub: "Бакалавриат", color: NAVY, icon: "🏨", places: "20 бюджет.", white: true },
          ].map((prog, i) => (
            <div key={i} style={{ background: prog.color, position: "relative", overflow: "hidden", cursor: "pointer" }}>
              {/* Giant background letter */}
              <div style={{ position: "absolute", bottom: -20, right: -10, fontSize: 200, fontWeight: 900, lineHeight: 1, color: "rgba(0,0,0,0.07)", userSelect: "none" }}>
                {prog.icon}
              </div>
              <div style={{ padding: "40px 36px 36px", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                <div>
                  <div style={{ color: prog.dark ? BLACK : prog.white ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{prog.sub}</div>
                  <div style={{ color: prog.dark ? BLACK : WHITE, fontSize: 38, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1 }}>{prog.title}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ color: prog.dark ? BLACK : WHITE, fontWeight: 700, fontSize: 13 }}>{prog.places}</div>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: prog.dark ? BLACK : WHITE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: prog.dark ? WHITE : BLACK, fontWeight: 900, fontSize: 18 }}>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: BOLD STATS */}
      <div style={{ background: BLACK, padding: "80px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {[
            { num: "850+", label: "Студентов", accent: LIME },
            { num: "40+", label: "Преподавателей-практиков", accent: ORANGE },
            { num: "6", label: "Образовательных программ", accent: LIME },
            { num: "94%", label: "Выпускников трудоустроены", accent: ORANGE },
          ].map((s, i) => (
            <div key={i} style={{ padding: "48px 36px", borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.08)` : "none" }}>
              <div style={{ color: s.accent, fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>{s.num}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 600, marginTop: 12, letterSpacing: 0.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div style={{ background: NAVY, padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>ВВГУ — Институт туризма и креативных индустрий · Владивосток</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Поступление", "О нас", "Контакты"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
