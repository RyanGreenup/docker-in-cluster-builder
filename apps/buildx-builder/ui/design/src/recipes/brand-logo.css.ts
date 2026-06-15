import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, radius, space, textSize, tracking } from "../tokens";

/**
 * Brand lockup for the personal site: a square monogram tile beside a semibold
 * wordmark, on one baseline. Two mark treatments are supported via the `mark`
 * recipe's `tone`:
 *   - `solid`  -- filled brand-blue tile with the mono initials reversed out
 *                 (the everyday header mark).
 *   - `glyph`  -- a quiet outline tile that hosts a thin stroked SVG monogram
 *                 (the "Node" mark: an R whose leg ends in a teal node, reading
 *                 as both a letter and a two-node system diagram). The inline
 *                 SVG inherits `currentColor`.
 *
 * Everything that can come from the contract (radii, spacing, type, colour
 * roles) does; the tile box sizes are identity geometry owned here.
 */

const BOX = {
  sm: "26px",
  md: "30px",
  lg: "64px",
} as const;

/** The outer lockup: mark + wordmark on a single baseline. */
export const lock = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    fontWeight: "600",
    letterSpacing: tracking.tight,
    color: vars.roles.fg.base,
  },
  variants: {
    size: {
      sm: { gap: space["2"] },
      md: { gap: space["3"] },
      lg: { gap: space["4"] },
    },
  },
  defaultVariants: { size: "md" },
});

/** The monogram tile. `solid` fills with brand; `glyph` is a quiet outline host. */
export const mark = recipe({
  base: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    fontFamily: font.mono,
    fontWeight: "600",
    letterSpacing: "0.02em",
    borderRadius: radius.md,
  },
  variants: {
    tone: {
      solid: {
        background: vars.roles.brand.primary,
        color: vars.roles.brand.onPrimary,
      },
      glyph: {
        background: vars.roles.brand.primarySubtle,
        color: vars.roles.brand.primary,
        boxShadow: `inset 0 0 0 1px ${vars.roles.brand.primaryBorder}`,
      },
    },
    size: {
      sm: { width: BOX.sm, height: BOX.sm, fontSize: textSize["2xs"] },
      md: { width: BOX.md, height: BOX.md, fontSize: textSize.xs },
      lg: {
        width: BOX.lg,
        height: BOX.lg,
        fontSize: textSize.xl,
        borderRadius: radius.lg,
      },
    },
  },
  defaultVariants: { tone: "solid", size: "md" },
});

/** The stroked "Node" SVG glyph; colour and accent node inherit from the tile. */
export const glyph = style({
  display: "block",
  width: "62%",
  height: "62%",
});

/** The wordmark text beside the mark. */
export const word = recipe({
  base: {
    fontWeight: "600",
    whiteSpace: "nowrap",
    color: vars.roles.fg.base,
  },
  variants: {
    size: {
      sm: { fontSize: textSize.sm },
      md: { fontSize: textSize.md },
      lg: { fontSize: textSize.xl },
    },
  },
  defaultVariants: { size: "md" },
});
