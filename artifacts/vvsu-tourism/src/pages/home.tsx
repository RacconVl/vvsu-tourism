import { useState, useEffect } from "react";
import { CatMascot } from "@/components/illustrations/CatMascot";
import { Link } from "wouter";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, ArrowRight, Shield, Anchor, Waves, Star, Users, Trophy, BookOpen, GraduationCap, Zap, Globe, Briefcase, Building2, Plane, UtensilsCrossed, Camera, Ship, Palette, CheckCircle2, Sparkles, ExternalLink, Heart, Medal, Lightbulb } from "lucide-react";

/* ── SVG Illustrations ──────────────────────────────────────── */

function CompassIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Outer ring */}
      <motion.g style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        <circle cx="100" cy="100" r="80" stroke="#033F7E" strokeWidth="3" strokeDasharray="8 4" opacity="0.3" />
      </motion.g>
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
      <motion.g style={{ transformOrigin: "100px 85px" }}
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
        {[0, 120, 240].map((deg, i) => (
          <circle key={i} cx={100 + 65 * Math.cos((deg * Math.PI) / 180)} cy={85 + 65 * Math.sin((deg * Math.PI) / 180)} r="4" fill="#EB7124" />
        ))}
      </motion.g>
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

/* ── Stickman 94% → 100% animation ─────────────────────────── */
function StickmanStat() {
  const [phase, setPhase] = useState<"run"|"erase"|"spray"|"leave">("run");
  const [oldOp, setOldOp] = useState(1);
  const [newOp, setNewOp] = useState(0);
  const [stickX, setStickX] = useState(-55);
  const [stickDur, setStickDur] = useState(2.0);
  const [resetKey, setResetKey] = useState(0);
  // Single walk-cycle value 0→1 (triangle wave) that drives ALL limbs
  const [walkT, setWalkT] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));
    async function run() {
      while (!cancelled) {
        setResetKey(k => k + 1);
        setStickDur(2.0);
        setOldOp(1);
        setNewOp(0);
        setStickX(-55);
        await sleep(80);
        if (cancelled) break;
        setPhase("run");
        setStickX(38);
        await sleep(2300);
        if (cancelled) break;
        setPhase("erase");
        setOldOp(0);
        await sleep(1300);
        if (cancelled) break;
        setPhase("spray");
        setNewOp(1);
        await sleep(2200);
        if (cancelled) break;
        setPhase("leave");
        setStickDur(1.6);
        setStickX(160);
        await sleep(1900);
        if (cancelled) break;
        await sleep(600);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  const isMoving = phase === "run" || phase === "leave";

  // Single RAF loop — all limbs driven by one shared angle
  useEffect(() => {
    if (!isMoving) { setWalkT(0); return; }
    const period = 380; // ms per half-stride
    let startTime = 0;
    let rafId: number;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) % (period * 2);
      // triangle wave: 0→1 then 1→0
      setWalkT(elapsed < period ? elapsed / period : 2 - elapsed / period);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isMoving]);

  // Natural cross-pattern walk:
  //   right arm + left leg in phase  (both forward at walkT=0)
  //   left arm  + right leg in phase (both backward at walkT=0)
  const rArmDeg = -35 + walkT * 70;   // -35° (forward) → +35° (backward)
  const lArmDeg =  35 - walkT * 70;   // +35° (backward) → -35° (forward)
  const lLegDeg = -32 + walkT * 60;   // -32° (forward) → +28° (backward)  ← synced with rArm
  const rLegDeg =  28 - walkT * 60;   // +28° (backward) → -32° (forward)  ← synced with lArm

  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white mb-1"
        style={{ background: "linear-gradient(135deg, #033F7E, #172E46)" }}>
        <Trophy className="h-5 w-5" />
      </div>
      <div style={{ width: 140, height: 60, position: "relative" }}>
        <svg viewBox="-55 0 200 56" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <motion.text x={97} y={40} textAnchor="middle" fontSize="22" fontWeight="900"
            style={{ fill: "hsl(var(--foreground))" }}
            animate={{ opacity: oldOp }} transition={{ duration: 0.7 }}>94%</motion.text>
          <motion.text x={97} y={40} textAnchor="middle" fontSize="22" fontWeight="900"
            fill="#EB7124"
            animate={{ opacity: newOp }} transition={{ duration: 0.8 }}>100%</motion.text>

          {phase === "spray" && [0,1,2,3,4,5].map(i => (
            <motion.circle key={i} cx={52 + i * 7} cy={26} r={1.5} fill="#EB7124"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -(4 + i * 1.5)] }}
              transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.07 }} />
          ))}

          <motion.g key={resetKey} initial={{ x: -55 }} animate={{ x: stickX }}
            transition={{ duration: stickDur, ease: "easeInOut" }}>
            <circle cx={0} cy={7} r={5} stroke="#033F7E" strokeWidth={1.8} fill="none" />
            <line x1={0} y1={12} x2={0} y2={27} stroke="#033F7E" strokeWidth={1.8} />

            {/* RIGHT arm */}
            {phase === "erase" ? (
              <motion.g style={{ transformOrigin: "0px 17px" }}
                animate={{ rotate: [-18, 18] }}
                transition={{ duration: 0.25, repeat: Infinity, repeatType: "reverse" }}>
                <line x1={0} y1={17} x2={14} y2={17} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
                <rect x={10} y={14} width={7} height={4} rx={1} fill="#aaa" />
              </motion.g>
            ) : phase === "spray" ? (
              <g>
                <line x1={0} y1={17} x2={14} y2={11} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
                <rect x={12} y={8} width={8} height={5} rx={1.5} fill="#EB7124" />
                <circle cx={21} cy={10} r={1.3} fill="#c0392b" />
              </g>
            ) : (
              <g transform={`rotate(${isMoving ? rArmDeg : 0}, 0, 17)`}>
                <line x1={0} y1={17} x2={4} y2={28} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
              </g>
            )}

            {/* LEFT arm */}
            {isMoving ? (
              <g transform={`rotate(${lArmDeg}, 0, 17)`}>
                <line x1={0} y1={17} x2={-4} y2={28} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
              </g>
            ) : (
              <line x1={0} y1={17} x2={-8} y2={22} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
            )}

            {/* LEFT leg — synced with right arm */}
            <g transform={`rotate(${isMoving ? lLegDeg : 0}, 0, 27)`}>
              <line x1={0} y1={27} x2={-2} y2={45} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
            </g>

            {/* RIGHT leg — synced with left arm */}
            <g transform={`rotate(${isMoving ? rLegDeg : 0}, 0, 27)`}>
              <line x1={0} y1={27} x2={2} y2={45} stroke="#033F7E" strokeWidth={1.8} strokeLinecap="round" />
            </g>
          </motion.g>
        </svg>
      </div>
      <span className="text-sm text-muted-foreground">трудоустройство</span>
    </div>
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
        <CatMascot />
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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-10 leading-tight">
              Морское путешествие <br />
              <span className="text-accent drop-shadow-[0_0_32px_rgba(235,113,36,0.5)]">к знаниям</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none rounded-full px-8 h-14 text-lg shadow-[0_0_32px_rgba(235,113,36,0.35)]" asChild>
                <Link href="/dashboard">Начать экспедицию <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10" asChild>
                <Link href="/admission">Узнать о поступлении</Link>
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
                {i === 2 ? (
                  <StickmanStat />
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white mb-1"
                      style={{ background: "linear-gradient(135deg, #033F7E, #172E46)" }}>
                      {s.icon}
                    </div>
                    <span className="text-3xl font-bold text-foreground">{s.value}</span>
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flagship programs ──────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0a1a2e 0%, #0d2340 50%, #0a1a2e 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(3,63,126,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(235,113,36,0.12) 0%, transparent 40%)" }} />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm mb-5">
              <Sparkles className="h-4 w-4" /> Флагманские программы
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Выбери своё<br /><span className="text-accent">направление</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              Институт туризма и креативных индустрий — это три ведущих направления, открывающих двери в профессии будущего
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Tourism */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }} whileHover={{ y: -6 }}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm h-full flex flex-col group hover:border-[#033F7E]/60 transition-all hover:shadow-xl hover:shadow-[#033F7E]/20">
                <div className="relative h-52 overflow-hidden">
                  <img src="/prog-tourism.png" alt="Туризм" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(3,63,126,0.9) 100%)" }} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-[#033F7E] flex items-center justify-center"><Globe className="h-5 w-5 text-white" /></div>
                    <span className="text-white font-bold text-lg">Туризм</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">Бакалавриат · Магистратура</div>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <p className="text-white/70 text-sm leading-relaxed">Организация международных туров, экотуризм, круизный туризм в АТР. Практика с первого курса на объектах Приморья.</p>
                  <div className="space-y-2">
                    {["25 бюджетных мест", "Двойной диплом с Кореей", "Практика в отелях 5★"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-white/60"><CheckCircle2 className="h-3.5 w-3.5 text-[#033F7E] shrink-0" />{f}</div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#5b9cf6] hover:text-white transition-colors font-medium">
                      Подробнее о программе <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Design — highlighted */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -6 }}>
              <div className="rounded-2xl overflow-hidden border border-accent/40 h-full flex flex-col group hover:border-accent/70 transition-all hover:shadow-xl hover:shadow-accent/25 relative">
                <div className="absolute -top-px left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-accent/40">⭐ Флагманская</div>
                </div>
                <div className="relative h-52 overflow-hidden">
                  <img src="/prog-design.png" alt="Дизайн" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(20,10,5,0.92) 100%)" }} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center"><Palette className="h-5 w-5 text-white" /></div>
                    <span className="text-white font-bold text-lg">Дизайн</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1" style={{ background: "linear-gradient(160deg, #1a0e06 0%, #0d1a2e 100%)" }}>
                  <p className="text-white/70 text-sm leading-relaxed">Графический дизайн и дизайн среды. Реальные проекты с туристическими брендами, айдентика, UX/UI, дизайн туристических объектов Приморья.</p>
                  <div className="space-y-2">
                    {["Студия оборудована Mac Pro", "Партнёрство с агентствами VL", "Диплом = портфолио"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-white/60"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />{f}</div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-white transition-colors font-semibold">
                      Подробнее о программе <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hotel Management */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -6 }}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm h-full flex flex-col group hover:border-[#EB7124]/40 transition-all hover:shadow-xl hover:shadow-[#EB7124]/15">
                <div className="relative h-52 overflow-hidden">
                  <img src="/prog-hotel.png" alt="Гостиничное дело" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(20,10,0,0.9) 100%)" }} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-[#EB7124] flex items-center justify-center"><Building2 className="h-5 w-5 text-white" /></div>
                    <span className="text-white font-bold text-lg">Гостиничное дело</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">Бакалавриат</div>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <p className="text-white/70 text-sm leading-relaxed">Управление отелями и гостиничным сервисом международного уровня. Стажировки в 5★ отелях Владивостока, Сочи и Кореи.</p>
                  <div className="space-y-2">
                    {["20 бюджетных мест", "Стажировки в Hyatt, Marriott", "100% трудоустройство"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-white/60"><CheckCircle2 className="h-3.5 w-3.5 text-[#EB7124] shrink-0" />{f}</div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#fb923c] hover:text-white transition-colors font-medium">
                      Подробнее о программе <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-3 shadow-lg shadow-accent/30">
              <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer">
                Все флагманские программы ВВГУ <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Why choose us + student photos ─────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left: reasons */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-muted/30 text-muted-foreground text-sm mb-6">
                <Heart className="h-4 w-4 text-accent" /> Почему выбирают нас
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Институт,<br />который <span className="text-accent">меняет жизнь</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Мы не просто обучаем — мы погружаем в реальную индустрию с первого дня. Каждый студент получает наставника-практика и доступ к живым проектам.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Medal className="h-5 w-5" />, title: "Аккредитованные программы", desc: "Дипломы признаются работодателями России, Кореи, Японии и Китая", color: "#033F7E" },
                  { icon: <Lightbulb className="h-5 w-5" />, title: "Проектное обучение", desc: "Реальные кейсы от туристических компаний Приморья с первого семестра", color: "#EB7124" },
                  { icon: <Globe className="h-5 w-5" />, title: "Международная среда", desc: "Студенческий обмен с 12 университетами АТР, летние школы за рубежом", color: "#7c3aed" },
                  { icon: <Users className="h-5 w-5" />, title: "Сообщество выпускников", desc: "3 000+ выпускников работают в ведущих компаниях туристической отрасли", color: "#0891b2" },
                ].map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${r.color}cc, ${r.color})` }}>
                        {r.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-0.5">{r.title}</h4>
                        <p className="text-sm text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: photo mosaic */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden h-56 shadow-lg">
                  <img src="/students-1.png" alt="Абитуриенты ВВГУ" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden h-40 shadow-lg">
                  <img src="/students-2.png" alt="Студенты ВВГУ" className="w-full h-full object-cover" />
                </motion.div>
              </div>
              <div className="space-y-3 mt-8">
                <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden h-40 shadow-lg">
                  <img src="/students-3.png" alt="Кампус ВВГУ" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden h-56 shadow-lg">
                  <img src="/students-4.png" alt="Учёба в ВВГУ" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "70+", label: "Лет институту", color: "#033F7E" },
              { num: "3 000+", label: "Выпускников в индустрии", color: "#EB7124" },
              { num: "12", label: "Стран-партнёров", color: "#7c3aed" },
              { num: "95%", label: "Трудоустройство", color: "#16a34a" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="rounded-2xl border border-border/60 bg-card p-5 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
                  <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Careers ───────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-muted/30 text-muted-foreground text-sm mb-5">
              <Briefcase className="h-4 w-4 text-accent" /> Карьера выпускников
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Кем вы можете<br />
              <span className="text-accent">стать после ВВГУ</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Наши выпускники работают по всему Азиатско-Тихоокеанскому региону — от отелей Владивостока до туроператоров Японии и Кореи.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Plane className="h-7 w-7" />, title: "Туроператор / турагент", desc: "Организация туров, формирование маршрутов, работа с международными партнёрами АТР.", color: "#033F7E", salary: "от 60 000 ₽", img: "/career-touroperator.png" },
              { icon: <Building2 className="h-7 w-7" />, title: "Менеджер отеля", desc: "Управление гостиничным сервисом, стандарты 4–5★, работа с международными гостями.", color: "#EB7124", salary: "от 70 000 ₽", img: "/career-hotel.png" },
              { icon: <Globe className="h-7 w-7" />, title: "Экскурсовод / гид", desc: "Авторские туры по Приморью, острову Русский, маршруты на иностранных языках.", color: "#7c3aed", salary: "от 50 000 ₽", img: "/career-guide.png" },
              { icon: <Camera className="h-7 w-7" />, title: "Специалист по туристическому маркетингу", desc: "SMM, контент-маркетинг, продвижение туристических брендов и дестинаций.", color: "#0891b2", salary: "от 65 000 ₽", img: "/career-marketing.png" },
              { icon: <UtensilsCrossed className="h-7 w-7" />, title: "Организатор событий и MICE", desc: "Конференции, деловые форумы, фестивали, инсентив-туризм для корпоративных клиентов.", color: "#16a34a", salary: "от 75 000 ₽", img: "/career-events.png" },
              { icon: <Ship className="h-7 w-7" />, title: "Специалист круизного туризма", desc: "Обслуживание круизных лайнеров, портовый туризм, морские экскурсии по бухте Золотой Рог.", color: "#b45309", salary: "от 80 000 ₽", img: "/career-cruise.png" },
              { icon: <Palette className="h-7 w-7" />, title: "Графический дизайнер / арт-директор", desc: "Фирменный стиль туристических брендов, полиграфия, визуальная идентичность дестинаций.", color: "#db2777", salary: "от 70 000 ₽", img: "/career-designer-graphic.png" },
              { icon: <Sparkles className="h-7 w-7" />, title: "Дизайнер цифровых медиа", desc: "UX/UI туристических приложений и сайтов, motion-графика, веб-дизайн для АТР-рынка.", color: "#6366f1", salary: "от 75 000 ₽", img: "/career-designer-digital.png" },
              { icon: <Lightbulb className="h-7 w-7" />, title: "Дизайнер интерьера и пространств", desc: "Концепции отелей, ресторанов и туристических объектов — от лобби до смотровых площадок.", color: "#0d9488", salary: "от 65 000 ₽", img: "/career-designer-interior.png" },
            ].map((job, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}>
                <div className="rounded-2xl border border-border/60 bg-card h-full flex flex-col hover:shadow-lg transition-shadow group overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img src={job.img} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${job.color}cc, ${job.color})` }}>
                        {job.icon}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{job.salary}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{job.desc}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="h-0.5 w-8 rounded-full transition-all group-hover:w-16" style={{ background: job.color }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
