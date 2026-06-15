import { style } from "@vanilla-extract/css";

// Behaviour only: layout affordances for an icon + label, and the
// Not-allowed cursor when disabled. No colours, type, or radius — those
// Are aesthetics and belong to a themed layer (see ../../exemplars).
export const button = style({
  alignItems: "center",
  cursor: "pointer",
  display: "inline-flex",
  gap: "0.5rem",
  justifyContent: "center",
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});
