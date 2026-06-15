import { font, fontWeight, radius, space, textSize, tracking } from "@rs/liatris-design";
import { vars } from "@rs/liatris-design/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

/*
 * Liatris skin for the SidebarShell primitive: the panel surface and type come
 * from the @rs/liatris-design token module and colour roles, and the section
 * chrome (small-caps headers, hover states) is layered over the primitive's
 * data-part hooks, exactly as the liatris Electron app skins it.
 */

const { roles } = vars;

export const stage = style({
  background: roles.bg.app,
  display: "flex",
  fontFamily: font.sans,
  minHeight: "100vh",
});

export const panel = style({
  background: roles.bg.surface,
  borderRight: `1px solid ${roles.border.base}`,
  color: roles.fg.base,
  display: "flex",
  flexDirection: "column",
  padding: space["3"],
  width: "280px",
});

globalStyle(`${panel} [data-part="trigger"]`, {
  alignItems: "center",
  borderRadius: radius.sm,
  cursor: "pointer",
  display: "flex",
  gap: space["2"],
  padding: `${space["1"]} ${space["2"]}`,
});

globalStyle(`${panel} [data-part="trigger"]:hover`, {
  background: roles.bg.hover,
});

globalStyle(`${panel} [data-part="title"]`, {
  color: roles.fg.muted,
  fontSize: textSize.xs,
  fontWeight: fontWeight.semibold,
  letterSpacing: tracking.caps,
  textTransform: "uppercase",
});

globalStyle(`${panel} [data-part="icon"]`, {
  color: roles.fg.subtle,
  height: "12px",
  marginLeft: "auto",
  width: "12px",
});

globalStyle(`${panel} [data-part="sidebar-section-body"]`, {
  color: roles.fg.base,
  fontSize: textSize.sm,
  padding: `${space["1"]} ${space["2"]}`,
});

export const fileList = style({
  display: "flex",
  flexDirection: "column",
  gap: space["1"],
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const fileRow = style({
  borderRadius: radius.sm,
  cursor: "pointer",
  fontFamily: font.mono,
  fontSize: textSize.xs,
  padding: `${space["1"]} ${space["2"]}`,
  selectors: {
    "&:hover": { background: roles.bg.hover },
  },
});
