import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// LUMIÈRE · DIALOG SKIN
// Warm editorial luxury-print. A high-end hotel / restaurant reservation feel:
// ivory paper, aubergine ink, a single terracotta-gold accent, fine hairline
// rules, Cormorant Garamond display + Newsreader body + Manrope eyebrows.
//
// Scoping: Dialog.Portal renders Content/Overlay at <body>, so we cannot rely on
// an ancestor wrapper. The scope classes below are placed DIRECTLY on
// Dialog.Overlay / Dialog.Content via their `class` prop, and every globalStyle
// targets `.lumiereOverlay` / `.lumiereDialog` as the element itself.

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Newsreader', Georgia, serif";
const LABEL = "'Manrope', system-ui, sans-serif";

const ivory = "#f6f0e6";
const paper = "#fbf7ef";
const ink = "#2a2230";
const inkSoft = "#6f6478";
const hairline = "#e2d8c8";
const accent = "#b06a4a"; // terracotta
const accentDeep = "#8c4f36";
const gold = "#c9a14a";

// ---------------------------------------------------------------- animation
const overlayIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
const overlayOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});
const contentIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -46%) scale(0.97)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});
const contentOut = keyframes({
  from: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  to: { opacity: 0, transform: "translate(-50%, -47%) scale(0.98)" },
});

// ---------------------------------------------------------------- trigger
// (not portalled — lives wherever the story places it)
export const trigger = style({
  fontFamily: LABEL,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: ivory,
  background: ink,
  border: "none",
  borderRadius: "999px",
  padding: "0.85rem 1.9rem",
  cursor: "pointer",
  transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
  boxShadow: "0 0.5rem 1.4rem rgba(42, 34, 48, 0.18)",
});
globalStyle(`${trigger}:hover`, {
  background: accentDeep,
  transform: "translateY(-1px)",
  boxShadow: "0 0.75rem 1.8rem rgba(140, 79, 54, 0.32)",
});
globalStyle(`${trigger}:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "3px",
});

// a softer, ghost variant trigger for secondary stories
export const triggerGhost = style({
  fontFamily: LABEL,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: ink,
  background: "transparent",
  border: `1px solid ${ink}`,
  borderRadius: "999px",
  padding: "0.8rem 1.85rem",
  cursor: "pointer",
  transition: "color 0.25s ease, background 0.25s ease, border-color 0.25s ease",
});
globalStyle(`${triggerGhost}:hover`, {
  background: ink,
  color: ivory,
});
globalStyle(`${triggerGhost}:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "3px",
});

// ---------------------------------------------------------------- overlay
export const overlay = style({});
globalStyle(`.${overlay}[data-part="dialog-overlay"]`, {
  background: "radial-gradient(circle at 50% 30%, rgba(58, 44, 38, 0.42), rgba(28, 22, 26, 0.66))",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
});
globalStyle(`.${overlay}[data-part="dialog-overlay"][data-open]`, {
  animation: `${overlayIn} 0.32s ease forwards`,
});
globalStyle(`.${overlay}[data-part="dialog-overlay"][data-closed]`, {
  animation: `${overlayOut} 0.26s ease forwards`,
});

// ---------------------------------------------------------------- content
export const dialog = style({});
const dlg = `.${dialog}[data-part="dialog-content"]`;

globalStyle(dlg, {
  fontFamily: BODY,
  color: ink,
  background: paper,
  backgroundImage: `linear-gradient(180deg, ${paper} 0%, ${ivory} 100%)`,
  width: "min(92vw, 32rem)",
  maxHeight: "min(86vh, 44rem)",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  border: `1px solid ${hairline}`,
  boxShadow: [
    "0 0.1rem 0 rgba(255,255,255,0.6) inset",
    "0 2.5rem 5rem -1rem rgba(36, 26, 30, 0.45)",
    "0 0 0 1px rgba(201, 161, 74, 0.12)",
  ].join(", "),
  padding: 0,
  overflow: "hidden",
});
globalStyle(`${dlg}[data-open]`, {
  animation: `${contentIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
});
globalStyle(`${dlg}[data-closed]`, {
  animation: `${contentOut} 0.28s ease forwards`,
});
// gold top hairline accent
globalStyle(`${dlg}::before`, {
  content: '""',
  position: "absolute",
  insetInline: 0,
  top: 0,
  height: "3px",
  background: `linear-gradient(90deg, transparent, ${gold} 30%, ${accent} 70%, transparent)`,
});

// ---- label (h2) ----
globalStyle(`${dlg} [data-part="dialog-label"]`, {
  fontFamily: DISPLAY,
  fontWeight: 500,
  fontSize: "2.1rem",
  lineHeight: 1.08,
  letterSpacing: "0.005em",
  color: ink,
  margin: "0 0 0.5rem",
});

// ---- description (p) ----
globalStyle(`${dlg} [data-part="dialog-description"]`, {
  fontFamily: BODY,
  fontSize: "1.02rem",
  lineHeight: 1.55,
  color: inkSoft,
  margin: 0,
});

// ---- close (button) ----
globalStyle(`${dlg} [data-part="dialog-close"]`, {
  position: "absolute",
  top: "1.1rem",
  right: "1.1rem",
  width: "2.1rem",
  height: "2.1rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  border: `1px solid ${hairline}`,
  background: "transparent",
  color: inkSoft,
  fontSize: "1.1rem",
  lineHeight: 1,
  cursor: "pointer",
  transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
  zIndex: 2,
});
globalStyle(`${dlg} [data-part="dialog-close"]:hover`, {
  color: accentDeep,
  borderColor: accent,
  background: "rgba(176, 106, 74, 0.08)",
  transform: "rotate(90deg)",
});
globalStyle(`${dlg} [data-part="dialog-close"]:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "2px",
});

// ---------------------------------------------------------------- composed regions
// (helper classes used in the story body, scoped under the dialog element)
export const eyebrow = style({});
globalStyle(`${dlg} .${eyebrow}`, {
  fontFamily: LABEL,
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: accentDeep,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  marginBottom: "1rem",
});
globalStyle(`${dlg} .${eyebrow}::after`, {
  content: '""',
  height: "1px",
  width: "2.4rem",
  background: `linear-gradient(90deg, ${accent}, transparent)`,
});

export const header = style({});
globalStyle(`${dlg} .${header}`, {
  padding: "2.6rem 2.6rem 1.4rem",
  position: "relative",
});

export const body = style({});
globalStyle(`${dlg} .${body}`, {
  padding: "0 2.6rem 1.4rem",
  overflowY: "auto",
  flex: 1,
  minHeight: 0,
});
// elegant thin scrollbar for the scrollable body
globalStyle(`${dlg} .${body}`, {
  scrollbarWidth: "thin",
  scrollbarColor: `${hairline} transparent`,
});

export const footer = style({});
globalStyle(`${dlg} .${footer}`, {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.9rem",
  padding: "1.4rem 2.6rem 2.2rem",
  borderTop: `1px solid ${hairline}`,
  background: "rgba(246, 240, 230, 0.6)",
});

// a hairline divider used inside bodies
export const rule = style({});
globalStyle(`${dlg} .${rule}`, {
  height: "1px",
  background: hairline,
  border: "none",
  margin: "1.6rem 0",
});

// ---------------------------------------------------------------- buttons (footer)
export const btnPrimary = style({});
globalStyle(`${dlg} .${btnPrimary}`, {
  fontFamily: LABEL,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: ivory,
  background: ink,
  border: "none",
  borderRadius: "999px",
  padding: "0.8rem 1.8rem",
  cursor: "pointer",
  transition: "background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease",
});
globalStyle(`${dlg} .${btnPrimary}:hover`, {
  background: accentDeep,
  transform: "translateY(-1px)",
  boxShadow: "0 0.6rem 1.4rem rgba(140, 79, 54, 0.3)",
});
globalStyle(`${dlg} .${btnPrimary}:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "2px",
});

export const btnGhost = style({});
globalStyle(`${dlg} .${btnGhost}`, {
  fontFamily: LABEL,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: inkSoft,
  background: "transparent",
  border: `1px solid ${hairline}`,
  borderRadius: "999px",
  padding: "0.8rem 1.6rem",
  cursor: "pointer",
  transition: "color 0.22s ease, border-color 0.22s ease",
});
globalStyle(`${dlg} .${btnGhost}:hover`, {
  color: ink,
  borderColor: ink,
});
globalStyle(`${dlg} .${btnGhost}:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "2px",
});

// ---------------------------------------------------------------- form fields
export const field = style({});
globalStyle(`${dlg} .${field}`, {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginBottom: "1.2rem",
});
globalStyle(`${dlg} .${field} label`, {
  fontFamily: LABEL,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: inkSoft,
});
globalStyle(`${dlg} .${field} input, ${dlg} .${field} select, ${dlg} .${field} textarea`, {
  fontFamily: BODY,
  fontSize: "1.02rem",
  color: ink,
  background: "transparent",
  border: "none",
  borderBottom: `1px solid ${hairline}`,
  borderRadius: 0,
  padding: "0.5rem 0.1rem",
  transition: "border-color 0.22s ease",
  outline: "none",
});
globalStyle(`${dlg} .${field} input::placeholder, ${dlg} .${field} textarea::placeholder`, {
  color: "#b8aea0",
});
globalStyle(
  `${dlg} .${field} input:focus, ${dlg} .${field} select:focus, ${dlg} .${field} textarea:focus`,
  { borderColor: accent, boxShadow: `0 1px 0 0 ${accent}` },
);

// two-up row for paired fields
export const fieldRow = style({});
globalStyle(`${dlg} .${fieldRow}`, {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.4rem",
});

// ---------------------------------------------------------------- editorial bits
// drop-cap'd long-form paragraph + section heading for the terms dialog
export const prose = style({});
globalStyle(`${dlg} .${prose} h3`, {
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: "1.5rem",
  color: ink,
  margin: "1.8rem 0 0.6rem",
});
globalStyle(`${dlg} .${prose} p`, {
  fontFamily: BODY,
  fontSize: "1.02rem",
  lineHeight: 1.66,
  color: "#4a3f4e",
  margin: "0 0 1rem",
});
globalStyle(`${dlg} .${prose} p:first-of-type::first-letter`, {
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: "3.4rem",
  lineHeight: 0.8,
  float: "left",
  paddingRight: "0.6rem",
  paddingTop: "0.4rem",
  color: accentDeep,
});

// itinerary / summary line items (label · value)
export const dl = style({});
globalStyle(`${dlg} .${dl}`, {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "baseline",
  gap: "0.8rem",
  padding: "0.85rem 0",
  borderBottom: `1px solid ${hairline}`,
});
globalStyle(`${dlg} .${dl} .${dl}-k, ${dlg} .dlKey`, {});
globalStyle(`${dlg} .dlKey`, {
  fontFamily: LABEL,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: inkSoft,
});
globalStyle(`${dlg} .dlDot`, {
  borderBottom: `1px dotted ${hairline}`,
  transform: "translateY(-0.25rem)",
});
globalStyle(`${dlg} .dlVal`, {
  fontFamily: DISPLAY,
  fontSize: "1.25rem",
  fontWeight: 600,
  color: ink,
});

// a small italic flourish line
export const flourish = style({});
globalStyle(`${dlg} .${flourish}`, {
  fontFamily: BODY,
  fontStyle: "italic",
  fontSize: "1.05rem",
  color: accentDeep,
  textAlign: "center",
  margin: "0.4rem 0 0",
});

// ---------------------------------------------------------------- embedded calendar
// when the Calendar lives inside the dialog body we give it room + center it
export const calMount = style({});
globalStyle(`${dlg} .${calMount}`, {
  display: "flex",
  justifyContent: "center",
  padding: "0.4rem 0 0.2rem",
});
