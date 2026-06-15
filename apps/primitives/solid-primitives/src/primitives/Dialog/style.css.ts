import { style } from "@vanilla-extract/css";

// Structural-only styling. The primitive owns positioning (overlay covers the
// Viewport; content is centered) and nothing else — colour, type, radius, and
// Motion are layered by the storybook skins through the `data-part` hooks.

export const overlay = style({
  inset: 0,
  position: "fixed",
});

export const content = style({
  left: "50%",
  maxHeight: "calc(100vh - 2rem)",
  maxWidth: "calc(100vw - 2rem)",
  overflowY: "auto",
  position: "fixed",
  top: "50%",
  transform: "translate(-50%, -50%)",
});
