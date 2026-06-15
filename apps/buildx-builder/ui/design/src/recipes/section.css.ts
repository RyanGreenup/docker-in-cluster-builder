import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, leading, space, textSize } from "../tokens";

/**
 * Section primitives for the editorial pages. `section` separates a block from
 * the one above it by the section rhythm (96px). `sectionHead` is the header
 * row: a title on the left and an optional "more" link pushed to the right,
 * with a hairline rule beneath. `sectionTitle` / `sectionMore` are the two
 * pieces. Colours come from the typed contract; spacing/type from static tokens.
 */
export const section = style({
  marginTop: space["24"],
});

export const sectionHead = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: space["4"],
  marginBottom: space["8"],
  paddingBottom: space["4"],
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
});

export const sectionTitle = style({
  margin: 0,
  fontFamily: font.sans,
  fontSize: textSize["2xl"],
  fontWeight: "600",
  lineHeight: leading.snug,
  color: vars.roles.fg.base,
});

export const sectionMore = style({
  fontSize: textSize.sm,
  fontWeight: "500",
  color: vars.roles.brand.primary,
  whiteSpace: "nowrap",
  selectors: {
    "&:hover": { color: vars.roles.brand.primaryHover },
  },
});
