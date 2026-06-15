import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const filterBar = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.sm,
  padding: `0 ${rangerVars.sp.md}`,
  height: 36,
  borderBottom: `1px solid ${rangerVars.border.subtle}`,
  flexShrink: 0,
});

export const filterPrompt = style({
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.muted,
  fontFamily: rangerVars.font.mono,
  flexShrink: 0,
});

export const filterInput = style({
  flex: 1,
  background: "none",
  border: "none",
  outline: "none",
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.primary,
  "::placeholder": { color: rangerVars.fg.muted },
});

export const filterStats = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  fontSize: rangerVars.text["2xs"],
  color: rangerVars.fg.muted,
  fontFamily: rangerVars.font.mono,
  flexShrink: 0,
  userSelect: "none",
});

export const filterStatDivider = style({ color: rangerVars.border.default });

export const filterSortKey = style({
  cursor: "pointer",
  color: rangerVars.fg.secondary,
  ":hover": { color: rangerVars.accent.base },
});
