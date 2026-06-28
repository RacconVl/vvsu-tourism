import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, Palette, Monitor, Shirt, PenTool,
  Package, Building2, Leaf, GraduationCap, MapPin, Users,
  Briefcase, Star, CheckCircle, Quote, Layers, Lightbulb,
} from "lucide-react";

const tracks = [
  {
    id: "environment",
    emoji: "🏛️",
    title: "Дизайн среды",
    subtitle: "ИНТЕРЬЕР • ОБЩЕСТВЕННЫЕ ПРОСТРАНСТВА • ЛАНДШАФТ • 3D",
    color: "#033F7E",
    creates: [
      "Интерьеры и общественные пространства",
      "Городские сценарии и благоустройство",
      "3D-визуализации, макеты и материалы",
      "Реальные задачи для среды Владивостока",
    ],
    cta: "Создавай не просто проекты — создавай среду для жизни",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: "digital",
    emoji: "💻",
    title: "Цифровой дизайн",
    subtitle: "UX/UI • 3D • MOTION • WEB • AI • GAME",
    color: "#7c3aed",
    creates: [
      "Интерфейсы и digital-продукты",
      "3D-объекты и motion-графика",
      "Визуальные системы и контент",
      "Проектирование пользовательского опыта",
    ],
    cta: "От визуальной системы — к работающему цифровому продукту",
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    id: "fashion",
    emoji: "👗",
    title: "Цифровая мода и дизайн костюма",
    subtitle: "FASHION • 3D • БРЕНД • КОЛЛЕКЦИИ",
    color: "#db2777",
    creates: [
      "Дизайн костюма и fashion-эскиз",
      "Конструирование и коллекции",
      "Цифровое моделирование одежды",
      "Собственный бренд и визуальная подача",
    ],
    cta: "Fashion + technology: от эскиза до цифровой коллекции",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    id: "graphic",
    emoji: "🎨",
    title: "Графический дизайн",
    subtitle: "АЙДЕНТИКА • УПАКОВКА • ПЛАКАТЫ • ФОРМА",
    color: "#EB7124",
    creates: [
      "Айдентика и брендинг",
      "Типографика и упаковка",
      "Плакаты и рекламные материалы",
      "Визуальные системы для бизнеса",
    ],
    cta: "Визуальные системы — в одном портфолио",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    id: "industrial",
    emoji: "⚙️",
    title: "Промышленный дизайн",
    subtitle: "ПРЕДМЕТЫ • ПРОТОТИПЫ • ЭРГОНОМИКА",
    color: "#0891b2",
    creates: [
      "Предметы и формы",
      "Прототипирование и 3D-печать",
      "Эргономика и технические концепты",
      "Продуктовый дизайн",
    ],
    cta: "Предметные решения — в одном портфолио",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "architecture",
    emoji: "🏗️",
    title: "Архитектура и ландшафт",
    subtitle: "АРХИТЕКТУРА • ЛАНДШАФТ • СРЕДА",
    color: "#16a34a",
    creates: [
      "Архитектурные чертежи и концепции",
      "Ландшафтное проектирование",
      "Городская среда и благоустройство",
      "Макеты и 3D-модели",
    ],
    cta: "Создавай архитектуру, которая меняет город",
    icon: <Leaf className="h-5 w-5" />,
  },
];

const processSteps = [
  { num: "01", label: "Идея", desc: "Формулировка замысла и концепции" },
  { num: "02", label: "Исследование", desc: "Анализ среды, аудитории, аналогов" },
  { num: "03", label: "Эскиз", desc: "Первые визуальные решения" },
  { num: "04", label: "Модель", desc: "3D, макет или прототип" },
  { num: "05", label: "Прототип", desc: "Рабочая версия проекта" },
  { num: "06", label: "Защита", desc: "Публичная презентация перед экспертами" },
  { num: "07", label: "Портфолио", desc: "Проект становится частью твоего портфолио" },
];

const portfolioCategories = [
  {
    title: "Среда",
    icon: "🏛️",
    items: ["Интерьеры", "Макеты", "Общественные пространства", "Городские концепции"],
    color: "#033F7E",
  },
  {
    title: "Digital",
    icon: "💻",
    items: ["UX/UI-проекты", "Motion-графика", "3D-объекты", "Веб-интерфейсы"],
    color: "#7c3aed",
  },
  {
    title: "Fashion",
    icon: "👗",
    items: ["Коллекции одежды", "Бренд и айдентика", "3D-одежда", "Fashion-съёмки"],
    color: "#db2777",
  },
  {
    title: "Архитектура",
    icon: "🏗️",
    items: ["Чертежи", "Концепции", "Макеты", "Ландшафтные проекты"],
    color: "#16a34a",
  },
];

const careers = [
  { role: "Дизайнер среды", track: "Дизайн среды", icon: "🏛️" },
  { role: "Интерьерный дизайнер", track: "Дизайн среды", icon: "🛋️" },
  { role: "Графический дизайнер", track: "Графический дизайн", icon: "🎨" },
  { role: "UX/UI-дизайнер", track: "Цифровой дизайн", icon: "📱" },
  { role: "Motion / 3D-дизайнер", track: "Цифровой дизайн", icon: "✨" },
  { role: "Дизайнер костюма", track: "Мода", icon: "👗" },
  { role: "Архитектор", track: "Архитектура", icon: "🏗️" },
  { role: "Ландшафтный дизайнер", track: "Архитектура", icon: "🌿" },
  { role: "Игропедагог", track: "Педагогика", icon: "🎮" },
  { role: "Методист творческих программ", track: "Педагогика", icon: "📚" },
];

const whyVvsu = [
  { icon: <Layers className="h-5 w-5" />, title: "Проектное обучение", desc: "Ты собираешь проектный путь, а не просто изучаешь дисциплины" },
  { icon: <MapPin className="h-5 w-5" />, title: "Связь с городом и регионом", desc: "Владивосток — учебная лаборатория. Реальные городские задачи" },
  { icon: <Briefcase className="h-5 w-5" />, title: "Портфолио с первого курса", desc: "Твоё портфолио начинается уже во время учёбы, не после" },
  { icon: <Sparkles className="h-5 w-5" />, title: "Междисциплинарность", desc: "Дизайн + архитектура + цифровые технологии в одной среде" },
  { icon: <Users className="h-5 w-5" />, title: "Преподаватели-практики", desc: "Дизайнеры, архитекторы и эксперты индустрии — наставники проектов" },
  { icon: <Star className="h-5 w-5" />, title: "Реальные городские проекты", desc: "Образование превращается в профессиональный маршрут студента" },
];

export default function DesignProgramsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4" style={{ background: "linear-gradient(135deg, #172E46 0%, #1a0533 50%, #033F7E 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Floating design icons */}
        {["🎨", "💻", "👗", "🏛️", "⚙️", "🌿"].map((emoji, i) => (
          <motion.div key={i} className="absolute text-2xl opacity-10 pointer-events-none"
            style={{ top: `${15 + i * 12}%`, left: `${5 + i * 15}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}>
            {emoji}
          </motion.div>
        ))}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-white/10 text-white border-white/20 mb-4 text-sm px-4 py-1">Креативные индустрии · ВВГУ ИТИКИ</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Создавай город.<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #EB7124, #db2777)" }}>
                Создавай образы.
              </span>
              <br />Создавай будущее.
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Дизайн, архитектура, мода и цифровые медиа — 7 образовательных треков в сердце Владивостока.
              Практика с первого дня, портфолио с первого курса.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-12">
                <Link href="/admission">Узнать о поступлении <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/specialty-test">Какой трек подходит мне?</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ИТИКИ как творческая экосистема */}
      <div className="bg-muted/30 border-b border-border/40 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "7", label: "образовательных треков", color: "#033F7E" },
            { num: "4+", label: "года портфолио во время учёбы", color: "#EB7124" },
            { num: "100%", label: "преподавателей — практики", color: "#7c3aed" },
            { num: "∞", label: "возможностей для города", color: "#16a34a" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-20">

        {/* Карта образовательных треков */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Palette className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Карта направлений</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Выбери свой образовательный трек</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Навигация строится вокруг понятных образовательных треков — найди свой путь</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tracks.map((track, i) => (
              <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
                <Card className="rounded-2xl border-border/60 hover:shadow-xl transition-shadow h-full overflow-hidden">
                  <div className="h-1.5" style={{ background: track.color }} />
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{track.emoji}</div>
                      <div>
                        <h3 className="font-bold text-foreground text-base leading-snug">{track.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{track.subtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {track.creates.map((item, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: track.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-medium pt-1 border-t border-border/40" style={{ color: track.color }}>
                      ↘ {track.cta}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Как строится обучение */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Процесс обучения</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Идея → Портфолио</h2>
            <p className="text-muted-foreground mt-2">Студент собирает проектный путь, а не просто изучает дисциплины</p>
          </div>
          <div className="relative">
            {/* connecting line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-[#7c3aed] to-[#16a34a] hidden md:block mx-[7%]" />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
              {processSteps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center">
                  <div className="w-16 h-16 rounded-2xl border-2 border-accent/30 bg-accent/5 flex flex-col items-center justify-center mx-auto mb-3 hover:border-accent hover:bg-accent/10 transition-colors">
                    <div className="text-xs font-black text-accent">{step.num}</div>
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{step.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-accent font-semibold mt-8 text-sm">
            ↘ Твоё портфолио начинается уже во время учёбы
          </motion.p>
        </motion.section>

        {/* Что будет в портфолио */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Диплом + реальные проекты</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Что будет в твоём портфолио</h2>
            <p className="text-muted-foreground mt-2">Реальные работы студентов лучше любых обещаний объясняют, чему здесь учатся</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioCategories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                <Card className="rounded-2xl border-border/60 hover:shadow-lg transition-shadow h-full overflow-hidden">
                  <div className="h-1" style={{ background: cat.color }} />
                  <CardContent className="p-5">
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="font-bold text-foreground mb-3">{cat.title}</h3>
                    <div className="space-y-1.5">
                      {cat.items.map((item, j) => (
                        <div key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Владивосток как проектная лаборатория */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 space-y-5" style={{ background: "linear-gradient(135deg, #172E46, #033F7E)" }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-white/60 uppercase tracking-widest text-xs">Набережные • Маршруты • Парки</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Владивосток как проектная лаборатория</h2>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">↘</span>
                    <span>Город становится учебной лабораторией — не просто фон, а проект, который можно улучшить</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">↘</span>
                    <span>Студенты работают с реальной средой региона: набережными, маршрутами, парками</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">↘</span>
                    <span>Дизайн среды связан с туризмом и городской экономикой Приморья</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">↘</span>
                    <span>Туристические маршруты, культурные события, общественные пространства — реальные задачи</span>
                  </div>
                </div>
                <p className="text-white font-bold italic">«Город — это не фон. Это проект, который можно улучшить.»</p>
              </div>
              <div className="p-8 md:p-10 space-y-4 bg-muted/30">
                <h3 className="font-bold text-foreground text-lg">Чем усиливает город студентов ВВГУ</h3>
                {[
                  { icon: "🌊", text: "Работа с набережными и морской набережной" },
                  { icon: "🗺️", text: "Проектирование туристических маршрутов" },
                  { icon: "🌳", text: "Благоустройство парков и общественных пространств" },
                  { icon: "🎭", text: "Дизайн культурных и городских событий" },
                  { icon: "🏙️", text: "Концепции развития городской среды АТР" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="text-xl">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Почему ВВГУ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Ценность образования</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Почему ВВГУ ИТИКИ?</h2>
            <p className="text-muted-foreground mt-2">Проектное обучение и региональный фокус</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyVvsu.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}>
                <Card className="rounded-2xl border-border/60 hover:shadow-md transition-shadow p-5 h-full">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Для родителей */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-2xl border-border/60 bg-muted/30">
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge variant="outline" className="mb-4 text-xs">Информация для родителей</Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Прикладные навыки и понятная ценность</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Это не просто творческое образование — это профессиональный маршрут с конкретным результатом.
                    Обучение даёт <strong>диплом, навыки, реальные проекты и профессиональные контакты</strong>.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Цифровые инструменты: Figma, Blender, AutoCAD, AI-инструменты",
                      "Проектная работа с реальными заказчиками",
                      "Карьерные маршруты с первого курса",
                      "Востребованные компетенции на рынке АТР",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-foreground">Карьерные сценарии</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {careers.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border/60 text-sm">
                        <span className="text-lg">{c.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground text-xs leading-tight">{c.role}</p>
                          <p className="text-muted-foreground text-[10px]">{c.track}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="rounded-2xl p-12 border border-border/60 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533, #172E46)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-white mb-3">Твой проектный путь начинается здесь</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8 text-sm">
                Мечтай, исследуй, твори — объединяя искусство и технологии. Портфолио начинается с первого курса.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-12">
                  <Link href="/admission">Поступить в ВВГУ ИТИКИ <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/open-day">День открытых дверей</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/specialty-test">Пройти тест</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
