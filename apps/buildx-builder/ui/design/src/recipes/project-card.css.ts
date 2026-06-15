import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, radius, space, textSize, tracking } from "../tokens";

/**
 * Project card: a bordered surface tile for the "selected work" grid. Title and
 * an optional mono status note share the head row; a flexible description pushes
 * the tech-tag row and the source/live link footer to the bottom so cards in a
 * row stay aligned. On hover the border lifts to the brand tint with a faint
 * shadow (no elevation jump). All colours come from the typed contract.
 */
export const projectCard = style({
  display: "flex",
  flexDirection: "column",
  gap: space["4"],
  padding: space["6"],
  background: vars.roles.bg.surface,
  border: `1px solid ${vars.roles.border.base}`,
  borderRadius: radius.xl,
  transition:
    "border-color var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": {
      borderColor: vars.roles.brand.primaryBorder,
      boxShadow: `0 1px 2px color-mix(in srgb, ${vars.roles.fg.base} 6%, transparent)`,
    },
  },
});

export const projectCardHead = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: space["3"],
});

export const projectCardTitle = style({
  margin: 0,
  fontSize: textSize.lg,
  fontWeight: "600",
  color: vars.roles.fg.base,
});

/** Short status note, e.g. "Open source" or "Production". */
export const projectCardNote = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.accentStrong,
  letterSpacing: tracking.wide,
  whiteSpace: "nowrap",
});

export const projectCardDesc = style({
  margin: 0,
  fontSize: textSize.md,
  color: vars.roles.fg.muted,
  flex: 1,
});

export const projectCardTech = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["2"],
});

export const projectCardLinks = style({
  display: "flex",
  gap: space["2"],
  paddingTop: space["2"],
  borderTop: `1px solid ${vars.roles.border.subtle}`,
});

export const projectCardLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space["2"],
  height: "36px",
  paddingInline: space["3"],
  borderRadius: radius.md,
  fontSize: textSize.sm,
  fontWeight: "500",
  color: vars.roles.fg.muted,
  transition:
    "color var(--duration-base) var(--ease-standard), background-color var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": {
      color: vars.roles.brand.primary,
      background: vars.roles.bg.hover,
    },
  },
});
