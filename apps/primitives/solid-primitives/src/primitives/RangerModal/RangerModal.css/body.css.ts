import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const body = style({
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr 1.6fr",
  flex: 1,
  overflow: "hidden",
  minHeight: 0,
});

export const col = style({
  display: "flex",
  flexDirection: "column",
  borderRight: `1px solid ${rangerVars.border.subtle}`,
  overflow: "hidden",
  selectors: { "&:last-child": { borderRight: "none" } },
});

export const colCurrent = style({
  background: `color-mix(in oklch, ${rangerVars.surface.raised} 60%, ${rangerVars.surface.sunken} 40%)`,
});

export const colHead = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `0 ${rangerVars.sp.md}`,
  height: 28,
  fontSize: rangerVars.text["2xs"],
  fontFamily: rangerVars.font.mono,
  color: rangerVars.fg.muted,
  borderBottom: `1px solid ${rangerVars.border.subtle}`,
  flexShrink: 0,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  userSelect: "none",
});

export const colCount = style({
  background: rangerVars.surface.sunken,
  border: `1px solid ${rangerVars.border.subtle}`,
  borderRadius: "10px",
  padding: "0 6px",
  fontSize: "10px",
  lineHeight: "16px",
});

export const list = style({
  flex: 1,
  overflowY: "auto",
  padding: "4px 0",
  minHeight: 0,
});
