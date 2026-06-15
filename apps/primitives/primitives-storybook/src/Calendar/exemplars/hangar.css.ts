import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// SKIN · HANGAR — stark industrial ops-console calendar.
// Cool graphite panels, hairline steel grid, one acid-green signal accent.
// Everything is scoped under the `.hangarCal` wrapper so it never leaks into
// sibling stories; the headless Calendar primitive is themed exclusively via
// its [data-part] + corvu state attributes (data-selected/in-range/today…).

const MONO = "'DM Mono', 'JetBrains Mono', monospace";
const SANS = "'IBM Plex Sans', system-ui, sans-serif";

// palette
const VOID = "#0a0c0e";
const PANEL = "#101417";
const PANEL_HI = "#161b1f";
const HAIR = "#222a30";
const HAIR_HI = "#2f3a42";
const INK = "#e4ebef";
const MUTE = "#74858f";
const FAINT = "#475158";
const SIGNAL = "#c6f24e"; // acid-green
const SIGNAL_DK = "#1f2a10";

const flicker = keyframes({
  "0%,100%": { opacity: 1 },
  "50%": { opacity: 0.55 },
});

export const hangarCal = style({
  fontFamily: SANS,
  background: VOID,
  color: INK,
  border: `1px solid ${HAIR_HI}`,
  padding: "0",
  width: "fit-content",
  position: "relative",
  boxShadow: "0 0 0 1px #000, 0 30px 60px -20px rgba(0,0,0,.8)",
  backgroundImage: `linear-gradient(${PANEL} 0 0)`,
});

// bracket corner ticks — precision-instrument framing
globalStyle(`${hangarCal}::before`, {
  content: '""',
  position: "absolute",
  top: "-1px",
  left: "-1px",
  width: "10px",
  height: "10px",
  borderTop: `2px solid ${SIGNAL}`,
  borderLeft: `2px solid ${SIGNAL}`,
  pointerEvents: "none",
});
globalStyle(`${hangarCal}::after`, {
  content: '""',
  position: "absolute",
  bottom: "-1px",
  right: "-1px",
  width: "10px",
  height: "10px",
  borderBottom: `2px solid ${SIGNAL}`,
  borderRight: `2px solid ${SIGNAL}`,
  pointerEvents: "none",
});

// ---- header / chrome (composed in the story) ----
export const calChrome = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  background: VOID,
  borderBottom: `1px solid ${HAIR}`,
  fontFamily: MONO,
  fontSize: "10.5px",
  letterSpacing: ".22em",
  textTransform: "uppercase",
  color: MUTE,
});
export const calTag = style({
  color: VOID,
  background: SIGNAL,
  fontWeight: 500,
  padding: "3px 8px",
  letterSpacing: ".18em",
});
export const calLive = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  color: SIGNAL,
  fontSize: "10px",
});
globalStyle(`${calLive}::before`, {
  content: '""',
  width: "6px",
  height: "6px",
  background: SIGNAL,
  borderRadius: "999px",
  boxShadow: `0 0 7px ${SIGNAL}`,
  animation: `${flicker} 1.6s steps(2) infinite`,
});

// row holding nav + month labels
export const calNavBar = style({
  display: "flex",
  alignItems: "stretch",
  borderBottom: `1px solid ${HAIR}`,
});
export const calMonths = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  fontFamily: MONO,
  fontSize: "12px",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: INK,
});
export const calTables = style({
  display: "flex",
  gap: "1px",
  background: HAIR,
  padding: "14px",
  paddingTop: "12px",
});
export const calCol = style({ background: PANEL, padding: "0 4px" });

// legend / footer for range readout
export const calFoot = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "10px 14px",
  borderTop: `1px solid ${HAIR}`,
  background: VOID,
  fontFamily: MONO,
  fontSize: "11px",
  letterSpacing: ".06em",
  color: MUTE,
});
globalStyle(`${calFoot} b`, {
  color: SIGNAL,
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",
});
export const calReadout = style({ color: INK, fontVariantNumeric: "tabular-nums" });

// ---- primitive theming ----

// nav buttons
globalStyle(`${hangarCal} [data-part="calendar-nav"]`, {
  appearance: "none",
  background: PANEL_HI,
  color: MUTE,
  border: "none",
  borderRight: `1px solid ${HAIR}`,
  borderLeft: `1px solid ${HAIR}`,
  fontFamily: MONO,
  fontSize: "14px",
  lineHeight: 1,
  width: "40px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background .12s, color .12s",
});
globalStyle(`${hangarCal} ${calMonths} + [data-part="calendar-nav"]`, {});
globalStyle(`${hangarCal} [data-part="calendar-nav"]:hover`, {
  background: SIGNAL,
  color: VOID,
});
globalStyle(`${hangarCal} [data-part="calendar-nav"]:focus-visible`, {
  outline: `2px solid ${SIGNAL}`,
  outlineOffset: "-2px",
});

// month label inside nav bar
globalStyle(`${hangarCal} [data-part="calendar-label"]`, {
  fontFamily: MONO,
  fontSize: "12px",
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: INK,
});

// table grid
globalStyle(`${hangarCal} [data-part="calendar-table"]`, {
  borderCollapse: "collapse",
  fontFamily: MONO,
});
globalStyle(`${hangarCal} [data-part="calendar-head-cell"]`, {
  color: FAINT,
  fontSize: "9.5px",
  fontWeight: 400,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  padding: "8px 0 10px",
  textAlign: "center",
  width: "38px",
});

globalStyle(`${hangarCal} [data-part="calendar-cell"]`, {
  padding: "1px",
  textAlign: "center",
});

// day buttons
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"]`, {
  appearance: "none",
  background: "transparent",
  color: INK,
  border: "1px solid transparent",
  width: "36px",
  height: "34px",
  fontFamily: MONO,
  fontSize: "12.5px",
  fontVariantNumeric: "tabular-nums",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background .1s, color .1s, border-color .1s",
});
// out-of-month days dim (corvu sets aria attrs; trigger month prop drives it)
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"][data-outside-month]`, {
  color: FAINT,
});
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"]:hover`, {
  background: PANEL_HI,
  borderColor: HAIR_HI,
});
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"]:focus-visible`, {
  outline: `2px solid ${SIGNAL}`,
  outlineOffset: "-2px",
});

// today — bracketed marker
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"][data-today]`, {
  color: SIGNAL,
  borderColor: HAIR_HI,
  position: "relative",
});
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"][data-today]::after`, {
  content: '""',
  position: "absolute",
  bottom: "4px",
  width: "4px",
  height: "4px",
  background: SIGNAL,
  borderRadius: "999px",
  boxShadow: `0 0 5px ${SIGNAL}`,
});

// in-range band
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"][data-in-range]`, {
  background: SIGNAL_DK,
  color: SIGNAL,
  borderColor: "transparent",
});

// selected / range endpoints — hard acid-green fill
globalStyle(
  `${hangarCal} [data-part="calendar-cell-trigger"][data-selected],
   ${hangarCal} [data-part="calendar-cell-trigger"][data-range-start],
   ${hangarCal} [data-part="calendar-cell-trigger"][data-range-end]`,
  {
    background: SIGNAL,
    color: VOID,
    fontWeight: 500,
    borderColor: SIGNAL,
  },
);
globalStyle(
  `${hangarCal} [data-part="calendar-cell-trigger"][data-range-start]::after,
   ${hangarCal} [data-part="calendar-cell-trigger"][data-range-end]::after`,
  { content: "none" },
);

// disabled
globalStyle(`${hangarCal} [data-part="calendar-cell-trigger"][data-disabled]`, {
  color: FAINT,
  opacity: 0.4,
  cursor: "not-allowed",
});
