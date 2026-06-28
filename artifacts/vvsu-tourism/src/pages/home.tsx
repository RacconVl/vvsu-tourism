import { useState, useEffect } from "react";
import { CatMascot } from "@/components/illustrations/CatMascot";
import { Link } from "wouter";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, ArrowRight, Shield, Anchor, Waves, Star, Users, Trophy, BookOpen, GraduationCap, Zap, Globe, Briefcase, Building2, Plane, UtensilsCrossed, Camera, Ship, Palette, CheckCircle2, Sparkles, ExternalLink, Heart, Medal, Lightbulb, Award, Cpu, Printer, MonitorSmartphone, FlaskConical, Handshake, TrendingUp, BadgeCheck } from "lucide-react";

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

/* ── Tech Illustrations ─────────────────────────────────────── */
function Printer3DIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <rect x="20" y="75" width="80" height="32" rx="6" fill="#033F7E" opacity="0.18" />
      <rect x="28" y="78" width="64" height="26" rx="4" fill="#033F7E" opacity="0.35" />
      <rect x="32" y="55" width="56" height="8" rx="3" fill="#172E46" opacity="0.7" />
      <rect x="32" y="20" width="4" height="65" rx="2" fill="#033F7E" opacity="0.5" />
      <rect x="84" y="20" width="4" height="65" rx="2" fill="#033F7E" opacity="0.5" />
      <rect x="28" y="16" width="64" height="8" rx="3" fill="#033F7E" opacity="0.8" />
      <motion.g animate={{ x: [-14, 14, -14] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="46" y="46" width="28" height="10" rx="3" fill="#5b9cf6" opacity="0.9" />
        <rect x="56" y="56" width="8" height="6" rx="1" fill="#033F7E" />
        <motion.rect x="59" y="62" width="2" height="6" rx="1" fill="#EB7124"
          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>
      {[0, 1, 2, 3].map(i => (
        <motion.rect key={i} x={40 + i * 2} y={70 - i * 3} width={40 - i * 4} height={3} rx={1}
          fill="#EB7124" opacity={0.55 + i * 0.1}
          initial={{ scaleX: 0, originX: 0.5 }} animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.5, duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }} />
      ))}
      <circle cx="60" cy="60" r="44" fill="#033F7E" opacity="0.05" />
    </svg>
  );
}

function LabIllustration() {
  const lines = [
    { y: 37, w: 44, fill: "#5b9cf6" },
    { y: 43, w: 58, fill: "#EB7124" },
    { y: 49, w: 30, fill: "#5b9cf6" },
    { y: 55, w: 58, fill: "#EB7124" },
    { y: 61, w: 44, fill: "#5b9cf6" },
    { y: 67, w: 30, fill: "#EB7124" },
  ];
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <rect x="18" y="25" width="84" height="58" rx="6" fill="#033F7E" opacity="0.2" />
      <rect x="22" y="29" width="76" height="50" rx="4" fill="#0a1a2e" opacity="0.85" />
      {lines.map((l, i) => (
        <motion.rect key={i} x={30} y={l.y} width={l.w} height={3} rx={1.5}
          fill={l.fill} opacity={0.7}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8 + i * 0.25, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      <motion.rect x="78" y="55" width="2" height="14" rx="1" fill="#5b9cf6"
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
      <rect x="38" y="83" width="44" height="5" rx="2" fill="#033F7E" opacity="0.5" />
      <rect x="28" y="88" width="64" height="3" rx="1.5" fill="#033F7E" opacity="0.35" />
      <rect x="40" y="91" width="40" height="12" rx="3" fill="#172E46" opacity="0.6" />
      <circle cx="60" cy="60" r="44" fill="#5b9cf6" opacity="0.04" />
    </svg>
  );
}

function VRIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "60px 60px" }}>
        <rect x="18" y="44" width="84" height="38" rx="18" fill="#033F7E" opacity="0.85" />
        <rect x="22" y="48" width="76" height="30" rx="14" fill="#172E46" opacity="0.9" />
        <circle cx="44" cy="63" r="11" fill="#0a1a2e" opacity="0.95" />
        <circle cx="76" cy="63" r="11" fill="#0a1a2e" opacity="0.95" />
        <motion.circle cx="44" cy="63" r="7" fill="#5b9cf6" opacity="0.5"
          animate={{ fill: ["#5b9cf6","#EB7124","#7c3aed","#5b9cf6"] }}
          transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="76" cy="63" r="7" fill="#EB7124" opacity="0.5"
          animate={{ fill: ["#EB7124","#7c3aed","#5b9cf6","#EB7124"] }}
          transition={{ duration: 3, repeat: Infinity }} />
        <rect x="52" y="56" width="16" height="14" rx="3" fill="#033F7E" opacity="0.6" />
      </motion.g>
      <rect x="46" y="82" width="28" height="4" rx="2" fill="#033F7E" opacity="0.4" />
      <circle cx="60" cy="60" r="44" fill="#7c3aed" opacity="0.04" />
    </svg>
  );
}

function GrantIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <motion.g style={{ transformOrigin: "60px 55px" }}
        animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="32" y="28" width="56" height="72" rx="6" fill="#033F7E" opacity="0.2" />
        <rect x="36" y="32" width="48" height="64" rx="4" fill="#0a1a2e" opacity="0.7" />
        {[0,1,2,3,4].map(i => (
          <rect key={i} x="44" y={42 + i * 9} width={32 - (i % 2) * 10} height={3} rx={1.5}
            fill="#5b9cf6" opacity={0.5 - i * 0.05} />
        ))}
        <rect x="40" y="38" width="40" height="4" rx="2" fill="#EB7124" opacity="0.7" />
      </motion.g>
      <motion.circle cx="72" cy="38" r="16" fill="#EB7124" opacity="0.92"
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
      </motion.circle>
      <motion.text x="72" y="44" textAnchor="middle" fontSize="16" fill="white" fontWeight="900"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>₽</motion.text>
      {[[52,22],[88,28],[82,52],[58,18],[92,42]].map(([cx,cy],i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={2} fill="#EB7124"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
      ))}
    </svg>
  );
}

function MacStudioIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <rect x="20" y="22" width="80" height="60" rx="5" fill="#033F7E" opacity="0.18" />
      <rect x="24" y="26" width="72" height="52" rx="3" fill="#0a1a2e" opacity="0.9" />
      <motion.rect x="30" y="32" width="60" height="40" rx="2" fill="#0d2444" opacity="0.8"
        animate={{ opacity: [0.8, 0.95, 0.8] }} transition={{ duration: 3, repeat: Infinity }} />
      {([["#5b9cf6",38,42,44],["#EB7124",38,50,28],["#7c3aed",38,58,36],["#16a34a",38,66,20]] as [string,number,number,number][]).map(([c,x,y,w],i) => (
        <motion.rect key={i} x={x} y={y} width={w} height={4} rx={2} fill={c}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, delay: i*0.4, repeat: Infinity }} />
      ))}
      <motion.rect x="82" y="50" width="2" height="18" rx="1" fill="white" opacity={0.9}
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
      <rect x="50" y="78" width="20" height="4" rx="2" fill="#033F7E" opacity="0.5" />
      <rect x="30" y="82" width="60" height="3" rx="1.5" fill="#033F7E" opacity="0.3" />
      <rect x="10" y="85" width="100" height="8" rx="4" fill="#172E46" opacity="0.5" />
    </svg>
  );
}

function CareerCenterIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <motion.g animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="30" y="35" width="60" height="60" rx="8" fill="#033F7E" opacity="0.2" />
        <rect x="34" y="39" width="52" height="52" rx="6" fill="#0a1a2e" opacity="0.8" />
        <rect x="40" y="45" width="40" height="6" rx="3" fill="#EB7124" opacity="0.8" />
        {[0,1,2,3].map(i => (
          <rect key={i} x="40" y={57 + i*8} width={40 - i*5} height={4} rx={2} fill="#5b9cf6" opacity={0.6 - i*0.1} />
        ))}
        <rect x="34" y="78" width="52" height="13" rx="6" fill="#033F7E" opacity="0.4" />
        <rect x="44" y="82" width="32" height="5" rx="2" fill="#EB7124" opacity="0.7" />
      </motion.g>
      <motion.circle cx="82" cy="38" r="14" fill="#16a34a" opacity="0.9"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
      </motion.circle>
      <motion.path d="M76 38 L80 42 L88 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }} />
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
      <section
        className="w-full"
        style={{ display: "grid", gridTemplateColumns: "3fr 2fr", minHeight: "88vh", borderBottom: "4px solid #0A0A0A" }}
      >
        {/* LEFT: editorial big type */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
          style={{ background: "var(--color-background)", padding: "80px 60px", borderRight: "4px solid #0A0A0A", gap: 32 }}
        >
          <div>
            <div style={{
              display: "inline-block", background: "#FF007F", color: "#fff",
              fontWeight: 800, fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              padding: "6px 16px", marginBottom: 36
            }}>
              Владивосток · 2024
            </div>
            <h1 style={{
              fontSize: "clamp(52px, 6.5vw, 92px)", fontWeight: 900, lineHeight: 0.93,
              letterSpacing: "-0.04em", margin: 0, color: "var(--color-foreground)"
            }}>
              ТВОРИ.<br />
              <span style={{ color: "#172E46" }}>УЧИСЬ.</span><br />
              <span style={{
                WebkitTextStroke: "3px var(--color-foreground)",
                color: "transparent",
                display: "block"
              }}>МЕНЯЙ.</span>
            </h1>
          </div>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: 16, lineHeight: 1.75, maxWidth: 480, margin: 0 }}>
            Институт туризма и креативных индустрий ВВГУ — образование для тех,
            кто создаёт будущее Дальнего Востока и Азиатско-Тихоокеанского региона.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Button asChild size="lg" style={{
              background: "#172E46", color: "#fff", borderRadius: 0,
              padding: "0 36px", height: 52, fontWeight: 800, fontSize: 14,
              letterSpacing: 1, textTransform: "uppercase"
            }}>
              <Link href="/dashboard">Начать обучение <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" style={{
              borderRadius: 0, borderWidth: 2, borderColor: "var(--color-foreground)",
              padding: "0 28px", height: 52, fontWeight: 700, fontSize: 14,
              color: "var(--color-foreground)", background: "transparent"
            }}>
              <Link href="/admission">Поступление →</Link>
            </Button>
          </div>
        </motion.div>

        {/* RIGHT: geometric stat blocks */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr" }}>
          {/* Top: navy + lime circle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ background: "#172E46", position: "relative", overflow: "hidden", borderBottom: "4px solid #0A0A0A" }}
          >
            <div style={{
              position: "absolute", bottom: -70, left: -70,
              width: 260, height: 260, borderRadius: "50%", background: "#C6FF00"
            }} />
            <div style={{ position: "relative", padding: "44px 40px", zIndex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                Студентов
              </div>
              <div style={{ color: "#fff", fontSize: "clamp(60px,5vw,84px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 10 }}>
                850<span style={{ color: "#C6FF00" }}>+</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom: hot pink */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.28 }}
            style={{ background: "#FF007F", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(0,0,0,0.1)" }} />
            <div style={{ position: "absolute", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
            <div style={{ padding: "44px 40px", position: "relative", zIndex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                Трудоустройство
              </div>
              <div style={{ color: "#fff", fontSize: "clamp(60px,5vw,84px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 10 }}>
                94%
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ticker ──────────────────────────────────────── */}
      <div style={{ overflow: "hidden", background: "#C6FF00", borderTop: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content", padding: "13px 0" }}>
          {Array.from({ length: 4 }).flatMap((_, ri) =>
            ["ТВОРИ", "✦", "УЧИСЬ", "✦", "МЕНЯЙ", "✦", "ВЛАДИВОСТОК", "✦", "ВВГУ", "✦", "ТУРИЗМ", "✦", "ДИЗАЙН", "✦", "АРТ", "✦"].map((w, wi) => (
              <span key={`${ri}-${wi}`} style={{ fontWeight: 900, fontSize: 15, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: "#0A0A0A", flexShrink: 0, fontStyle: w === "✦" ? "normal" : "normal" }}>{w}</span>
            ))
          )}
        </div>
      </div>

      {/* ── Stats bento mosaic ──────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr 1.3fr 0.9fr", minHeight: 220, borderBottom: "3px solid #0A0A0A" }}>
        {/* Black + lime number */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ background: "#0A0A0A", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 32px", position: "relative", overflow: "hidden", borderRight: "3px solid #0A0A0A" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "#FF007F", opacity: 0.18 }} />
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Опыт</div>
          <div style={{ color: "#C6FF00", fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>30+</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>лет в индустрии</div>
        </motion.div>
        {/* Lime + black number */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
          style={{ background: "#C6FF00", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 32px", position: "relative", overflow: "hidden", borderRight: "3px solid #0A0A0A" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "#0A0A0A", opacity: 0.07 }} />
          <div style={{ color: "rgba(0,0,0,0.38)", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Студентов</div>
          <div style={{ color: "#0A0A0A", fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>2.5K</div>
          <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>обучается сейчас</div>
        </motion.div>
        {/* Navy + white */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.16 }}
          style={{ background: "#172E46", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 32px", position: "relative", overflow: "hidden", borderRight: "3px solid #0A0A0A" }}>
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 110, height: 110, borderRadius: "50%", background: "#C6FF00", opacity: 0.14 }} />
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Партнёров</div>
          <div style={{ color: "#fff", fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>40+</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>компаний АТР</div>
        </motion.div>
        {/* Pink + white */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.24 }}
          style={{ background: "#FF007F", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 32px", position: "relative", overflow: "hidden", borderRight: "3px solid #0A0A0A" }}>
          <div style={{ position: "absolute", top: -20, right: 16, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Трудоустройство</div>
          <div style={{ color: "#fff", fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>94%</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600, marginTop: 4 }}>выпускников</div>
        </motion.div>
        {/* White + navy text */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.32 }}
          style={{ background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: 8 }}>Место</div>
          <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: "#172E46", letterSpacing: "-0.04em" }}>ТОП‑5</div>
          <div style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginTop: 6, fontWeight: 600, letterSpacing: 1 }}>ДФО</div>
        </motion.div>
      </section>

      {/* ── Tech Infrastructure ───────────────────────────────── */}
      <section className="bg-background" style={{ borderBottom: "3px solid #0A0A0A" }}>
        {/* Section label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "20px 48px", borderBottom: "3px solid #0A0A0A", background: "#0A0A0A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C6FF00" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Передовые технологии</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>→ ВВГУ</span>
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--color-foreground)", marginBottom: 16 }}>
              Передовые технологии<br /><span style={{ color: "#FF007F" }}>для вашего обучения</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              В ВВГУ созданы все условия для учёбы и творчества — современное оборудование, лаборатории и инструменты профессиональной индустрии.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                Illus: Printer3DIllustration,
                title: "3D-принтеры и прототипирование",
                desc: "Современные FDM и SLA 3D-принтеры для создания макетов, сувенирной продукции и дизайн-проектов. Студенты печатают прототипы с первого курса.",
                tags: ["Creality K1 Max", "Bambu Lab X1", "Фотополимерная печать"],
                color: "#033F7E",
              },
              {
                Illus: LabIllustration,
                title: "Компьютерные классы и IT-лаборатории",
                desc: "Оборудованные компьютерные классы с высокопроизводительными ПК, скоростным интернетом и лицензионным ПО для работы с любыми проектами.",
                tags: ["60+ рабочих мест", "Windows + Linux", "Adobe CC, AutoCAD"],
                color: "#EB7124",
              },
              {
                Illus: MacStudioIllustration,
                title: "Mac Studio для дизайнеров",
                desc: "Специализированная студия для дизайнеров, оснащённая Apple Mac Studio и профессиональными мониторами. Работайте в среде, как в ведущих агентствах.",
                tags: ["Apple Mac Studio", "Wacom Cintiq", "Профмониторы 4K"],
                color: "#db2777",
              },
              {
                Illus: VRIllustration,
                title: "VR / AR оборудование",
                desc: "Шлемы виртуальной реальности для проектирования туристических маршрутов, виртуальных экскурсий и иммерсивных презентаций — технологии будущего уже сегодня.",
                tags: ["Meta Quest Pro", "HTC Vive", "360° контент"],
                color: "#7c3aed",
              },
              {
                Illus: LabIllustration,
                title: "Медиастудия и фотолаборатория",
                desc: "Профессиональная фото- и видеостудия с постоянным освещением, хромакеем и монтажными станциями. Снимайте и монтируйте контент на уровне медиаагентств.",
                tags: ["Canon EOS R5", "DJI Drone", "Adobe Premiere"],
                color: "#0891b2",
              },
              {
                Illus: Printer3DIllustration,
                title: "Лаборатория туристических технологий",
                desc: "Специализированная лаборатория с системами бронирования, GDS-платформами и профессиональным ПО для управления туристическими маршрутами и отелями.",
                tags: ["Amadeus GDS", "TourWriter", "Travelport"],
                color: "#16a34a",
              },
            ].map(({ Illus, title, desc, tags, color }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div style={{ border: "2px solid #0A0A0A", background: "var(--color-card)", height: "100%", display: "flex", flexDirection: "column", padding: 24, gap: 16, position: "relative", overflow: "hidden" }}
                  className="hover:shadow-xl transition-shadow">
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, bottom: 0, background: color }} />
                  <div className="h-24 w-24 ml-2">
                    <Illus />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--color-foreground)", marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: 12 }}>{desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {tags.map(t => (
                        <span key={t} style={{ fontSize: 11, padding: "3px 10px", border: `1.5px solid ${color}`, color, background: `${color}15`, fontWeight: 700, letterSpacing: 0.5 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grants strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ border: "3px solid #0A0A0A", background: "#0A0A0A", overflow: "hidden", position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                {/* Left: text */}
                <div style={{ padding: "52px 48px", borderRight: "3px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF007F", color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", padding: "6px 14px", marginBottom: 28 }}>
                    <Award style={{ width: 14, height: 14 }} /> Гранты
                  </div>
                  <h3 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff", marginBottom: 20 }}>
                    Студенты ВВГУ<br /><span style={{ color: "#C6FF00" }}>выигрывают гранты</span>
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 360 }}>
                    Гранты Росмолодёжи, президентские стипендии и гранты на проекты в туризме и креативных индустриях. ВВГУ помогает оформить заявку.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <a href="https://fadm.gov.ru" target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#FF007F", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: 0.5 }}>
                      Гранты Росмолодёжи <ExternalLink style={{ width: 14, height: 14 }} />
                    </a>
                    <a href="https://grants.culture.ru" target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "2px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                      Культурные гранты <ExternalLink style={{ width: 14, height: 14 }} />
                    </a>
                  </div>
                </div>
                {/* Right: stat cells */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
                  {[
                    { num: "500K₽", label: "Максимальный грант", bg: "#FF007F", text: "#fff" },
                    { num: "12+", label: "Победителей в 2024", bg: "#C6FF00", text: "#0A0A0A" },
                    { num: "3 млн", label: "Выиграно в 2024", bg: "#172E46", text: "#fff" },
                    { num: "100%", label: "Поддержка заявки", bg: "#fff", text: "#0A0A0A" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, padding: 28, borderTop: "3px solid rgba(255,255,255,0.08)", borderLeft: i % 2 === 1 ? "3px solid rgba(255,255,255,0.08)" : "none", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: s.text }}>{s.num}</div>
                      <div style={{ fontSize: 11, color: s.text, opacity: 0.6, fontWeight: 600, marginTop: 6, letterSpacing: 0.5 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee: tech → programs ────────────────────────────── */}
      <div style={{ overflow: "hidden", background: "#172E46", borderTop: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        <div style={{ display: "flex", animation: "marquee-reverse 28s linear infinite", width: "max-content", padding: "12px 0" }}>
          {Array.from({ length: 4 }).flatMap((_, ri) =>
            ["3D-ПРИНТЕРЫ", "◆", "VR / AR", "◆", "MAC STUDIO", "◆", "МЕДИАСТУДИЯ", "◆", "GDS-СИСТЕМЫ", "◆", "IT-ЛАБ", "◆", "ИНФРАСТРУКТУРА", "◆"].map((w, wi) => (
              <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", paddingRight: 28, color: w === "◆" ? "#C6FF00" : "rgba(255,255,255,0.55)", flexShrink: 0 }}>{w}</span>
            ))
          )}
        </div>
      </div>

      {/* ── Flagship programs ──────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,0,127,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(198,255,0,0.05) 0%, transparent 40%)" }} />
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
                  <div className="mt-auto flex items-center gap-3">
                    <Link href="/design"
                      className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-white transition-colors font-semibold">
                      Все направления кафедры <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hotel Management */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -6 }}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm h-full flex flex-col group hover:border-accent/40 transition-all hover:shadow-xl hover:shadow-accent/15">
                <div className="relative h-52 overflow-hidden">
                  <img src="/prog-hotel.png" alt="Гостиничное дело" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(20,10,0,0.9) 100%)" }} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center"><Building2 className="h-5 w-5 text-white" /></div>
                    <span className="text-white font-bold text-lg">Гостиничное дело</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">Бакалавриат</div>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <p className="text-white/70 text-sm leading-relaxed">Управление отелями и гостиничным сервисом международного уровня. Стажировки в 5★ отелях Владивостока, Сочи и Кореи.</p>
                  <div className="space-y-2">
                    {["20 бюджетных мест", "Стажировки в Hyatt, Marriott", "100% трудоустройство"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-white/60"><CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />{f}</div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <a href="https://www.vvsu.ru/about/flagship-educational-programs/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-white transition-colors font-medium">
                      Подробнее о программе <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Master's Design highlight */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="rounded-2xl border border-accent/30 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1a0e06 0%, #0d1a2e 100%)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 mr-2">Магистратура</span>
                      <span className="text-xs text-white/50">2 года обучения · Очная форма</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Магистратура по дизайну — <span className="text-accent">следующий уровень</span></h3>
                  <p className="text-white/65 text-sm leading-relaxed mb-4 max-w-2xl">
                    Программа магистратуры ВВГУ по направлению «Дизайн» — для тех, кто хочет выйти на уровень арт-директора и исследователя. Углублённая теория, авторские проекты, участие в международных выставках и работа с брендами АТР. Можно поступить после бакалавриата любого вуза.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: <BadgeCheck className="h-4 w-4" />, text: "Бюджетные места" },
                      { icon: <Globe className="h-4 w-4" />, text: "Международные проекты" },
                      { icon: <Users className="h-4 w-4" />, text: "Наставник — практик" },
                      { icon: <Award className="h-4 w-4" />, text: "Грантовая поддержка" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <span className="text-accent">{f.icon}</span>{f.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <a href="https://www.vvsu.ru/admission/mag/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-bold hover:bg-accent/80 transition-colors shadow-lg shadow-accent/30 whitespace-nowrap">
                    Подать документы <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="https://www.vvsu.ru/admission/mag/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-colors whitespace-nowrap">
                    Программы магистратуры <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

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
                      <motion.div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${r.color}cc, ${r.color})` }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.18, rotate: [0, -8, 8, 0] }}
                      >
                        {r.icon}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-foreground mb-0.5">{r.title}</h4>
                        <p className="text-sm text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: reference-style mosaic grid */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 0, border: "3px solid #0A0A0A", height: 480 }}>
                {/* Cell 1: pink bg + B&W circle photo */}
                <div style={{ background: "#FF007F", position: "relative", overflow: "hidden", borderRight: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 170, height: 170, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(255,255,255,0.3)" }}>
                      <img src="/students-1.png" alt="Студенты" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 16, left: 16, color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Студенты</div>
                </div>
                {/* Cell 2: lime bg + bold number */}
                <div style={{ background: "#C6FF00", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderBottom: "3px solid #0A0A0A", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "#0A0A0A", opacity: 0.06 }} />
                  <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, color: "#0A0A0A", letterSpacing: "-0.04em" }}>12</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginTop: 6 }}>Партнёров АТР</div>
                </div>
                {/* Cell 3: navy bg + bold text */}
                <div style={{ background: "#172E46", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28, borderRight: "3px solid #0A0A0A", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "#C6FF00", opacity: 0.15 }} />
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Девиз</div>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                    УЧИСЬ.<br/><span style={{ color: "#C6FF00" }}>СОЗДАВАЙ.</span><br/>МЕНЯЙ.
                  </div>
                </div>
                {/* Cell 4: black bg + B&W circle photo */}
                <div style={{ background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 170, height: 170, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(255,0,127,0.4)" }}>
                      <img src="/students-2.png" alt="Кампус" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.15)" }} />
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 16, right: 16, color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Кампус</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── Oversized text statement ────────────────────────────── */}
      <section style={{ background: "#FF007F", overflow: "hidden", borderTop: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A", padding: "40px 0", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "40%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none" }} />
        <div style={{ whiteSpace: "nowrap", lineHeight: 0.85 }}>
          <div style={{ fontSize: "clamp(80px,12vw,160px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#fff", paddingLeft: 48, opacity: 0.95 }}>
            СОЗДАВАЙ.
          </div>
          <div style={{ fontSize: "clamp(80px,12vw,160px)", fontWeight: 900, letterSpacing: "-0.05em", paddingLeft: 120, marginTop: 4 }}>
            <span style={{ WebkitTextStroke: "3px #fff", color: "transparent" }}>ИССЛЕДУЙ.</span>
          </div>
        </div>
      </section>

      {/* ── Marquee: before careers ─────────────────────────────── */}
      <div style={{ overflow: "hidden", background: "#FF007F", borderTop: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        <div style={{ display: "flex", animation: "marquee 24s linear infinite", width: "max-content", padding: "14px 0" }}>
          {Array.from({ length: 4 }).flatMap((_, ri) =>
            ["ТУРОПЕРАТОР", "★", "ДИЗАЙНЕР", "★", "МЕНЕДЖЕР ОТЕЛЯ", "★", "ГИД", "★", "АРТ-ДИРЕКТОР", "★", "МАРКЕТОЛОГ", "★", "КАРЬЕРА В АТР", "★"].map((w, wi) => (
              <span key={`${ri}-${wi}`} style={{ fontWeight: 900, fontSize: 14, letterSpacing: 4, textTransform: "uppercase", paddingRight: 32, color: w === "★" ? "#0A0A0A" : "#fff", flexShrink: 0 }}>{w}</span>
            ))
          )}
        </div>
      </div>

      {/* ── Careers ───────────────────────────────────────────── */}
      <section className="bg-background" style={{ borderBottom: "3px solid #0A0A0A" }}>
        {/* Section label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "20px 48px", borderBottom: "3px solid #0A0A0A", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#FF007F" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#0A0A0A" }}>Кем вы станете после ВВГУ</span>
          </div>
          <div style={{ height: 1, background: "#0A0A0A", opacity: 0.12 }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "#0A0A0A", opacity: 0.35, textTransform: "uppercase" }}>→ Карьера</span>
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--color-foreground)", marginBottom: 16 }}>
              Кем вы можете<br /><span style={{ color: "#FF007F" }}>стать после ВВГУ</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Наши выпускники работают по всему Азиатско-Тихоокеанскому региону — от отелей Владивостока до туроператоров Японии и Кореи.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: "2px solid #0A0A0A" }}>
            {[
              { icon: <Plane className="h-6 w-6" />, title: "Туроператор / турагент", desc: "Организация туров, формирование маршрутов, работа с международными партнёрами АТР.", color: "#033F7E", salary: "от 60 000 ₽", img: "/career-touroperator.png" },
              { icon: <Building2 className="h-6 w-6" />, title: "Менеджер отеля", desc: "Управление гостиничным сервисом, стандарты 4–5★, работа с международными гостями.", color: "#EB7124", salary: "от 70 000 ₽", img: "/career-hotel.png" },
              { icon: <Globe className="h-6 w-6" />, title: "Экскурсовод / гид", desc: "Авторские туры по Приморью, острову Русский, маршруты на иностранных языках.", color: "#7c3aed", salary: "от 50 000 ₽", img: "/career-guide.png" },
              { icon: <Camera className="h-6 w-6" />, title: "Спец. по туристическому маркетингу", desc: "SMM, контент-маркетинг, продвижение туристических брендов и дестинаций.", color: "#0891b2", salary: "от 65 000 ₽", img: "/career-marketing.png" },
              { icon: <UtensilsCrossed className="h-6 w-6" />, title: "Организатор событий и MICE", desc: "Конференции, деловые форумы, фестивали, инсентив-туризм для корпоративных клиентов.", color: "#16a34a", salary: "от 75 000 ₽", img: "/career-events.png" },
              { icon: <Ship className="h-6 w-6" />, title: "Специалист круизного туризма", desc: "Обслуживание круизных лайнеров, портовый туризм, морские экскурсии по бухте Золотой Рог.", color: "#b45309", salary: "от 80 000 ₽", img: "/career-cruise.png" },
              { icon: <Palette className="h-6 w-6" />, title: "Графический дизайнер", desc: "Фирменный стиль туристических брендов, полиграфия, визуальная идентичность дестинаций.", color: "#db2777", salary: "от 70 000 ₽", img: "/career-designer-graphic.png" },
              { icon: <Sparkles className="h-6 w-6" />, title: "Дизайнер цифровых медиа", desc: "UX/UI туристических приложений и сайтов, motion-графика, веб-дизайн для АТР-рынка.", color: "#6366f1", salary: "от 75 000 ₽", img: "/career-designer-digital.png" },
              { icon: <Lightbulb className="h-6 w-6" />, title: "Дизайнер интерьера", desc: "Концепции отелей, ресторанов и туристических объектов — от лобби до смотровых площадок.", color: "#0d9488", salary: "от 65 000 ₽", img: "/career-designer-interior.png" },
            ].map((job, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div style={{ borderRight: "2px solid #0A0A0A", borderBottom: "2px solid #0A0A0A", background: "var(--color-card)", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
                  className="group hover:bg-muted/20 transition-colors">
                  <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
                    <img src={job.img} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: job.color }} />
                    <div style={{ position: "absolute", bottom: 8, right: 8, background: job.color, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", letterSpacing: 0.5 }}>{job.salary}</div>
                  </div>
                  <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: job.color }}>
                      {job.icon}
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: 14, color: "var(--color-foreground)", lineHeight: 1.3 }}>{job.title}</h3>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>{job.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career Center ─────────────────────────────────────── */}
      <section style={{ background: "#0A0A0A", borderBottom: "3px solid #0A0A0A" }}>
        {/* Section label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "20px 48px", borderBottom: "3px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#C6FF00" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#C6FF00" }}>Центр карьеры</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>→ cpo.vvsu.ru</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 600 }}>
          {/* Left: text content */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ padding: "52px 48px", borderRight: "3px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 0 }}>
            <h2 style={{ fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", marginBottom: 20 }}>
              Центр карьеры —<br /><span style={{ color: "#C6FF00" }}>ваш старт в профессию</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
              <a href="https://cpo.vvsu.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#C6FF00", textDecoration: "none", fontWeight: 700 }}>cpo.vvsu.ru</a> — служба, которая помогает студентам и выпускникам найти работу, пройти практику и построить карьеру. Работодатели приходят к вам сами.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 36 }}>
              {[
                { icon: <Handshake className="h-5 w-5" />, title: "База вакансий и работодателей", color: "#C6FF00" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Карьерные недели и ярмарки", color: "#FF007F" },
                { icon: <FlaskConical className="h-5 w-5" />, title: "Места практик онлайн", color: "#5b9cf6" },
                { icon: <BadgeCheck className="h-5 w-5" />, title: "Практико-интегрированное обучение", color: "#a78bfa" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${item.color}` }}>
                    <div style={{ color: item.color, flexShrink: 0 }}>{item.icon}</div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{item.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <a href="https://cpo.vvsu.ru" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "#C6FF00", color: "#0A0A0A", fontSize: 13, fontWeight: 900, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", alignSelf: "flex-start" }}>
              Перейти в Центр карьеры <ExternalLink style={{ width: 14, height: 14 }} />
            </a>
          </motion.div>

          {/* Right: stats + events */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column" }}>
            {/* Stat cells 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: "0 0 auto" }}>
              {[
                { num: "94%", label: "Трудоустройство", bg: "#C6FF00", text: "#0A0A0A" },
                { num: "200+", label: "Работодателей", bg: "#FF007F", text: "#fff" },
                { num: "500+", label: "Вакансий", bg: "#172E46", text: "#fff" },
                { num: "12", label: "Мероприятий/год", bg: "#fff", text: "#0A0A0A" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, padding: "32px 28px", borderTop: "3px solid rgba(255,255,255,0.08)", borderLeft: i % 2 === 1 ? "3px solid rgba(255,255,255,0.08)" : "none", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: s.text }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: s.text, opacity: 0.6, fontWeight: 600, marginTop: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Events list */}
            <div style={{ flex: 1, padding: "28px 32px", borderTop: "3px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#C6FF00", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Свежие события</div>
              {[
                { date: "17.06.2026", title: "Выпускники встретились с работодателями транспортной отрасли", type: "Встреча" },
                { date: "16.02.2026", title: "Встреча со специалистами Центра занятости населения Приморья", type: "Лекция" },
                { date: "02.12.2025", title: "Интеграционные карьерные недели завершились в ВВГУ", type: "Карьерная неделя" },
              ].map((ev, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, flexShrink: 0, minWidth: 72, paddingTop: 2 }}>{ev.date}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, marginBottom: 6 }}>{ev.title}</div>
                    <span style={{ fontSize: 10, padding: "3px 8px", background: "rgba(198,255,0,0.15)", color: "#C6FF00", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{ev.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee: before student life ────────────────────────── */}
      <div style={{ overflow: "hidden", background: "#0A0A0A", borderTop: "3px solid #0A0A0A" }}>
        <div style={{ display: "flex", animation: "marquee-reverse 32s linear infinite", width: "max-content", padding: "12px 0" }}>
          {Array.from({ length: 4 }).flatMap((_, ri) =>
            ["КАМПУС", "→", "ЯПОНСКОЕ МОРЕ", "→", "КВЕСТЫ", "→", "НЕТВОРКИНГ", "→", "ПРОЕКТЫ", "→", "ДРУЗЬЯ", "→", "ПРИМОРЬЕ", "→", "АТР", "→"].map((w, wi) => (
              <span key={`${ri}-${wi}`} style={{ fontWeight: 800, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", paddingRight: 28, color: w === "→" ? "#C6FF00" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>{w}</span>
            ))
          )}
        </div>
      </div>

      {/* ── Жизнь студента ─────────────────────────────────────── */}
      <section className="bg-background" style={{ borderBottom: "3px solid #0A0A0A" }}>
        {/* Section label strip */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 24, padding: "20px 48px", borderBottom: "3px solid #0A0A0A", background: "#0A0A0A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, background: "#FF007F" }} />
            <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#fff" }}>Жизнь в ВВГУ</span>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>→ Студенческая жизнь</span>
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--color-foreground)", marginBottom: 16 }}>
              Жизнь в ВВГУ —<br /><span style={{ color: "#FF007F" }}>это не только учёба</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Путешествия, квесты по Владивостоку, нетворкинг с индустрией и настоящие друзья из разных стран АТР
            </p>
          </motion.div>

          {/* Photo cards — sharp editorial grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "2px solid #0A0A0A", marginBottom: 2 }}>
            {[
              { img: "/student-life-1.png", title: "Командная работа над реальными проектами", desc: "Маршруты для настоящих туроператоров с 1-го курса", tag: "Практика", tagBg: "#FF007F" },
              { img: "/student-life-2.png", title: "Кампус с видом на Японское море", desc: "Учись там, где вдохновляет сама природа", tag: "Кампус", tagBg: "#C6FF00", tagText: "#0A0A0A" },
              { img: "/student-life-3.png", title: "Публичные защиты и конференции", desc: "Защити проект перед представителями отрасли", tag: "Карьера", tagBg: "#172E46" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div style={{ borderRight: "2px solid #0A0A0A", height: "100%", overflow: "hidden", position: "relative" }} className="group">
                  <div style={{ height: 240, overflow: "hidden" }}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div style={{ padding: "24px", borderTop: "2px solid #0A0A0A" }}>
                    <div style={{ display: "inline-block", background: item.tagBg, color: item.tagText ?? "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{item.tag}</div>
                    <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--color-foreground)", lineHeight: 1.3, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "2px solid #0A0A0A", borderTop: "none", marginBottom: 32 }}>
            {[
              { text: "В ВВГУ я познакомилась с корейскими студентами, и сейчас мы вместе разрабатываем тур-проект для рынка Азии.", name: "Даша, 3 курс", avatar: "/avatars/student-1.png", bg: "#0A0A0A", textC: "#fff" },
              { text: "Квест по Золотому Рогу — лучшее задание в моей жизни. Это не просто учёба, это настоящее приключение.", name: "Артём, 2 курс", avatar: "/avatars/student-2.png", bg: "#C6FF00", textC: "#0A0A0A" },
              { text: "Мастер-класс от шеф-повара ресторана «Zuma» был частью нашей программы. Такого нет ни в одном другом вузе!", name: "Юна, магистратура", avatar: "/avatars/student-3.png", bg: "#FF007F", textC: "#fff" },
            ].map((q, i) => (
              <div key={i} style={{ background: q.bg, padding: "28px 24px", borderRight: "2px solid #0A0A0A", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
                <p style={{ fontSize: 14, color: q.textC, opacity: 0.85, lineHeight: 1.6, fontStyle: "italic" }}>«{q.text}»</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={q.avatar} alt={q.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${q.textC}40` }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: q.textC }}>{q.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { href: "/open-day", label: "День открытых дверей" },
              { href: "/specialty-test", label: "Какая специальность подходит?" },
              { href: "/alumni", label: "Карьера выпускников" },
              { href: "/faq", label: "FAQ для абитуриентов" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                style={{ display: "inline-block", padding: "10px 20px", border: "2px solid #0A0A0A", fontSize: 13, fontWeight: 700, color: "var(--color-foreground)", textDecoration: "none", letterSpacing: 0.3 }}
                className="hover:bg-muted transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────── */}
      <section style={{ background: "#FF007F", borderBottom: "3px solid #0A0A0A", overflow: "hidden" }}>
        {/* Marquee inside CTA */}
        <div style={{ overflow: "hidden", borderBottom: "3px solid rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", animation: "marquee 20s linear infinite", width: "max-content", padding: "12px 0" }}>
            {Array.from({ length: 6 }).flatMap((_, ri) =>
              ["ПОСТУПАЙ СЕЙЧАС", "✦", "ТВОРИ", "✦", "УЧИСЬ", "✦", "МЕНЯЙ МИР", "✦"].map((w, wi) => (
                <span key={`${ri}-${wi}`} style={{ fontWeight: 900, fontSize: 14, letterSpacing: 4, textTransform: "uppercase", paddingRight: 32, color: w === "✦" ? "rgba(0,0,0,0.35)" : "#fff", flexShrink: 0 }}>{w}</span>
              ))
            )}
          </div>
        </div>
        <div className="container mx-auto px-4" style={{ padding: "64px 48px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 48 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>Начните прямо сейчас</div>
              <h2 style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: 0 }}>
                Готовы<br />к экспедиции?
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/register"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: "#0A0A0A", color: "#fff", fontSize: 14, fontWeight: 900, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Зарегистрироваться <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
              <Link href="/admission"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", border: "2px solid rgba(0,0,0,0.25)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                Информация о поступлении
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
