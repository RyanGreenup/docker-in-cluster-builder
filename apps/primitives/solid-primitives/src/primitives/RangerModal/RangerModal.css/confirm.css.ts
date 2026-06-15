import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const confirmRow = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.sm,
  padding: `6px ${rangerVars.sp.md}`,
  background: `color-mix(in oklch, ${rangerVars.surface.raised} 85%, hsl(0 70% 60%) 15%)`,
});

export const confirmText = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  fontSize: rangerVars.text.sm,
  flex: 1,
});

export const confirmBtn = style({
  fontSize: rangerVars.text["2xs"],
  padding: "2px 8px",
  border: `1px solid ${rangerVars.border.default}`,
  borderRadius: rangerVars.radius.sm,
  background: rangerVars.surface.base,
  color: rangerVars.fg.secondary,
  cursor: "pointer",
  ":hover": { background: rangerVars.surface.hover },
});

export const confirmBtnDanger = style({
  borderColor: "hsl(0 65% 55%)",
  color: "hsl(0 65% 55%)",
  ":hover": {
    background: "hsl(0 65% 50%)",
    color: "white",
    borderColor: "hsl(0 65% 50%)",
  },
});
