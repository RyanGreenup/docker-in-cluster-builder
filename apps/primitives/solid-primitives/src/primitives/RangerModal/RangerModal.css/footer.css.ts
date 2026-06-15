import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const footer = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.sm,
  padding: `0 ${rangerVars.sp.md}`,
  height: 32,
  borderTop: `1px solid ${rangerVars.border.subtle}`,
  fontSize: rangerVars.text["2xs"],
  fontFamily: rangerVars.font.mono,
  color: rangerVars.fg.muted,
  flexShrink: 0,
  overflow: "hidden",
});

export const footerStatusPath = style({
  fontWeight: 600,
  color: rangerVars.fg.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "30%",
});

export const footerDivider = style({
  color: rangerVars.border.default,
  flexShrink: 0,
});

export const footerSpacer = style({ flex: 1 });

export const footerGroup = style({
  display: "flex",
  alignItems: "center",
  gap: 3,
  flexShrink: 0,
});

export const kbdMini = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 16,
  height: 16,
  padding: "0 4px",
  background: rangerVars.surface.sunken,
  border: `1px solid ${rangerVars.border.default}`,
  borderRadius: 3,
  fontSize: "10px",
  color: rangerVars.fg.secondary,
  fontFamily: rangerVars.font.mono,
});
