import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { layout, leading, space, textSize } from "../tokens";

/**
 * The lede block at the top of a sub-page (about, contact, projects): a kicker
 * sits above `pageHeadTitle`, with `pageHeadLede` as the muted intro paragraph.
 * Capped to the prose measure so the intro stays a comfortable reading width.
 */
export const pageHead = style({
  maxWidth: layout.proseMax,
  marginBottom: space["12"],
});

export const pageHeadTitle = style({
  margin: 0,
  marginTop: space["4"],
  fontSize: textSize["4xl"],
  fontWeight: "600",
  lineHeight: leading.tight,
  color: vars.roles.fg.base,
  "@media": {
    "screen and (max-width: 640px)": { fontSize: textSize["3xl"] },
  },
});

export const pageHeadLede = style({
  margin: 0,
  marginTop: space["5"],
  fontSize: textSize.lg,
  lineHeight: leading.relaxed,
  color: vars.roles.fg.muted,
});
