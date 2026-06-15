import { globalStyle, style } from "@vanilla-extract/css";

export const brutalist = style({
  background: "#ffffff",
  color: "#000",
  fontFamily: "'JetBrains Mono', monospace",
  padding: "56px 56px 64px",
  minHeight: "100%",
});

export const brHead = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  borderBottom: "2px solid #000",
  paddingBottom: "14px",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: ".08em",
});

export const brH1 = style({
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "-.01em",
  margin: "28px 0 28px",
  textTransform: "uppercase",
});

export const brH1Small = style({
  display: "block",
  fontSize: "12px",
  fontWeight: 400,
  letterSpacing: ".08em",
  color: "#555",
  marginTop: "8px",
});

export const brMeta = style({
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  gap: "4px 16px",
  marginTop: "14px",
  borderTop: "1px dashed #888",
  paddingTop: "14px",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: ".06em",
});

globalStyle(`${brutalist} [data-part="root"]`, {
  border: "2px solid #000",
});

// Collapse the shared border between adjacent items so the stack reads as one
// ruled block (the first item keeps its top border, unlike a :first-of-type
// rule which can't match here — a non-accordion div precedes the items).
globalStyle(`${brutalist} [data-part="root"] + [data-part="root"]`, {
  borderTop: 0,
});

globalStyle(`${brutalist} [data-part="trigger"]`, {
  padding: "18px 20px",
  fontSize: "13px",
  letterSpacing: ".06em",
  textTransform: "uppercase",
  transition: "background .15s, color .15s",
});

globalStyle(`${brutalist} [data-part="title"]`, {
  display: "flex",
  alignItems: "baseline",
  gap: "18px",
});

globalStyle(`${brutalist} [data-part="title"]::before`, {
  content: "var(--br-tag)",
  color: "#888",
  flexShrink: 0,
  fontWeight: 400,
  fontSize: "11px",
  whiteSpace: "nowrap",
});

globalStyle(
  `${brutalist} [data-part="root"]:has(input:checked) > [data-part="trigger"]`,
  {
    background: "#000",
    color: "#fff",
  },
);

globalStyle(
  `${brutalist} [data-part="root"]:has(input:checked) > [data-part="trigger"] [data-part="title"]::before`,
  {
    color: "#888",
  },
);

globalStyle(`${brutalist} [data-part="icon"]`, {
  width: "auto",
  height: "auto",
});

globalStyle(`${brutalist} [data-part="icon"] > svg`, {
  display: "none",
});

globalStyle(`${brutalist} [data-part="icon"]::before`, {
  content: '"[+]"',
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700,
  transition: "opacity .2s",
});

globalStyle(
  `${brutalist} [data-part="root"]:has(input:checked) [data-part="icon"]::before`,
  {
    content: '"[−]"',
  },
);

globalStyle(`${brutalist} [data-content-inner]`, {
  padding: "20px 20px 24px",
  borderTop: "2px solid #000",
  fontSize: "13px",
  lineHeight: 1.7,
  background: "#f4f4f0",
});

globalStyle(`${brutalist} [data-content-inner] code`, {
  background: "#000",
  color: "#fff",
  padding: "1px 6px",
  fontFamily: "'JetBrains Mono', monospace",
});

globalStyle(`${brutalist} ${brMeta} dt`, {
  color: "#888",
});

globalStyle(`${brutalist} ${brMeta} dd`, {
  margin: 0,
});
