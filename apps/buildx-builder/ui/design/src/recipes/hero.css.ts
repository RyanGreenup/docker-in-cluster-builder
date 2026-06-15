import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, layout, leading, radius, space, textSize, tracking } from "../tokens";

/**
 * Home hero. The default is a single left-aligned editorial column: a kicker
 * above a very large semibold headline, a muted lede capped to the reading
 * measure, and a wrap-friendly row of CTA buttons.
 *
 * The `heroSplit` / `specSheet` exports add an optional asymmetric layout: the
 * prose column beside a narrow mono "spec sheet" rail (years, focus, stack,
 * location, status) styled like an engineering datasheet. It surfaces the hard
 * credentials a recruiter scans for without adding decoration, and collapses to
 * a single column on narrow viewports.
 */
export const hero = style({
  maxWidth: "52rem",
  paddingBlock: `${space["8"]} ${space["4"]}`,
});

export const heroTitle = style({
  margin: 0,
  marginTop: space["5"],
  fontSize: textSize["5xl"],
  fontWeight: "600",
  // Headline runs tighter than the `tight` body leading; literal to preserve the
  // exact display rhythm of the reference design.
  lineHeight: "1.05",
  letterSpacing: tracking.tight,
  color: vars.roles.fg.base,
  "@media": {
    "screen and (max-width: 640px)": { fontSize: textSize["4xl"] },
  },
});

export const heroLede = style({
  margin: 0,
  marginTop: space["6"],
  maxWidth: layout.measure,
  fontSize: textSize.xl,
  lineHeight: leading.normal,
  color: vars.roles.fg.muted,
  "@media": {
    "screen and (max-width: 640px)": { fontSize: textSize.lg },
  },
});

export const heroCta = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["3"],
  marginTop: space["8"],
});

// ---------------------------------------------------------------------------
// Optional asymmetric "spec sheet" layout (prose column + mono datasheet rail)
// ---------------------------------------------------------------------------

export const heroSplit = style({
  display: "grid",
  gridTemplateColumns: "1fr 18rem",
  gap: space["12"],
  alignItems: "start",
  "@media": {
    "screen and (max-width: 860px)": {
      gridTemplateColumns: "1fr",
      gap: space["8"],
    },
  },
});

export const specSheet = style({
  fontFamily: font.mono,
  fontSize: textSize.sm,
  border: `1px solid ${vars.roles.border.base}`,
  borderRadius: radius.lg,
  background: vars.roles.bg.sunken,
  overflow: "hidden",
});

export const specRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: space["4"],
  padding: `${space["3"]} ${space["4"]}`,
  borderTop: `1px solid ${vars.roles.border.subtle}`,
  selectors: {
    "&:first-child": { borderTop: 0 },
  },
});

export const specKey = style({
  flexShrink: 0,
  fontSize: textSize.xs,
  textTransform: "uppercase",
  letterSpacing: tracking.caps,
  color: vars.roles.fg.faint,
});

export const specVal = style({
  textAlign: "right",
  color: vars.roles.fg.base,
});
