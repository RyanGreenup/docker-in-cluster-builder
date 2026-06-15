import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  padding: `4px ${rangerVars.sp.md}`,
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.primary,
  cursor: "pointer",
  userSelect: "none",
  ":hover": { background: rangerVars.surface.hover },
});

export const rowActive = style({
  background: rangerVars.accent.soft,
});

export const rowActiveCurrent = style({
  background: rangerVars.accent.base,
  color: rangerVars.fg.onAccent,
});

export const rowMarked = style({
  outline: `1px solid ${rangerVars.accent.border}`,
  outlineOffset: -1,
});

export const rowMark = style({
  width: 10,
  fontSize: 8,
  color: rangerVars.accent.base,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const rowIcon = style({
  width: 16,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  color: rangerVars.fg.secondary,
});

export const rowName = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: 5,
});

export const rowTagDot = style({
  width: 6,
  height: 6,
  borderRadius: "50%",
  flexShrink: 0,
});

export const rowMeta = style({
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: rangerVars.text["2xs"],
  color: rangerVars.fg.muted,
  fontFamily: rangerVars.font.mono,
  flexShrink: 0,
  marginLeft: "auto",
});

export const chevron = style({ color: rangerVars.fg.muted, fontSize: 11 });

export const renameInput = style({
  background: "none",
  border: "none",
  outline: `1px solid ${rangerVars.accent.base}`,
  outlineOffset: 2,
  borderRadius: 2,
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.primary,
  width: "100%",
  padding: "0 2px",
});

export const emptyMsg = style({
  padding: `${rangerVars.sp.xl} ${rangerVars.sp.md}`,
  fontFamily: rangerVars.font.mono,
  fontSize: rangerVars.text["2xs"],
  color: rangerVars.fg.muted,
});

export const newRow = style({
  background: rangerVars.accent.soft,
  outline: `1px solid ${rangerVars.accent.border}`,
  outlineOffset: -1,
});
