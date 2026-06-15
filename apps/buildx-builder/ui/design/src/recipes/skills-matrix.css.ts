import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, fontWeight, space, textSize, tracking } from "../tokens";

/**
 * Skills matrix for the CV / resume page. Renders a column of labelled rows,
 * each containing a monospace section number, a caps-case group label, and a
 * flex-wrap row of chip tags.
 *
 * The `reveal` scroll-animation wrapper is NOT part of this recipe -- it stays
 * as a page-level class so this recipe remains stateless.
 */

export const matrix = style({
  display: "flex",
  flexDirection: "column",
  gap: space["5"],
});

export const mrow = style({
  display: "grid",
  gridTemplateColumns: "13rem 1fr",
  gap: space["4"],
  alignItems: "start",
  paddingBottom: space["5"],
  borderBottom: `1px solid ${vars.roles.border.base}`,
  selectors: {
    "&:last-child": {
      borderBottom: "0",
      paddingBottom: "0",
    },
  },
  "@media": {
    "(max-width: 820px)": {
      gridTemplateColumns: "1fr",
      gap: space["3"],
    },
  },
});

export const mrowLabel = style({
  display: "flex",
  alignItems: "baseline",
  gap: space["2"],
});

export const mrowNo = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.faint,
});

export const mrowTitle = style({
  fontSize: textSize.sm,
  fontWeight: fontWeight.semibold,
  textTransform: "uppercase",
  letterSpacing: tracking.caps,
  color: vars.roles.fg.muted,
});

export const mrowItems = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["2"],
});

