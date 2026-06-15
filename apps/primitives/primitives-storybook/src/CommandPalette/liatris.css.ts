import { font, radius, shadow, space, textSize } from "@rs/liatris-design";
import { vars } from "@rs/liatris-design/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

/*
 * Liatris skin for the CommandPalette primitive, layered over its data-part
 * hooks (palette-root, palette-input, palette-item, palette-empty). This is
 * the same look the liatris Electron app gives its Mod+P file palette: a
 * raised surface, a sunken input, and a brand-tinted active row, all resolved
 * from the design system's tokens and colour roles.
 */

const { roles } = vars;

export const stage = style({
  background: roles.bg.app,
  color: roles.fg.base,
  display: "grid",
  fontFamily: font.sans,
  minHeight: "100vh",
  placeItems: "center",
});

export const palette = style({
  background: roles.bg.raised,
  border: `1px solid ${roles.border.base}`,
  borderRadius: radius.lg,
  boxShadow: shadow.lg,
  gap: space["2"],
  padding: space["2"],
});

globalStyle(`${palette} [data-part="palette-input"]`, {
  background: roles.bg.sunken,
  border: `1px solid ${roles.border.subtle}`,
  borderRadius: radius.md,
  color: roles.fg.base,
  fontFamily: font.sans,
  fontSize: textSize.md,
  outline: "none",
  padding: `${space["2"]} ${space["3"]}`,
});

globalStyle(`${palette} [data-part="palette-input"]:focus`, {
  borderColor: roles.focusRing,
});

globalStyle(`${palette} [data-part="palette-item"]`, {
  alignItems: "baseline",
  borderRadius: radius.sm,
  display: "flex",
  gap: space["3"],
  padding: `${space["1"]} ${space["3"]}`,
});

globalStyle(`${palette} [data-part="palette-item"][data-active]`, {
  background: roles.brand.primarySubtle,
});

globalStyle(`${palette} [data-part="palette-item-name"]`, {
  color: roles.fg.base,
  fontSize: textSize.sm,
});

globalStyle(`${palette} [data-part="palette-item-path"]`, {
  color: roles.fg.subtle,
  fontFamily: font.mono,
  fontSize: textSize["2xs"],
});

globalStyle(`${palette} [data-part="palette-empty"]`, {
  color: roles.fg.muted,
  fontSize: textSize.sm,
  padding: space["3"],
  textAlign: "center",
});

export const openButton = style({
  background: roles.bg.surface,
  border: `1px solid ${roles.border.base}`,
  borderRadius: radius.md,
  color: roles.fg.base,
  cursor: "pointer",
  fontFamily: font.sans,
  fontSize: textSize.sm,
  padding: `${space["2"]} ${space["4"]}`,
  selectors: {
    "&:hover": { background: roles.bg.hover },
  },
});
