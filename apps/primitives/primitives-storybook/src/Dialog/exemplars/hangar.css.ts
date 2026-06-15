import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// SKIN · HANGAR — stark industrial deployment-console dialog.
// Cool graphite panels, hairline steel grid, acid-green signal accent, with a
// danger-red mode for destructive confirms. The headless Dialog primitive is
// themed exclusively through its [data-part] hooks + corvu data-open/closed.
//
// PORTAL SCOPING: Dialog.Portal renders Overlay/Content at <body>, so a parent
// wrapper cannot scope them. The scope class `hangarDialog` is passed directly
// to Overlay/Content, and selectors put the class ON the element itself:
//   .hangarDialog[data-part="dialog-overlay"] …
//   .hangarDialog[data-part="dialog-content"] …

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
const DANGER = "#ff5a4d";
const DANGER_DK = "#2a1110";

// ---------------------------------------------------------------- scope class
// This single class is passed to BOTH Overlay and Content. It carries no box
// styling of its own (each [data-part] selector below targets the right node).
export const hangarDialog = style({});

// ---------------------------------------------------------------- animations
const overlayIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const overlayOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const contentIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -46%) scale(.97)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});
const contentOut = keyframes({
  from: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  to: { opacity: 0, transform: "translate(-50%, -48%) scale(.98)" },
});
const sweep = keyframes({
  from: { backgroundPosition: "0 0" },
  to: { backgroundPosition: "0 -200px" },
});

// ---------------------------------------------------------------- overlay
globalStyle(`.${hangarDialog}[data-part="dialog-overlay"]`, {
  background: "rgba(4,6,8,.74)",
  backdropFilter: "blur(2px)",
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 4px)",
  animation: `${overlayIn} .18s ease-out, ${sweep} 8s linear infinite`,
});
globalStyle(`.${hangarDialog}[data-part="dialog-overlay"][data-closed]`, {
  animation: `${overlayOut} .16s ease-in forwards`,
});

// ---------------------------------------------------------------- content
globalStyle(`.${hangarDialog}[data-part="dialog-content"]`, {
  fontFamily: SANS,
  background: PANEL,
  color: INK,
  border: `1px solid ${HAIR_HI}`,
  borderRadius: 0,
  padding: 0,
  width: "min(92vw, 30rem)",
  maxHeight: "min(86vh, 44rem)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 0 0 1px #000, 0 0 0 4px rgba(198,242,78,.06), 0 40px 80px -24px rgba(0,0,0,.85)",
  animation: `${contentIn} .2s cubic-bezier(.2,.9,.3,1)`,
});
globalStyle(`.${hangarDialog}[data-part="dialog-content"][data-closed]`, {
  animation: `${contentOut} .16s ease-in forwards`,
});
// signal hairline along the top edge
globalStyle(`.${hangarDialog}[data-part="dialog-content"]::before`, {
  content: '""',
  position: "absolute",
  insetInline: 0,
  top: 0,
  height: "2px",
  background: SIGNAL,
  zIndex: 2,
});
// alertdialog variant flips the accent to danger-red
globalStyle(`.${hangarDialog}[data-part="dialog-content"][role="alertdialog"]::before`, {
  background: DANGER,
});
globalStyle(`.${hangarDialog}[data-part="dialog-content"][role="alertdialog"]`, {
  boxShadow: "0 0 0 1px #000, 0 0 0 4px rgba(255,90,77,.08), 0 40px 80px -24px rgba(0,0,0,.85)",
});

// ---------------------------------------------------------------- label (h2)
globalStyle(`.${hangarDialog}[data-part="dialog-label"]`, {
  margin: 0,
  fontFamily: MONO,
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: INK,
});

// ---------------------------------------------------------------- description
globalStyle(`.${hangarDialog}[data-part="dialog-description"]`, {
  margin: 0,
  fontSize: "13.5px",
  lineHeight: 1.55,
  color: MUTE,
});

// ---------------------------------------------------------------- close (X)
globalStyle(`.${hangarDialog}[data-part="dialog-close"]`, {
  appearance: "none",
  background: PANEL_HI,
  color: MUTE,
  border: `1px solid ${HAIR}`,
  borderRadius: 0,
  fontFamily: MONO,
  fontSize: "11px",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  padding: "8px 14px",
  cursor: "pointer",
  transition: "background .12s, color .12s, border-color .12s",
});
globalStyle(`.${hangarDialog}[data-part="dialog-close"]:hover`, {
  background: PANEL,
  color: INK,
  borderColor: HAIR_HI,
});
globalStyle(`.${hangarDialog}[data-part="dialog-close"]:focus-visible`, {
  outline: `2px solid ${SIGNAL}`,
  outlineOffset: "2px",
});

// ================================================================ trigger
// (rendered inline, not portalled — scope via the wrapper in the story)
export const trigger = style({
  appearance: "none",
  background: "transparent",
  color: SIGNAL,
  border: `1px solid ${HAIR_HI}`,
  borderRadius: 0,
  fontFamily: MONO,
  fontSize: "12px",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  padding: "10px 18px",
  cursor: "pointer",
  position: "relative",
  transition: "background .12s, color .12s, box-shadow .12s",
  selectors: {
    "&:hover": {
      background: SIGNAL,
      color: VOID,
      boxShadow: `0 0 0 1px ${SIGNAL}, 0 0 24px -6px ${SIGNAL}`,
    },
    "&:focus-visible": { outline: `2px solid ${SIGNAL}`, outlineOffset: "2px" },
  },
});
export const triggerDanger = style({
  color: DANGER,
  selectors: {
    "&:hover": {
      background: DANGER,
      color: VOID,
      boxShadow: `0 0 0 1px ${DANGER}, 0 0 24px -6px ${DANGER}`,
    },
  },
});

// ================================================================ composition
// header / body / footer helper classes used inside Dialog.Content
export const head = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: "12px",
  padding: "16px 20px",
  background: VOID,
  borderBottom: `1px solid ${HAIR}`,
});
export const headMeta = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  minWidth: 0,
});
export const kicker = style({
  fontFamily: MONO,
  fontSize: "9.5px",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: SIGNAL,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
});
globalStyle(`${kicker}::before`, {
  content: '""',
  width: "6px",
  height: "6px",
  background: SIGNAL,
  boxShadow: `0 0 6px ${SIGNAL}`,
});
export const kickerDanger = style({ color: DANGER });
globalStyle(`${kickerDanger}::before`, { background: DANGER, boxShadow: `0 0 6px ${DANGER}` });

export const body = style({
  padding: "18px 20px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  overflowY: "auto",
  minHeight: 0,
});
// scanline scrollbar
globalStyle(`${body}`, { scrollbarColor: `${HAIR_HI} ${PANEL}`, scrollbarWidth: "thin" });

export const foot = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "10px",
  padding: "14px 20px",
  background: VOID,
  borderTop: `1px solid ${HAIR}`,
});
export const footSpread = style({ justifyContent: "space-between" });

// primary action button (acid signal) + danger variant
export const action = style({
  appearance: "none",
  background: SIGNAL,
  color: VOID,
  border: `1px solid ${SIGNAL}`,
  borderRadius: 0,
  fontFamily: MONO,
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  padding: "9px 16px",
  cursor: "pointer",
  transition: "filter .12s, box-shadow .12s",
  selectors: {
    "&:hover": { filter: "brightness(1.08)", boxShadow: `0 0 22px -6px ${SIGNAL}` },
    "&:focus-visible": { outline: `2px solid ${SIGNAL}`, outlineOffset: "2px" },
  },
});
export const actionDanger = style({
  background: DANGER,
  borderColor: DANGER,
  color: VOID,
  selectors: {
    "&:hover": { boxShadow: `0 0 22px -6px ${DANGER}` },
    "&:focus-visible": { outline: `2px solid ${DANGER}` },
  },
});

// ---- metric strip (status panel inside body) ----
export const metrics = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1px",
  background: HAIR,
  border: `1px solid ${HAIR}`,
});
export const metric = style({
  background: PANEL_HI,
  padding: "10px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});
globalStyle(`${metric} span`, {
  fontFamily: MONO,
  fontSize: "9px",
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: FAINT,
});
globalStyle(`${metric} b`, {
  fontFamily: MONO,
  fontSize: "15px",
  fontWeight: 500,
  color: INK,
  fontVariantNumeric: "tabular-nums",
});
globalStyle(`${metric} b[data-signal]`, { color: SIGNAL });
globalStyle(`${metric} b[data-danger]`, { color: DANGER });

// callout (warning panel for destructive confirm)
export const callout = style({
  display: "flex",
  gap: "12px",
  padding: "12px 14px",
  background: DANGER_DK,
  border: `1px solid rgba(255,90,77,.4)`,
  fontSize: "13px",
  lineHeight: 1.5,
  color: "#f2c9c4",
});
globalStyle(`${callout} code`, {
  fontFamily: MONO,
  color: DANGER,
  fontSize: "12.5px",
});

// ---- form controls ----
export const field = style({ display: "flex", flexDirection: "column", gap: "7px" });
export const lbl = style({
  fontFamily: MONO,
  fontSize: "9.5px",
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: MUTE,
});
const controlBase = {
  appearance: "none" as const,
  background: VOID,
  color: INK,
  border: `1px solid ${HAIR_HI}`,
  borderRadius: 0,
  fontFamily: MONO,
  fontSize: "13px",
  padding: "10px 12px",
  width: "100%",
  transition: "border-color .12s, box-shadow .12s",
};
export const input = style({
  ...controlBase,
  selectors: {
    "&::placeholder": { color: FAINT },
    "&:focus": { outline: "none", borderColor: SIGNAL, boxShadow: `0 0 0 1px ${SIGNAL}` },
  },
});
export const select = style({
  ...controlBase,
  cursor: "pointer",
  backgroundImage:
    "linear-gradient(45deg, transparent 50%, #74858f 50%), linear-gradient(135deg, #74858f 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 16px) 50%, calc(100% - 11px) 50%",
  backgroundSize: "5px 5px, 5px 5px",
  backgroundRepeat: "no-repeat",
  paddingRight: "32px",
  selectors: {
    "&:focus": { outline: "none", borderColor: SIGNAL, boxShadow: `0 0 0 1px ${SIGNAL}` },
  },
});
export const fieldRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
});

// ---- run-log (long scroll demo) ----
export const log = style({
  fontFamily: MONO,
  fontSize: "12px",
  lineHeight: 1.7,
  background: VOID,
  border: `1px solid ${HAIR}`,
  padding: "12px 14px",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});
export const logLine = style({
  display: "grid",
  gridTemplateColumns: "auto auto 1fr",
  gap: "12px",
  color: MUTE,
  whiteSpace: "nowrap",
});
globalStyle(`${logLine} time`, { color: FAINT, fontVariantNumeric: "tabular-nums" });
globalStyle(`${logLine}[data-lvl="ok"] em`, { color: SIGNAL, fontStyle: "normal" });
globalStyle(`${logLine}[data-lvl="warn"] em`, { color: "#f5c542", fontStyle: "normal" });
globalStyle(`${logLine}[data-lvl="err"] em`, { color: DANGER, fontStyle: "normal" });
globalStyle(`${logLine} span`, { color: INK, whiteSpace: "normal" });

// embedded calendar host inside the date-picker dialog
export const calHost = style({
  border: `1px solid ${HAIR}`,
  background: VOID,
});
