import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, radius, space, textSize, tracking } from "../tokens";

/**
 * Site header: a sticky, lightly-translucent bar over a blurred backdrop. Brand
 * lockup on the left, horizontal nav pushed to the right, and a square theme
 * toggle. The active nav link reads as brand-blue on a brand-subtle pill.
 *
 * Below `760px` the inline nav gives way to a slide-in sheet (the `navToggle` /
 * navSheet / navBackdrop / navIndex pieces): a right-hand sheet over a dimmed
 * backdrop, mono index numbers beside large links, theme toggle pinned at the
 * foot. The consuming app wires the open/close state and `prefers-reduced-motion`
 * is respected by keeping the transitions on `--ease-reveal`.
 *
 * Colours come from the typed contract; the translucent bar uses color-mix on
 * the app-bg role so it stays correct in both themes.
 */
export const siteHeader = style({
  position: "sticky",
  top: 0,
  zIndex: 40,
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
  // The frosted bar lives on a ::before layer rather than on the header itself.
  // `backdrop-filter` would make the header the containing block for its fixed
  // children, trapping the mobile backdrop/sheet inside the thin header strip.
  // Keeping the filter off the header lets the overlay cover the full viewport.
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    background: `color-mix(in srgb, ${vars.roles.bg.app} 86%, transparent)`,
    backdropFilter: "saturate(140%) blur(8px)",
  },
});

export const headerInner = style({
  maxWidth: "72rem",
  marginInline: "auto",
  padding: `${space["3"]} ${space["6"]}`,
  display: "flex",
  alignItems: "center",
  gap: space["6"],
});

export const brand = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space["3"],
  flexShrink: 0,
  whiteSpace: "nowrap",
  fontWeight: "600",
  letterSpacing: tracking.tight,
  color: vars.roles.fg.base,
  textDecoration: "none",
});

export const brandMark = style({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: "30px",
  height: "30px",
  borderRadius: radius.md,
  background: vars.roles.brand.primary,
  color: vars.roles.brand.onPrimary,
  fontFamily: font.mono,
  fontSize: textSize.xs,
  fontWeight: "600",
  letterSpacing: "0.02em",
});

export const brandName = style({
  fontSize: textSize.md,
  "@media": {
    "screen and (max-width: 760px)": { display: "none" },
  },
});

export const nav = style({
  marginInlineStart: "auto",
  "@media": {
    "screen and (max-width: 760px)": { display: "none" },
  },
});

export const navList = style({
  listStyle: "none",
  display: "flex",
  alignItems: "center",
  gap: space["1"],
});

export const navLink = style({
  display: "inline-flex",
  alignItems: "center",
  height: "36px",
  paddingInline: space["3"],
  borderRadius: radius.md,
  fontSize: textSize.sm,
  fontWeight: "500",
  color: vars.roles.fg.muted,
  textDecoration: "none",
  transition:
    "color var(--duration-base) var(--ease-standard), background-color var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": { color: vars.roles.fg.base, background: vars.roles.bg.hover },
    "&:focus-visible": {
      outline: `2px solid ${vars.roles.brand.ring}`,
      outlineOffset: "2px",
    },
    '&[aria-current="page"]': {
      color: vars.roles.brand.primary,
      background: vars.roles.brand.primarySubtle,
    },
  },
});

export const headerActions = style({
  display: "flex",
  alignItems: "center",
  gap: space["2"],
});

/** The square light/dark toggle button (also the only client island). */
export const themeToggle = style({
  display: "inline-grid",
  placeItems: "center",
  width: "44px",
  height: "44px",
  borderRadius: radius.md,
  border: `1px solid ${vars.roles.border.base}`,
  background: vars.roles.bg.surface,
  color: vars.roles.fg.muted,
  cursor: "pointer",
  transition:
    "color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard), background-color var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": {
      color: vars.roles.fg.base,
      borderColor: vars.roles.border.strong,
      background: vars.roles.bg.hover,
    },
  },
});

// ---------------------------------------------------------------------------
// Mobile slide-in sheet (shown < 760px; open/close state owned by the app)
// ---------------------------------------------------------------------------

/**
 * The hamburger opener; hidden on desktop. Closing is handled inside the sheet
 * (the close button or the backdrop), so this control only ever opens.
 */
export const navToggle = style({
  display: "none",
  marginInlineStart: "auto",
  placeItems: "center",
  width: "44px",
  height: "44px",
  borderRadius: radius.md,
  border: `1px solid ${vars.roles.border.base}`,
  background: vars.roles.bg.surface,
  color: vars.roles.fg.base,
  cursor: "pointer",
  "@media": {
    "screen and (max-width: 760px)": { display: "inline-grid" },
  },
});

/**
 * Viewport-sized overlay layer that hosts the backdrop and sheet. It clips its
 * children (`overflow: hidden`), so the sheet parked off-screen at
 * `translateX(100%)` never widens the document or triggers a horizontal
 * scrollbar. It is itself click-through (`pointer-events: none`); the backdrop
 * and sheet re-enable pointer events. Only present below the breakpoint.
 */
export const navOverlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "none",
  overflow: "hidden",
  pointerEvents: "none",
  "@media": {
    "screen and (max-width: 760px)": { display: "block" },
  },
});

/**
 * Dimmed backdrop behind the sheet. Always present so it can fade; it is inert
 * (hidden, non-interactive) until `data-open="true"`. Sized to the overlay.
 */
export const navBackdrop = style({
  position: "absolute",
  inset: 0,
  background: `color-mix(in srgb, ${vars.roles.fg.base} 45%, transparent)`,
  backdropFilter: "blur(2px)",
  border: "none",
  opacity: 0,
  visibility: "hidden",
  cursor: "pointer",
  pointerEvents: "auto",
  transition:
    "opacity var(--duration-base) var(--ease-standard), visibility var(--duration-base) var(--ease-standard)",
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
  selectors: {
    '&[data-open="true"]': { opacity: 1, visibility: "visible" },
  },
});

/**
 * Right-hand sheet panel, positioned within the clipping overlay. Always
 * present and parked off-screen; it slides in on the `reveal` easing when
 * `data-open="true"`. The overlay's `overflow: hidden` hides it when closed.
 */
export const navSheet = style({
  position: "absolute",
  top: 0,
  right: 0,
  height: "100%",
  width: "min(82vw, 20rem)",
  display: "flex",
  flexDirection: "column",
  gap: space["1"],
  padding: space["6"],
  background: vars.roles.bg.surface,
  borderLeft: `1px solid ${vars.roles.border.base}`,
  boxShadow: `-24px 0 60px color-mix(in srgb, ${vars.roles.fg.base} 18%, transparent)`,
  transform: "translateX(100%)",
  visibility: "hidden",
  pointerEvents: "auto",
  transition:
    "transform var(--duration-slow) var(--ease-reveal), visibility var(--duration-slow) var(--ease-reveal)",
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
  selectors: {
    '&[data-open="true"]': { transform: "translateX(0)", visibility: "visible" },
  },
});

/** Header row inside the sheet: a mono label and the close button. */
export const navSheetHead = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: space["2"],
});

export const navSheetTitle = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  textTransform: "uppercase",
  letterSpacing: tracking.kicker,
  color: vars.roles.fg.faint,
});

/** Square close button pinned in the sheet header. */
export const navSheetClose = style({
  display: "inline-grid",
  placeItems: "center",
  width: "40px",
  height: "40px",
  borderRadius: radius.md,
  border: `1px solid ${vars.roles.border.base}`,
  background: vars.roles.bg.surface,
  color: vars.roles.fg.base,
  cursor: "pointer",
  transition:
    "color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard), background-color var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": {
      borderColor: vars.roles.border.strong,
      background: vars.roles.bg.hover,
    },
  },
});

/** Mono index number ("01".."06") beside each sheet link. */
export const navIndex = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  letterSpacing: tracking.caps,
  color: vars.roles.fg.faint,
});

/** A large link row inside the sheet. */
export const navSheetLink = style({
  display: "flex",
  alignItems: "baseline",
  gap: space["3"],
  paddingBlock: space["3"],
  fontSize: textSize.lg,
  fontWeight: "500",
  color: vars.roles.fg.base,
  textDecoration: "none",
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
  selectors: {
    '&[aria-current="page"]': { color: vars.roles.brand.primary },
  },
});
