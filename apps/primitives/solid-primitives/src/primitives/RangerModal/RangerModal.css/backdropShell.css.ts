import { style } from "@vanilla-extract/css";

import { rangerVars } from "../theme.css";
import { fadeIn, riseIn } from "./animations.css";

export const backdrop = style({
  position: "fixed",
  inset: 0,
  background: "oklch(0% 0 0 / 0.4)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 900,
  padding: rangerVars.sp.lg,
  animation: `${fadeIn} 140ms ${rangerVars.ease.out} both`,
});

export const shell = style({
  width: "100%",
  maxWidth: "920px",
  height: "min(600px, 88vh)",
  background: rangerVars.surface.raised,
  border: `1px solid ${rangerVars.border.default}`,
  borderRadius: rangerVars.radius.lg,
  boxShadow: "0 24px 64px oklch(0% 0 0 / 0.22), 0 4px 16px oklch(0% 0 0 / 0.1)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  animation: `${riseIn} 180ms ${rangerVars.ease.out} both`,
});
