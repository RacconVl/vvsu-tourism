import { Link } from "wouter";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, ArrowRight, Shield, Anchor, Waves, Star, Users, Trophy, BookOpen, GraduationCap, Zap, Globe } from "lucide-react";

/* ── SVG Illustrations ──────────────────────────────────────── */

function CompassIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Outer ring */}
      <motion.circle cx="100" cy="100" r="80" stroke="#033F7E" strokeWidth="3" strokeDasharray="8 4" opacity="0.3"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 100px" }} />
      {/* Middle ring */}
      <circle cx="100" cy="100" r="60" stroke="#EB7124" strokeWidth="1.5" opacity="0.2" />
      {/* Inner circle */}
      <circle cx="100" cy="100" r="40" fill="#033F7E" opacity="0.15" />
      <circle cx="100" cy="100" r="40" stroke="#033F7E" strokeWidth="2" opacity="0.4" />
      {/* Compass needle N */}
      <motion.g style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: [0, 8, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <polygon points="100,62 106,100 100,108 94,100" fill="#EB7124" />
        <polygon points="100,108 106,100 100,138 94,100" fill="#033F7E" opacity="0.6" />
      </motion.g>
      {/* Center dot */}
      <circle cx="100" cy="100" r="6" fill="white" />
      <circle cx="100" cy="100" r="3" fill="#EB7124" />
      {/* Cardinal points */}
      {[["N", 100, 18], ["S", 100, 188], ["W", 12, 104], ["E", 188, 104]].map(([l, x, y]) => (
        <text key={String(l)} x={x} y={y} textAnchor="middle" fill="#033F7E" fontSize="12" fontWeight="700" opacity="0.6">{l}</text>
      ))}
      {/* Sparkles */}
      {[[40, 40], [160, 40], [40, 160], [160, 160]].map(([x, y], i) => (
        <motion.g key={i} style={{ transformOrigin: `${x}px ${y}px` }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}>
          <circle cx={x} cy={y} r="3" fill="#EB7124" />
        </motion.g>
      ))}
    </svg>
  );
}

function MapIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Sea background */}
      <motion.ellipse cx="100" cy="130" rx="75" ry="25" fill="#033F7E" opacity="0.1"
        animate={{ scaleX: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      {/* Map outline - Vladivostok peninsula shape */}
      <motion.path d="M70,50 Q80,40 100,38 Q130,36 145,55 Q158,72 155,95 Q150,125 130,145 Q110,158 95,155 Q75,150 65,130 Q52,108 58,85 Q62,65 70,50 Z"
        fill="#033F7E" stroke="#033F7E" strokeWidth="2"
        animate={{ opacity: [0.12, 0.18, 0.12] }} transition={{ duration: 3, repeat: Infinity }} />
      {/* Grid lines */}
      {[60, 80, 100, 120, 140].map(y => (
        <line key={y} x1="30" y1={y} x2="170" y2={y} stroke="#033F7E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      ))}
      {[60, 90, 120, 150].map(x => (
        <line key={x} x1={x} y1="30" x2={x} y2="170" stroke="#033F7E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      ))}
      {/* Location pins */}
      {[[100, 75], [125, 105], [80, 120]].map(([x, y], i) => (
        <motion.g key={i} style={{ transformOrigin: `${x}px ${y}px` }}
          animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}>
          <circle cx={x} cy={y} r="10" fill={i === 0 ? "#EB7124" : "#033F7E"} opacity="0.2" />
          <circle cx={x} cy={y} r="6" fill={i === 0 ? "#EB7124" : "#033F7E"} opacity="0.8" />
          <circle cx={x} cy={y} r="3" fill="white" />
        </motion.g>
      ))}
      {/* Route line */}
      <motion.path d="M100,75 Q115,92 125,105 Q105,112 80,120" stroke="#EB7124" strokeWidth="2" strokeDasharray="5 3" fill="none" opacity="0.6"
        animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
    </svg>
  );
}

function TrophyIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Glow */}
      <motion.circle cx="100" cy="85" r="55" fill="#EB7124" opacity="0.08"
        animate={{ r: [50, 58, 50] }} transition={{ duration: 3, repeat: Infinity }} />
      {/* Trophy body */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M72,45 L128,45 L122,90 Q118,115 100,120 Q82,115 78,90 Z" fill="#EB7124" opacity="0.85" />
        <path d="M72,45 L60,45 Q48,45 48,60 Q48,80 72,88 Z" fill="#d97706" opacity="0.6" />
        <path d="M128,45 L140,45 Q152,45 152,60 Q152,80 128,88 Z" fill="#d97706" opacity="0.6" />
        <rect x="88" y="120" width="24" height="20" fill="#EB7124" opacity="0.7" rx="2" />
        <rect x="75" y="138" width="50" height="8" fill="#EB7124" rx="4" />
        {/* Star on trophy */}
        <polygon points="100,60 103,71 115,71 106,78 109,89 100,82 91,89 94,78 85,71 97,71" fill="white" opacity="0.9" />
      </motion.g>
      {/* Orbiting stars */}
      {[0, 120, 240].map((deg, i) => (
        <motion.circle key={i} cx={100 + 65 * Math.cos((deg * Math.PI) / 180)} cy={85 + 65 * Math.sin((deg * Math.PI) / 180)} r="4"
          fill="#EB7124"
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
          style={{ transformOrigin: "100px 85px" }} />
      ))}
    </svg>
  );
}

function CommunityIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Connection lines */}
      <motion.line x1="100" y1="100" x2="50" y2="60" stroke="#033F7E" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3"
        animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.line x1="100" y1="100" x2="150" y2="60" stroke="#033F7E" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3"
        animate={{ opacity: [0.4, 0.15, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.line x1="100" y1="100" x2="45" y2="145" stroke="#EB7124" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3"
        animate={{ opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
      <motion.line x1="100" y1="100" x2="155" y2="145" stroke="#EB7124" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3"
        animate={{ opacity: [0.5, 0.25, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
      {/* Avatar circles */}
      {[
        { cx: 50,  cy: 60,  r: 22, fill: "#033F7E", delay: 0 },
        { cx: 150, cy: 60,  r: 22, fill: "#EB7124", delay: 0.3 },
        { cx: 45,  cy: 148, r: 18, fill: "#172E46", delay: 0.6 },
        { cx: 155, cy: 148, r: 18, fill: "#d97706", delay: 0.9 },
      ].map((a, i) => (
        <motion.g key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: a.delay }}>
          <circle cx={a.cx} cy={a.cy} r={a.r} fill={a.fill} opacity="0.2" />
          <circle cx={a.cx} cy={a.cy} r={a.r - 4} fill={a.fill} opacity="0.7" />
          {/* Face */}
          <circle cx={a.cx} cy={a.cy - 3} r={4} fill="white" opacity="0.8" />
          <ellipse cx={a.cx} cy={a.cy + 7} rx={5} ry={3} fill="white" opacity="0.5" />
        </motion.g>
      ))}
      {/* Center hub */}
      <motion.circle cx="100" cy="100" r="26" fill="#033F7E" opacity="0.15"
        animate={{ r: [24, 28, 24] }} transition={{ duration: 2, repeat: Infinity }} />
      <circle cx="100" cy="100" r="20" fill="#033F7E" opacity="0.8" />
      <text x="100" y="106" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">✦</text>
    </svg>
  );
}

function ShipIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Sea waves */}
      <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M20,155 Q50,140 80,155 Q110,170 140,155 Q170,140 190,155" stroke="#033F7E" strokeWidth="2.5" fill="none" opacity="0.3" />
      </motion.g>
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <path d="M20,165 Q50,152 80,165 Q110,178 140,165 Q170,152 190,165" stroke="#033F7E" strokeWidth="1.5" fill="none" opacity="0.2" />
      </motion.g>
      {/* Ship hull */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M55,130 L145,130 L135,155 Q100,162 65,155 Z" fill="#172E46" opacity="0.9" />
        <rect x="70" y="100" width="60" height="32" rx="4" fill="#033F7E" />
        {/* Windows */}
        <rect x="78" y="108" width="12" height="10" rx="2" fill="white" opacity="0.7" />
        <rect x="95" y="108" width="12" height="10" rx="2" fill="white" opacity="0.7" />
        <rect x="112" y="108" width="12" height="10" rx="2" fill="white" opacity="0.7" />
        {/* Mast */}
        <line x1="100" y1="100" x2="100" y2="45" stroke="#172E46" strokeWidth="3" />
        {/* Sail */}
        <motion.path d="M100,50 L140,75 L100,95 Z" fill="#EB7124" opacity="0.7"
          animate={{ skewY: [0, 2, 0, -2, 0] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.path d="M100,55 L65,75 L100,90 Z" fill="#EB7124" opacity="0.4"
          animate={{ skewY: [0, -2, 0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.3 }} />
        {/* Flag */}
        <motion.path d="M100,45 L118,38 L100,31 Z" fill="#EB7124"
          animate={{ scaleX: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "100px 38px" }} />
      </motion.g>
    </svg>
  );
}

/* ── Why Us data ─────────────────────────────────────────────── */
const whyUs = [
  {
    Illustration: CompassIllustration,
    title: "Практика с первого дня",
    desc: "Учебные квесты проходят на реальных туристических объектах Владивостока. Вы решаете настоящие бизнес-задачи ещё в стенах университета.",
    accent: "#033F7E",
    stat: "80%",
    statLabel: "практики от курса",
  },
  {
    Illustration: MapIllustration,
    title: "Уникальная локация",
    desc: "Владивосток — самый динамичный туристический хаб Дальнего Востока. Бухта Золотой Рог, Японское море и природные парки — ваша живая лаборатория.",
    accent: "#EB7124",
    stat: "3+",
    statLabel: "млн туристов в год",
  },
  {
    Illustration: TrophyIllustration,
    title: "Карьера в индустрии",
    desc: "Партнёрство с ведущими отелями, туроператорами и авиакомпаниями АТР. Выпускники работают по всему Тихоокеанскому региону.",
    accent: "#d97706",
    stat: "94%",
    statLabel: "трудоустройство",
  },
  {
    Illustration: CommunityIllustration,
    title: "Живое сообщество",
    desc: "Студенческие клубы, фестивали, международные обмены. Мы строим не просто образование — мы создаём профессиональную сеть на всю жизнь.",
    accent: "#7c3aed",
    stat: "2 500+",
    statLabel: "студентов",
  },
];

const stats = [
  { value: "30+", label: "лет опыта", icon: <GraduationCap className="h-5 w-5" /> },
  { value: "2 500+", label: "студентов", icon: <Users className="h-5 w-5" /> },
  { value: "94%", label: "трудоустройство", icon: <Trophy className="h-5 w-5" /> },
  { value: "40+", label: "партнёров", icon: <Globe className="h-5 w-5" /> },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0a1a2e 0%, #0d2444 30%, #033F7E 70%, #0a2d5c 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute right-[8%] top-[12%] opacity-[0.06] pointer-events-none">
          <Anchor className="h-72 w-72 text-white" style={{ transform: "rotate(15deg)" }} />
        </div>
        {[
          { top: "18%", left: "12%", size: 3, delay: 0 },
          { top: "32%", left: "7%", size: 2, delay: 0.8 },
          { top: "55%", left: "15%", size: 2.5, delay: 0.4 },
          { top: "22%", right: "22%", size: 2, delay: 1.2 },
          { top: "68%", right: "10%", size: 3, delay: 0.6 },
          { top: "78%", left: "30%", size: 2, delay: 1.5 },
          { top: "12%", left: "45%", size: 1.5, delay: 0.9 },
          { top: "42%", right: "28%", size: 2.5, delay: 0.3 },
        ].map((s, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
            style={{ top: s.top, left: (s as {left?: string}).left, right: (s as {right?: string}).right, width: s.size, height: s.size }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + i * 0.4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(235,113,36,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full">
            <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,90 L0,90 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur text-white/70 text-sm mb-8">
              <Waves className="h-4 w-4 text-accent" />
              ВВГУ · Институт туризма и креативных индустрий
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
              Морское путешествие <br />
              <span className="text-accent drop-shadow-[0_0_32px_rgba(235,113,36,0.5)]">к знаниям</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Станьте профессионалом туризма. Исследуйте Владивосток, выполняйте квесты и стройте карьеру в индустрии гостеприимства.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none rounded-full px-8 h-14 text-lg shadow-[0_0_32px_rgba(235,113,36,0.35)]" asChild>
                <Link href="/dashboard">Начать экспедицию <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10" asChild>
                <Link href="/courses">Изучить курсы</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="py-12 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white mb-1"
                  style={{ background: "linear-gradient(135deg, #033F7E, #172E46)" }}>
                  {s.icon}
                </div>
                <span className="text-3xl font-bold text-foreground">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-bold text-center text-foreground mb-16">
            Платформа нового поколения
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Compass className="h-9 w-9" />, color: "#033F7E", title: "Интерактивные квесты", desc: "Практические задания на реальных локациях Владивостока. Решайте бизнес-кейсы и получайте опыт." },
              { icon: <MapIcon className="h-9 w-9" />, color: "#EB7124", title: "Изучение региона", desc: "Погрузитесь в историю, культуру и географию Приморского края через нашу интерактивную карту." },
              { icon: <Shield className="h-9 w-9" />, color: "#172E46", title: "Профессиональные роли", desc: "Развивайтесь как экскурсовод, маркетолог, дизайнер или туроператор. Каждая роль уникальна." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center space-y-4 group">
                <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${f.color}cc, ${f.color})` }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────── */}
      <section className="py-24 overflow-hidden relative" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.3) 50%, hsl(var(--background)) 100%)" }}>
        {/* Decorative bg circles */}
        <div className="absolute -left-40 top-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(3,63,126,0.07) 0%, transparent 70%)" }} />
        <div className="absolute -right-40 bottom-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(235,113,36,0.07) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-muted/30 text-muted-foreground text-sm mb-5">
              <Star className="h-4 w-4 text-accent" /> Почему ВВГУ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ваш курс к<br />
              <span className="text-accent">успешной карьере</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Мы сочетаем академическое образование, живую практику и уникальную среду Владивостока.
            </p>
          </motion.div>

          <div className="space-y-20">
            {whyUs.map(({ Illustration, title, desc, accent, stat, statLabel }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}>
                {/* Illustration */}
                <div className="w-full md:w-80 shrink-0">
                  <div className="relative">
                    {/* Glow bg */}
                    <div className="absolute inset-0 rounded-3xl" style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }} />
                    <div className="relative h-64 w-full flex items-center justify-center p-8">
                      <Illustration />
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="text-4xl font-bold" style={{ color: accent }}>{stat}</span>
                      <span className="text-muted-foreground text-sm">{statLabel}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg max-w-lg">{desc}</p>
                    <div className="mt-6 h-1 w-16 rounded-full" style={{ background: accent }} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Student Life Preview ───────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Жизнь в кампусе</h2>
            <p className="text-muted-foreground">Современная инфраструктура в центре Владивостока</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <ShipIllustration />, title: "Кампус у моря", desc: "Учебные корпуса в нескольких минутах от набережной бухты Золотой Рог.", color: "#033F7E" },
              { icon: <BookOpen className="h-16 w-16 text-white" />, title: "Библиотека и лаборатории", desc: "Современные учебные пространства, медиатека и специализированные туристические лаборатории.", color: "#EB7124" },
              { icon: <Users className="h-16 w-16 text-white" />, title: "Общежития", desc: "Комфортное проживание в 5 минутах от университета. Все условия для учёбы и отдыха.", color: "#172E46" },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="rounded-2xl overflow-hidden border border-border/60 group hover:shadow-lg transition-shadow h-full">
                  <div className="h-44 flex items-center justify-center relative"
                    style={{ background: `linear-gradient(135deg, ${c.color}dd, ${c.color}99)` }}>
                    <div className="h-32 w-32 opacity-80">{c.icon}</div>
                  </div>
                  <div className="p-5 bg-card">
                    <h3 className="font-bold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
            <Button variant="outline" className="rounded-full px-8" asChild>
              <Link href="/admission">Узнать о поступлении <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #172E46 0%, #033F7E 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute right-10 top-0 bottom-0 flex items-center pointer-events-none opacity-[0.04]">
          <Anchor className="h-64 w-64 text-white" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-white/60 text-sm uppercase tracking-widest">Начните прямо сейчас</span>
              <Star className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Готовы к экспедиции?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 h-13" asChild>
                <Link href="/register">Зарегистрироваться бесплатно <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 bg-white/5 text-white hover:bg-white/10" asChild>
                <Link href="/admission">Информация о поступлении</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
