import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { duration, ease, font, fontWeight, radius, space, textSize } from "../tokens";

export const channel = style({
  display: "flex",
  alignItems: "center",
  gap: space["4"],
  padding: space["5"],
  background: vars.roles.bg.raised,
  border: `1px solid ${vars.roles.border.base}`,
  borderRadius: radius.xl,
  textDecoration: "none",
  color: "inherit",
  transition: `border-color ${duration.base} ${ease.standard}, background-color ${duration.base} ${ease.standard}`,
  selectors: {
    "&:hover": {
      borderColor: vars.roles.brand.primaryBorder,
      background: vars.roles.bg.hover,
    },
  },
});

export const channelIcon = style({
  display: "grid",
  placeItems: "center",
  width: "44px",
  height: "44px",
  flexShrink: 0,
  borderRadius: radius.lg,
  background: vars.roles.brand.primarySubtle,
  color: vars.roles.brand.primary,
});

export const channelBody = style({
  display: "flex",
  flexDirection: "column",
  gap: space["1"],
  flex: 1,
  minWidth: 0,
});

export const channelTop = style({
  display: "flex",
  alignItems: "baseline",
  gap: space["3"],
  flexWrap: "wrap",
});

export const channelLabel = style({
  fontWeight: fontWeight.semibold,
  color: vars.roles.fg.base,
});

export const channelValue = style({
  fontFamily: font.mono,
  fontSize: textSize.sm,
  color: vars.roles.fg.subtle,
});

export const channelHint = style({
  fontSize: textSize.sm,
  color: vars.roles.fg.muted,
});

export const channelArrow = style({
  color: vars.roles.fg.faint,
  fontSize: textSize.lg,
  transition: `transform ${duration.base} ${ease.standard}, color ${duration.base} ${ease.standard}`,
  selectors: {
    [`${channel}:hover &`]: {
      color: vars.roles.brand.primary,
      transform: "translateX(3px)",
    },
  },
});
