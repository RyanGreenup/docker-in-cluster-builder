import { globalStyle, keyframes, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { ease, font, fontWeight, radius, space, textSize, tracking } from "../tokens";

/**
 * Resume identity card -- the header block at the top of the CV page.
 *
 * Grid-pattern bleed on the ::before layer (masked radial, pointer-events off).
 * Colours come from the typed contract so the card themes automatically.
 * The ping keyframe is local to this recipe and not exported.
 */

const ping = keyframes({
  "0%": { transform: "scale(1)", opacity: "0.6" },
  "80%, 100%": { transform: "scale(2.6)", opacity: "0" },
});

// ---- Outer card shell -------------------------------------------------------

export const identCard = style({
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${vars.roles.border.strong}`,
  borderRadius: radius["2xl"],
  background: vars.roles.bg.raised,
  padding: `${space["8"]} ${space["8"]} ${space["6"]}`,
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: [
      `linear-gradient(${vars.roles.border.base} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${vars.roles.border.base} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: "28px 28px",
    WebkitMaskImage: "radial-gradient(120% 90% at 88% 0%, #000 0%, transparent 62%)",
    maskImage: "radial-gradient(120% 90% at 88% 0%, #000 0%, transparent 62%)",
    opacity: 0.7,
    pointerEvents: "none",
  },
});

// ---- Top row (id block + actions) ------------------------------------------

export const identTop = style({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: space["6"],
  flexWrap: "wrap",
});

export const identId = style({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  gap: space["5"],
  minWidth: 0,
});

// ---- Avatar -----------------------------------------------------------------

export const identPhoto = style({
  flexShrink: 0,
  width: "84px",
  height: "84px",
  borderRadius: radius.xl,
  objectFit: "cover",
  border: `1px solid ${vars.roles.border.strong}`,
  boxShadow: `0 1px 2px color-mix(in srgb, ${vars.roles.fg.base} 12%, transparent)`,
});

export const identPhotoFallback = style({
  flexShrink: 0,
  width: "84px",
  height: "84px",
  borderRadius: radius.xl,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: vars.roles.brand.primarySubtle,
  color: vars.roles.brand.primary,
  fontFamily: font.mono,
  fontSize: textSize["2xl"],
  fontWeight: fontWeight.semibold,
});

// ---- Text block (kicker / name / tagline / status) -------------------------

export const identLines = style({
  position: "relative",
  minWidth: 0,
});

export const identKicker = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space["2"],
  fontFamily: font.mono,
  fontSize: textSize.xs,
  fontWeight: fontWeight.medium,
  textTransform: "uppercase",
  letterSpacing: tracking.kicker,
  color: vars.roles.brand.primary,
});

export const identName = style({
  marginTop: space["2"],
  fontSize: textSize["4xl"],
  lineHeight: "1.02",
  color: vars.roles.fg.base,
});

export const identTagline = style({
  marginTop: space["3"],
  fontSize: textSize.xl,
  color: vars.roles.fg.muted,
  maxWidth: "30ch",
});

export const identStatusBadge = style({
  marginTop: space["4"],
  display: "inline-flex",
  alignItems: "center",
  gap: space["2"],
  padding: `6px ${space["3"]}`,
  borderRadius: radius.pill,
  background: vars.status.success.bg,
  border: `1px solid ${vars.status.success.border}`,
  color: vars.status.success.fg,
  fontFamily: font.mono,
  fontSize: textSize.xs,
  letterSpacing: tracking.wide,
});

export const identPulse = style({
  position: "relative",
  width: "8px",
  height: "8px",
  borderRadius: radius.pill,
  background: vars.status.success.base,
  "::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background: vars.status.success.base,
    animation: `${ping} 1.9s ${ease.standard} infinite`,
  },
});

// ---- Actions column (download + clock) --------------------------------------

export const identActions = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: space["3"],
});

export const identClock = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.faint,
  letterSpacing: tracking.wide,
  textAlign: "right",
});

globalStyle(`${identClock} b`, {
  color: vars.roles.fg.muted,
  fontWeight: fontWeight.medium,
});

// ---- Contact strip ----------------------------------------------------------

export const identContact = style({
  position: "relative",
  marginTop: space["6"],
  paddingTop: space["5"],
  borderTop: `1px solid ${vars.roles.border.base}`,
  display: "flex",
  flexWrap: "wrap",
  gap: `${space["2"]} ${space["5"]}`,
  fontFamily: font.mono,
  fontSize: textSize.sm,
  color: vars.roles.fg.subtle,
});

export const identContactLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space["2"],
  color: vars.roles.fg.muted,
  transition: `color 200ms ${ease.standard}`,
  selectors: {
    "&:hover": {
      color: vars.roles.brand.primary,
    },
  },
});

globalStyle(`${identContactLink} svg`, {
  color: vars.roles.fg.faint,
});

globalStyle(`${identContactLink}:hover svg`, {
  color: vars.roles.brand.primary,
});
