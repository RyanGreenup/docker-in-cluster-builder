import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, fontWeight, space } from "../tokens";

/**
 * Education list for the CV / resume page. Renders a borderless list of rows,
 * each containing a degree title, institution, and graduation year.
 *
 * The `reveal` scroll-animation wrapper is NOT part of this recipe -- it stays
 * as a page-level class so this recipe remains stateless.
 */

export const eduList = style({
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 0,
});

export const eduRow = style({
  display: "flex",
  alignItems: "baseline",
  gap: space["3"],
  flexWrap: "wrap",
  padding: `${space["3"]} 0`,
  borderTop: `1px solid ${vars.roles.border.subtle}`,
  selectors: {
    "&:first-child": {
      borderTop: "0",
    },
  },
});

export const eduDegree = style({
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.base,
});

export const eduOrg = style({
  color: vars.roles.fg.muted,
});

export const eduYear = style({
  marginLeft: "auto",
  fontFamily: font.mono,
  fontSize: "0.8125rem",
  color: vars.roles.fg.faint,
  whiteSpace: "nowrap",
});
