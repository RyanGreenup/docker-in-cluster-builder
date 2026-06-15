import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.sm,
  padding: `0 ${rangerVars.sp.md}`,
  height: 40,
  borderBottom: `1px solid ${rangerVars.border.subtle}`,
  flexShrink: 0,
});

export const titleBlock = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  marginRight: rangerVars.sp.xs,
  color: rangerVars.fg.tertiary,
});

export const appName = style({
  fontSize: rangerVars.text.sm,
  fontWeight: 600,
  color: rangerVars.fg.primary,
  letterSpacing: "-0.01em",
});

export const modeTag = style({
  display: "inline-flex",
  alignItems: "center",
  marginLeft: rangerVars.sp.xs,
  padding: "1px 5px",
  fontSize: rangerVars.text["2xs"],
  fontFamily: rangerVars.font.mono,
  background: rangerVars.surface.sunken,
  border: `1px solid ${rangerVars.border.subtle}`,
  borderRadius: rangerVars.radius.sm,
  color: rangerVars.fg.muted,
  verticalAlign: "middle",
});

export const crumb = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
  flex: 1,
  overflow: "hidden",
  fontSize: rangerVars.text.xs,
  fontFamily: rangerVars.font.mono,
  color: rangerVars.fg.muted,
});

export const crumbPrefix = style({ flexShrink: 0 });

export const crumbSeg = style({
  color: rangerVars.fg.secondary,
  cursor: "pointer",
  whiteSpace: "nowrap",
  ":hover": { color: rangerVars.fg.primary },
});

export const crumbSegTail = style({
  color: rangerVars.fg.primary,
  fontWeight: 600,
});

export const crumbSep = style({
  color: rangerVars.border.default,
  flexShrink: 0,
});

export const viewsGroup = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
  marginLeft: "auto",
});

export const viewBtn = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  padding: "3px 8px",
  fontSize: rangerVars.text["2xs"],
  border: "1px solid transparent",
  borderRadius: rangerVars.radius.sm,
  background: "none",
  color: rangerVars.fg.secondary,
  cursor: "pointer",
  ":hover": {
    background: rangerVars.surface.hover,
    color: rangerVars.fg.primary,
  },
});

export const viewBtnActive = style({
  background: rangerVars.surface.sunken,
  borderColor: rangerVars.border.subtle,
  color: rangerVars.fg.primary,
});

export const iconBtn = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  border: "none",
  borderRadius: rangerVars.radius.sm,
  background: "none",
  color: rangerVars.fg.tertiary,
  cursor: "pointer",
  flexShrink: 0,
  ":hover": {
    background: rangerVars.surface.hover,
    color: rangerVars.fg.primary,
  },
  ":disabled": { opacity: 0.3, cursor: "default" },
});
