import { globalStyle, style } from "@vanilla-extract/css";

export const stencil = style({
  background: "#ecead4",
  color: "#16140e",
  fontFamily: "'Bricolage Grotesque', sans-serif",
  padding: "56px 56px 80px",
  minHeight: "100%",
});

export const stTag = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#16140e",
  margin: "0 0 28px",
});

globalStyle(`${stTag}::before`, {
  content: '""',
  width: "8px",
  height: "8px",
  background: "#d8472b",
  display: "inline-block",
});

export const stH1 = style({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: "60px",
  lineHeight: 0.92,
  letterSpacing: "-.035em",
  margin: "0 0 40px",
  maxWidth: "11ch",
});

export const stH1Em = style({
  fontStyle: "italic",
  fontWeight: 400,
  fontFamily: "'Instrument Serif', serif",
  letterSpacing: "-.02em",
  color: "#d8472b",
});

export const stRow = style({
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  gap: "8px 18px",
  marginTop: "18px",
  paddingTop: "18px",
  borderTop: "1px solid currentColor",
  fontSize: "13px",
  letterSpacing: ".04em",
});

globalStyle(`${stRow} dt`, {
  textTransform: "uppercase",
  opacity: 0.7,
});

globalStyle(`${stRow} dd`, {
  margin: 0,
});

globalStyle(`${stencil} [data-part="root"]`, {
  display: "grid",
  gridTemplateColumns: "96px 1fr",
  borderTop: "1px solid #16140e",
  transition: "background .25s ease",
});

globalStyle(`${stencil} [data-part="root"]:last-of-type`, {
  borderBottom: "1px solid #16140e",
});

globalStyle(`${stencil} [data-part="root"]::before`, {
  content: "attr(data-num)",
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: "56px",
  lineHeight: 1,
  letterSpacing: "-.04em",
  padding: "22px 0 0",
  color: "#16140e",
  gridColumn: 1,
  gridRow: "1 / span 2",
  alignSelf: "start",
  transition: "color .25s",
});

globalStyle(`${stencil} [data-part="root"]:has(input:checked)`, {
  background: "#d8472b",
  color: "#f4ead8",
});

globalStyle(`${stencil} [data-part="root"]:has(input:checked)::before`, {
  color: "#f4ead8",
});

// Trigger and content both live in column 2 (the ::before numeral owns column
// 1) so they stack via implicit rows; otherwise the grid auto-places them
// side-by-side in row 1 and the collapse can't hide the panel.
globalStyle(`${stencil} [data-part="trigger"]`, {
  gridColumn: 2,
  padding: "28px 20px 28px 0",
  gap: "28px",
});

globalStyle(`${stencil} [data-part="title"]`, {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 600,
  fontSize: "26px",
  lineHeight: 1.1,
  letterSpacing: "-.02em",
  maxWidth: "22ch",
});

globalStyle(`${stencil} [data-part="icon"]`, {
  width: "38px",
  height: "38px",
  border: "1.5px solid currentColor",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
});

globalStyle(`${stencil} [data-part="icon"] > svg`, {
  width: "16px",
  height: "16px",
  inset: 0,
  margin: "auto",
  position: "absolute",
});

globalStyle(`${stencil} [data-part="content"]`, {
  gridColumn: 2,
});

globalStyle(`${stencil} [data-content-inner]`, {
  padding: "0 60px 32px 0",
  fontSize: "16px",
  lineHeight: 1.55,
  maxWidth: "56ch",
  fontFamily: "'Bricolage Grotesque', sans-serif",
});
