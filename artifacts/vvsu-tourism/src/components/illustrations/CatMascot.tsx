import { motion } from "framer-motion";

export function CatMascot() {
  return (
    <div
      className="absolute top-0 right-0 pointer-events-none select-none z-10 overflow-visible"
      style={{ width: "clamp(200px, 22vw, 300px)", height: "auto" }}
    >
      <svg
        viewBox="0 0 200 310"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        overflow="visible"
      >
        <defs>
          <linearGradient id="cm-fur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9A2E" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
          <linearGradient id="cm-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE0B8" />
            <stop offset="100%" stopColor="#FFC880" />
          </linearGradient>
          <linearGradient id="cm-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" />
            <stop offset="100%" stopColor="#E04E00" />
          </linearGradient>
          <linearGradient id="cm-lens-l" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8D8FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#D0ECFF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="cm-lens-r" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8D8FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#D0ECFF" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="cm-cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8FAA" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF8FAA" stopOpacity="0" />
          </radialGradient>
          <filter id="cm-drop" x="-30%" y="-10%" width="160%" height="140%">
            <feDropShadow dx="2" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* ── BOB WRAPPER ── */}
        <motion.g
          filter="url(#cm-drop)"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* ── TAIL ── */}
          <path
            d="M150 285 Q188 268 186 232 Q184 208 165 212"
            stroke="#E04E00"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M150 285 Q188 268 186 232 Q184 208 165 212"
            stroke="#FF9A2E"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* ── BODY ── */}
          <ellipse cx="98" cy="238" rx="60" ry="62" fill="url(#cm-body)" />
          <ellipse cx="98" cy="248" rx="36" ry="42" fill="url(#cm-belly)" opacity="0.85" />

          {/* ── LEFT ARM (resting down) ── */}
          <ellipse
            cx="44"
            cy="230"
            rx="15"
            ry="30"
            fill="url(#cm-body)"
            transform="rotate(-12,44,230)"
          />
          {/* Left paw */}
          <ellipse cx="38" cy="258" rx="13" ry="10" fill="url(#cm-fur)" />
          <ellipse cx="31" cy="253" rx="5" ry="4" fill="#FF9A2E" opacity="0.8" />
          <ellipse cx="38" cy="251" rx="5" ry="4" fill="#FF9A2E" opacity="0.8" />
          <ellipse cx="45" cy="253" rx="5" ry="4" fill="#FF9A2E" opacity="0.8" />

          {/* ── RIGHT ARM (waving) — pivot at shoulder ── */}
          <motion.g
            style={{ transformOrigin: "152px 210px" }}
            animate={{ rotate: [-18, 22, -10, 26, -18] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.5, 0.75, 1] }}
          >
            {/* Upper arm */}
            <ellipse
              cx="158"
              cy="188"
              rx="14"
              ry="30"
              fill="url(#cm-body)"
              transform="rotate(18,158,188)"
            />
            {/* Paw */}
            <ellipse cx="170" cy="162" rx="14" ry="11" fill="url(#cm-fur)" />
            {/* Toes */}
            <ellipse cx="162" cy="154" rx="5" ry="4" fill="#FF9A2E" opacity="0.85" />
            <ellipse cx="171" cy="152" rx="5" ry="4" fill="#FF9A2E" opacity="0.85" />
            <ellipse cx="180" cy="156" rx="5" ry="4" fill="#FF9A2E" opacity="0.85" />
          </motion.g>

          {/* ── EARS (behind beret) ── */}
          <polygon points="44,102 28,58 72,82" fill="url(#cm-fur)" />
          <polygon points="154,102 172,58 128,82" fill="url(#cm-fur)" />
          {/* Inner ears */}
          <polygon points="48,97 36,65 66,85" fill="#FFB3C8" />
          <polygon points="150,97 164,65 134,85" fill="#FFB3C8" />

          {/* ── HEAD ── */}
          <circle cx="99" cy="142" r="70" fill="url(#cm-fur)" />

          {/* Forehead tabby stripes */}
          <path d="M82 112 Q99 108 116 112" stroke="#C04000" strokeWidth="2.2" fill="none" opacity="0.5" />
          <path d="M80 120 Q99 115 118 120" stroke="#C04000" strokeWidth="1.6" fill="none" opacity="0.4" />

          {/* ── BERET ── */}
          {/* Brim */}
          <ellipse cx="99" cy="92" rx="76" ry="19" fill="#5B2D8E" opacity="0.9" />
          {/* Colorful stripes on brim */}
          <clipPath id="cm-brim-clip">
            <ellipse cx="99" cy="92" rx="76" ry="19" />
          </clipPath>
          <g clipPath="url(#cm-brim-clip)">
            <rect x="23" y="73" width="20" height="38" fill="#E74C3C" opacity="0.9" />
            <rect x="43" y="73" width="16" height="38" fill="#E67E22" opacity="0.9" />
            <rect x="59" y="73" width="16" height="38" fill="#F1C40F" opacity="0.9" />
            <rect x="75" y="73" width="16" height="38" fill="#27AE60" opacity="0.9" />
            <rect x="91" y="73" width="16" height="38" fill="#2980B9" opacity="0.9" />
            <rect x="107" y="73" width="16" height="38" fill="#8E44AD" opacity="0.9" />
            <rect x="123" y="73" width="18" height="38" fill="#E74C3C" opacity="0.9" />
            <rect x="141" y="73" width="18" height="38" fill="#E67E22" opacity="0.9" />
          </g>
          <ellipse cx="99" cy="92" rx="76" ry="19" fill="transparent" stroke="#4A2070" strokeWidth="2" />

          {/* Dome */}
          <ellipse cx="99" cy="82" rx="54" ry="27" fill="#7B3FBE" opacity="0.95" />
          <clipPath id="cm-dome-clip">
            <ellipse cx="99" cy="82" rx="54" ry="27" />
          </clipPath>
          <g clipPath="url(#cm-dome-clip)">
            <rect x="45" y="55" width="16" height="54" fill="#E74C3C" opacity="0.5" />
            <rect x="61" y="55" width="14" height="54" fill="#E67E22" opacity="0.5" />
            <rect x="75" y="55" width="14" height="54" fill="#F1C40F" opacity="0.5" />
            <rect x="89" y="55" width="14" height="54" fill="#27AE60" opacity="0.5" />
            <rect x="103" y="55" width="14" height="54" fill="#2980B9" opacity="0.5" />
            <rect x="117" y="55" width="14" height="54" fill="#8E44AD" opacity="0.5" />
            <rect x="131" y="55" width="14" height="54" fill="#E74C3C" opacity="0.5" />
          </g>
          <ellipse cx="99" cy="82" rx="54" ry="27" fill="transparent" stroke="#4A2070" strokeWidth="1.5" />

          {/* Dome shine */}
          <ellipse cx="83" cy="70" rx="14" ry="6" fill="white" opacity="0.12" transform="rotate(-20,83,70)" />

          {/* Pompom */}
          <motion.g
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "99px 57px" }}
          >
            <circle cx="99" cy="57" r="12" fill="#E74C3C" />
            <circle cx="99" cy="57" r="9" fill="#FF6B6B" />
            <circle cx="95" cy="54" r="3.5" fill="#FFB3B3" opacity="0.75" />
          </motion.g>

          {/* ── GLASSES ── */}
          {/* Left lens — big wide oval */}
          <ellipse cx="74" cy="150" rx="27" ry="23" fill="url(#cm-lens-l)" />
          <ellipse cx="74" cy="150" rx="27" ry="23" fill="none" stroke="#1E2D3D" strokeWidth="3.2" />
          {/* Right lens */}
          <ellipse cx="126" cy="150" rx="27" ry="23" fill="url(#cm-lens-r)" />
          <ellipse cx="126" cy="150" rx="27" ry="23" fill="none" stroke="#1E2D3D" strokeWidth="3.2" />
          {/* Bridge */}
          <path d="M101 150 Q99 147 97 150" stroke="#1E2D3D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Arms */}
          <line x1="47" y1="149" x2="36" y2="144" stroke="#1E2D3D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="153" y1="149" x2="164" y2="144" stroke="#1E2D3D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lens shine */}
          <ellipse cx="64" cy="140" rx="7" ry="5" fill="white" opacity="0.28" transform="rotate(-25,64,140)" />
          <ellipse cx="116" cy="140" rx="7" ry="5" fill="white" opacity="0.28" transform="rotate(-25,116,140)" />

          {/* ── EYES (behind glasses) ── */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.82, 0.87, 0.92, 1], ease: "easeInOut" }}
            style={{ transformOrigin: "74px 150px" }}
          >
            <circle cx="74" cy="150" r="12" fill="#2D1B0E" />
            <circle cx="79" cy="145" r="3.5" fill="white" opacity="0.92" />
            <circle cx="77" cy="147" r="1.8" fill="white" opacity="0.6" />
          </motion.g>
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.82, 0.87, 0.92, 1], ease: "easeInOut" }}
            style={{ transformOrigin: "126px 150px" }}
          >
            <circle cx="126" cy="150" r="12" fill="#2D1B0E" />
            <circle cx="131" cy="145" r="3.5" fill="white" opacity="0.92" />
            <circle cx="129" cy="147" r="1.8" fill="white" opacity="0.6" />
          </motion.g>

          {/* ── NOSE ── */}
          <ellipse cx="99" cy="167" rx="5.5" ry="4" fill="#E88FA5" />

          {/* ── WHISKERS ── */}
          {/* Left */}
          <line x1="50" y1="168" x2="86" y2="170" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />
          <line x1="48" y1="175" x2="85" y2="174" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />
          <line x1="50" y1="182" x2="86" y2="178" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />
          {/* Right */}
          <line x1="148" y1="168" x2="112" y2="170" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />
          <line x1="150" y1="175" x2="113" y2="174" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />
          <line x1="148" y1="182" x2="112" y2="178" stroke="#9B7A5A" strokeWidth="1.3" opacity="0.65" />

          {/* ── MOUTH (smile) ── */}
          <path d="M89 175 Q99 186 109 175" stroke="#7A4A2A" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* ── CHEEK BLUSH ── */}
          <ellipse cx="56" cy="174" rx="13" ry="9" fill="url(#cm-cheek)" />
          <ellipse cx="142" cy="174" rx="13" ry="9" fill="url(#cm-cheek)" />
        </motion.g>
      </svg>
    </div>
  );
}
