import { globalStyle, style } from "@vanilla-extract/css";

// LUMIÈRE · CALENDAR SKIN
// Warm editorial luxury-print, matching the Lumière Dialog. Ivory paper,
// aubergine ink, terracotta-gold accent. Cormorant Garamond month labels,
// Manrope weekday eyebrows, Newsreader numerals. Range selection paints a soft
// terracotta wash with rounded end-caps.
//
// Not portalled — a wrapping `<div class={cal}>` scopes everything. The same
// wrapper class is reused inside the Lumière date-picker dialog.

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Newsreader', Georgia, serif";
const LABEL = "'Manrope', system-ui, sans-serif";

const paper = "#fbf7ef";
const ink = "#2a2230";
const inkSoft = "#6f6478";
const hairline = "#e2d8c8";
const accent = "#b06a4a";
const accentDeep = "#8c4f36";
const wash = "rgba(176, 106, 74, 0.12)";
const gold = "#c9a14a";

export const cal = style({
  fontFamily: BODY,
  color: ink,
  background: paper,
  backgroundImage: `linear-gradient(180deg, ${paper} 0%, #f6f0e6 100%)`,
  border: `1px solid ${hairline}`,
  borderRadius: "4px",
  padding: "1.8rem 1.9rem 2rem",
  boxShadow: "0 1.5rem 3rem -1rem rgba(36, 26, 30, 0.2)",
  position: "relative",
});
globalStyle(`${cal}::before`, {
  content: '""',
  position: "absolute",
  insetInline: 0,
  top: 0,
  height: "3px",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  background: `linear-gradient(90deg, transparent, ${gold} 30%, ${accent} 70%, transparent)`,
});

// optional eyebrow above the months
export const eyebrow = style({
  fontFamily: LABEL,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: accentDeep,
  textAlign: "center",
  marginBottom: "1.2rem",
});

// header strip: nav ‹ · month label · nav ›
export const head = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1.2rem",
  gap: "1rem",
});

// the two-month wrapper
export const months = style({
  display: "flex",
  gap: "2.4rem",
  flexWrap: "wrap",
  justifyContent: "center",
});
export const monthCol = style({
  display: "flex",
  flexDirection: "column",
});
export const monthHead = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1rem",
  minHeight: "2.2rem",
});

// ---------------------------------------------------------------- nav buttons
globalStyle(`${cal} [data-part="calendar-nav"]`, {
  fontFamily: BODY,
  width: "2.4rem",
  height: "2.4rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  color: inkSoft,
  background: "transparent",
  border: `1px solid ${hairline}`,
  borderRadius: "999px",
  cursor: "pointer",
  transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
});
globalStyle(`${cal} [data-part="calendar-nav"]:hover`, {
  color: accentDeep,
  borderColor: accent,
  background: wash,
});
globalStyle(`${cal} [data-part="calendar-nav"]:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "2px",
});

// ---------------------------------------------------------------- month label
globalStyle(`${cal} [data-part="calendar-label"]`, {
  fontFamily: DISPLAY,
  fontSize: "1.7rem",
  fontWeight: 500,
  letterSpacing: "0.01em",
  color: ink,
  textAlign: "center",
});

// ---------------------------------------------------------------- table / grid
globalStyle(`${cal} [data-part="calendar-table"]`, {
  borderCollapse: "separate",
  borderSpacing: "0.2rem",
});
globalStyle(`${cal} [data-part="calendar-head-cell"]`, {
  fontFamily: LABEL,
  fontSize: "0.6rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: inkSoft,
  paddingBottom: "0.7rem",
  width: "2.6rem",
});

globalStyle(`${cal} [data-part="calendar-cell"]`, {
  padding: 0,
  textAlign: "center",
});

// ---------------------------------------------------------------- day triggers
globalStyle(`${cal} [data-part="calendar-cell-trigger"]`, {
  fontFamily: BODY,
  fontVariantNumeric: "lining-nums tabular-nums",
  fontSize: "1.02rem",
  color: ink,
  width: "2.6rem",
  height: "2.6rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "999px",
  cursor: "pointer",
  transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
});

// days outside the visible month (corvu dims via aria-hidden / disabled)
globalStyle(
  `${cal} [data-part="calendar-cell-trigger"][data-disabled], ${cal} [data-part="calendar-cell-trigger"]:disabled`,
  { color: "#cfc3b4", cursor: "default" },
);

globalStyle(`${cal} [data-part="calendar-cell-trigger"]:hover:not(:disabled)`, {
  background: wash,
  color: accentDeep,
});
globalStyle(`${cal} [data-part="calendar-cell-trigger"]:focus-visible`, {
  outline: `2px solid ${gold}`,
  outlineOffset: "1px",
});

// today — fine ring + gold dot underneath
globalStyle(`${cal} [data-part="calendar-cell-trigger"][data-today]`, {
  borderColor: accent,
  fontWeight: 600,
});

// in-range wash (the soft terracotta carpet between endpoints)
globalStyle(`${cal} [data-part="calendar-cell-trigger"][data-in-range]`, {
  background: wash,
  borderRadius: 0,
  color: accentDeep,
});

// selected / endpoints — solid ink chip
globalStyle(
  `${cal} [data-part="calendar-cell-trigger"][data-selected], ${cal} [data-part="calendar-cell-trigger"][data-range-start], ${cal} [data-part="calendar-cell-trigger"][data-range-end]`,
  {
    background: ink,
    color: "#fbf7ef",
    fontWeight: 600,
    borderColor: ink,
  },
);
globalStyle(`${cal} [data-part="calendar-cell-trigger"][data-range-start]`, {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});
globalStyle(`${cal} [data-part="calendar-cell-trigger"][data-range-end]`, {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
});
globalStyle(
  `${cal} [data-part="calendar-cell-trigger"][data-selected]:hover, ${cal} [data-part="calendar-cell-trigger"][data-range-start]:hover, ${cal} [data-part="calendar-cell-trigger"][data-range-end]:hover`,
  { background: accentDeep, color: "#fbf7ef", borderColor: accentDeep },
);

// ---------------------------------------------------------------- footnote
export const footnote = style({
  fontFamily: BODY,
  fontStyle: "italic",
  fontSize: "0.98rem",
  color: inkSoft,
  textAlign: "center",
  marginTop: "1.4rem",
  paddingTop: "1.2rem",
  borderTop: `1px solid ${hairline}`,
});
globalStyle(`${footnote} b`, {
  fontStyle: "normal",
  fontWeight: 600,
  color: accentDeep,
});
