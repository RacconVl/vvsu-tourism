import { motion } from "framer-motion";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { GeoCircle, GhostText, DotGrid, VerticalText } from "@/components/GraphicAccents";

const roleLabels: Record<string, string> = {
  guide: "Экскурсовод",
  marketer: "Маркетолог",
  designer: "Дизайнер",
  operator: "Туроператор",
};

const rankStyle = (rank: number) => {
  if (rank === 1) return { bg: "from-yellow-400 to-amber-500", text: "text-yellow-600", medal: "🥇" };
  if (rank === 2) return { bg: "from-gray-300 to-gray-400", text: "text-gray-500", medal: "🥈" };
  if (rank === 3) return { bg: "from-amber-600 to-amber-700", text: "text-amber-600", medal: "🥉" };
  return { bg: "", text: "text-muted-foreground", medal: `#${rank}` };
};

const questExamples = [
  { mark: "МАР", type: "Маршрут",   color: "bg-teal-100 text-teal-700",   title: "Маршрут по Золотому Рогу",              desc: "Разработайте однодневный туристический маршрут по набережной с 5 ключевыми достопримечательностями", location: "Бухта Золотой Рог",         difficulty: "Лёгкий",  diffColor: "text-green-600", xp: 100 },
  { mark: "МКТ", type: "Маркетинг", color: "bg-purple-100 text-purple-700", title: "SMM-кампания для сафари-парка",          desc: "Создайте концепцию SMM-кампании для привлечения туристов в Приморский сафари-парк",                location: "Приморский сафари-парк",    difficulty: "Средний", diffColor: "text-amber-600", xp: 175 },
  { mark: "ДЗН", type: "Дизайн",    color: "bg-rose-100 text-rose-700",   title: "Фирменный стиль отеля на мысе Тобизина", desc: "Разработайте концепцию визуального стиля для бутик-отеля: цвета, логотип, айдентика",               location: "Мыс Тобизина",              difficulty: "Сложный", diffColor: "text-red-600",   xp: 250 },
  { mark: "ЭКО", type: "Маршрут",   color: "bg-teal-100 text-teal-700",   title: "Экомаршрут по Морскому заповеднику",    desc: "Разработайте эко-тур с минимальным воздействием на природу и образовательными элементами",          location: "Морской заповедник",        difficulty: "Сложный", diffColor: "text-red-600",   xp: 300 },
];

const successStories = [
  {
    avatar: "/avatars/student-3.png",
    name: "Дарья Ким",
    course: "3-й курс, специальность «Туризм»",
    story: "Выполнила 12 квестов за семестр, набрала 2 400 XP и обменяла их на худи ВВГУ с символикой института. «Квесты помогли мне сделать реальные кейсы для резюме — теперь у меня есть портфолио ещё до выпуска»",
    xp: 2400,
    quests: 12,
    reward: "Худи ВВГУ",
    rewardEmoji: "👕",
  },
  {
    avatar: "/avatars/student-2.png",
    name: "Максим Соколов",
    course: "4-й курс, специальность «Туроперейтинг»",
    story: "18 выполненных квестов и 4 100 XP позволили Максиму получить билет на международную конференцию «Туризм АТР-2024» во Владивостоке. «Это открыло мне контакты с работодателями из Кореи и Японии»",
    xp: 4100,
    quests: 18,
    reward: "Билет на конференцию",
    rewardEmoji: "🎫",
  },
  {
    avatar: "/avatars/student-5.png",
    name: "Юна Пак",
    course: "2-й курс, специальность «Гостиничный сервис»",
    story: "Начав со 2-го курса, Юна уже набрала 1 600 XP за 8 квестов и обменяла их на фирменный рюкзак и блокнот. «Я вошла в топ-10 рейтинга — это мотивирует учиться ещё активнее»",
    xp: 1600,
    quests: 8,
    reward: "Рюкзак + блокнот ВВГУ",
    rewardEmoji: "🎒",
  },
];

const storeItems = [
  { name: "Кепка ВВГУ", xp: 500, emoji: "🧢" },
  { name: "Блокнот + ручка", xp: 750, emoji: "📓" },
  { name: "Худи института", xp: 2000, emoji: "👕" },
  { name: "Рюкзак ВВГУ", xp: 3000, emoji: "🎒" },
  { name: "Билет на конференцию", xp: 4000, emoji: "🎫" },
  { name: "Стажировка в партнёрской компании", xp: 6000, emoji: "🏢" },
];

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────── */}
      <div style={{ background: "#0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        {/* Label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "18px 48px", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Рейтинг</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>→ ВВГУ 2026</span>
        </div>
        {/* Marquee */}
        <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", animation: "marquee 24s linear infinite", width: "max-content", padding: "10px 0" }}>
            {Array.from({ length: 4 }).flatMap((_, ri) =>
              ["ЗАЛ СЛАВЫ", "★", "РЕЙТИНГ СТУДЕНТОВ", "★", "КВЕСТЫ", "★", "XP БАЛЛЫ", "★", "ИМИДЖКА ВВГУ", "★", "ТОП-10", "★"].map((w, wi) => (
                <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "★" ? "#C6FF00" : "rgba(255,255,255,0.45)", flexShrink: 0 }}>{w}</span>
              ))
            )}
          </div>
        </div>
        {/* Hero content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", minHeight: 260, alignItems: "stretch" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ padding: "48px 48px", borderRight: "3px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {/* Geometric decorations */}
            <GhostText text="ИТКИ" size={200} color="#fff" opacity={0.04} bottom={-40} right={-20} />
            <GeoCircle size={280} color="#C6FF00" opacity={0.08} shape="full" bottom={-140} right={-60} animate />
            <GeoCircle size={120} color="#FF007F" opacity={0.15} shape="quarter-tl" top={-1} right={-1} />
            <DotGrid cols={5} rows={3} color="#C6FF00" opacity={0.18} top={24} right={160} />
            <GeoCircle size={60} color="#0057B8" opacity={0.25} shape="full" top={32} right={80} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                Институт туризма и креативных индустрий · ВВГУ
              </div>
              <h1 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16 }}>
                Зал<br /><span style={{ color: "#C6FF00" }}>Славы</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.7, maxWidth: 480 }}>
                Выполняй квесты, копи XP и обменивай баллы на фирменную атрибутику ВВГУ
              </p>
            </div>
          </motion.div>
          {/* Right: stat cells */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", minWidth: 200 }}>
            {[
              { num: "10", sub: "участников", bg: "#C6FF00", text: "#0A0A0A" },
              { num: "XP", sub: "за каждый квест", bg: "#FF007F", text: "#fff" },
              { num: "01", sub: "место доступно", bg: "#0057B8", text: "#fff" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, padding: "20px 28px", borderBottom: i < 2 ? "3px solid rgba(0,0,0,0.1)" : "none", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: s.text }}>{s.num}</div>
                <div style={{ fontSize: 10, color: s.text, opacity: 0.65, fontWeight: 700, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">

        {/* ── Как работает система ───────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-accent font-black">◆</span>
            <h2 className="text-2xl font-bold text-foreground">Как работает система баллов</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0" style={{ border: "3px solid var(--border)" }}>
            {[
              { step: "01", mark: "КВТ", title: "Выбери квест", desc: "Реальные задания по туризму, маркетингу, дизайну и бюджетированию во Владивостоке", color: "#0057B8" },
              { step: "02", mark: "ВЫП", title: "Выполни задание", desc: "Отправь решение через личный кабинет — преподаватели проверяют работу", color: "#FF007F" },
              { step: "03", mark: "XP",  title: "Получи XP", desc: "За каждый квест начисляются баллы опыта: от 100 до 300 XP в зависимости от сложности", color: "#C6FF00" },
              { step: "04", mark: "ОБМ", title: "Обменяй на имиджку", desc: "Накопленные XP можно обменять в деканате на фирменную атрибутику ВВГУ", color: "#0A0A0A" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ borderRight: i < 3 ? "3px solid var(--border)" : "none" }}>
                <div style={{ borderTop: `4px solid ${s.color}` }} className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontWeight: 900, fontSize: 28, color: s.color === "#C6FF00" ? "#C6FF00" : s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.step}</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center text-white mb-3"
                    style={{ background: s.color === "#C6FF00" ? "#C6FF00" : s.color, color: s.color === "#C6FF00" ? "#0A0A0A" : "#fff" }}>
                    <span className="text-[11px] font-black">{s.mark}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* XP Arrow flow */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Квест</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-accent">+XP</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Рейтинг вырос</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Обмен в деканате</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-accent font-semibold">Имиджевая атрибутика 🎁</span>
          </div>
        </motion.section>

        {/* ── Магазин имиджки ─────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-accent font-black">◆</span>
            <h2 className="text-2xl font-bold text-foreground">Что можно получить за XP</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0" style={{ border: "3px solid var(--border)" }}>
            {storeItems.map((item, i) => {
              const bg = ["#0057B8","#FF007F","#C6FF00","#0A0A0A","#0057B8","#FF007F"][i];
              const fg = bg === "#C6FF00" ? "#0A0A0A" : "#fff";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{ borderRight: i < 5 ? "3px solid var(--border)" : "none", borderBottom: i < 3 ? "3px solid var(--border)" : "none" }}
                >
                  <div className="p-4 h-full flex flex-col" style={{ borderTop: `3px solid ${bg}` }}>
                    <div className="h-8 w-8 flex items-center justify-center text-[10px] font-black mb-2" style={{ background: bg, color: fg }}>
                      {["КЕП","БЛК","ХДИ","РЗК","КНФ","СТЖ"][i]}
                    </div>
                    <p className="text-xs font-bold text-foreground leading-tight mb-1">{item.name}</p>
                    <p className="text-[10px] font-black mt-auto" style={{ color: bg === "#C6FF00" ? "#7a9900" : bg }}>
                      ★ {item.xp.toLocaleString()} XP
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Обмен производится в деканате института (каб. 312) в рабочие часы. XP не сгорают.
          </p>
        </motion.section>

        {/* ── Примеры квестов ──────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-accent font-black">◆</span>
              <h2 className="text-2xl font-bold text-foreground">Примеры квестов из кабинета</h2>
            </div>
            <Link href="/quests">
              <span className="text-sm text-accent hover:underline flex items-center gap-1 cursor-pointer">
                Все квесты <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "3px solid var(--border)" }}>
            {questExamples.map((q, i) => {
              const accentColor = ["#0057B8","#FF007F","#C6FF00","#0A0A0A"][i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    borderRight: i % 2 === 0 ? "3px solid var(--border)" : "none",
                    borderBottom: i < 2 ? "3px solid var(--border)" : "none",
                    borderLeft: `4px solid ${accentColor}`,
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-7 w-7 flex items-center justify-center text-[9px] font-black shrink-0"
                        style={{ background: accentColor, color: accentColor === "#C6FF00" ? "#0A0A0A" : "#fff" }}>
                        {q.mark}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{q.type}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-1 leading-tight">{q.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{q.desc}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">● {q.location}</span>
                      <span className={`text-xs font-medium ${q.diffColor}`}>◆ {q.difficulty}</span>
                      <span className="text-xs font-black ml-auto" style={{ color: "#EB7124" }}>★ +{q.xp} XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Истории успеха ───────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-accent font-black">◆</span>
            <h2 className="text-2xl font-bold text-foreground">Студенты, которые уже получают имиджку</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "3px solid var(--border)" }}>
            {successStories.map((s, i) => {
              const topColor = ["#FF007F","#C6FF00","#0057B8"][i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  style={{ borderRight: i < 2 ? "3px solid var(--border)" : "none" }}
                >
                  <div style={{ borderTop: `4px solid ${topColor}` }} className="p-5 h-full flex flex-col">
                    {/* Quote mark decoration */}
                    <div style={{ fontSize: 48, lineHeight: 1, color: topColor, opacity: 0.2, fontWeight: 900, marginBottom: -8 }}>«</div>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={s.avatar} alt={s.name} className="h-12 w-12 object-cover shrink-0" style={{ border: `2px solid ${topColor}` }} />
                      <div>
                        <p className="font-black text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.story}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-border/40">
                      <span className="text-[10px] font-black px-2 py-0.5" style={{ background: topColor, color: topColor === "#C6FF00" ? "#0A0A0A" : "#fff" }}>
                        ★ {s.xp.toLocaleString()} XP
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">◆ {s.quests} квест.</span>
                      <span className="text-[10px] font-bold text-foreground ml-auto">{s.reward}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Top 3 Podium ─────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-accent font-black">◆</span>
            <h2 className="text-2xl font-bold text-foreground">Текущий рейтинг</h2>
          </div>

          {!isLoading && top3.length >= 3 && (
            <div className="mb-8 grid grid-cols-3 gap-0" style={{ border: "3px solid var(--border)" }}>
              {/* 2nd, 1st, 3rd order */}
              {[top3[1], top3[0], top3[2]].map((entry, idx) => {
                const actualRank = entry.rank;
                const colors = ["#0057B8","#C6FF00","#FF007F"];
                const bg = colors[idx];
                const textColor = bg === "#C6FF00" ? "#0A0A0A" : "#fff";
                const rankMark = ["#2","#1","#3"][idx];
                return (
                  <div key={entry.rank}
                    style={{ borderRight: idx < 2 ? "3px solid var(--border)" : "none", borderTop: `5px solid ${bg}` }}
                    className="p-5 flex flex-col items-center text-center">
                    <div className="h-8 w-8 flex items-center justify-center font-black text-sm mb-3"
                      style={{ background: bg, color: textColor }}>{rankMark}</div>
                    <img src={entry.avatarUrl || undefined} alt={entry.studentName}
                      className="h-12 w-12 object-cover mb-2" style={{ border: `2px solid ${bg}` }} />
                    <p className="font-black text-foreground text-sm leading-tight">{entry.studentName}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: bg === "#C6FF00" ? "#7a9900" : bg }}>
                      ★ {entry.xp.toLocaleString()} XP
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full List */}
          <div style={{ border: "3px solid var(--border)" }}>
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : (
                <div>
                  {leaderboard?.map((entry, i) => {
                    const isMe = entry.studentName === "Александра Морозова";
                    const rankColor = entry.rank === 1 ? "#C6FF00" : entry.rank === 2 ? "#0057B8" : entry.rank === 3 ? "#FF007F" : "var(--border)";
                    return (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 transition-colors ${isMe ? "bg-accent/5" : "hover:bg-muted/30"}`}
                        style={{ borderBottom: i < (leaderboard?.length ?? 0) - 1 ? "2px solid var(--border)" : "none", borderLeft: `4px solid ${rankColor}` }}
                        data-testid={`row-leaderboard-${entry.rank}`}
                      >
                        <div className="w-7 h-7 flex items-center justify-center font-black text-xs shrink-0"
                          style={{ background: rankColor, color: rankColor === "#C6FF00" ? "#0A0A0A" : rankColor === "var(--border)" ? "var(--foreground)" : "#fff" }}>
                          {entry.rank}
                        </div>
                        <img src={entry.avatarUrl || undefined} alt={entry.studentName} className="h-9 w-9 object-cover flex-shrink-0" style={{ border: `2px solid ${rankColor}` }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-bold text-sm ${isMe ? "text-accent" : "text-foreground"}`}>{entry.studentName}</p>
                            {isMe && <span className="text-[9px] font-black px-1.5 py-0.5" style={{ background: "#EB7124", color: "#fff" }}>ВЫ</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{roleLabels[entry.role] ?? entry.role}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] font-bold text-muted-foreground">УР. {entry.level}</p>
                          <p className="text-sm font-black" style={{ color: "#EB7124" }}>★ {entry.xp.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">◆ {entry.completedQuests} кв.</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
