import { style } from "@vanilla-extract/css";

/**
 * STRUCTURAL ONLY. This is a headless layout primitive: it ports the grid,
 * responsive reflow and drawer/scrim mechanics from a conventional dashboard
 * shell but carries no colour, border, background or shadow. Skins apply those
 * in `exemplars/DashboardShell`.
 *
 * Tunable dimensions are read from CSS custom properties (with fallbacks) so a
 * skin or consumer can retune the shell without forking these rules:
 *   --ds-navbar-h      top navbar height            (default 3.875rem)
 *   --ds-bottombar-h   mobile bottom bar height     (default 4.75rem)
 *   --ds-sidebar-w     desktop sidebar column width (default 15.75rem)
 *   --ds-drawer-w      mobile drawer width          (default 17.875rem)
 *   --ds-drawer-duration / --ds-drawer-ease   slide + fade timing
 */

const NAV_H = "var(--ds-navbar-h, 3.875rem)";
const BOTTOM_H = "var(--ds-bottombar-h, 4.75rem)";
const SIDEBAR_W = "var(--ds-sidebar-w, 15.75rem)";
const DRAWER_W = "var(--ds-drawer-w, 17.875rem)";
const DRAWER_TRANSITION = "var(--ds-drawer-duration, 280ms) var(--ds-drawer-ease, ease)";

// Media queries cannot read CSS custom properties, so the breakpoint is a fixed
// module constant. Default matches the conventional desktop/mobile split.
const MOBILE = "screen and (max-width: 1023.98px)";
const DESKTOP = "screen and (min-width: 1024px)";

// Explicit stacking order: scrim < drawer < bottomBar < navbar.
const zLayers = {
  scrim: 43,
  drawer: 44,
  bottomBar: 45,
  navbar: 50,
} as const;

/** Outermost element. 100dvh + hidden so the page never scrolls past the UI. */
export const root = style({
  height: "100dvh",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: `${NAV_H} 1fr`,
  gridTemplateAreas: '"bar" "main"',
  "@media": {
    [DESKTOP]: {
      gridTemplateColumns: `${SIDEBAR_W} 1fr`,
      gridTemplateAreas: '"side bar" "side main"',
    },
  },
});

/** Sidebar: desktop = static grid column; mobile = fixed transform drawer. */
export const sidebar = style({
  gridArea: "side",
  display: "flex",
  flexDirection: "column",
  "@media": {
    [MOBILE]: {
      position: "fixed",
      top: NAV_H,
      left: 0,
      bottom: BOTTOM_H,
      width: DRAWER_W,
      zIndex: zLayers.drawer,
      overflowY: "auto",
      transform: "translateX(-105%)",
      transition: `transform ${DRAWER_TRANSITION}`,
    },
  },
});

/** Applied to the sidebar via classList when the drawer is open: slides it in (mobile). */
export const sidebarOpen = style({
  "@media": {
    [MOBILE]: { transform: "translateX(0)" },
  },
});

/** Top navbar grid area, above the drawer on mobile. */
export const navbar = style({
  gridArea: "bar",
  display: "flex",
  alignItems: "center",
  zIndex: zLayers.navbar,
});

/** Hamburger trigger - mobile only. */
export const hamburger = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "none",
  cursor: "pointer",
  "@media": {
    [DESKTOP]: { display: "none" },
  },
});

/*
 * In-drawer close/toggle button. Sits at the bottom of the sidebar so the
 * thumb can reach it without stretching to the navbar hamburger. Hidden on
 * desktop because the sidebar is a static column there, not a drawer.
 */
export const drawerToggle = style({
  display: "none",
  "@media": {
    [MOBILE]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      cursor: "pointer",
    },
  },
});

/** Main scroll region - the only scrollable area. */
export const main = style({
  gridArea: "main",
  overflowY: "auto",
  "@media": {
    [MOBILE]: { paddingBottom: BOTTOM_H },
  },
});

/**
 * Mobile scrim - dims the band between navbar and bottom bar.
 *
 * Stays mounted and fades via `opacity` (paired with `scrimOpen`) so the dim
 * crossfades in step with the drawer slide instead of popping. While closed it
 * is `opacity: 0` + `pointer-events: none`, so it never intercepts taps.
 */
export const scrim = style({
  display: "none",
  "@media": {
    [MOBILE]: {
      display: "block",
      position: "fixed",
      top: NAV_H,
      left: 0,
      right: 0,
      bottom: BOTTOM_H,
      zIndex: zLayers.scrim,
      opacity: 0,
      pointerEvents: "none",
      transition: `opacity ${DRAWER_TRANSITION}`,
    },
  },
});

/** Applied to the scrim via classList when the drawer is open; fades it in. */
export const scrimOpen = style({
  "@media": {
    [MOBILE]: {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});

/** Mobile bottom tab bar - fixed, above the drawer. */
export const bottomBar = style({
  display: "none",
  "@media": {
    [MOBILE]: {
      display: "flex",
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      height: BOTTOM_H,
      zIndex: zLayers.bottomBar,
    },
  },
});

/** A single tappable tab button in the mobile bottom bar. */
export const bottomTab = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
});

/** Active mobile tab marker (structural hook; skin supplies the accent). */
export const bottomTabActive = style({});

/** Generic nav row in the sidebar. */
export const navItem = style({
  appearance: "none",
  width: "100%",
  display: "flex",
  alignItems: "center",
  background: "transparent",
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
});

/** Active nav row marker (structural hook; skin supplies the accent). */
export const navItemActive = style({});
