import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/** Absolute-positioned geometric circle/half-circle/quarter-circle */
export function GeoCircle({
  size, top, left, right, bottom,
  color, opacity = 1,
  shape = "full",
  animate: doAnim = false,
}: {
  size: number;
  top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string;
  color: string; opacity?: number;
  shape?: "full" | "half-top" | "half-bottom" | "half-left" | "half-right"
         | "quarter-tl" | "quarter-tr" | "quarter-bl" | "quarter-br";
  animate?: boolean;
}) {
  const borderRadius: Record<typeof shape, string> = {
    "full":        "50%",
    "half-top":    "50% 50% 0 0",
    "half-bottom": "0 0 50% 50%",
    "half-left":   "50% 0 0 50%",
    "half-right":  "0 50% 50% 0",
    "quarter-tl":  "50% 0 0 0",
    "quarter-tr":  "0 50% 0 0",
    "quarter-bl":  "0 0 0 50%",
    "quarter-br":  "0 0 50% 0",
  };

  const style: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: color,
    opacity,
    borderRadius: borderRadius[shape],
    pointerEvents: "none",
    zIndex: 0,
    ...(top !== undefined    ? { top }    : {}),
    ...(left !== undefined   ? { left }   : {}),
    ...(right !== undefined  ? { right }  : {}),
    ...(bottom !== undefined ? { bottom } : {}),
  };

  if (doAnim) {
    return (
      <motion.div
        style={style}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }
  return <div style={style} />;
}

/** Giant ghost text overlaid in the background */
export function GhostText({
  text, size = 180, color = "#fff", opacity = 0.045,
  top, left, right, bottom,
  rotate = 0,
}: {
  text: string; size?: number; color?: string; opacity?: number;
  top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string;
  rotate?: number;
}) {
  return (
    <div style={{
      position: "absolute", pointerEvents: "none", userSelect: "none",
      fontWeight: 900, fontSize: size, lineHeight: 1, opacity,
      color, letterSpacing: "-0.06em", whiteSpace: "nowrap",
      zIndex: 0,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      ...(top    !== undefined ? { top }    : {}),
      ...(left   !== undefined ? { left }   : {}),
      ...(right  !== undefined ? { right }  : {}),
      ...(bottom !== undefined ? { bottom } : {}),
    }}>
      {text}
    </div>
  );
}

/** Small dot-grid accent */
export function DotGrid({
  cols = 6, rows = 4, gap = 10, color = "#fff", opacity = 0.12,
  top, left, right, bottom,
}: {
  cols?: number; rows?: number; gap?: number;
  color?: string; opacity?: number;
  top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string;
}) {
  return (
    <div style={{
      position: "absolute", pointerEvents: "none",
      display: "grid", gridTemplateColumns: `repeat(${cols}, ${gap}px)`,
      gridTemplateRows: `repeat(${rows}, ${gap}px)`, gap: gap,
      opacity, zIndex: 0,
      ...(top    !== undefined ? { top }    : {}),
      ...(left   !== undefined ? { left }   : {}),
      ...(right  !== undefined ? { right }  : {}),
      ...(bottom !== undefined ? { bottom } : {}),
    }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: color }} />
      ))}
    </div>
  );
}

/** Vertical/diagonal bold text stripe (like "design" rotated 90°) */
export function VerticalText({
  text, color = "#fff", opacity = 0.07, size = 11,
  top, left, right, bottom,
}: {
  text: string; color?: string; opacity?: number; size?: number;
  top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string;
}) {
  return (
    <div style={{
      position: "absolute", pointerEvents: "none", userSelect: "none",
      fontWeight: 900, fontSize: size, letterSpacing: 4,
      textTransform: "uppercase", color, opacity,
      writingMode: "vertical-rl", transform: "rotate(180deg)",
      ...(top    !== undefined ? { top }    : {}),
      ...(left   !== undefined ? { left }   : {}),
      ...(right  !== undefined ? { right }  : {}),
      ...(bottom !== undefined ? { bottom } : {}),
    }}>
      {text}
    </div>
  );
}

/**
 * Full-width editorial band separator between content sections.
 * Use outside any container (full-bleed) between major sections.
 */
export function SectionBand({
  label, num = "", bg = "#0A0A0A",
  accent = "#C6FF00", textColor = "#C6FF00",
}: {
  label: string; num?: string;
  bg?: string; accent?: string; textColor?: string;
}) {
  const dark = bg === "#0A0A0A" || bg === "#0057B8" || bg === "#FF007F";
  const labelColor  = dark ? textColor : "#0A0A0A";
  const dividerOp   = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const tagColor    = dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const ghostColor  = dark ? "#fff" : "#0A0A0A";
  return (
    <div style={{
      background: bg, overflow: "hidden", position: "relative",
      borderTop: "3px solid #0A0A0A", borderBottom: "3px solid #0A0A0A",
    }}>
      {num && (
        <div style={{
          position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
          fontSize: 110, fontWeight: 900, color: ghostColor, opacity: 0.06,
          lineHeight: 1, letterSpacing: "-0.05em", pointerEvents: "none", userSelect: "none",
        }}>{num}</div>
      )}
      <div style={{
        position: "absolute", left: -55, top: "50%", transform: "translateY(-50%)",
        width: 150, height: 150, borderRadius: "50%", background: accent, opacity: dark ? 0.2 : 0.25,
        pointerEvents: "none",
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 24, padding: "18px 48px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ width: 8, height: 8, background: textColor, flexShrink: 0 }} />
        <span style={{
          fontWeight: 900, fontSize: 12, letterSpacing: 4,
          textTransform: "uppercase", color: labelColor,
        }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: dividerOp }} />
        {num && (
          <span style={{
            fontWeight: 700, fontSize: 11, letterSpacing: 2,
            color: tagColor, textTransform: "uppercase",
          }}>→ {num}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Large ghost section number for use inside a position:relative container.
 * Renders the number behind the content at very low opacity.
 */
export function GhostSectionNum({
  num, color = "var(--color-foreground)", opacity = 0.05,
  align = "left",
}: {
  num: string; color?: string; opacity?: number;
  align?: "left" | "right";
}) {
  return (
    <div style={{
      position: "absolute",
      ...(align === "right" ? { right: -10 } : { left: -10 }),
      top: "50%", transform: "translateY(-55%)",
      fontSize: 130, fontWeight: 900, color, opacity,
      lineHeight: 1, letterSpacing: "-0.06em",
      pointerEvents: "none", userSelect: "none", zIndex: 0,
      whiteSpace: "nowrap",
    }}>
      {num}
    </div>
  );
}

/**
 * Solid-color accent cell — inject into card grids as a visual punctuation block.
 */
export function AccentCard({
  text, sub = "", bg = "#C6FF00", textColor = "#0A0A0A",
  style: extraStyle,
}: {
  text: string; sub?: string;
  bg?: string; textColor?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{
      background: bg, padding: "28px 24px",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      position: "relative", overflow: "hidden",
      border: "2px solid #0A0A0A",
      ...extraStyle,
    }}>
      <div style={{
        position: "absolute", top: -50, right: -50, width: 180, height: 180,
        borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -20, left: -20, width: 70, height: 70,
        borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em",
        color: textColor, position: "relative", zIndex: 1,
      }}>{text}</div>
      {sub && (
        <div style={{
          fontSize: 11, color: textColor, opacity: 0.65, fontWeight: 600,
          marginTop: 8, letterSpacing: 0.5, textTransform: "uppercase",
          position: "relative", zIndex: 1,
        }}>{sub}</div>
      )}
    </div>
  );
}

/**
 * Upgrade for section header `◆ + h2` pattern — colored bar + ghost number.
 * Wrap content as children; the component adds the bar on the left and ghost num behind.
 */
export function SectionHeader({
  num, accent = "#C6FF00", children,
}: {
  num: string; accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", marginBottom: 24 }}>
      <GhostSectionNum num={num} color="var(--color-foreground)" opacity={0.045} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ width: 4, alignSelf: "stretch", minHeight: 28, background: accent, flexShrink: 0 }} />
        {children}
      </div>
    </div>
  );
}
