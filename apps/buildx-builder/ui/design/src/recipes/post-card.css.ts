import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, layout, space, textSize, tracking } from "../tokens";

/**
 * Post card: a list row for the blog/recent-writing strip. A mono date sits
 * above the title; the whole title+excerpt+"read post" block is the link, and
 * the title shifts to brand-blue on hover. Tags follow beneath, outside the
 * link. Rows are separated by a hairline bottom rule; the list zeroes the first
 * row's top padding. Colours come from the typed contract.
 */
export const postCard = style({
  display: "flex",
  flexDirection: "column",
  gap: space["3"],
  paddingBlock: space["6"],
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
});

export const postCardLink = style({
  display: "grid",
  gap: space["2"],
  color: "inherit",
  textDecoration: "none",
  borderRadius: "2px",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.roles.brand.ring}`,
      outlineOffset: space["2"],
    },
  },
});

export const postCardDate = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.subtle,
  letterSpacing: tracking.wide,
});

export const postCardTitle = style({
  margin: 0,
  fontSize: textSize.xl,
  fontWeight: "600",
  color: vars.roles.fg.base,
  transition: "color var(--duration-base) var(--ease-standard)",
  selectors: {
    [`${postCardLink}:hover &`]: { color: vars.roles.brand.primary },
  },
});

export const postCardDesc = style({
  margin: 0,
  fontSize: textSize.md,
  color: vars.roles.fg.muted,
  maxWidth: layout.measure,
});

export const postCardMore = style({
  fontSize: textSize.sm,
  fontWeight: "500",
  color: vars.roles.brand.primary,
});

export const postCardTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["2"],
});
