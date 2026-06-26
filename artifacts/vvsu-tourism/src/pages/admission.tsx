import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, ClipboardList, FileText, Phone, MapPin,
  ChevronRight, CheckCircle2, Clock, Calendar, ArrowRight,
  Anchor, Waves, Star, Users, BookOpen, Award, Home, Wifi,
  Utensils, ShieldCheck, Play, ExternalLink,
  Palette, Sparkles, Lightbulb, Monitor, TreePine, Zap,
} from "lucide-react";

const programs = [
  {
    code: "43.03.02",
    title: "Туризм",
    degree: "Бакалавриат",
    duration: "4 года",
    form: "Очная / Заочная",
    places: { budget: 25, paid: 30 },
    profiles: ["Технология и организация туроператорской деятельности", "Технология и организация туристских услуг"],
    color: "#033F7E",
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
    color: "#172E46",
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
  {
    num: 1,
    title: "Подача заявления",
    desc: "Подайте заявление лично в приёмную комиссию, через Госуслуги или по почте. Укажите желаемое направление и форму обучения.",
    icon: <FileText className="h-6 w-6" />,
    deadline: "20 июля",
  },
  {
    num: 2,
    title: "Сдача документов",
    desc: "Предоставьте оригиналы или копии необходимых документов. Полный список указан в разделе «Документы».",
    icon: <ClipboardList className="h-6 w-6" />,
    deadline: "25 июля",
  },
  {
    num: 3,
    title: "Вступительные испытания",
    desc: "Для некоторых специальностей проводятся дополнительные творческие испытания. Расписание публикуется на сайте.",
    icon: <BookOpen className="h-6 w-6" />,
    deadline: "28–30 июля",
  },
  {
    num: 4,
    title: "Зачисление",
    desc: "После конкурсного отбора абитуриенты, вошедшие в список, подают оригиналы документов для зачисления.",
    icon: <Award className="h-6 w-6" />,
    deadline: "9 августа",
  },
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
  { label: "Приёмная комиссия",  value: "+7 (423) 240-40-07", icon: <Phone className="h-4 w-4" /> },
  { label: "Адрес",              value: "г. Владивосток, ул. Гоголя, 41", icon: <MapPin className="h-4 w-4" /> },
  { label: "Режим работы",       value: "Пн–Пт: 09:00–17:00", icon: <Clock className="h-4 w-4" /> },
  { label: "Email",              value: "priem@vvsu.ru", icon: <FileText className="h-4 w-4" /> },
];

type TabKey = "programs" | "steps" | "documents" | "exams" | "dorm" | "contacts";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "programs",  label: "Направления",          icon: <GraduationCap className="h-4 w-4" /> },
  { key: "steps",     label: "Этапы поступления",    icon: <ClipboardList className="h-4 w-4" /> },
  { key: "documents", label: "Документы",             icon: <FileText className="h-4 w-4" /> },
  { key: "exams",     label: "Вступительные",         icon: <BookOpen className="h-4 w-4" /> },
  { key: "dorm",      label: "Общежитие",             icon: <Home className="h-4 w-4" /> },
  { key: "contacts",  label: "Контакты",              icon: <Phone className="h-4 w-4" /> },
];

const dormAmenities = [
  { icon: <Wifi className="h-5 w-5" />,        label: "Высокоскоростной Wi-Fi",        desc: "Оптоволоконный интернет во всех комнатах и зонах отдыха" },
  { icon: <Utensils className="h-5 w-5" />,    label: "Столовая и буфет",              desc: "Горячее питание 3 раза в день, кухни на каждом этаже" },
  { icon: <ShieldCheck className="h-5 w-5" />, label: "Круглосуточная охрана",         desc: "Пропускная система, видеонаблюдение, комендант" },
  { icon: <Users className="h-5 w-5" />,       label: "Комнаты отдыха",               desc: "Телевизоры, настольный теннис, зоны для общения" },
  { icon: <BookOpen className="h-5 w-5" />,    label: "Читальный зал",                 desc: "Тихая учебная зона с доступом к университетским ресурсам" },
  { icon: <Home className="h-5 w-5" />,        label: "Прачечная",                     desc: "Стиральные машины и сушилки на каждом этаже" },
];

const dormRooms = [
  { type: "Одноместная",  price: "4 500 ₽/мес", places: 40,  color: "#033F7E", desc: "Личное пространство с письменным столом, шкафом и кроватью" },
  { type: "Двухместная",  price: "2 800 ₽/мес", places: 120, color: "#EB7124", desc: "Стандартный блок на 2 студента, раздельные рабочие зоны" },
  { type: "Трёхместная",  price: "2 200 ₽/мес", places: 60,  color: "#172E46", desc: "Экономичный вариант для иногородних первокурсников" },
];

export default function AdmissionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("programs");

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1a2e 0%, #033F7E 60%, #0a2d5c 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute right-10 top-10 opacity-[0.05] pointer-events-none">
          <Anchor className="h-64 w-64 text-white" />
        </div>
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="hsl(var(--background))" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/8 text-white/70 text-sm mb-6">
              <Waves className="h-4 w-4 text-accent" />
              Институт туризма и креативных индустрий · ВВГУ
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Поступление <span className="text-accent">2026</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Начните своё путешествие в мир туризма, гостеприимства и творческих индустрий. Мы ждём вас в ВВГУ!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60 mb-8">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Бюджетные и платные места</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Приём до 30 августа 2026</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" /> Очная и заочная формы</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.vvsu.ru/about/flagship-educational-programs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full px-8 py-3 text-sm transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50"
              >
                <Play className="h-4 w-4" />
                Флагманские образовательные программы
                <ExternalLink className="h-4 w-4 ml-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-background py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 p-1 rounded-2xl border border-border/60 bg-muted/30 mb-8 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === t.key
                    ? "bg-background shadow-sm text-foreground border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Направления ─────────────────────────────── */}
          {activeTab === "programs" && (
            <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {programs.map((p, i) => (
                <motion.div key={p.code} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Card className="rounded-2xl border-border/60 overflow-hidden hover:shadow-md transition-shadow h-full group">
                    <div className="h-40 overflow-hidden relative">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${p.color}cc)` }} />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="text-xs font-mono text-white/80">{p.code}</span>
                        <Badge className="text-xs rounded-full text-white border-white/30 bg-white/10 backdrop-blur-sm">{p.degree}</Badge>
                      </div>
                    </div>
                    <div className="h-1" style={{ background: p.color }} />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                        </div>
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{ background: p.color }}
                        >
                          <GraduationCap className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="rounded-xl bg-muted/50 p-2.5 text-center">
                          <p className="font-bold text-foreground">{p.duration}</p>
                          <p className="text-xs text-muted-foreground">Срок обучения</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-2.5 text-center">
                          <p className="font-bold text-foreground">{p.form}</p>
                          <p className="text-xs text-muted-foreground">Форма</p>
                        </div>
                        <div className="rounded-xl p-2.5 text-center" style={{ background: `${p.color}15` }}>
                          <p className="font-bold" style={{ color: p.color }}>{p.places.budget}</p>
                          <p className="text-xs text-muted-foreground">Бюджет</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-2.5 text-center">
                          <p className="font-bold text-foreground">{p.places.paid}</p>
                          <p className="text-xs text-muted-foreground">Платные</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">Профили:</p>
                        <ul className="space-y-1">
                          {p.profiles.map((pr) => (
                            <li key={pr} className="flex items-center gap-2 text-sm text-foreground">
                              <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} /> {pr}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Дизайн: два направления ─────────────────── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
              <div className="rounded-2xl border border-[#172E46]/20 bg-gradient-to-br from-[#172E46]/5 to-[#6366f1]/5 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-xl bg-[#172E46] flex items-center justify-center text-white shrink-0">
                    <Palette className="h-5 w-5" />
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
                  <div className="rounded-2xl bg-white dark:bg-card border border-[#6366f1]/20 p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shrink-0">
                        <Monitor className="h-5 w-5" />
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
                      <p className="text-xs font-semibold text-[#6366f1] mb-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Идеально, если ты:</p>
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
                      <Zap className="h-3.5 w-3.5 text-[#6366f1]" />
                      Выпускники работают в стартапах, турагентствах и digital-агентствах по всей России и АТР
                    </div>
                  </div>

                  {/* Дизайн среды */}
                  <div className="rounded-2xl bg-white dark:bg-card border border-[#0d9488]/20 p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shrink-0">
                        <TreePine className="h-5 w-5" />
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
                      <p className="text-xs font-semibold text-[#0d9488] mb-2 flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> Идеально, если ты:</p>
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
                      <Zap className="h-3.5 w-3.5 text-[#0d9488]" />
                      Выпускники работают с девелоперами, отельными сетями и туристическими объектами Приморья
                    </div>
                  </div>
                </div>

                {/* Общие преимущества */}
                <div className="mt-6 rounded-xl bg-[#172E46]/5 border border-[#172E46]/10 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  {[
                    { icon: <Award className="h-4 w-4" />, label: "Лицензированная программа", sub: "государственный диплом" },
                    { icon: <Users className="h-4 w-4" />, label: "Практики отрасли", sub: "преподаватели-действующие специалисты" },
                    { icon: <Star className="h-4 w-4" />, label: "Творческое испытание", sub: "портфолио вместо ЕГЭ по рисованию" },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-[#172E46] dark:text-[#6b8cbf]">{icon}</span>
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
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {steps.map((s, i) => (
                    <motion.div key={s.num} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex gap-5 pl-2 items-start"
                    >
                      <div className="relative z-10 h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: i === 0 ? "#EB7124" : "#033F7E" }}>
                        {s.icon}
                      </div>
                      <Card className="flex-1 rounded-2xl border-border/60">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="font-bold text-foreground">Шаг {s.num}: {s.title}</h3>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
                              style={{ background: "#EB7124" }}>
                              до {s.deadline}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              <Card className="rounded-2xl border-dashed border-accent/30 mt-8">
                <CardContent className="p-5 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Подача через Госуслуги</p>
                    <p className="text-sm text-muted-foreground">
                      Абитуриенты могут подать заявление дистанционно через портал Госуслуги или на сайте ВВГУ,
                      не приезжая лично в университет.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Документы ───────────────────────────────── */}
          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-5">
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #033F7E, #EB7124)" }} />
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" /> Перечень документов
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
              <Card className="rounded-2xl overflow-hidden border-border/60">
                <div className="h-1" style={{ background: "linear-gradient(90deg, #033F7E, #EB7124)" }} />
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" /> Что такое вступительные испытания?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Вступительные испытания — это дополнительные экзамены, которые проводит университет помимо результатов ЕГЭ.
                    Они позволяют оценить специальные навыки абитуриента, необходимые для конкретной специальности.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Для большинства направлений (Туризм, Гостиничное дело) достаточно результатов ЕГЭ.
                    Для направления <strong className="text-foreground">«Дизайн»</strong> (54.03.01) обязательно
                    прохождение творческого испытания — независимо от баллов ЕГЭ.
                  </p>
                </CardContent>
              </Card>

              {/* Список направлений */}
              <div className="grid grid-cols-1 gap-4">
                {exams.map((e, i) => (
                  <motion.div key={e.direction} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="rounded-2xl border-border/60">
                      <CardContent className="p-5 flex items-start gap-5">
                        <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground mb-2">{e.direction}</p>
                          <div className="flex flex-wrap gap-2">
                            {e.subjects.map((s, j) => (
                              <span key={j} className="text-xs px-3 py-1 rounded-full font-medium"
                                style={{ background: j === 0 ? "rgba(3,63,126,0.12)" : j === 1 ? "rgba(235,113,36,0.12)" : "rgba(23,46,70,0.1)",
                                         color: j === 0 ? "#033F7E" : j === 1 ? "#EB7124" : "#172E46" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Творческое испытание для Дизайна */}
              <Card className="rounded-2xl overflow-hidden border-[#EB7124]/30">
                <div className="h-1 bg-accent" />
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" /> Творческое испытание — Дизайн (54.03.01)
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Творческое испытание проводится для всех профилей направления «Дизайн», в том числе
                    для <strong className="text-foreground">Дизайна цифровой среды</strong> и
                    <strong className="text-foreground"> Цифрового дизайна</strong>.
                    Испытание оценивает художественные способности, пространственное мышление и базовые навыки композиции.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Рисунок", desc: "Академический рисунок геометрических тел или натюрморта карандашом. Оценивается конструктивное построение, светотень, пропорции.", color: "#033F7E", img: "/exam-drawing.png" },
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
                      <Clock className="h-4 w-4 text-accent" /> Как проходит испытание
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
                    <Clock className="h-4 w-4 text-accent" /> Минимальные баллы ЕГЭ
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">

              {/* Hero card with 3D tour */}
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="h-1.5" style={{ background: "linear-gradient(90deg, #033F7E, #EB7124)" }} />
                <div className="relative flex flex-col md:flex-row">
                  {/* 3D Tour panel */}
                  <div className="md:w-1/2 min-h-[280px] flex flex-col items-center justify-center gap-5 p-8 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0a1a2e 0%, #033F7E 100%)" }}>
                    {/* Animated dot grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-40"
                      style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    {/* Animated building SVG */}
                    <motion.svg viewBox="0 0 160 120" className="w-44 h-32 relative z-10" fill="none"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                      {/* Building */}
                      <rect x="20" y="35" width="120" height="80" rx="3" fill="#033F7E" opacity="0.6" />
                      <rect x="20" y="35" width="120" height="80" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      {/* Roof */}
                      <polygon points="10,35 80,8 150,35" fill="#172E46" opacity="0.8" />
                      {/* Windows grid */}
                      {([0,1,2,3] as const).flatMap(col => ([0,1,2] as const).map(row => (
                        <motion.rect key={`${col}-${row}`} x={32 + col * 28} y={48 + row * 22} width="16" height="14" rx="2"
                          fill="#EB7124"
                          animate={{ opacity: [0.4, 0.9, 0.4] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: (col + row) * 0.3 }} />
                      )))}
                      {/* Door */}
                      <rect x="68" y="90" width="24" height="25" rx="2" fill="#172E46" opacity="0.9" />
                      {/* Flag */}
                      <line x1="80" y1="8" x2="80" y2="0" stroke="white" strokeWidth="1.5" />
                      <motion.polygon points="80,0 96,-6 80,-12" fill="#EB7124"
                        animate={{ scaleX: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ transformOrigin: "80px -6px" }} />
                      {/* Stars */}
                      {[[15, 15], [145, 18], [10, 60], [152, 55]].map(([x, y], i) => (
                        <motion.circle key={i} cx={x} cy={y} r="1.5" fill="white"
                          animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
                      ))}
                    </motion.svg>
                    <div className="relative z-10 text-center">
                      <p className="text-white font-semibold mb-1">3D-тур по кампусу</p>
                      <p className="text-white/60 text-xs mb-4">Виртуальный осмотр общежития и учебных корпусов</p>
                      <a href="https://www.vvsu.ru/life/" target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="rounded-full bg-accent hover:bg-accent/90 text-white gap-2">
                          <Play className="h-3.5 w-3.5 fill-white" /> Открыть тур
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  {/* Info panel */}
                  <CardContent className="md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                      <Home className="h-5 w-5 text-accent" /> Студенческое общежитие ВВГУ
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Комфортное проживание в 5 минутах ходьбы от главного корпуса. Все иногородние студенты имеют право на место в общежитии при наличии свободных мест.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        ["220", "мест всего"],
                        ["5 мин", "до корпуса"],
                        ["24/7", "охрана"],
                        ["от 2 200 ₽", "в месяц"],
                      ].map(([v, l]) => (
                        <div key={l} className="rounded-xl bg-muted/50 p-3 text-center">
                          <p className="font-bold text-foreground text-lg leading-none">{v}</p>
                          <p className="text-xs text-muted-foreground mt-1">{l}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Room types */}
              <div>
                <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                  <Home className="h-4 w-4 text-accent" /> Типы комнат
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dormRooms.map((r, i) => (
                    <motion.div key={r.type} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Card className="rounded-2xl border-border/60 overflow-hidden h-full">
                        <div className="h-1.5" style={{ background: r.color }} />
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-foreground">{r.type}</h4>
                            <span className="text-sm font-bold" style={{ color: r.color }}>{r.price}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{r.desc}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" /> {r.places} мест
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> Удобства и инфраструктура
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dormAmenities.map((a, i) => (
                    <motion.div key={a.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          {a.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{a.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rules & Application */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="rounded-2xl border-border/60">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-accent" /> Как получить место
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {[
                        "Подать заявление в деканат до 1 августа",
                        "Предоставить справку об иногороднем адресе прописки",
                        "Заключить договор найма жилого помещения",
                        "Пройти инструктаж по правилам проживания",
                        "Оплатить первый месяц проживания",
                      ].map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "#EB7124" }}>{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/60">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent" /> Правила проживания
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {[
                        "Соблюдение тишины с 23:00 до 07:00",
                        "Запрет курения в здании",
                        "Гости допускаются до 22:00",
                        "Еженедельные санитарные дни (суббота)",
                        "Обязательное страхование имущества",
                      ].map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Link to full life page */}
              <Card className="rounded-2xl border-dashed border-accent/30 bg-accent/5">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">Жизнь в ВВГУ</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Полная информация о студенческой жизни, досуге и инфраструктуре кампуса</p>
                  </div>
                  <a href="https://www.vvsu.ru/life/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button variant="outline" className="rounded-full gap-2">
                      vvsu.ru/life <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
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
                          {c.icon}
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
                    <MapPin className="h-10 w-10 text-accent mx-auto mb-2" />
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
                <div className="h-1" style={{ background: "linear-gradient(90deg, #033F7E, #EB7124)" }} />
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
      <section className="py-16" style={{ background: "linear-gradient(135deg, #172E46 0%, #033F7E 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-white/60 text-sm uppercase tracking-widest">Осталось сделать один шаг</span>
              <Star className="h-5 w-5 text-accent" />
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
