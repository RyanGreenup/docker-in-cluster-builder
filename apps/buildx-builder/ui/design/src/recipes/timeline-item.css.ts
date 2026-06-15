import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, fontWeight, radius, space, textSize, tracking } from "../tokens";

/**
 * Experience timeline item for the CV / resume page. Renders a single job
 * entry: a dot+line rail on the left, period + optional tag at the top, role
 * title, org line, bullet list, and optional tech chips.
 *
 * The `reveal` scroll-animation wrapper is NOT part of this recipe -- it stays
 * as a page-level class so this recipe remains stateless.
 */

export const tlItem = style({
  position: "relative",
  paddingLeft: "2.5rem",
  selectors: {
    "&:not(:last-child)": {
      paddingBottom: space["8"],
    },
    // Dot
    "&::before": {
      content: "''",
      position: "absolute",
      left: "0",
      top: "4px",
      width: "15px",
      height: "15px",
      borderRadius: radius.pill,
      background: vars.roles.bg.raised,
      border: `3px solid ${vars.roles.brand.primaryBorder}`,
      zIndex: 1,
    },
    // Vertical line
    "&::after": {
      content: "''",
      position: "absolute",
      left: "7px",
      top: "18px",
      bottom: "-2px",
      width: "1.5px",
      background: vars.roles.border.base,
    },
    "&:last-child::after": {
      display: "none",
    },
  },
});

export const tlItemNow = style({
  selectors: {
    "&::before": {
      background: vars.roles.brand.primary,
      borderColor: vars.roles.brand.primary,
      boxShadow: `0 0 0 4px ${vars.roles.brand.primarySubtle}`,
    },
  },
});

export const tlTop = style({
  display: "flex",
  alignItems: "center",
  gap: space["3"],
  flexWrap: "wrap",
});

export const tlPeriod = style({
  fontFamily: font.mono,
  fontSize: textSize.sm,
  color: vars.roles.fg.faint,
  letterSpacing: tracking.wide,
});

export const tlTag = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  fontWeight: fontWeight.semibold,
  textTransform: "uppercase",
  letterSpacing: tracking.caps,
  color: vars.roles.brand.onPrimary,
  background: vars.roles.brand.primary,
  padding: "2px 8px",
  borderRadius: radius.sm,
});

export const tlTagAccent = style({
  background: vars.roles.brand.primary,
});

export const tlRole = style({
  marginTop: space["2"],
  fontSize: textSize.xl,
  fontWeight: fontWeight.semibold,
  color: vars.roles.fg.base,
});

export const tlOrg = style({
  marginTop: "2px",
  fontSize: textSize.md,
  color: vars.roles.fg.muted,
});

globalStyle(`${tlOrg} b`, {
  color: vars.roles.fg.base,
  fontWeight: fontWeight.medium,
});

export const tlPoints = style({
  listStyle: "none",
  marginTop: space["4"],
  display: "flex",
  flexDirection: "column",
  gap: space["2"],
});

globalStyle(`${tlPoints} li`, {
  position: "relative",
  paddingLeft: "1.25rem",
  color: vars.roles.fg.muted,
  maxWidth: "68ch",
  lineHeight: "1.6",
});

globalStyle(`${tlPoints} li::before`, {
  content: "''",
  position: "absolute",
  left: "2px",
  top: "0.62em",
  width: "5px",
  height: "5px",
  borderRadius: radius.pill,
  background: vars.roles.brand.primary,
});

globalStyle(`${tlPoints} .num`, {
  fontFamily: font.mono,
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.base,
  background: vars.roles.brand.primarySubtle,
  padding: "0 5px",
  borderRadius: radius.sm,
});

export const tlTech = style({
  display: "flex",
  flexWrap: "wrap",
  gap: space["2"],
  marginTop: space["3"],
});

// ---- Prior roles grid -------------------------------------------------------

export const tlPrior = style({
  marginTop: space["6"],
  paddingLeft: "2.5rem",
});

export const tlPriorGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: `${space["3"]} ${space["6"]}`,
  "@media": {
    "(max-width: 820px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const tlPriorRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: `${space["3"]} 0`,
  borderTop: `1px solid ${vars.roles.border.base}`,
});

export const tlPriorRole = style({
  fontSize: textSize.md,
  fontWeight: fontWeight.medium,
  color: vars.roles.fg.base,
});

export const tlPriorMeta = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.faint,
});

// ---- ol wrapper for the list ------------------------------------------------

export const tl = style({
  listStyle: "none",
});
