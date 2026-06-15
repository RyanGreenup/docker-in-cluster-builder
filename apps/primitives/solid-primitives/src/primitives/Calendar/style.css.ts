import { style } from "@vanilla-extract/css";

// Structural-only styling. The grid collapses its borders and day triggers
// Center their label; everything else (colour, range highlighting, type,
// Spacing) is layered by the storybook skins via the `data-part` hooks and
// Corvu's `data-selected` / `data-in-range` / `data-today` state attributes.

export const table = style({
  borderCollapse: "collapse",
});

export const cellTrigger = style({
  alignItems: "center",
  cursor: "pointer",
  display: "inline-flex",
  justifyContent: "center",
});
