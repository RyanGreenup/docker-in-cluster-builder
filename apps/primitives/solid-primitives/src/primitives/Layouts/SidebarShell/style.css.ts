import { style } from "@vanilla-extract/css";

// Structural-only styling. The shell owns the column layout and scroll
// behaviour; colour, type, and spacing are layered by consumers through the
// `data-part` hooks (sidebar-shell, sidebar-section, sidebar-section-body).

export const root = style({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflowY: "auto",
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});

export const body = style({
  minHeight: 0,
  overflowY: "auto",
});
