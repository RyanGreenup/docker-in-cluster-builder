import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, layout, space, textSize } from "../tokens";

export const pager = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: space["4"],
  marginTop: space["10"],
  maxWidth: layout.proseMax,
});

export const pagerCount = style({
  fontFamily: font.mono,
  fontSize: textSize.sm,
  color: vars.roles.fg.subtle,
});
