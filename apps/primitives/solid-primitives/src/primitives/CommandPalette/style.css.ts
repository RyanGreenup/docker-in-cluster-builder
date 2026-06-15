import { style } from "@vanilla-extract/css";

// Structural-only styling. The palette owns the column layout, sizing, and
// scroll behaviour; colour, type, radius, and motion are layered by consumers
// through the `data-part` hooks (palette-root, palette-input, palette-list,
// palette-item, palette-empty).

export const root = style({
  display: "flex",
  flexDirection: "column",
  maxHeight: "60vh",
  minHeight: 0,
  width: "min(640px, 90vw)",
});

export const input = style({
  width: "100%",
});

export const list = style({
  listStyle: "none",
  margin: 0,
  minHeight: 0,
  overflowY: "auto",
  padding: 0,
});

export const item = style({
  cursor: "pointer",
});
