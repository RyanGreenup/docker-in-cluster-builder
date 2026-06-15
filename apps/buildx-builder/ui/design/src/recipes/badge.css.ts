import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, radius, space, textSize } from "../tokens";

import type { StatusKey } from "../palette/status";

/**
 * Maps a status family onto the typed contract's bg / fg / border roles.
 * @param key - The status family to resolve.
 * @returns The bg, fg, and border colours for that family.
 */
const family = (key: StatusKey): { background: string; color: string; borderColor: string } => ({
  background: vars.status[key].bg,
  color: vars.status[key].fg,
  borderColor: vars.status[key].border,
});

/**
 * The status-chip recipe — the single source of truth for badge styling.
 *
 * `base` carries only mode-invariant tokens (radius, font, spacing). The
 * `status` variants pull their colours from the typed theme contract, so each
 * family flips light/dark automatically.
 */
export const badge = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["1"],
    fontFamily: font.sans,
    fontWeight: "600",
    borderRadius: radius.pill,
    border: "1px solid",
    whiteSpace: "nowrap",
    lineHeight: "1",
  },
  variants: {
    status: {
      success: family("success"),
      warning: family("warning"),
      danger: family("danger"),
      info: family("info"),
      neutral: family("neutral"),
      promo: family("promo"),
    },
    size: {
      sm: { fontSize: textSize["2xs"], padding: `${space["1"]} ${space["2"]}` },
      md: { fontSize: textSize.xs, padding: `${space["1"]} ${space["3"]}` },
    },
  },
  defaultVariants: { status: "neutral", size: "md" },
});
