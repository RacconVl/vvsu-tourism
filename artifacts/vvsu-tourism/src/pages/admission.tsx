import { useState } from "react";
import { GeoCircle, GhostText, DotGrid, VerticalText, GhostSectionNum, AccentCard } from "@/components/GraphicAccents";
import { DigitalDesignIllustration, EnvironmentDesignIllustration } from "@/components/illustrations/DesignIllustrations";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle2, ArrowRight, ExternalLink, Play } from "lucide-react";

const programs = [
  {
    code: "43.03.02",
    title: "Туризм",
    degree: "Бакалавриат",
    duration: "4 года",
    form: "Очная / Заочная",
    places: { budget: 25, paid: 30 },
    profiles: ["Технология и организация туроператорской деятельности", "Технология и организация туристских услуг"],
    color: "#0057B8",
    img: "/prog-tourism-bachelor.png",
  },
  {
    code: "43.03.03",
    title: "Гостиничное дело",
    degree: "Бакалавриат",
    duration: "4 года",
    form: "Очная / Заочная",
    places: { budget: 20, paid: 25 },
    profiles: ["Гостиничная деятельность", "Управление отелем"],
    color: "#EB7124",
    img: "/prog-hotel.png",
  },
  {
    code: "54.03.01",
    title: "Дизайн",
    degree: "Бакалавриат",
    duration: "4 года",
    form: "Очная",
    places: { budget: 15, paid: 20 },
    profiles: ["Цифровой дизайн", "Дизайн среды"],
    color: "#0057B8",
    img: "/prog-design.png",
  },
  {
    code: "43.04.02",
    title: "Туризм",
    degree: "Магистратура",
    duration: "2 года",
    form: "Очная / Заочная",
    places: { budget: 10, paid: 15 },
    profiles: ["Менеджмент в туризме", "Международный туризм"],
    color: "#7c3aed",
    img: "/prog-tourism-master.png",
  },
];

const steps = [
  { num: 1, title: "Подача заявления",       desc: "Подайте заявление лично в приёмную комиссию, через Госуслуги или по почте. Укажите желаемое направление и форму обучения.", deadline: "20 июля" },
  { num: 2, title: "Сдача документов",        desc: "Предоставьте оригиналы или копии необходимых документов. Полный список указан в разделе «Документы».", deadline: "25 июля" },
  { num: 3, title: "Вступительные испытания", desc: "Для некоторых специальностей проводятся дополнительные творческие испытания. Расписание публикуется на сайте.", deadline: "28–30 июля" },
  { num: 4, title: "Зачисление",              desc: "После конкурсного отбора абитуриенты, вошедшие в список, подают оригиналы документов для зачисления.", deadline: "9 августа" },
];

const documents = [
  "Паспорт гражданина РФ (оригинал + копия)",
  "Аттестат / диплом об образовании (оригинал + копия)",
  "Результаты ЕГЭ (для поступающих по ЕГЭ)",
  "Медицинская справка 086/у",
  "6 фотографий 3×4 см",
  "Документы, подтверждающие льготы (при наличии)",
  "Военный билет (для военнообязанных)",
  "СНИЛС",
];

const exams = [
  { direction: "Туризм (бак.)",         subjects: ["Русский язык", "Обществознание", "История / География"] },
  { direction: "Гостиничное дело",       subjects: ["Русский язык", "Обществознание", "История"] },
  { direction: "Дизайн",                 subjects: ["Русский язык", "Литература", "Творческое испытание"] },
  { direction: "Туризм (маг.)",          subjects: ["Вступительный экзамен по профилю"] },
];

const contacts = [
  { label: "Приёмная комиссия", value: "+7 (423) 240-40-07", mark: "ТЕЛ" },
  { label: "Адрес",             value: "г. Владивосток, ул. Гоголя, 41", mark: "АДР" },
  { label: "Режим работы",      value: "Пн–Пт: 09:00–17:00", mark: "ЧАС" },
  { label: "Email",             value: "priem@vvsu.ru", mark: "МЛ" },
];

type TabKey = "programs" | "steps" | "documents" | "exams" | "dorm" | "contacts";

const tabs: { key: TabKey; label: string }[] = [
  { key: "programs",  label: "Направления" },
  { key: "steps",     label: "Этапы поступления" },
  { key: "documents", label: "Документы" },
  { key: "exams",     label: "Вступительные" },
  { key: "dorm",      label: "Общежитие" },
  { key: "contacts",  label: "Контакты" },
];

const dormAmenities = [
  { mark: "ВФ",  label: "Высокоскоростной Wi-Fi",  desc: "Оптоволоконный интернет во всех комнатах и зонах отдыха" },
  { mark: "ПТ",  label: "Столовая и буфет",         desc: "Горячее питание 3 раза в день, кухни на каждом этаже" },
  { mark: "ОХ",  label: "Круглосуточная охрана",    desc: "Пропускная система, видеонаблюдение, комендант" },
  { mark: "ОТ",  label: "Комнаты отдыха",           desc: "Телевизоры, настольный теннис, зоны для общения" },
  { mark: "ЧЗ",  label: "Читальный зал",            desc: "Тихая учебная зона с доступом к университетским ресурсам" },
  { mark: "ПР",  label: "Прачечная",                desc: "Стиральные машины и сушилки на каждом этаже" },
];

const dormRooms = [
  { type: "Одноместная",  price: "4 500 ₽/мес", places: 40,  color: "#0057B8", desc: "Личное пространство с письменным столом, шкафом и кроватью" },
  { type: "Двухместная",  price: "2 800 ₽/мес", places: 120, color: "#EB7124", desc: "Стандартный блок на 2 студента, раздельные рабочие зоны" },
  { type: "Трёхместная",  price: "2 200 ₽/мес", places: 60,  color: "#0057B8", desc: "Экономичный вариант для иногородних первокурсников" },
];

export default function AdmissionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("programs");

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section style={{ background: "#0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        {/* Label strip */}
        <div className="px-4 md:px-12" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 16, paddingTop: 18, paddingBottom: 18, borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#FF007F" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#FF007F" }}>Поступление</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span className="hidden sm:inline" style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", whiteSpace: "nowrap" }}>→ ВВГУ 2026</span>
        </div>
        {/* Marquee */}
        <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", animation: "marquee 28s linear infinite", width: "max-content", padding: "10px 0" }}>
            {Array.from({ length: 4 }).flatMap((_, ri) =>
              ["ПОСТУПЛЕНИЕ 2026", "✦", "БЮДЖЕТНЫЕ МЕСТА", "✦", "ТУРИЗМ", "✦", "ДИЗАЙН", "✦", "ГОСТИНИЧНОЕ ДЕЛО", "✦", "ПРИЁМ ДО 30 АВГУСТА", "✦"].map((w, wi) => (
                <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "✦" ? "#C6FF00" : "rgba(255,255,255,0.45)", flexShrink: 0 }}>{w}</span>
              ))
            )}
          </div>
        </div>
        {/* Hero content */}
        <div className="flex flex-col lg:grid" style={{ gridTemplateColumns: "1fr auto", gap: 0, alignItems: "stretch" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ padding: "clamp(28px,4vw,56px) clamp(20px,4vw,48px)", borderRight: "3px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            {/* Graphic accents */}
            <GhostText text="2026" size={180} color="#FF007F" opacity={0.07} bottom={-20} right={40} />
            <GeoCircle size={320} color="#FF007F" opacity={0.07} shape="full" bottom={-160} left={-80} animate />
            <GeoCircle size={100} color="#C6FF00" opacity={0.18} shape="quarter-tr" top={-1} right={-1} />
            <GeoCircle size={50} color="#0057B8" opacity={0.3} shape="full" top={50} right={120} />
            <DotGrid cols={6} rows={4} color="#fff" opacity={0.1} bottom={80} right={40} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Институт туризма и креативных индустрий · ВВГУ</div>
              <h1 style={{ fontSize: "clamp(44px,6vw,80px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 20 }}>
                Поступление<br /><span style={{ color: "#FF007F" }}>2026</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, maxWidth: 520 }}>
                Начните своё путешествие в мир туризма, гостеприимства и творческих индустрий. Мы ждём вас в ВВГУ!
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32, position: "relative", zIndex: 1 }}>
              <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#FF007F", color: "#fff", fontSize: 13, fontWeight: 900, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>
                <Play style={{ width: 14, height: 14 }} /> Флагманские программы <ExternalLink style={{ width: 13, height: 13 }} />
              </a>
            </div>
          </motion.div>
          {/* Right: stat cells */}
          <div className="grid grid-cols-3 lg:grid-cols-1 border-t-[3px] border-[rgba(255,255,255,0.08)] lg:border-t-0">
            {[
              { num: "25", sub: "бюджетных мест", bg: "#FF007F", text: "#fff" },
              { num: "30.08", sub: "конец приёма", bg: "#C6FF00", text: "#0A0A0A" },
              { num: "4", sub: "направления", bg: "#0057B8", text: "#fff" },
            ].map((s, i) => (
              <div key={i} className={i < 2 ? "border-r-[3px] lg:border-r-0 lg:border-b-[3px] border-[rgba(255,255,255,0.08)]" : ""}
                style={{ background: s.bg, padding: "clamp(14px,2vw,24px) clamp(12px,2vw,28px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ fontSize: "clamp(22px,4vw,40px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: s.text }}>{s.num}</div>
                <div style={{ fontSize: 10, color: s.text, opacity: 0.65, fontWeight: 600, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky tab bar */}
      <div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-0 w-max md:w-fit" style={{ border: "2px solid var(--border)" }}>
            {tabs.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap"
                style={{
                  borderRight: i < tabs.length - 1 ? "2px solid var(--border)" : "none",
                  background: activeTab === t.key ? "#0057B8" : "transparent",
                  color: activeTab === t.key ? "#fff" : "var(--muted-foreground)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  fontSize: 11,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <section className="bg-background py-10">
        <div className="max-w-5xl mx-auto px-4">

          {/* ── Направления ─────────────────────────────── */}
          {activeTab === "programs" && (
            <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "3px solid var(--border)" }}>
              {programs.map((p, i) => (
                <motion.div key={p.code} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ borderRight: i % 2 === 0 ? "3px solid var(--border)" : "none", borderBottom: i < 2 ? "3px solid var(--border)" : "none" }}>
                  <div className="overflow-hidden hover:shadow-md transition-shadow h-full group">
                    <div className="h-40 overflow-hidden relative">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${p.color}ee)` }} />
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: p.color }} />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="text-[10px] font-black text-white px-2 py-0.5" style={{ background: "rgba(0,0,0,0.5)" }}>{p.code}</span>
                        <span className="text-[10px] font-bold text-white px-2 py-0.5" style={{ background: p.color }}>{p.degree}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-black text-foreground">{p.title}</h3>
                        <div className="h-10 w-10 flex items-center justify-center text-white shrink-0 text-[10px] font-black"
                          style={{ background: p.color }}>
                          ТУР
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-0 mb-4 text-sm" style={{ border: "2px solid var(--border)" }}>
                        {[
                          { val: p.duration, label: "Срок обучения" },
                          { val: p.form, label: "Форма" },
                          { val: String(p.places.budget), label: "Бюджет", accent: p.color },
                          { val: String(p.places.paid), label: "Платные" },
                        ].map((cell, ci) => (
                          <div key={ci} className="p-2.5 text-center"
                            style={{ borderRight: ci % 2 === 0 ? "2px solid var(--border)" : "none", borderBottom: ci < 2 ? "2px solid var(--border)" : "none", background: cell.accent ? `${cell.accent}15` : undefined }}>
                            <p className="font-black text-foreground" style={cell.accent ? { color: cell.accent } : undefined}>{cell.val}</p>
                            <p className="text-xs text-muted-foreground">{cell.label}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1 font-black uppercase tracking-widest">Профили:</p>
                        <ul className="space-y-1">
                          {p.profiles.map((pr) => (
                            <li key={pr} className="flex items-center gap-2 text-sm text-foreground">
                              <span className="font-black text-xs shrink-0" style={{ color: p.color }}>→</span> {pr}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Accent stat strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 my-6" style={{ border: "2px solid #0A0A0A" }}>
              <AccentCard text="25" sub="бюджетных мест" bg="#0057B8" textColor="#fff" style={{ borderRight: "2px solid #0A0A0A" }} />
              <AccentCard text="4" sub="направления подготовки" bg="#C6FF00" textColor="#0A0A0A" style={{ borderRight: "2px solid #0A0A0A" }} />
              <AccentCard text="★" sub="топ вузов ДФО" bg="#FF007F" textColor="#fff" />
            </div>

            {/* ── Дизайн: два направления ─────────────────── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
              <div className="rounded-2xl border border-[#0057B8]/20 bg-gradient-to-br from-[#0057B8]/5 to-[#6366f1]/5 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-xl bg-[#0057B8] flex items-center justify-center text-white shrink-0 text-[10px] font-black">
                    ДЗН
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">54.03.01 · Бакалавриат · 4 года</p>
                    <h3 className="text-xl font-bold text-foreground">Дизайн — выбери свой путь</h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  В ВВГУ дизайн — это не просто «рисовать красиво». Это профессия, которая меняет то, как люди взаимодействуют с миром: цифровым или физическим. У нас два профиля с разной специализацией — выбери тот, что ближе тебе.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Цифровой дизайн */}
                  <div className="rounded-2xl bg-white dark:bg-card border border-[#6366f1]/20 overflow-hidden flex flex-col">
                    <DigitalDesignIllustration />
                    <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shrink-0 text-[9px] font-black">
                        ЦФ
                      </div>
                      <div>
                        <p className="text-xs text-[#6366f1] font-semibold uppercase tracking-wide">Профиль 1</p>
                        <h4 className="font-bold text-foreground text-base">Цифровой дизайн</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ты создаёшь интерфейсы, приложения и визуальный контент, которыми пользуются миллионы. UX/UI, motion-графика, веб-дизайн, брендинг в digital — всё это востребованные навыки на рынке АТР, где туризм и IT неразделимы.
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Чему научишься:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["UX / UI", "Figma & Prototyping", "Motion-графика", "Веб-дизайн", "SMM-визуал", "Брендинг", "3D-визуализация"].map(s => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#6366f1]/5 p-3.5">
                      <p className="text-xs font-semibold text-[#6366f1] mb-2 flex items-center gap-1.5">✦ Идеально, если ты:</p>
                      <ul className="space-y-1.5">
                        {[
                          "Проводишь часы в телефоне и замечаешь, когда интерфейс «сломан»",
                          "Хочешь работать удалённо или в международных командах",
                          "Видишь будущее в технологиях, но хочешь оставаться в творчестве",
                        ].map(t => (
                          <li key={t} className="flex items-start gap-2 text-xs text-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#6366f1] shrink-0 mt-0.5" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="text-[#6366f1] font-bold">→</span>
                      Выпускники работают в стартапах, турагентствах и digital-агентствах по всей России и АТР
                    </div>
                    </div>
                  </div>

                  {/* Дизайн среды */}
                  <div className="rounded-2xl bg-white dark:bg-card border border-[#0d9488]/20 overflow-hidden flex flex-col">
                    <EnvironmentDesignIllustration />
                    <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shrink-0 text-[9px] font-black">
                        СР
                      </div>
                      <div>
                        <p className="text-xs text-[#0d9488] font-semibold uppercase tracking-wide">Профиль 2</p>
                        <h4 className="font-bold text-foreground text-base">Дизайн среды</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ты проектируешь пространства, которые люди запоминают: лобби отелей, музейные экспозиции, туристические маршруты и городские объекты. Владивосток — идеальный полигон: здесь строят новые гостиницы, музеи и набережные прямо сейчас.
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Чему научишься:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Интерьерный дизайн", "Архитектурная графика", "3ds Max / ArchiCAD", "Экспозиционный дизайн", "Ландшафт", "Эргономика", "Туристическая навигация"].map(s => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#0d9488]/10 text-[#0d9488] font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#0d9488]/5 p-3.5">
                      <p className="text-xs font-semibold text-[#0d9488] mb-2 flex items-center gap-1.5">✦ Идеально, если ты:</p>
                      <ul className="space-y-1.5">
                        {[
                          "Входишь в кафе и сразу оцениваешь интерьер, свет и атмосферу",
                          "Хочешь создавать места, которые попадают в Instagram-подборки",
                          "Мечтаешь спроектировать арт-отель или туристический кластер",
                        ].map(t => (
                          <li key={t} className="flex items-start gap-2 text-xs text-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#0d9488] shrink-0 mt-0.5" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="text-[#0d9488] font-bold">→</span>
                      Выпускники работают с девелоперами, отельными сетями и туристическими объектами Приморья
                    </div>
                    </div>
                  </div>
                </div>

                {/* Общие преимущества */}
                <div className="mt-6 rounded-xl bg-[#0057B8]/5 border border-[#0057B8]/10 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  {[
                    { mark: "ЛЦ", label: "Лицензированная программа", sub: "государственный диплом" },
                    { mark: "ПР", label: "Практики отрасли", sub: "преподаватели-действующие специалисты" },
                    { mark: "ТВ", label: "Творческое испытание", sub: "портфолио вместо ЕГЭ по рисованию" },
                  ].map(({ mark, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center justify-center w-8 h-6 text-[9px] font-black text-[#0057B8] bg-[#0057B8]/10">{mark}</span>
                      <p className="text-xs font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            </div>
          )}

          {/* ── Этапы поступления ───────────────────────── */}
          {activeTab === "steps" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div style={{ border: "2px solid #0A0A0A" }}>
                {steps.map((s, i) => (
                  <motion.div key={s.num} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", borderBottom: i < steps.length - 1 ? "2px solid #0A0A0A" : "none" }}>
                    <div style={{ width: 72, flexShrink: 0, background: i === 0 ? "#EB7124" : "#0057B8", display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 0" }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{String(s.num).padStart(2, "0")}</span>
                    </div>
                    <div style={{ flex: 1, padding: "18px 24px", borderLeft: "2px solid #0A0A0A", minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 900, color: "var(--color-foreground)", minWidth: 0 }}>Шаг {s.num}: {s.title}</h3>
                        <span style={{ background: "#EB7124", color: "#fff", fontSize: 10, fontWeight: 900, padding: "4px 10px", flexShrink: 0, letterSpacing: 0.5, whiteSpace: "nowrap" }}>до {s.deadline}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ border: "2px solid #0A0A0A", borderTop: "none", display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 24px" }}>
                <div style={{ width: 28, height: 28, background: "#C6FF00", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 900, color: "#0A0A0A" }}>✓</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "var(--color-foreground)", marginBottom: 4 }}>Подача через Госуслуги</p>
                  <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>
                    Абитуриенты могут подать заявление дистанционно через портал Госуслуги или на сайте ВВГУ,
                    не приезжая лично в университет.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Документы ───────────────────────────────── */}
          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-5">
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #0057B8, #EB7124)" }} />
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <span className="text-accent font-black">◆</span> Перечень документов
                  </h2>
                  <ul className="space-y-3">
                    {documents.map((doc, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-muted/30"
                      >
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{doc}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Иностранным гражданам дополнительно:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent" /> Нотариально заверенный перевод документов об образовании</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent" /> Документ, подтверждающий признание иностранного образования</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent" /> Виза или вид на жительство (при необходимости)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/60 bg-muted/20">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Документы принимаются в оригинале или в виде заверенных копий. Копии заверяются нотариусом
                    или непосредственно в приёмной комиссии при предъявлении оригиналов.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Вступительные испытания ─────────────────── */}
          {activeTab === "exams" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">

              {/* Что такое вступительные */}
              <div style={{ border: "2px solid #0A0A0A" }}>
                <div style={{ background: "#0057B8", padding: "18px 24px 16px" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Что такое вступительные испытания?</h2>
                </div>
                <div style={{ padding: "18px 24px 20px" }}>
                  <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: 10 }}>
                    Вступительные испытания — это дополнительные экзамены, которые проводит университет помимо результатов ЕГЭ.
                    Они позволяют оценить специальные навыки абитуриента, необходимые для конкретной специальности.
                  </p>
                  <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>
                    Для большинства направлений (Туризм, Гостиничное дело) достаточно результатов ЕГЭ.
                    Для направления <strong style={{ color: "var(--color-foreground)" }}>«Дизайн»</strong> (54.03.01) обязательно
                    прохождение творческого испытания — независимо от баллов ЕГЭ.
                  </p>
                </div>
              </div>

              {/* Список направлений */}
              <div style={{ border: "2px solid #0A0A0A" }}>
                {exams.map((e, i) => (
                  <motion.div key={e.direction} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ display: "flex", borderBottom: i < exams.length - 1 ? "2px solid #0A0A0A" : "none" }}>
                    <div style={{ width: 56, flexShrink: 0, background: i === 2 ? "#EB7124" : "#0057B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1, padding: "14px 20px", borderLeft: "2px solid #0A0A0A" }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: "var(--color-foreground)", marginBottom: 8 }}>{e.direction}</p>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                        {e.subjects.map((s, j) => (
                          <span key={j} style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px",
                            border: `2px solid ${j === 0 ? "#0057B8" : j === 1 ? "#EB7124" : "#0A0A0A"}`,
                            color: j === 0 ? "#0057B8" : j === 1 ? "#EB7124" : "var(--color-foreground)",
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Творческое испытание для Дизайна */}
              <Card className="rounded-2xl overflow-hidden border-[#EB7124]/30">
                <div className="h-1 bg-accent" />
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <span className="text-accent font-black">◆</span> Творческое испытание — Дизайн (54.03.01)
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Творческое испытание проводится для всех профилей направления «Дизайн», в том числе
                    для <strong className="text-foreground">Дизайна цифровой среды</strong> и
                    <strong className="text-foreground"> Цифрового дизайна</strong>.
                    Испытание оценивает художественные способности, пространственное мышление и базовые навыки композиции.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Рисунок", desc: "Академический рисунок геометрических тел или натюрморта карандашом. Оценивается конструктивное построение, светотень, пропорции.", color: "#0057B8", img: "/exam-drawing.png" },
                      { title: "Живопись / Графика", desc: "Цветовое или тональное решение композиции. Для Цифрового дизайна — допускается чёрно-белая графика.", color: "#7c3aed", img: "/exam-painting.png" },
                      { title: "Композиция", desc: "Создание декоративной или пространственной композиции на заданную тему. Оценивается оригинальность, ритм, баланс.", color: "#EB7124", img: "/exam-composition.png" },
                      { title: "Творческое задание", desc: "Эскиз айдентики, иллюстрации или дизайн-концепции. Для цифровых профилей: может включать макет интерфейса.", color: "#16a34a", img: "/exam-creative.png" },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden h-full">
                          <div className="h-36 overflow-hidden">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                              <span className="font-semibold text-sm text-foreground">{item.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-muted/30 p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="text-accent font-black">◆</span> Как проходит испытание
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />Продолжительность: 3–4 часа в аудитории университета</li>
                      <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />Формат: задание выдаётся на месте, все материалы приносит абитуриент</li>
                      <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />Что брать: карандаши (ТМ, Т, М), акварель или гуашь, бумагу А3</li>
                      <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />Портфолио принимается как дополнение, но не заменяет испытание</li>
                      <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />Максимальный балл: 100. Проходной порог: 40 баллов</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-accent/20 bg-accent/5">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Цифровые профили</span> — для поступающих на
                      «Дизайн цифровой среды» и «Цифровой дизайн» допускается использование
                      распечатанного цифрового портфолио (PDF, не более 10 работ) как дополнение к основному заданию.
                      На самом испытании работа выполняется вручную.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Минимальные баллы ЕГЭ */}
              <Card className="rounded-2xl overflow-hidden border-border/60">
                <div className="h-1 bg-primary" />
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-accent font-black">◆</span> Минимальные баллы ЕГЭ
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm mt-3">
                    {[["Русский язык", 40], ["Обществознание", 45], ["История", 35]].map(([subj, score]) => (
                      <div key={String(subj)} className="rounded-xl bg-muted/50 p-3">
                        <p className="text-2xl font-bold text-accent">{score}</p>
                        <p className="text-xs text-muted-foreground mt-1">{subj}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Общежитие ───────────────────────────────── */}
          {activeTab === "dorm" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-0 max-w-4xl">

              {/* Hero: 3D tour + stats */}
              <div style={{ border: "2px solid #0A0A0A", display: "flex", flexDirection: "column" as const }} className="md:flex-row">
                <div className="md:w-1/2 flex flex-col items-center justify-center gap-5 p-8 relative overflow-hidden"
                  style={{ background: "#0A0A0A", minHeight: 280 }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <motion.svg viewBox="0 0 160 120" className="w-44 h-32 relative z-10" fill="none"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                    <rect x="20" y="35" width="120" height="80" rx="0" fill="#0057B8" opacity="0.5" />
                    <rect x="20" y="35" width="120" height="80" rx="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                    <polygon points="10,35 80,8 150,35" fill="#0057B8" opacity="0.7" />
                    {([0,1,2,3] as const).flatMap(col => ([0,1,2] as const).map(row => (
                      <motion.rect key={`${col}-${row}`} x={32 + col * 28} y={48 + row * 22} width="16" height="14" rx="0"
                        fill="#EB7124"
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: (col + row) * 0.3 }} />
                    )))}
                    <rect x="68" y="90" width="24" height="25" rx="0" fill="#0057B8" opacity="0.9" />
                    <line x1="80" y1="8" x2="80" y2="0" stroke="white" strokeWidth="1.5" />
                    <motion.polygon points="80,0 96,-6 80,-12" fill="#EB7124"
                      animate={{ scaleX: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ transformOrigin: "80px -6px" }} />
                    {[[15,15],[145,18],[10,60],[152,55]].map(([x,y],i) => (
                      <motion.circle key={i} cx={x} cy={y} r="1.5" fill="white"
                        animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
                    ))}
                  </motion.svg>
                  <div className="relative z-10 text-center">
                    <p style={{ color: "#fff", fontWeight: 800, marginBottom: 4 }}>3D-тур по кампусу</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 16 }}>Виртуальный осмотр общежития и учебных корпусов</p>
                    <a href="https://www.vvsu.ru/life/" target="_blank" rel="noopener noreferrer">
                      <button style={{ background: "#EB7124", border: "none", color: "#fff", fontSize: 12, fontWeight: 900, padding: "10px 20px", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" as const, display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Play className="h-3.5 w-3.5 fill-white" /> Открыть тур <ExternalLink className="h-3 w-3" />
                      </button>
                    </a>
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center" style={{ borderLeft: "2px solid #0A0A0A" }}>
                  <div style={{ background: "#0057B8", padding: "18px 24px 16px" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Студенческое общежитие ВВГУ</h2>
                  </div>
                  <div style={{ padding: "18px 24px 20px" }}>
                    <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.6, marginBottom: 16 }}>
                      Комфортное проживание в 5 минутах ходьбы от главного корпуса. Все иногородние студенты имеют право на место в общежитии при наличии свободных мест.
                    </p>
                    <div className="grid grid-cols-2 gap-0" style={{ border: "2px solid #0A0A0A" }}>
                      {[["220","мест всего"],["5 мин","до корпуса"],["24/7","охрана"],["от 2 200 ₽","в месяц"]].map(([v,l],i) => (
                        <div key={l} style={{ padding: "16px 12px", borderRight: i % 2 === 0 ? "2px solid #0A0A0A" : "none", borderBottom: i < 2 ? "2px solid #0A0A0A" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" as const }}>
                          <p style={{ fontSize: 18, fontWeight: 900, color: "var(--color-foreground)", lineHeight: 1, whiteSpace: "nowrap" }}>{v}</p>
                          <p style={{ fontSize: 11, color: "var(--color-muted-foreground)", marginTop: 5 }}>{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Room types */}
              <div style={{ border: "2px solid #0A0A0A", borderTop: "none" }}>
                <div style={{ background: "#0A0A0A", padding: "12px 24px" }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: "#C6FF00", textTransform: "uppercase" as const }}>Типы комнат</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {dormRooms.map((r, i) => (
                    <motion.div key={r.type} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ borderRight: i < dormRooms.length - 1 ? "2px solid #0A0A0A" : "none", borderTop: "2px solid #0A0A0A" }}>
                      <div style={{ height: 4, background: r.color }} />
                      <div style={{ padding: "16px 20px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 900, color: "var(--color-foreground)" }}>{r.type}</h4>
                          <span style={{ fontSize: 13, fontWeight: 900, color: r.color }}>{r.price}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "var(--color-muted-foreground)", lineHeight: 1.5, marginBottom: 10 }}>{r.desc}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 900, color: "var(--color-muted-foreground)", letterSpacing: 1 }}>МСТ</span>
                          <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>{r.places} мест</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div style={{ border: "2px solid #0A0A0A", borderTop: "none" }}>
                <div style={{ background: "#0A0A0A", padding: "12px 24px" }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: "#C6FF00", textTransform: "uppercase" as const }}>Удобства и инфраструктура</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  {dormAmenities.map((a, i) => (
                    <motion.div key={a.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 20px", borderTop: "2px solid #0A0A0A", borderRight: i % 2 === 0 ? "2px solid #0A0A0A" : "none" }}>
                      <div style={{ width: 36, height: 36, background: "#0057B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0, letterSpacing: 1 }}>{a.mark}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "var(--color-foreground)", marginBottom: 2 }}>{a.label}</p>
                        <p style={{ fontSize: 11, color: "var(--color-muted-foreground)" }}>{a.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rules & Application */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: "2px solid #0A0A0A", borderTop: "none" }}>
                <div style={{ borderRight: "2px solid #0A0A0A" }}>
                  <div style={{ background: "#EB7124", padding: "14px 20px" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 900, color: "#fff", textTransform: "uppercase" as const, letterSpacing: 1 }}>Как получить место</h4>
                  </div>
                  <div style={{ padding: "16px 20px 18px" }}>
                    {[
                      "Подать заявление в деканат до 1 августа",
                      "Предоставить справку об иногороднем адресе прописки",
                      "Заключить договор найма жилого помещения",
                      "Пройти инструктаж по правилам проживания",
                      "Оплатить первый месяц проживания",
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 4 ? 10 : 0, alignItems: "flex-start" }}>
                        <div style={{ width: 22, height: 22, background: "#EB7124", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.4 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ background: "#0057B8", padding: "14px 20px" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 900, color: "#fff", textTransform: "uppercase" as const, letterSpacing: 1 }}>Правила проживания</h4>
                  </div>
                  <div style={{ padding: "16px 20px 18px" }}>
                    {[
                      "Соблюдение тишины с 23:00 до 07:00",
                      "Запрет курения в здании",
                      "Гости допускаются до 22:00",
                      "Еженедельные санитарные дни (суббота)",
                      "Обязательное страхование имущества",
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 4 ? 10 : 0, alignItems: "flex-start" }}>
                        <div style={{ width: 22, height: 22, background: "#C6FF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#0A0A0A", flexShrink: 0 }}>✓</div>
                        <span style={{ fontSize: 13, color: "var(--color-muted-foreground)", lineHeight: 1.4 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Link to full life page */}
              <div style={{ border: "2px solid #0A0A0A", borderTop: "none", display: "flex", flexDirection: "column", gap: 14, padding: "18px 24px" }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 900, color: "var(--color-foreground)", marginBottom: 4 }}>Жизнь в ВВГУ</p>
                  <p style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>Полная информация о студенческой жизни, досуге и инфраструктуре кампуса</p>
                </div>
                <a href="https://www.vvsu.ru/life/" target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start" }}>
                  <button style={{ background: "transparent", border: "2px solid #0A0A0A", color: "var(--color-foreground)", fontSize: 12, fontWeight: 900, padding: "10px 18px", cursor: "pointer", letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    vvsu.ru/life <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </a>
              </div>
            </motion.div>
          )}

          {/* ── Контакты ────────────────────────────────── */}
          {activeTab === "contacts" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map((c, i) => (
                  <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="rounded-2xl border-border/60 h-full">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-black">{c.mark}</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{c.label}</p>
                          <p className="font-semibold text-foreground text-sm mt-0.5">{c.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Map embed placeholder */}
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="aspect-video bg-muted/40 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-5xl block mb-2">◉</span>
                    <p className="font-semibold text-foreground">г. Владивосток, ул. Гоголя, 41</p>
                    <p className="text-sm text-muted-foreground mt-1">ВВГУ, корпус А</p>
                    <a href="https://yandex.ru/maps/-/CDNnJdPL" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent text-sm mt-3 hover:underline">
                      Открыть на карте <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl overflow-hidden border-border/60">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #0057B8, #EB7124)" }} />
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground mb-2">Онлайн-подача документов</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Вы можете подать документы через портал Госуслуги или сайт университета не выходя из дома.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://www.gosuslugi.ru" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="rounded-full">Госуслуги <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                    </a>
                    <a href="https://www.vvsu.ru/admission/" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="rounded-full">Сайт ВВГУ <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0057B8 0%, #0057B8 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-accent text-lg">✦</span>
              <span className="text-white/60 text-sm uppercase tracking-widest">Осталось сделать один шаг</span>
              <span className="text-accent text-lg">✦</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы стать частью ВВГУ?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-13" asChild>
                <Link href="/register">Зарегистрироваться <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 bg-white/5 text-white hover:bg-white/10" asChild>
                <Link href="/cabinet">Личный кабинет</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
