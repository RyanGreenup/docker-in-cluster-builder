import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, fontWeight, space, textSize, tracking } from "../tokens";

/**
 * CV / resume section divider. A numbered heading row -- mono section number,
 * bold title, a flex-grow rule, and an optional count label -- followed by an
 * arbitrary content slot. Used four times on the resume page (Summary,
 * Experience, Technical stack, Education).
 *
 * The `reveal` scroll-animation class is NOT part of this recipe; it stays as
 * a wrapper class applied by the Astro page so the recipe stays stateless.
 */
export const cvSection = style({
  marginTop: space["16"],
});

export const cvSectionHead = style({
  display: "flex",
  alignItems: "center",
  gap: space["3"],
  marginBottom: space["8"],
});

export const cvSectionNo = style({
  fontFamily: font.mono,
  fontSize: textSize.sm,
  fontWeight: fontWeight.medium,
  color: vars.roles.brand.primary,
  flexShrink: 0,
});

export const cvSectionTitle = style({
  margin: 0,
  fontSize: textSize["2xl"],
  fontWeight: fontWeight.semibold,
  color: vars.roles.fg.base,
  whiteSpace: "nowrap",
});

export const cvSectionRule = style({
  flex: 1,
  height: "1px",
  background: vars.roles.border.base,
});

export const cvSectionCount = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.faint,
  letterSpacing: tracking.wide,
  flexShrink: 0,
});

// Suppress the default browser margin on any heading placed directly inside the
// section head (defensive reset -- the component renders its own h2 via the
// recipe but a consumer might wrap a heading differently).
globalStyle(`${cvSectionHead} h2`, {
  margin: 0,
});
