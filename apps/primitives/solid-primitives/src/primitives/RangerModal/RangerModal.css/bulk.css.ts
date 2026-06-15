import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";

export const bulkBar = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.sm,
  padding: `0 ${rangerVars.sp.md}`,
  height: 36,
  borderTop: `1px solid ${rangerVars.border.subtle}`,
  background: rangerVars.surface.sunken,
  flexShrink: 0,
});

export const bulkCount = style({
  fontSize: rangerVars.text.xs,
  fontWeight: 600,
  color: rangerVars.fg.secondary,
  marginRight: rangerVars.sp.xs,
});

export const bulkDivider = style({
  width: 1,
  height: 16,
  background: rangerVars.border.subtle,
  flexShrink: 0,
});

export const bulkBtn = style({
  display: "flex",
  alignItems: "center",
  gap: rangerVars.sp.xs,
  padding: "3px 8px",
  fontSize: rangerVars.text.xs,
  border: `1px solid ${rangerVars.border.subtle}`,
  borderRadius: rangerVars.radius.sm,
  background: "none",
  color: rangerVars.fg.secondary,
  cursor: "pointer",
  ":hover": {
    background: rangerVars.surface.hover,
    color: rangerVars.fg.primary,
  },
});

export const bulkBtnDanger = style({
  ":hover": {
    background: "hsl(0 60% 50%)",
    color: "white",
    borderColor: "hsl(0 60% 50%)",
  },
});
