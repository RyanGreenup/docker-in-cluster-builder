import { globalStyle, style } from "@vanilla-extract/css";

export const editorial = style({
  background: "#f4ecda",
  color: "#2a1f14",
  fontFamily: "'Cormorant Garamond', serif",
  padding: "72px 64px",
  minHeight: "100%",
});

export const edEyebrow = style({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
  fontSize: "15px",
  letterSpacing: ".04em",
  color: "#8a6a3a",
  margin: "0 0 6px",
});

export const edH1 = style({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  fontSize: "56px",
  lineHeight: 1,
  letterSpacing: "-.01em",
  margin: "0 0 4px",
});

export const edRule = style({
  border: 0,
  borderTop: "1px solid #2a1f14",
  margin: "28px 0 0",
});

globalStyle(`${editorial} [data-part="root"]`, {
  borderBottom: "1px solid rgba(42,31,20,.35)",
  display: "grid",
  gridTemplateColumns: "56px 1fr",
  columnGap: "32px",
});

globalStyle(`${editorial} [data-part="root"]::before`, {
  content: "attr(data-num)",
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
  fontSize: "22px",
  color: "#8a6a3a",
  padding: "28px 0 0",
  gridColumn: 1,
  gridRow: "1 / span 2",
  alignSelf: "start",
});

// Pin the trigger and content to column 2 so they stack (the ::before numeral
// owns column 1). Without explicit columns the grid auto-places trigger and
// content side-by-side in row 1, and the collapse can't hide a sideways panel.
globalStyle(`${editorial} [data-part="trigger"]`, {
  gridColumn: 2,
  padding: "26px 0",
  gap: "24px",
});

globalStyle(`${editorial} [data-part="content"]`, {
  gridColumn: 2,
});

globalStyle(`${editorial} [data-part="title"]`, {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  fontSize: "28px",
  lineHeight: 1.15,
  letterSpacing: "-.005em",
});

globalStyle(`${editorial} [data-part="icon"]`, {
  fontSize: "16px",
  color: "#2a1f14",
  width: "18px",
  height: "18px",
});

globalStyle(`${editorial} [data-content-inner]`, {
  padding: "0 0 28px",
  color: "#4d3a25",
  fontSize: "19px",
  lineHeight: 1.55,
  maxWidth: "56ch",
  fontStyle: "italic",
  fontFamily: "'Cormorant Garamond', serif",
});

globalStyle(
  `${editorial} [data-part="root"]:has(input:checked) [data-part="title"]`,
  {
    color: "#6b3a1c",
  },
);
