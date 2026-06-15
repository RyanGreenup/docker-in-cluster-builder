import { style } from "@vanilla-extract/css";

import { tokens, vars } from "../../styles/theme.css";

const colors = vars.color.pop;

/**
 * Flat fluoro fill, heavy outline, hard offset shadow.
 * Hover grows the shadow to lift it; click shrinks it to press it down.
 */
export const button = style({
  backgroundColor: tokens.ui.primary,
  border: `2px solid ${colors.ink}`,
  borderRadius: "6px",
  boxShadow: `4px 4px 0 ${colors.ink}`,
  color: colors.ink,
  cursor: "pointer",
  fontFamily: tokens.font.outfit,
  fontSize: tokens.text.base,
  fontWeight: 700,
  padding: "0.5rem 1.1rem",
  selectors: {
    "&:active:not(:disabled)": {
      backgroundColor: colors.grape,
      boxShadow: `0 0 0 ${colors.ink}`,
      color: colors.cloud,
      transform: "translate(4px, 4px)",
    },
    "&:disabled": {
      backgroundColor: colors.ash,
      boxShadow: "none",
      color: colors.paperShade,
      cursor: "not-allowed",
    },
    "&:hover:not(:disabled)": {
      backgroundColor: colors.tangerine,
      boxShadow: `6px 6px 0 ${colors.ink}`,
      transform: "translate(-2px, -2px)",
    },
  },
  transition: "transform 120ms ease, box-shadow 120ms ease, background-color 150ms ease",
});
