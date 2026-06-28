import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight, CheckCircle, MapPin, Users, Briefcase, Star,
  Layers, Lightbulb, Monitor, Building2, Leaf, Palette,
  GraduationCap, FlaskConical, Trophy, Phone, Mail, MessageCircle,
  ChevronDown, Clock, BookOpen, Hammer,
} from "lucide-react";

/* ─── data ─────────────────────────────────────────────────── */

const tracks = [
  {
    id: "environment", emoji: "🏙️", color: "#033F7E",
    title: "Дизайн среды",
    tags: "интерьеры, городская среда, 3D",
    creates: ["Интерьеры и общественные пространства", "Городские сценарии и благоустройство", "3D-визуализации и макеты", "Реальные задачи для среды Владивостока"],
    exam: "Рисунок + Композиция",
    places: "15 бюджет / 20 платно",
  },
  {
    id: "digital", emoji: "💻", color: "#7c3aed",
    title: "Цифровой дизайн",
    tags: "UX/UI, графика, motion, AI",
    creates: ["Интерфейсы и digital-продукты", "3D-объекты и motion-графика", "Визуальные системы и контент", "Проектирование пользовательского опыта"],
    exam: "Рисунок + Композиция",
    places: "15 бюджет / 20 платно",
  },
  {
    id: "fashion", emoji: "👗", color: "#db2777",
    title: "Цифровая мода и дизайн костюма",
    tags: "fashion, 3D, бренд, коллекции",
    creates: ["Дизайн костюма и fashion-эскиз", "Конструирование и коллекции", "Цифровое моделирование одежды", "Собственный бренд и визуальная подача"],
    exam: "Рисунок + Композиция",
    places: "10 бюджет / 15 платно",
  },
  {
    id: "graphic", emoji: "🎨", color: "#EB7124",
    title: "Графический дизайн",
    tags: "айдентика, упаковка, плакаты",
    creates: ["Айдентика и брендинг", "Типографика и упаковка", "Плакаты и визуальные системы", "Рекламные и медиа-материалы"],
    exam: "Рисунок + Композиция",
    places: "10 бюджет / 15 платно",
  },
  {
    id: "industrial", emoji: "⚙️", color: "#0891b2",
    title: "Промышленный дизайн",
    tags: "предметы, прототипы, эргономика",
    creates: ["Предметы и формы", "Прототипирование и 3D-печать", "Эргономика и технические концепты", "Продуктовый дизайн"],
    exam: "Рисунок + Композиция",
    places: "10 бюджет / 10 платно",
  },
  {
    id: "architecture", emoji: "🏗️", color: "#16a34a",
    title: "Архитектура",
    tags: "здания, макеты, чертежи, городская среда",
    creates: ["Жилые и общественные здания", "Пространства и городская среда", "Ландшафтная организация территорий", "Образ города и защита проектных решений"],
    exam: "Рисунок + Черчение",
    places: "15 бюджет / 15 платно",
  },
  {
    id: "landscape", emoji: "🌿", color: "#65a30d",
    title: "Ландшафтная архитектура",
    tags: "парки, территории, экодизайн",
    creates: ["Ландшафтное проектирование", "Парки и рекреационные зоны", "Экологические концепции", "Благоустройство территорий"],
    exam: "Рисунок + Композиция",
    places: "10 бюджет / 10 платно",
  },
  {
    id: "master", emoji: "🎓", color: "#6366f1",
    title: "Магистратура",
    tags: "исследования, управление, экспертиза",
    creates: ["Исследования в области дизайна", "Управление творческими проектами", "Педагогика и методология", "Экспертная деятельность"],
    exam: "Портфолио + Собеседование",
    places: "5 бюджет / 10 платно",
  },
];

const timeline = [
  { year: "1990-е", label: "Основание", desc: "Начало художественного и дизайн-образования в ВВГУ" },
  { year: "2005", label: "Развитие", desc: "Объединение кафедр художественного направления" },
  { year: "2015", label: "Кафедра дизайна", desc: "Создание кафедры дизайна и технологий в составе ИТИКИ" },
  { year: "2020+", label: "Цифровая эра", desc: "Запуск цифровых направлений: UX/UI, motion, цифровая мода, AI" },
  { year: "Сегодня", label: "7 треков", desc: "Полная экосистема: бакалавриат + магистратура в сердце Владивостока" },
];

const labs = [
  { icon: "🖥️", title: "Компьютерные классы", desc: "Figma, Blender, AutoCAD, Adobe CC, AI-инструменты" },
  { icon: "🔨", title: "Мастерские", desc: "Макеты, материалы, прототипирование, 3D-печать" },
  { icon: "🎨", title: "Рисунок и живопись", desc: "Художественная база, академический рисунок, планшеты" },
  { icon: "📸", title: "Фотостудия", desc: "Предметная и портретная съёмка, обработка" },
  { icon: "🧵", title: "Швейная мастерская", desc: "Конструирование, пошив, работа с материалами" },
  { icon: "🏛️", title: "Пространство для проектов", desc: "Выставочные зоны, защиты, презентации работ" },
];

const whyItems = [
  { icon: <Star className="h-4 w-4" />, title: "Практика с первого курса", desc: "Реальные проекты, а не только учебные задания" },
  { icon: <Briefcase className="h-4 w-4" />, title: "Портфолио и личный бренд", desc: "Портфолио начинается с первого дня учёбы" },
  { icon: <MapPin className="h-4 w-4" />, title: "Владивосток и Приморье", desc: "Городская среда — ваша проектная лаборатория" },
  { icon: <Layers className="h-4 w-4" />, title: "Междисциплинарность", desc: "Дизайн + технологии + мода + туризм" },
  { icon: <Lightbulb className="h-4 w-4" />, title: "Реальные проекты", desc: "Работа с реальными заказчиками и задачами" },
  { icon: <Users className="h-4 w-4" />, title: "Первые заказы", desc: "Монетизация навыков ещё во время учёбы" },
];

const projectFilters = ["Все", "Дизайн среды", "Цифровой дизайн", "Мода", "Графика", "Архитектура"];

const mockProjects = [
  { title: "Интерьер кофейни", author: "Анна М., 3 курс", track: "Дизайн среды", emoji: "🏛️", color: "#033F7E" },
  { title: "Приложение для туристов", author: "Иван С., 4 курс", track: "Цифровой дизайн", emoji: "💻", color: "#7c3aed" },
  { title: "Коллекция «Тихий океан»", author: "Мария К., 3 курс", track: "Мода", emoji: "👗", color: "#db2777" },
  { title: "Айдентика рыбного рынка", author: "Дмитрий П., 4 курс", track: "Графика", emoji: "🎨", color: "#EB7124" },
  { title: "Набережная Спортивной гавани", author: "Екатерина В., 5 курс", track: "Архитектура", emoji: "🏗️", color: "#16a34a" },
  { title: "Фирменный стиль ИТИКИ", author: "Команда, 2 курс", track: "Графика", emoji: "✨", color: "#EB7124" },
];

const achievements = [
  { icon: "🏆", title: "Конкурсы и фестивали", desc: "Победы на всероссийских и региональных конкурсах дизайна" },
  { icon: "🖼️", title: "Выставки", desc: "Ежегодные выставки студенческих работ в ВВГУ и городских площадках" },
  { icon: "🎖️", title: "Гранты и стипендии", desc: "Студенты получают гранты на реализацию проектов" },
  { icon: "🏙️", title: "Городские проекты", desc: "Дипломные проекты для реальных объектов Владивостока" },
  { icon: "🌐", title: "Международное участие", desc: "Обмен и сотрудничество со студентами АТР" },
  { icon: "📰", title: "Публикации", desc: "Работы студентов в профессиональных изданиях" },
];

const researchAreas = [
  { emoji: "🏛️", title: "Дизайн среды", desc: "Городская среда, интерьерное проектирование" },
  { emoji: "💻", title: "Цифровой дизайн", desc: "UX, визуальные коммуникации, digital-среда" },
  { emoji: "👗", title: "Мода и технологии", desc: "Цифровое моделирование, sustainable fashion" },
  { emoji: "🎮", title: "Игропедагогика", desc: "Геймификация обучения, творческие методики" },
  { emoji: "🏗️", title: "Архитектура", desc: "Урбанистика, пространственное мышление" },
  { emoji: "🔬", title: "Проектные группы", desc: "Interdisciplinary research и совместные кейсы" },
];

const partners = [
  { emoji: "🏢", name: "Студии дизайна Владивостока" },
  { emoji: "🏛️", name: "Архитектурные бюро" },
  { emoji: "👗", name: "Fashion-компании региона" },
  { emoji: "🏙️", name: "Администрация Приморского края" },
  { emoji: "🎨", name: "Галереи и арт-пространства" },
  { emoji: "💼", name: "IT-компании и digital-агентства" },
];

const staff = [
  { name: "Заведующий кафедрой", role: "д-р наук, профессор", expertise: "Дизайн среды, урбанистика", emoji: "👤" },
  { name: "Координатор: Цифровой дизайн", role: "Практикующий UX/UI-дизайнер", expertise: "Figma, пользовательский опыт", emoji: "👤" },
  { name: "Координатор: Мода", role: "Fashion-дизайнер, практик", expertise: "Конструирование, 3D-мода", emoji: "👤" },
  { name: "Координатор: Архитектура", role: "Архитектор, к.т.н.", expertise: "Проектирование, урбанистика", emoji: "👤" },
];

const processSteps = [
  { num: "01", label: "Идея" }, { num: "02", label: "Исследование" },
  { num: "03", label: "Эскиз" }, { num: "04", label: "Модель" },
  { num: "05", label: "Прототип" }, { num: "06", label: "Защита" },
  { num: "07", label: "Портфолио" },
];

const anchorSections = [
  { id: "about",         label: "О кафедре" },
  { id: "history",       label: "История" },
  { id: "programs",      label: "Направления" },
  { id: "advantages",    label: "Преимущества" },
  { id: "labs",          label: "Лаборатории" },
  { id: "projects",      label: "Проекты" },
  { id: "partners",      label: "Практика" },
  { id: "applicants",    label: "Поступление" },
  { id: "creative-test", label: "Испытания" },
  { id: "parents",       label: "Родителям" },
  { id: "team",          label: "Преподаватели" },
  { id: "contacts",      label: "Контакты" },
];

/* ─── component ─────────────────────────────────────────────── */

export default function DesignProgramsPage() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", question: "" });
  const [formSent, setFormSent] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeFilter === "Все"
    ? mockProjects
    : mockProjects.filter((p) => p.track === activeFilter);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── BLOCK 1: Hero ─────────────────────────────────────── */}
      <div style={{ background: "#0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        {/* Label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "18px 48px", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#FF007F" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#FF007F" }}>Дизайн & Арт</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>→ ВВГУ · ИТИКИ</span>
        </div>
        {/* Marquee */}
        <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content", padding: "10px 0" }}>
            {Array.from({ length: 4 }).flatMap((_, ri) =>
              ["ДИЗАЙН", "✦", "АРХИТЕКТУРА", "✦", "ЦИФРОВЫЕ МЕДИА", "✦", "ДИЗАЙН СРЕДЫ", "✦", "ГРАФИКА", "✦", "ПОРТФОЛИО", "✦", "ПРОЕКТЫ", "✦"].map((w, wi) => (
                <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "✦" ? "#C6FF00" : "rgba(255,255,255,0.45)", flexShrink: 0 }}>{w}</span>
              ))
            )}
          </div>
        </div>
        {/* Hero content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", minHeight: 320, alignItems: "stretch" }}>
          <div className="max-w-6xl px-12 py-14">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Кафедра дизайна и технологий · Кафедра архитектуры</div>
              <h1 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 20 }}>
                Дизайн,<br />архитектура<br /><span style={{ color: "#FF007F" }}>и технологии</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
                Образование для тех, кто хочет создавать визуальные, предметные, пространственные и цифровые проекты. Твоё портфолио начинается здесь.
              </p>
              {/* CTA buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                <button onClick={() => scrollTo("programs")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#FF007F", color: "#fff", fontSize: 13, fontWeight: 900, border: "none", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>
                  Выбрать направление <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
                {[
                  { label: "Проекты", key: "projects" },
                  { label: "Поступить", key: "applicants" },
                  { label: "Консультация", key: "contacts" },
                ].map(({ label, key }) => (
                  <button key={key} onClick={() => scrollTo(key)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700, background: "transparent", cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Quick facts */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {[
                { icon: "🎓", label: "Бакалавриат" }, { icon: "🎓", label: "Магистратура" },
                { icon: "⏱️", label: "Очное обучение" }, { icon: "🏛️", label: "ИТИКИ" },
                { icon: "🖼️", label: "Портфолио" }, { icon: "🧩", label: "Реальные проекты" },
              ].map((f, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px", textAlign: "center", marginRight: -1, marginBottom: -1 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{f.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </div>

      {/* ── Sticky anchor nav ─────────────────────────────────── */}
      <div className="sticky top-[80px] z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto no-scrollbar">
            {anchorSections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className="shrink-0 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-colors border-b-2 border-transparent hover:border-accent whitespace-nowrap">
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">

        {/* ── BLOCK 2: О кафедре ─────────────────────────────── */}
        <motion.section id="about" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-xs" id="about-badge">О кафедре</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">Две кафедры — одна творческая среда</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Кафедра дизайна и технологий и кафедра архитектуры ВВГУ ИТИКИ — это единое пространство
                для тех, кто проектирует будущее: визуальные образы, цифровую среду, пространства, одежду,
                предметы и архитектуру.
              </p>
              <div className="space-y-2.5">
                {[
                  "Практико-ориентированное обучение с первого курса",
                  "Преподаватели — действующие практики отрасли",
                  "Проектная работа и связь с реальным регионом",
                  "Конкурсы, выставки, реальные кейсы",
                  "Портфолио формируется с первых курсов",
                  "Мечтать, исследовать, творить — объединяя искусство и технологии",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* History timeline */}
            <div id="history">
              <h3 className="font-bold text-foreground mb-5 text-lg">История кафедры</h3>
              <div className="relative pl-6 border-l-2 border-accent/20 space-y-6">
                {timeline.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                    <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-accent mt-1" />
                    <div className="text-xs font-black text-accent mb-0.5">{t.year}</div>
                    <div className="text-sm font-semibold text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{t.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOCK 4: Направления подготовки ────────────────── */}
        <motion.section id="programs" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Palette className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Карта направлений</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Выбери свой образовательный трек</h2>
            <p className="text-muted-foreground mt-2 text-sm">Нажми на карточку, чтобы узнать подробнее о направлении</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tracks.map((track, i) => (
              <motion.div key={track.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card
                  onClick={() => setSelectedTrack(selectedTrack === track.id ? null : track.id)}
                  className={`rounded-2xl border cursor-pointer transition-all hover:shadow-lg ${selectedTrack === track.id ? "border-accent/60 shadow-md" : "border-border/60"}`}>
                  <div className="h-1.5 rounded-t-2xl" style={{ background: track.color }} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{track.emoji}</span>
                      <h3 className="font-bold text-foreground text-sm leading-snug">{track.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{track.tags}</p>
                    {selectedTrack === track.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 border-t border-border/40 pt-3 mt-1">
                        {track.creates.map((c, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full shrink-0 mt-1" style={{ background: track.color }} />
                            {c}
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-border/40">
                          <div className="text-xs font-semibold text-foreground">Вступительное: <span className="font-normal text-muted-foreground">{track.exam}</span></div>
                          <div className="text-xs font-semibold text-foreground">Места: <span className="font-normal text-muted-foreground">{track.places}</span></div>
                        </div>
                        <Button onClick={() => scrollTo("applicants")} size="sm" className="w-full rounded-lg text-xs mt-1" style={{ background: track.color }}>
                          Подробнее о поступлении
                        </Button>
                      </motion.div>
                    )}
                    {selectedTrack !== track.id && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: track.color }}>
                        <ChevronDown className="h-3 w-3" /> Подробнее
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── BLOCK 5: Почему выбирают + лабораторная база ──── */}
        <motion.section id="advantages" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Ценность</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-6">Почему выбирают кафедру</h2>
              <div className="space-y-4">
                {whyItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div id="labs">
              <Badge variant="outline" className="mb-4 text-xs">Учебно-лабораторная база</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-6">Пространства и инструменты</h2>
              <div className="grid grid-cols-2 gap-3">
                {labs.map((lab, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="bg-muted/40 border border-border/50 rounded-xl p-3 hover:bg-muted/60 transition-colors">
                    <div className="text-2xl mb-2">{lab.icon}</div>
                    <p className="text-sm font-semibold text-foreground">{lab.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{lab.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Процесс обучения ───────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Как строится обучение</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Идея → Портфолио: 7 шагов</h2>
            <p className="text-muted-foreground text-sm mt-1">Студент собирает проектный путь, а не просто изучает дисциплины</p>
          </div>
          <div className="relative">
            <div className="absolute top-8 left-[7%] right-[7%] h-0.5 bg-gradient-to-r from-accent via-[#7c3aed] to-[#16a34a] hidden md:block" />
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 relative z-10">
              {processSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center">
                  <div className="w-16 h-16 rounded-2xl border-2 border-accent/30 bg-accent/5 flex items-center justify-center mx-auto mb-2 hover:border-accent hover:bg-accent/10 transition-colors">
                    <span className="text-xs font-black text-accent">{step.num}</span>
                  </div>
                  <p className="text-xs font-bold text-foreground">{step.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── BLOCK 7: Проекты студентов ─────────────────────── */}
        <motion.section id="projects" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 text-xs">Главный аргумент поступления</Badge>
            <h2 className="text-3xl font-bold text-foreground">Проекты студентов</h2>
            <p className="text-muted-foreground text-sm mt-1">Реальные работы объясняют лучше любых слов, чему здесь учатся</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {projectFilters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all border ${activeFilter === f ? "bg-accent text-white border-accent" : "border-border/60 text-muted-foreground hover:border-accent/50"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProjects.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border/60 bg-muted/20 hover:shadow-lg transition-all overflow-hidden cursor-pointer">
                <div className="h-32 flex items-center justify-center text-5xl" style={{ background: p.color + "15" }}>
                  {p.emoji}
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium mb-0.5" style={{ color: p.color }}>{p.track}</div>
                  <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">Галерея пополняется — здесь будут реальные проекты студентов</p>
        </motion.section>

        {/* ── BLOCK 8: Практика и партнёры ──────────────────── */}
        <motion.section id="partners" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Практика и среда</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-4">Жизнь кафедр</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Выставки, защиты, интенсивы, мастер-классы — постоянная проектная среда, которая формирует
                опыт публичной презентации и профессиональный круг общения.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🖼️", t: "Выставки и просмотры", d: "Регулярные показы работ в ВВГУ и на городских площадках" },
                  { icon: "🏆", t: "Защиты и конкурсы", d: "Экспертные жюри из практиков отрасли" },
                  { icon: "⚡", t: "Интенсивы и мастер-классы", d: "С приглашёнными дизайнерами, архитекторами, технологами" },
                  { icon: "🤝", t: "Реальные заказчики", d: "Дипломные проекты и практика в реальных организациях" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.t}</p>
                      <p className="text-xs text-muted-foreground">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-5">Партнёры и места практики</h3>
              <div className="grid grid-cols-2 gap-3">
                {partners.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                    <span className="text-xl">{p.emoji}</span>
                    <span className="text-foreground text-xs font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOCK 9: Наука и исследования ─────────────────── */}
        <motion.section id="research" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Наука и творческая деятельность</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-5">Исследовательские направления</h2>
              <div className="grid grid-cols-2 gap-3">
                {researchAreas.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="text-2xl mb-2">{r.emoji}</div>
                    <p className="text-sm font-semibold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* BLOCK 10: Достижения */}
              <Badge variant="outline" className="mb-4 text-xs">Конкурсы и достижения</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-5">Гордость кафедры</h2>
              <div className="space-y-3">
                {achievements.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOCK 11: Состав кафедры ───────────────────────── */}
        <motion.section id="team" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Наставники, практики, эксперты</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Преподаватели и профессиональная среда</h2>
            <p className="text-muted-foreground text-sm mt-1">Сильная среда помогает студенту быстрее войти в профессию</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {staff.map((s, i) => (
              <Card key={i} className="rounded-2xl border-border/60 text-center p-5">
                <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center text-2xl mx-auto mb-3">{s.emoji}</div>
                <p className="text-sm font-bold text-foreground leading-snug">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.role}</p>
                <p className="text-xs text-accent mt-1">{s.expertise}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <Users className="h-5 w-5 mx-auto text-accent" />, label: "Дизайнеры-практики", desc: "Действующие специалисты отрасли" },
              { icon: <FlaskConical className="h-5 w-5 mx-auto text-accent" />, label: "Эксперты индустрии", desc: "Консультации и экспертные сессии" },
              { icon: <Hammer className="h-5 w-5 mx-auto text-accent" />, label: "Наставники проектов", desc: "Персональное сопровождение" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/40">
                {item.icon}
                <p className="text-sm font-bold text-foreground mt-2">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── BLOCK 12: Абитуриенту ─────────────────────────── */}
        <motion.section id="applicants" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Как поступить</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Маршрут абитуриента</h2>
            <p className="text-muted-foreground text-sm mt-1">Выбери → Подготовься → Подай документы</p>
          </div>

          {/* 3-step applicant path */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                step: "01", icon: "🗺️", title: "Выбери направление",
                color: "#033F7E",
                items: ["Пройди тест на совместимость", "Изучи карточки треков", "Запишись на день открытых дверей"],
                action: { label: "Пройти тест", href: "/specialty-test" },
              },
              {
                step: "02", icon: "✏️", title: "Подготовься к испытанию",
                color: "#EB7124",
                items: ["Узнай формат творческого испытания", "Изучи критерии оценки", "Запишись на консультацию кафедры"],
                action: { label: "Об испытаниях", href: "#creative-test" },
              },
              {
                step: "03", icon: "📄", title: "Подай документы",
                color: "#16a34a",
                items: ["Лично, через Госуслуги или по почте", "Срок: до 20 июля (бюджет)", "Срок: до 10 августа (платно)"],
                action: { label: "Поступление", href: "/admission" },
              },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-2xl border-border/60 h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-1.5" style={{ background: s.color }} />
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
                        style={{ background: s.color }}>
                        {s.step}
                      </div>
                      <div>
                        <div className="text-xl">{s.icon}</div>
                        <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {s.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: s.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                    {s.action.href.startsWith("#") ? (
                      <Button onClick={() => scrollTo(s.action.href.slice(1))} size="sm" className="w-full rounded-lg text-xs" style={{ background: s.color }}>
                        {s.action.label} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="w-full rounded-lg text-xs" style={{ background: s.color }}>
                        <Link href={s.action.href}>{s.action.label} <ArrowRight className="ml-1 h-3 w-3" /></Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick info table */}
          <Card className="rounded-2xl border-border/60 bg-muted/20">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4">Быстрая информация</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Clock className="h-4 w-4" />, label: "Бакалавриат", val: "4 года, очно" },
                  { icon: <GraduationCap className="h-4 w-4" />, label: "Магистратура", val: "2 года, очно / заочно" },
                  { icon: <BookOpen className="h-4 w-4" />, label: "Вступительные", val: "Рисунок + Композиция" },
                  { icon: <Star className="h-4 w-4" />, label: "Бюджетные места", val: "от 10 до 15 на трек" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ── BLOCK 13: Творческие испытания ────────────────── */}
        <motion.section id="creative-test" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Творческое испытание</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-4">Что такое творческое испытание?</h2>
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-5">
                <p className="text-sm leading-relaxed text-foreground">
                  <strong>Творческое испытание — это не проверка «врождённого таланта»</strong>, а способ оценить
                  базовое композиционное мышление, пространственное восприятие и желание создавать.
                  Можно прийти без художественного образования.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "🎯", t: "Что оценивается", d: "Композиционное мышление, пространственное восприятие, рисунок с натуры" },
                  { icon: "📐", t: "Формат и материалы", d: "Карандаш, бумага А3; 3 часа; бытовая постановка или геометрические тела" },
                  { icon: "📋", t: "Критерии", d: "Пропорции, светотень, композиция листа, передача характера формы" },
                  { icon: "✏️", t: "Примеры заданий", d: "Натюрморт из 2–3 предметов, эскиз интерьерного пространства, шрифтовая композиция" },
                  { icon: "🎓", t: "Консультации", d: "Кафедра проводит бесплатные консультации для абитуриентов перед испытанием" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.t}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => scrollTo("contacts")} className="mt-6 rounded-full bg-accent hover:bg-accent/90 text-white" type="button">
                Записаться на консультацию <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {/* For parents */}
            <div id="parents">
              <Badge variant="outline" className="mb-4 text-xs">Для родителей</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-4">Прикладные навыки и понятная ценность</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Это не просто творческое образование — это профессиональный маршрут с конкретным результатом.
                Обучение даёт <strong>диплом, навыки, реальные проекты и профессиональные контакты</strong>.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  "Цифровые инструменты: Figma, Blender, AutoCAD, AI",
                  "Проектная работа с реальными заказчиками",
                  "Карьерные маршруты с первого курса",
                  "Востребованные компетенции на рынке АТР",
                  "Диплом государственного образца",
                  "Профессиональные контакты и наставники",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-foreground mb-3">Кем можно стать:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["🏛️","Дизайнер среды"],["🛋️","Интерьерный дизайнер"],
                  ["🎨","Графический дизайнер"],["📱","UX/UI-дизайнер"],
                  ["✨","Motion / 3D-дизайнер"],["👗","Дизайнер костюма"],
                  ["🏗️","Архитектор"],["🌿","Ландшафтный дизайнер"],
                ].map(([emoji, role], i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/40 text-xs">
                    <span>{emoji}</span>
                    <span className="font-medium text-foreground">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Владивосток как лаборатория ───────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 space-y-4" style={{ background: "linear-gradient(135deg,#172E46,#033F7E)" }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-white/60 text-xs uppercase tracking-widest">Набережные · Маршруты · Парки</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Владивосток — ваша проектная лаборатория</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Город — не просто фон. Это реальный проект, который можно улучшить.
                  Студенты работают с набережными, маршрутами, общественными пространствами и культурными объектами Приморья.
                </p>
                <div className="space-y-2.5">
                  {[
                    "Реальные городские задачи вместо учебных",
                    "Туристические маршруты и культурная среда",
                    "Благоустройство и общественные пространства",
                    "Связь дизайна, архитектуры и туризма АТР",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-accent mt-0.5">↘</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 md:p-10 space-y-3 bg-muted/20">
                <h3 className="font-bold text-foreground text-lg">Городские объекты кафедры</h3>
                {[
                  { icon: "🌊", t: "Морская набережная", d: "Концепции развития и благоустройства" },
                  { icon: "🗺️", t: "Туристические маршруты", d: "Навигация и визуальное оформление" },
                  { icon: "🌳", t: "Парки и скверы", d: "Ландшафтные проекты для Владивостока" },
                  { icon: "🎭", t: "Культурные события", d: "Айдентика и визуальный дизайн мероприятий" },
                  { icon: "🏙️", t: "Городская среда", d: "Концепции для городского развития Приморья" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{item.t}</p>
                      <p className="text-xs text-muted-foreground">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        {/* ── BLOCK 16: Контакты + форма ────────────────────── */}
        <motion.section id="contacts" ref={formRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Контакты</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-5">Свяжитесь с кафедрой</h2>
              <div className="space-y-4 mb-7">
                {[
                  { icon: <MapPin className="h-4 w-4" />, label: "Адрес", val: "Владивосток, ул. Гоголя, 41, ВВГУ ИТИКИ" },
                  { icon: <Mail className="h-4 w-4" />, label: "E-mail", val: "design@vvsu.ru" },
                  { icon: <Phone className="h-4 w-4" />, label: "Телефон", val: "+7 (423) 240-40-40" },
                  { icon: <MessageCircle className="h-4 w-4" />, label: "Telegram", val: "@miost_vl — новости кафедры" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">{c.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <p className="text-sm font-medium text-foreground">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">Координатор кафедры</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Координатор приёмной комиссии</p>
                    <p className="text-xs text-muted-foreground">Кафедра дизайна и технологий</p>
                    <p className="text-xs text-accent mt-0.5">Пн–Пт, 9:00–17:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Badge variant="outline" className="mb-4 text-xs">Заявка на консультацию</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-5">Получить консультацию</h2>
              {formSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Заявка отправлена!</h3>
                  <p className="text-sm text-muted-foreground">Координатор кафедры свяжется с вами в течение одного рабочего дня.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Ваше имя</label>
                    <Input placeholder="Имя и фамилия" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Телефон или e-mail</label>
                    <Input placeholder="+7 (900) 000-00-00 или email@example.com" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Ваш вопрос</label>
                    <Textarea placeholder="Напишите, что хотите узнать о поступлении, направлениях или творческом испытании..." value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="rounded-xl resize-none" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Интересующее направление</label>
                    <div className="flex flex-wrap gap-2">
                      {["Дизайн среды","Цифровой дизайн","Мода","Графика","Архитектура","Магистратура"].map((t) => (
                        <button type="button" key={t}
                          onClick={() => setForm({ ...form, question: `Интересует: ${t}. ` + form.question })}
                          className="px-3 py-1 rounded-full text-xs border border-border/60 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-11">
                    Получить консультацию <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── BLOCK 17: Финальный CTA ────────────────────────── */}
        <motion.section id="final-cta" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="rounded-2xl p-12 border border-border/60 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1a0533,#172E46)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-white mb-3">Выбери своё направление в дизайне и технологиях ВВГУ</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8 text-sm">
                Твоё портфолио начинается здесь. Мечтай, исследуй, твори — объединяя искусство и технологии.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-12">
                  <Link href="/admission">Поступить <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button onClick={() => scrollTo("directions")} variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Смотреть направления
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/open-day">День открытых дверей</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
