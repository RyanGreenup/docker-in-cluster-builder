import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, radius, space, textSize, tracking } from "../tokens";

/**
 * Tag chip: the small pill used for tech tags (TypeScript, Rust, ...) and post
 * tags. `tone` swaps the fill between the neutral sunken default, a brand-tinted
 * emphasis, and a petrol-teal accent. `mono` renders tech tokens in IBM Plex
 * Mono with the tracking dropped to zero (mono is already wide enough). Every
 * colour comes from the typed contract, so chips flip cleanly in dark mode.
 */
export const chip = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    height: "24px",
    paddingInline: space["2"],
    borderRadius: radius.sm,
    border: `1px solid ${vars.roles.border.base}`,
    background: vars.roles.bg.sunken,
    color: vars.roles.fg.muted,
    fontFamily: font.sans,
    fontSize: textSize.xs,
    fontWeight: "500",
    letterSpacing: tracking.wide,
    whiteSpace: "nowrap",
  },
  variants: {
    tone: {
      default: {},
      brand: {
        background: vars.roles.brand.primarySubtle,
        borderColor: vars.roles.brand.primaryBorder,
        color: vars.roles.brand.primary,
      },
      accent: {
        background: vars.roles.accentSubtle,
        borderColor: vars.roles.accentSubtle,
        color: vars.roles.accentStrong,
      },
    },
    mono: {
      true: { fontFamily: font.mono, letterSpacing: "0" },
      false: {},
    },
  },
  defaultVariants: { tone: "default", mono: false },
});
