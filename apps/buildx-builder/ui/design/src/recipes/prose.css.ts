import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, layout, leading, radius, space, textSize } from "../tokens";

/**
 * Prose: long-form reading typography for rendered Markdown (blog posts). The
 * `prose` class caps the column to the reading width and sets the base size and
 * relaxed leading; descendant element styles are attached with `globalStyle`
 * so they reach the generated Markdown DOM the way the reference's scoped
 * `:global(...)` rules did. Links underline in brand-blue with a soft
 * underline colour; code and pre use the sunken surface. All colours come from
 * the typed contract.
 */
export const prose = style({
  maxWidth: layout.proseMax,
  color: vars.roles.fg.base,
  fontSize: textSize.lg,
  lineHeight: leading.relaxed,
});

globalStyle(
  `${prose} p, ${prose} ul, ${prose} ol, ${prose} blockquote, ${prose} pre, ${prose} table`,
  { marginBlock: space["5"] },
);

globalStyle(`${prose} h2`, {
  fontSize: textSize["2xl"],
  fontWeight: "600",
  marginBlock: `${space["12"]} ${space["4"]}`,
  color: vars.roles.fg.base,
});
globalStyle(`${prose} h3`, {
  fontSize: textSize.xl,
  fontWeight: "600",
  marginBlock: `${space["8"]} ${space["3"]}`,
  color: vars.roles.fg.base,
});

globalStyle(`${prose} a`, {
  color: vars.roles.brand.primary,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  textDecorationColor: vars.roles.brand.primaryBorder,
  transition: "text-decoration-color var(--duration-base) var(--ease-standard)",
});
globalStyle(`${prose} a:hover`, {
  textDecorationColor: vars.roles.brand.primary,
});

globalStyle(`${prose} strong`, {
  fontWeight: "600",
  color: vars.roles.fg.base,
});

globalStyle(`${prose} ul, ${prose} ol`, {
  paddingInlineStart: space["6"],
});
globalStyle(`${prose} li`, { marginBlock: space["2"] });
globalStyle(`${prose} li::marker`, { color: vars.roles.fg.faint });

globalStyle(`${prose} blockquote`, {
  paddingInlineStart: space["5"],
  borderInlineStart: `3px solid ${vars.roles.accent}`,
  color: vars.roles.fg.muted,
  fontStyle: "italic",
});

globalStyle(`${prose} code`, {
  fontFamily: font.mono,
  fontSize: "0.86em",
  padding: "0.12em 0.4em",
  borderRadius: radius.sm,
  background: vars.roles.bg.sunken,
  border: `1px solid ${vars.roles.border.subtle}`,
  color: vars.roles.fg.base,
});
globalStyle(`${prose} pre`, {
  padding: space["5"],
  borderRadius: radius.lg,
  background: vars.roles.bg.sunken,
  border: `1px solid ${vars.roles.border.base}`,
  overflowX: "auto",
  fontSize: textSize.sm,
  lineHeight: leading.snug,
});
globalStyle(`${prose} pre code`, {
  padding: 0,
  border: 0,
  background: "transparent",
});

globalStyle(`${prose} .shiki`, {
  background: `${vars.roles.bg.sunken} !important`,
});
globalStyle(`${prose} .shiki span`, {
  background: "transparent !important",
});
globalStyle(`${prose} .shiki, ${prose} .shiki span`, {
  "@media": {
    "(prefers-color-scheme: dark)": {
      color: "var(--shiki-dark) !important",
    },
  },
});

globalStyle(`${prose} hr`, {
  marginBlock: space["10"],
  border: 0,
  borderTop: `1px solid ${vars.roles.border.base}`,
});

globalStyle(`${prose} img`, {
  borderRadius: radius.lg,
  border: `1px solid ${vars.roles.border.base}`,
});

globalStyle(`${prose} table`, {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: textSize.md,
});
globalStyle(`${prose} th, ${prose} td`, {
  textAlign: "left",
  padding: `${space["3"]} ${space["4"]}`,
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
});
globalStyle(`${prose} th`, {
  color: vars.roles.fg.subtle,
  fontWeight: "600",
  fontSize: textSize.sm,
});
