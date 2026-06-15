import { globalStyle, keyframes, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, radius, space, textSize, tracking } from "../tokens";

/**
 * Horizontal shimmer sweep that repeats with a long pause between passes.
 * The 0%/40% hold keeps it mostly static; the 40%-70% is the fast sweep.
 */
const shimmerSweep = keyframes({
  "0%, 40%": { transform: "translateX(-160%)" },
  "70%": { transform: "translateX(160%)" },
  "100%": { transform: "translateX(160%)" },
});

/**
 * Private / unreleased project badge. Uses the `promo` status family
 * (purple) to signal exclusivity. A repeating shimmer sweep on `::before`
 * gives a "classified signal" quality without demanding attention.
 *
 * Compose with a lock SVG icon and a text label in the component layer.
 */
export const comingSoonBadge = style({
  position: "relative",
  overflow: "hidden",
  display: "inline-flex",
  alignItems: "center",
  gap: space["1"],
  fontFamily: font.mono,
  fontSize: textSize.xs,
  fontWeight: "600",
  letterSpacing: tracking.wide,
  borderRadius: radius.pill,
  border: `1px solid ${vars.status.promo.border}`,
  background: vars.status.promo.bg,
  color: vars.status.promo.fg,
  padding: `${space["1"]} ${space["3"]}`,
  whiteSpace: "nowrap",
  lineHeight: "1",
  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "0",
      background: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${vars.status.promo.base} 22%, transparent) 50%, transparent 100%)`,
      animationName: shimmerSweep,
      animationDuration: "3.2s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
      animationDelay: "1s",
      pointerEvents: "none",
    },
  },
});

globalStyle(`${comingSoonBadge}::before`, {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});
