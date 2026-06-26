export function DigitalDesignIllustration() {
  return (
    <div className="h-40 w-full overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 360 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            @keyframes dd-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
            @keyframes dd-float2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-4px)}}
            @keyframes dd-float3{0%,100%{transform:translateY(0px)}50%{transform:translateY(-5px)}}
            @keyframes dd-blink{0%,48%{opacity:1}50%,98%{opacity:0}100%{opacity:1}}
            @keyframes dd-cursor{0%,100%{transform:translate(0px,0px)}25%{transform:translate(28px,12px)}55%{transform:translate(46px,-4px)}80%{transform:translate(18px,22px)}}
            @keyframes dd-glow{0%,100%{opacity:0.5}50%{opacity:1}}
            .dd-a1{animation:dd-float 3.2s ease-in-out infinite}
            .dd-a2{animation:dd-float2 4s ease-in-out infinite;animation-delay:.9s}
            .dd-a3{animation:dd-float3 3.6s ease-in-out infinite;animation-delay:1.6s}
            .dd-blink{animation:dd-blink 1.1s step-end infinite}
            .dd-cursor{animation:dd-cursor 6s ease-in-out infinite}
            .dd-glow{animation:dd-glow 2.5s ease-in-out infinite}
          `}</style>
          <linearGradient id="dd-bg" x1="0" y1="0" x2="360" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="55%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="dd-scr" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0c0a2e" />
            <stop offset="100%" stopColor="#1a1654" />
          </linearGradient>
          <radialGradient id="dd-glow-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="360" height="160" fill="url(#dd-bg)" />
        {/* Glow in center */}
        <ellipse cx="180" cy="80" rx="120" ry="70" fill="url(#dd-glow-center)" />

        {/* Grid */}
        {Array.from({ length: 19 }).map((_, i) => (
          <line key={"v" + i} x1={i * 20} y1="0" x2={i * 20} y2="160" stroke="white" strokeWidth="0.4" opacity="0.06" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={"h" + i} x1="0" y1={i * 20} x2="360" y2={i * 20} stroke="white" strokeWidth="0.4" opacity="0.06" />
        ))}

        {/* Monitor body */}
        <rect x="88" y="16" width="184" height="118" rx="11" fill="#1a1740" stroke="#6366f1" strokeWidth="1.5" opacity="0.95" />
        {/* Screen inner */}
        <rect x="97" y="25" width="166" height="101" rx="6" fill="url(#dd-scr)" />
        {/* Stand */}
        <rect x="163" y="134" width="34" height="7" rx="3.5" fill="#2d2b70" />
        <rect x="148" y="139" width="64" height="4" rx="2" fill="#2d2b70" />

        {/* Screen: top bar */}
        <rect x="97" y="25" width="166" height="13" rx="6" fill="#0f0d38" />
        <circle cx="107" cy="31.5" r="2.8" fill="#ef4444" opacity="0.85" />
        <circle cx="116" cy="31.5" r="2.8" fill="#f59e0b" opacity="0.85" />
        <circle cx="125" cy="31.5" r="2.8" fill="#22c55e" opacity="0.85" />
        <rect x="136" y="28" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.07)" />
        <rect x="222" y="29" width="34" height="5" rx="2.5" fill="rgba(99,102,241,0.4)" />

        {/* Left sidebar */}
        <rect x="97" y="38" width="32" height="88" fill="rgba(0,0,0,0.28)" />
        <rect x="102" y="46" width="22" height="5" rx="2.5" fill="rgba(99,102,241,0.9)" />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x="102" y={56 + i * 11} width={i === 2 ? 16 : 22} height="3.5" rx="1.75" fill="rgba(255,255,255,0.2)" />
        ))}
        <rect x="102" y="112" width="22" height="8" rx="4" fill="rgba(99,102,241,0.35)" />

        {/* Main: Card A */}
        <rect x="135" y="41" width="62" height="42" rx="5" fill="rgba(55,48,163,0.85)" />
        <rect x="140" y="47" width="30" height="5" rx="2.5" fill="#818cf8" />
        <rect x="140" y="56" width="50" height="3.5" rx="1.75" fill="rgba(255,255,255,0.4)" />
        <rect x="140" y="63" width="42" height="3.5" rx="1.75" fill="rgba(255,255,255,0.25)" />
        <rect x="140" y="70" width="22" height="7" rx="3.5" fill="#6366f1" />
        <rect x="165" y="71" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />

        {/* Main: Card B */}
        <rect x="203" y="41" width="56" height="42" rx="5" fill="rgba(45,39,140,0.8)" />
        <rect x="208" y="47" width="38" height="5" rx="2.5" fill="#c4b5fd" />
        <rect x="208" y="56" width="44" height="3.5" rx="1.75" fill="rgba(255,255,255,0.4)" />
        <rect x="208" y="63" width="34" height="3.5" rx="1.75" fill="rgba(255,255,255,0.25)" />
        <circle cx="213" cy="74" r="4.5" fill="#ec4899" opacity="0.9" />
        <circle cx="224" cy="74" r="4.5" fill="#6366f1" opacity="0.9" />
        <circle cx="235" cy="74" r="4.5" fill="#22c55e" opacity="0.9" />

        {/* Bottom status bar */}
        <rect x="135" y="89" width="124" height="24" rx="5" fill="rgba(10,8,42,0.7)" />
        <rect x="140" y="95" width="56" height="3.5" rx="1.75" fill="rgba(255,255,255,0.25)" />
        <rect x="140" y="102" width="42" height="3.5" rx="1.75" fill="rgba(255,255,255,0.15)" />
        <rect x="210" y="93" width="42" height="8" rx="4" fill="rgba(99,102,241,0.55)" />
        <rect x="214" y="95.5" width="30" height="3" rx="1.5" fill="rgba(199,210,254,0.7)" />

        {/* Cursor */}
        <g className="dd-cursor" style={{ transformOrigin: "205px 80px" }}>
          <path d="M205 80 L205 94 L209 91 L211.5 97 L214 96 L211.5 90 L217 90 Z" fill="white" opacity="0.95" />
        </g>

        {/* === External floating elements === */}

        {/* Color swatch card - top right */}
        <g className="dd-a1" style={{ transformOrigin: "312px 42px" }}>
          <rect x="284" y="20" width="56" height="44" rx="8" fill="rgba(99,102,241,0.18)" stroke="rgba(165,180,252,0.4)" strokeWidth="1" />
          <circle cx="297" cy="35" r="7.5" fill="#ef4444" opacity="0.85" />
          <circle cx="312" cy="35" r="7.5" fill="#f59e0b" opacity="0.85" />
          <circle cx="327" cy="35" r="7.5" fill="#6366f1" opacity="0.85" />
          <rect x="290" y="48" width="42" height="3.5" rx="1.75" fill="rgba(199,210,254,0.5)" />
        </g>

        {/* Component badge - right middle */}
        <g className="dd-a2" style={{ transformOrigin: "315px 96px" }}>
          <rect x="286" y="76" width="58" height="40" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(165,180,252,0.3)" strokeWidth="1" />
          <rect x="292" y="84" width="32" height="4.5" rx="2.25" fill="rgba(199,210,254,0.7)" />
          <rect x="292" y="93" width="46" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
          <rect x="292" y="100" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
          <rect x="292" y="107" width="22" height="5" rx="2.5" fill="rgba(99,102,241,0.6)" />
        </g>

        {/* Pill UI/UX - bottom right */}
        <g className="dd-a3" style={{ transformOrigin: "303px 132px" }}>
          <rect x="270" y="122" width="66" height="20" rx="10" fill="rgba(99,102,241,0.25)" stroke="rgba(165,180,252,0.45)" strokeWidth="1" />
          <circle cx="282" cy="132" r="4.5" fill="#6366f1" opacity="0.9" />
          <rect x="290" y="129" width="36" height="3.5" rx="1.75" fill="rgba(199,210,254,0.85)" />
        </g>

        {/* Left card */}
        <g className="dd-a2" style={{ transformOrigin: "36px 58px" }}>
          <rect x="8" y="38" width="56" height="40" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(165,180,252,0.25)" strokeWidth="1" />
          <rect x="14" y="47" width="36" height="4" rx="2" fill="rgba(165,180,252,0.65)" />
          <rect x="14" y="55" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
          <rect x="14" y="62" width="44" height="7" rx="3.5" fill="rgba(99,102,241,0.5)" />
          <rect x="18" y="64" width="26" height="3" rx="1.5" fill="rgba(199,210,254,0.7)" />
        </g>

        {/* Left circle motif */}
        <g className="dd-a1" style={{ transformOrigin: "30px 120px" }}>
          <circle cx="30" cy="120" r="16" fill="rgba(99,102,241,0.12)" stroke="rgba(165,180,252,0.2)" strokeWidth="1" />
          <circle cx="30" cy="120" r="9" fill="rgba(99,102,241,0.2)" />
          <circle cx="30" cy="120" r="4" fill="rgba(165,180,252,0.55)" />
        </g>

        {/* Blinking cursor line */}
        <rect x="28" y="98" width="2" height="13" rx="1" fill="rgba(165,180,252,0.85)" className="dd-blink" />

        {/* Subtle glow dots */}
        <circle cx="350" cy="150" r="20" fill="#6366f1" opacity="0.08" />
        <circle cx="10" cy="10" r="15" fill="#7c3aed" opacity="0.1" />
      </svg>
    </div>
  );
}

export function EnvironmentDesignIllustration() {
  return (
    <div className="h-40 w-full overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 360 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            @keyframes ed-sway{0%,100%{transform:rotate(0deg)}35%{transform:rotate(2.5deg)}70%{transform:rotate(-1.8deg)}}
            @keyframes ed-light{0%,100%{opacity:.35}50%{opacity:.65}}
            @keyframes ed-light2{0%,100%{opacity:.25}50%{opacity:.5}}
            @keyframes ed-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-5px)}}
            @keyframes ed-float2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-4px)}}
            @keyframes ed-pulse{0%,100%{opacity:.4}50%{opacity:.8}}
            .ed-sway{animation:ed-sway 4.5s ease-in-out infinite;transform-origin:106px 118px}
            .ed-light{animation:ed-light 3s ease-in-out infinite}
            .ed-light2{animation:ed-light2 3s ease-in-out infinite;animation-delay:1s}
            .ed-a1{animation:ed-float 3.4s ease-in-out infinite}
            .ed-a2{animation:ed-float2 4.2s ease-in-out infinite;animation-delay:.8s}
            .ed-a3{animation:ed-float 3.8s ease-in-out infinite;animation-delay:1.5s}
            .ed-pulse{animation:ed-pulse 2.8s ease-in-out infinite}
          `}</style>
          <linearGradient id="ed-bg" x1="0" y1="0" x2="360" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="55%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#0d6e68" />
          </linearGradient>
          <linearGradient id="ed-wall" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f4a43" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
          <linearGradient id="ed-floor" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0a7c77" />
          </linearGradient>
          <linearGradient id="ed-window-light" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(167,243,208,0.55)" />
            <stop offset="100%" stopColor="rgba(167,243,208,0)" />
          </linearGradient>
          <radialGradient id="ed-glow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="360" height="160" fill="url(#ed-bg)" />
        <ellipse cx="180" cy="60" rx="160" ry="80" fill="url(#ed-glow)" />

        {/* Blueprint grid */}
        {Array.from({ length: 19 }).map((_, i) => (
          <line key={"v" + i} x1={i * 20} y1="0" x2={i * 20} y2="160" stroke="#14b8a6" strokeWidth="0.4" opacity="0.1" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={"h" + i} x1="0" y1={i * 20} x2="360" y2={i * 20} stroke="#14b8a6" strokeWidth="0.4" opacity="0.1" />
        ))}

        {/* === ROOM ELEVATION (2D front view) === */}

        {/* Back wall */}
        <rect x="68" y="14" width="224" height="110" fill="url(#ed-wall)" />

        {/* Floor */}
        <rect x="60" y="118" width="240" height="28" fill="url(#ed-floor)" rx="2" />
        <line x1="60" y1="118" x2="300" y2="118" stroke="rgba(45,212,191,0.5)" strokeWidth="1.5" />

        {/* Ceiling cornice */}
        <rect x="68" y="14" width="224" height="5" fill="rgba(20,184,166,0.2)" />
        <line x1="68" y1="19" x2="292" y2="19" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />

        {/* === WINDOW (center) === */}
        <rect x="148" y="30" width="64" height="64" rx="3" fill="rgba(167,243,208,0.1)" stroke="rgba(167,243,208,0.45)" strokeWidth="1.5" />
        {/* Frame cross */}
        <line x1="180" y1="30" x2="180" y2="94" stroke="rgba(167,243,208,0.4)" strokeWidth="1.5" />
        <line x1="148" y1="62" x2="212" y2="62" stroke="rgba(167,243,208,0.4)" strokeWidth="1.5" />
        {/* Panes lighting */}
        <rect x="150" y="32" width="28" height="28" fill="rgba(167,243,208,0.12)" className="ed-light" />
        <rect x="182" y="32" width="28" height="28" fill="rgba(167,243,208,0.08)" className="ed-light2" />
        <rect x="150" y="64" width="28" height="28" fill="rgba(167,243,208,0.06)" className="ed-light2" />
        <rect x="182" y="64" width="28" height="28" fill="rgba(167,243,208,0.1)" className="ed-light" />
        {/* Window light ray on floor */}
        <polygon points="152,94 208,94 226,118 134,118" fill="url(#ed-window-light)" className="ed-light" />

        {/* === DOOR (right side) === */}
        <rect x="244" y="56" width="48" height="62" rx="3" fill="rgba(0,0,0,0.22)" stroke="rgba(20,184,166,0.3)" strokeWidth="1" />
        {/* Door arch top */}
        <path d="M244 56 Q268 38 292 56" fill="none" stroke="rgba(20,184,166,0.25)" strokeWidth="1" />
        <circle cx="247" cy="87" r="3" fill="rgba(45,212,191,0.6)" />

        {/* === PLANT (left) === */}
        <g className="ed-sway">
          {/* Main stem */}
          <line x1="106" y1="118" x2="106" y2="76" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          {/* Branch left */}
          <line x1="106" y1="100" x2="90" y2="88" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
          {/* Branch right */}
          <line x1="106" y1="92" x2="122" y2="80" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="106" cy="84" rx="13" ry="7" transform="rotate(-35,106,84)" fill="#0d9488" />
          <ellipse cx="106" cy="84" rx="13" ry="7" transform="rotate(25,106,84)" fill="#14b8a6" opacity="0.85" />
          <ellipse cx="84" cy="84" rx="10" ry="6" transform="rotate(-45,84,84)" fill="#0f766e" />
          <ellipse cx="84" cy="84" rx="10" ry="6" transform="rotate(15,84,84)" fill="#0d9488" opacity="0.75" />
          <ellipse cx="126" cy="76" rx="10" ry="6" transform="rotate(-20,126,76)" fill="#0d9488" />
          <ellipse cx="126" cy="76" rx="10" ry="6" transform="rotate(40,126,76)" fill="#14b8a6" opacity="0.75" />
          {/* Top leaf */}
          <ellipse cx="106" cy="70" rx="9" ry="5.5" transform="rotate(-10,106,70)" fill="#2dd4bf" opacity="0.9" />
        </g>
        {/* Pot */}
        <polygon points="97,118 115,118 112,134 100,134" fill="#0f766e" />
        <rect x="94" y="116" width="24" height="5" rx="2.5" fill="#0d9488" />

        {/* === Architectural annotations === */}

        {/* Height dimension - left */}
        <line x1="54" y1="14" x2="54" y2="118" stroke="rgba(45,212,191,0.45)" strokeWidth="0.8" strokeDasharray="3,3" />
        <path d="M51 19 L54 13 L57 19" fill="none" stroke="rgba(45,212,191,0.55)" strokeWidth="0.9" />
        <path d="M51 113 L54 119 L57 113" fill="none" stroke="rgba(45,212,191,0.55)" strokeWidth="0.9" />

        {/* Width dimension - bottom */}
        <line x1="68" y1="152" x2="292" y2="152" stroke="rgba(45,212,191,0.45)" strokeWidth="0.8" strokeDasharray="3,3" />
        <path d="M73 149 L67 152 L73 155" fill="none" stroke="rgba(45,212,191,0.55)" strokeWidth="0.9" />
        <path d="M287 149 L293 152 L287 155" fill="none" stroke="rgba(45,212,191,0.55)" strokeWidth="0.9" />

        {/* Window dimension line */}
        <line x1="148" y1="10" x2="212" y2="10" stroke="rgba(45,212,191,0.35)" strokeWidth="0.8" strokeDasharray="2,3" />

        {/* === Floating external elements === */}

        {/* Blueprint chip - top left */}
        <g className="ed-a1" style={{ transformOrigin: "33px 42px" }}>
          <rect x="6" y="22" width="54" height="40" rx="8" fill="rgba(13,148,136,0.2)" stroke="rgba(45,212,191,0.35)" strokeWidth="1" />
          <rect x="12" y="31" width="28" height="4.5" rx="2.25" fill="rgba(167,243,208,0.7)" />
          <rect x="12" y="39" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
          <rect x="12" y="46" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.14)" />
          <rect x="12" y="53" width="18" height="4" rx="2" fill="rgba(13,148,136,0.55)" />
        </g>

        {/* ArchiCAD badge - top right */}
        <g className="ed-a2" style={{ transformOrigin: "328px 38px" }}>
          <rect x="302" y="18" width="52" height="40" rx="8" fill="rgba(13,148,136,0.18)" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />
          <rect x="308" y="27" width="22" height="4.5" rx="2.25" fill="rgba(45,212,191,0.75)" />
          <rect x="308" y="35" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.22)" />
          <rect x="308" y="42" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.14)" />
          <rect x="308" y="48" width="38" height="6" rx="3" fill="rgba(13,148,136,0.5)" />
          <rect x="312" y="50" width="24" height="2.5" rx="1.25" fill="rgba(167,243,208,0.7)" />
        </g>

        {/* Material swatch - right side */}
        <g className="ed-a3" style={{ transformOrigin: "326px 98px" }}>
          <rect x="300" y="76" width="52" height="44" rx="8" fill="rgba(13,148,136,0.16)" stroke="rgba(45,212,191,0.28)" strokeWidth="1" />
          <rect x="305" y="83" width="20" height="20" rx="4" fill="#0d9488" opacity="0.7" />
          <rect x="330" y="83" width="16" height="20" rx="4" fill="rgba(45,212,191,0.5)" />
          <rect x="305" y="106" width="40" height="3" rx="1.5" fill="rgba(167,243,208,0.5)" />
          <rect x="305" y="112" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
        </g>

        {/* Circle motif - bottom left */}
        <g className="ed-a2" style={{ transformOrigin: "28px 120px" }}>
          <circle cx="28" cy="120" r="17" fill="rgba(13,148,136,0.12)" stroke="rgba(45,212,191,0.2)" strokeWidth="1" />
          <circle cx="28" cy="120" r="10" fill="rgba(20,184,166,0.2)" stroke="rgba(45,212,191,0.25)" strokeWidth="0.8" />
          <circle cx="28" cy="120" r="4" fill="rgba(45,212,191,0.55)" />
        </g>

        {/* Compass dot - bottom right */}
        <g className="ed-a1" style={{ transformOrigin: "332px 132px" }}>
          <circle cx="332" cy="132" r="12" fill="rgba(13,148,136,0.15)" stroke="rgba(45,212,191,0.25)" strokeWidth="0.8" />
          <line x1="332" y1="122" x2="332" y2="142" stroke="rgba(45,212,191,0.5)" strokeWidth="0.8" />
          <line x1="322" y1="132" x2="342" y2="132" stroke="rgba(45,212,191,0.5)" strokeWidth="0.8" />
          <circle cx="332" cy="132" r="2.5" fill="rgba(45,212,191,0.7)" />
        </g>

        {/* Ambient glow dots */}
        <circle cx="0" cy="0" r="20" fill="#0d9488" opacity="0.08" />
        <circle cx="360" cy="160" r="25" fill="#14b8a6" opacity="0.07" />
      </svg>
    </div>
  );
}
