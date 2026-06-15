import { globalStyle, style } from "@vanilla-extract/css";

export const sage = style({
  background: "#e7ebde",
  color: "#1f2a1c",
  fontFamily: "'Manrope', sans-serif",
  padding: "64px 56px",
  minHeight: "100%",
});

export const sgEyebrow = style({
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: ".22em",
  color: "#5a6a4a",
  fontWeight: 600,
  margin: "0 0 14px",
});

export const sgH1 = style({
  fontFamily: "'Instrument Serif', serif",
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: "56px",
  lineHeight: 1,
  margin: "0 0 36px",
  color: "#1f2a1c",
  letterSpacing: "-.01em",
});

export const sgH1Bold = style({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  letterSpacing: "-.02em",
});

export const sgTag = style({
  display: "inline-block",
  background: "#eef1e6",
  color: "#3a4a32",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: "999px",
  marginRight: "6px",
  marginTop: "12px",
});

globalStyle(`${sage} [data-part="root"]`, {
  background: "#fbfaf3",
  borderRadius: "22px",
  marginBottom: "12px",
  boxShadow: "0 1px 0 rgba(31,42,28,.04), 0 1px 2px rgba(31,42,28,.04)",
  transition: "box-shadow .25s ease, transform .25s ease",
});

globalStyle(`${sage} [data-part="root"]:has(input:checked)`, {
  boxShadow:
    "0 1px 0 rgba(31,42,28,.04), 0 18px 40px -16px rgba(31,42,28,.18), 0 0 0 1px rgba(31,42,28,.06)",
});

globalStyle(`${sage} [data-part="trigger"]`, {
  padding: "22px 26px",
  gap: "24px",
});

globalStyle(`${sage} [data-part="title"]`, {
  fontSize: "17px",
  fontWeight: 600,
  letterSpacing: "-.005em",
  color: "#1f2a1c",
});

globalStyle(`${sage} [data-part="icon"]`, {
  width: "30px",
  height: "30px",
  borderRadius: "999px",
  background: "#eef1e6",
  color: "#3a4a32",
  display: "grid",
  placeItems: "center",
  transition: "background .2s, color .2s",
  flexShrink: 0,
});

globalStyle(`${sage} [data-part="icon"] > svg`, {
  width: "14px",
  height: "14px",
  inset: 0,
  margin: "auto",
  position: "absolute",
});

globalStyle(
  `${sage} [data-part="root"]:has(input:checked) [data-part="icon"]`,
  {
    background: "#3a4a32",
    color: "#fbfaf3",
  },
);

globalStyle(`${sage} [data-content-inner]`, {
  padding: "0 26px 24px",
  color: "#4a5546",
  fontSize: "15px",
  lineHeight: 1.65,
  maxWidth: "58ch",
});

globalStyle(`${sage} [data-content-inner] em`, {
  fontFamily: "'Instrument Serif', serif",
  fontSize: "17px",
  color: "#2a3a22",
});
