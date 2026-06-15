import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { duration, ease, font, fontWeight, radius, space, textSize } from "../tokens";

export const postNav = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: space["4"],
  marginTop: space["16"],
  paddingTop: space["8"],
  borderTop: `1px solid ${vars.roles.border.subtle}`,
  "@media": {
    "screen and (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const postNavItem = style({
  display: "flex",
  flexDirection: "column",
  gap: space["2"],
  padding: `${space["4"]} ${space["5"]}`,
  border: `1px solid ${vars.roles.border.base}`,
  borderRadius: radius.lg,
  transition: `border-color ${duration.base} ${ease.standard}, background-color ${duration.base} ${ease.standard}`,
  selectors: {
    "&:hover": {
      borderColor: vars.roles.brand.primaryBorder,
      background: vars.roles.bg.hover,
    },
  },
});

export const postNavItemNext = style({
  textAlign: "right",
  "@media": {
    "screen and (max-width: 640px)": {
      textAlign: "left",
    },
  },
});

export const postNavDir = style({
  fontSize: textSize.xs,
  fontFamily: font.mono,
  color: vars.roles.fg.subtle,
});

export const postNavTitle = style({
  fontSize: textSize.md,
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.base,
});
