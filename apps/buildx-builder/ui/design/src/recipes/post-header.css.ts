import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, fontWeight, space, textSize } from "../tokens";

export const postHead = style({
  paddingBottom: space["8"],
  marginBottom: space["8"],
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
});

export const postBack = style({
  fontSize: textSize.sm,
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.muted,
  selectors: {
    "&:hover": { color: vars.roles.brand.primary },
  },
});

export const postTitle = style({
  marginTop: space["5"],
  fontSize: textSize["4xl"],
  color: vars.roles.fg.base,
  "@media": {
    "screen and (max-width: 640px)": {
      fontSize: textSize["3xl"],
    },
  },
});

export const postDesc = style({
  marginTop: space["4"],
  fontSize: textSize.lg,
  color: vars.roles.fg.muted,
});

export const postMeta = style({
  display: "flex",
  alignItems: "center",
  gap: space["2"],
  marginTop: space["5"],
  fontSize: textSize.sm,
  color: vars.roles.fg.subtle,
});

export const postByline = style({
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.base,
});

export const postDot = style({
  color: vars.roles.fg.faint,
});

export const postTime = style({
  fontFamily: font.mono,
});

export const postTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["2"],
  marginTop: space["5"],
});
