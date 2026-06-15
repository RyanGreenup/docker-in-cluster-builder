import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font } from "../tokens";

export const cvFoot = style({
  marginTop: "4rem",
  paddingTop: "1.25rem",
  borderTop: `1px solid ${vars.roles.border.subtle}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "0.75rem",
  fontFamily: font.mono,
  fontSize: "0.75rem",
  color: vars.roles.fg.muted,
});
