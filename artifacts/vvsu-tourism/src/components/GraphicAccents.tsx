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
