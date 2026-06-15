import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const previewCard = style({
  padding: rangerVars.sp.lg,
  overflowY: "auto",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: rangerVars.sp.md,
  minHeight: 0,
});

export const previewEmpty = style({
  padding: rangerVars.sp.lg,
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.muted,
  fontFamily: rangerVars.font.mono,
});

export const preTitle = style({
  fontSize: rangerVars.text.md,
  fontWeight: 600,
  color: rangerVars.fg.primary,
  lineHeight: 1.35,
});

export const preAbstract = style({
  fontSize: rangerVars.text.sm,
  color: rangerVars.fg.secondary,
  lineHeight: 1.6,
});

export const preGrid = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: `4px ${rangerVars.sp.md}`,
  fontSize: rangerVars.text.xs,
});

export const preGridKey = style({
  color: rangerVars.fg.muted,
  fontFamily: rangerVars.font.mono,
});

export const preGridVal = style({ color: rangerVars.fg.secondary });

export const preSectionLabel = style({
  fontSize: rangerVars.text["2xs"],
  fontFamily: rangerVars.font.mono,
  color: rangerVars.fg.muted,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: rangerVars.sp.xs,
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
});

export const preSectionCount = style({
  background: rangerVars.surface.sunken,
  border: `1px solid ${rangerVars.border.subtle}`,
  borderRadius: "10px",
  padding: "0 5px",
  fontSize: "10px",
  lineHeight: "15px",
});

export const preTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: rangerVars.sp.xs,
});

export const preBacklink = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  fontSize: rangerVars.text.xs,
  color: rangerVars.fg.secondary,
  padding: "2px 0",
});

export const preSnippet = style({
  fontSize: rangerVars.text.xs,
  color: rangerVars.fg.secondary,
  lineHeight: 1.6,
  background: rangerVars.surface.sunken,
  padding: rangerVars.sp.sm,
  borderRadius: rangerVars.radius.sm,
  border: `1px solid ${rangerVars.border.subtle}`,
});
