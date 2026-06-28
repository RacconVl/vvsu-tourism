import "./vvsu.css";

const NAVY = "#172E46";
const BLUE = "#033F7E";
const ORANGE = "#EB7124";
const LIME = "#C6FF00";
const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";

export function VariantB() {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: WHITE, minHeight: "100vh" }}>

      {/* NAVBAR — minimal */}
      <nav style={{ background: WHITE, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 68, borderBottom: `3px solid ${BLACK}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: ORANGE }} />
          <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: 3, textTransform: "uppercase", color: BLACK }}>ВВГУ</div>
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.15)" }} />
          <div style={{ fontWeight: 500, fontSize: 12, letterSpacing: 0.5, color: "rgba(0,0,0,0.45)", textTransform: "uppercase" }}>Институт туризма и креативных индустрий</div>
        </div>
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          {["Программы", "Карта", "Рейтинг"].map((item, i) => (
            <span key={item} style={{ color: "rgba(0,0,0,0.55)", fontSize: 13, cursor: "pointer", fontWeight: 600, padding: "0 20px", borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>{item}</span>
          ))}
          <button style={{ marginLeft: 20, background: ORANGE, color: WHITE, border: "none", borderRadius: 0, padding: "12px 28px", fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>
            Войти
          </button>
        </div>
      </nav>

      {/* HERO — EDITORIAL BIG TYPE */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", minHeight: 520 }}>
        {/* Left: oversized type */}
        <div style={{ padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: `4px solid ${BLACK}` }}>
          <div>
            <div style={{ display: "inline-block", background: ORANGE, color: WHITE, fontWeight: 800, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "6px 14px", marginBottom: 36 }}>
              Владивосток · 2024
            </div>
            <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.93, letterSpacing: -4, color: BLACK }}>
              ТВОРИ.<br/>
              <span style={{ color: NAVY }}>УЧИСЬ.</span><br/>
              <span style={{ WebkitTextStroke: `3px ${BLACK}`, color: "transparent" }}>МЕНЯЙ.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 48 }}>
            <button style={{ background: NAVY, color: WHITE, border: "none", padding: "16px 36px", fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>
              Начать обучение
            </button>
            <button style={{ background: "transparent", color: BLACK, border: `2px solid ${BLACK}`, padding: "14px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 0.5 }}>
              Программы →
            </button>
          </div>
        </div>
        {/* Right: geometric blocks */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr" }}>
          {/* Top: navy + lime circle */}
          <div style={{ background: NAVY, position: "relative", overflow: "hidden", borderBottom: `4px solid ${BLACK}` }}>
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: LIME }} />
            <div style={{ position: "relative", padding: 36, zIndex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Студентов</div>
              <div style={{ color: WHITE, fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: -4, marginTop: 8 }}>850<span style={{ color: LIME }}>+</span></div>
            </div>
          </div>
          {/* Bottom: orange */}
          <div style={{ background: ORANGE, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(0,0,0,0.12)" }} />
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <div style={{ padding: 36, position: "relative", zIndex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Трудоустройство</div>
              <div style={{ color: WHITE, fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: -4, marginTop: 8 }}>94%</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION DIVIDER — BOLD STRIP */}
      <div style={{ background: LIME, padding: "18px 48px", display: "flex", alignItems: "center", gap: 32, borderTop: `4px solid ${BLACK}`, borderBottom: `4px solid ${BLACK}` }}>
        <div style={{ color: BLACK, fontWeight: 900, fontSize: 13, letterSpacing: 4, textTransform: "uppercase" }}>Наши направления</div>
        <div style={{ flex: 1, height: 2, background: BLACK }} />
        <div style={{ color: BLACK, fontWeight: 700, fontSize: 12, letterSpacing: 2 }}>→ 6 программ</div>
      </div>

      {/* PROGRAMS — EDITORIAL HORIZONTAL */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { num: "01", title: "Туризм", desc: "Международные туры, экотуризм, круизный туризм в АТР", color: NAVY, textColor: WHITE },
          { num: "02", title: "Дизайн и арт", desc: "Графика, UX/UI, среда, мода — кафедра ИТИКИ", color: LIME, textColor: BLACK },
          { num: "03", title: "Гостиничное дело", desc: "Управление отелями 5★ в Приморье и АТР", color: ORANGE, textColor: WHITE },
        ].map((p, i) => (
          <div key={i} style={{
            background: p.color,
            padding: "52px 40px",
            borderLeft: i > 0 ? `4px solid ${BLACK}` : "none",
            position: "relative",
            cursor: "pointer",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ color: p.textColor, opacity: 0.35, fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>{p.num}</div>
              <div style={{ color: p.textColor, fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginTop: 12, letterSpacing: -1 }}>{p.title}</div>
              <div style={{ color: p.textColor, opacity: 0.65, fontSize: 13, lineHeight: 1.5, marginTop: 12 }}>{p.desc}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <div style={{ width: 44, height: 44, background: p.textColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: p.color, fontWeight: 900, fontSize: 20 }}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION — QUOTE / MANIFESTO */}
      <div style={{ background: BLACK, padding: "80px 48px", borderTop: `4px solid ${BLACK}`, display: "flex", alignItems: "center", gap: 80 }}>
        <div style={{ color: LIME, fontSize: 140, fontWeight: 900, lineHeight: 0.7, letterSpacing: -8, opacity: 0.9 }}>«</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: WHITE, fontSize: 36, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1 }}>
            Образование, которое<br/>
            <span style={{ color: ORANGE }}>создаёт профессионалов,</span><br/>
            меняющих Дальний Восток.
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginTop: 24 }}>ВВГУ — Институт туризма и креативных индустрий</div>
        </div>
      </div>

      {/* SECTION — GAMIFICATION TEASER */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `4px solid ${BLACK}` }}>
        {/* Left: navy */}
        <div style={{ background: NAVY, padding: "60px 48px", borderRight: `4px solid ${BLACK}` }}>
          <div style={{ color: LIME, fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>→ Геймификация</div>
          <div style={{ color: WHITE, fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            Учёба —<br/>это квест
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            XP-очки, уровни, достижения и личный маршрут от «Порта отплытия» до «Тихоокеанского горизонта».
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
            {["Уровень 5", "1 240 XP", "🏆 3 Бейджа"].map(b => (
              <div key={b} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 4, padding: "8px 16px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>{b}</div>
            ))}
          </div>
        </div>
        {/* Right: lime */}
        <div style={{ background: LIME, padding: "60px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(0,0,0,0.07)" }} />
          <div style={{ color: BLACK, fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>→ Карта путешествий</div>
          <div style={{ color: BLACK, fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            5 этапов<br/>экспедиции
          </div>
          {["⚓ Порт отплытия", "🗺️ Архипелаг знаний", "⛵ Открытый океан", "🐋 Марианская впадина", "🌅 Тихоокеанский горизонт"].map((stage, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: i <= 1 ? 8 : 8, height: 8, borderRadius: "50%", background: i <= 1 ? BLACK : "rgba(0,0,0,0.25)" }} />
              <span style={{ color: i <= 1 ? BLACK : "rgba(0,0,0,0.5)", fontSize: 12, fontWeight: i <= 1 ? 700 : 500 }}>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: BLACK, padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `4px solid ${ORANGE}` }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1 }}>© 2024 ВВГУ · Владивосток</div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Поступление", "О нас", "Карта", "Контакты"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
