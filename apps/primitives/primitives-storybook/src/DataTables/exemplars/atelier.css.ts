import { globalStyle, style } from "@vanilla-extract/css";

// EXEMPLAR 2 · ATELIER ("Auction catalogue")
// Warm paper, italic serif, big lot numerals. Selected row gets a thin
// vermilion ribbon and the lot number paints itself in red ink.

const SERIF = "'Newsreader', Georgia, serif";
const SANS = "'Inter', sans-serif";

export const atel = style({
  background: "#f1ebde",
  color: "#1a1612",
  fontFamily: SERIF,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "36px 48px",
});

export const atMast = style({
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "baseline",
  borderBottom: "1px solid #1a1612",
  paddingBottom: "6px",
  marginBottom: "18px",
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#1a1612",
});
globalStyle(`${atMast} > :first-child`, { textAlign: "left" });
globalStyle(`${atMast} > :last-child`, { textAlign: "right" });

export const atHouse = style({
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: "22px",
  letterSpacing: "-.01em",
  textTransform: "none",
  textAlign: "center",
});
globalStyle(`${atHouse} b`, {
  color: "#8a1d2c",
  fontStyle: "normal",
  fontWeight: 600,
});

export const atH1 = style({
  fontFamily: SERIF,
  fontWeight: 500,
  fontSize: "42px",
  lineHeight: 1.02,
  letterSpacing: "-.018em",
  margin: "0 0 4px",
});
globalStyle(`${atH1} i`, { fontWeight: 400, color: "#6a5a44" });

export const atDeck = style({
  fontFamily: SANS,
  fontSize: "12px",
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#6a5a44",
  margin: "0 0 22px",
  paddingBottom: "14px",
  borderBottom: "1px solid #1a1612",
});
globalStyle(`${atDeck} b`, { color: "#8a1d2c", fontWeight: 600 });

export const atTableWrap = style({ flex: 1, minHeight: 0 });

export const atFoot = style({
  borderTop: "1px solid #1a1612",
  padding: "10px 0 0",
  marginTop: "10px",
  display: "flex",
  justifyContent: "space-between",
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "#6a5a44",
});
globalStyle(`${atFoot} i`, {
  fontFamily: SERIF,
  fontStyle: "italic",
  color: "#1a1612",
  textTransform: "none",
  letterSpacing: 0,
  fontSize: "13px",
});

// cell content classes
export const artist = style({
  fontFamily: SANS,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: ".01em",
  color: "#1a1612",
});
export const yr = style({
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 400,
  color: "#6a5a44",
  marginLeft: "6px",
  letterSpacing: 0,
});
export const title = style({
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: 1.2,
  letterSpacing: "-.005em",
  color: "#1a1612",
});
export const unsold = style({
  fontStyle: "italic",
  color: "#8a1d2c",
  fontSize: "14px",
  fontWeight: 400,
});
export const withFees = style({
  display: "block",
  fontSize: "10px",
  letterSpacing: ".12em",
  color: "#6a5a44",
  textTransform: "uppercase",
  fontFamily: SANS,
  fontWeight: 500,
  marginTop: "2px",
});

// ---- primitive theming ----
globalStyle(`${atel} [data-part="header"]`, { background: "#f1ebde" });
globalStyle(`${atel} [data-part="header-row"]`, {
  borderBottom: "1px solid #1a1612",
  height: "36px",
});
globalStyle(`${atel} [data-part="header-cell"]`, {
  alignItems: "center",
  color: "#1a1612",
  display: "flex",
  fontFamily: SANS,
  fontSize: "10px",
  fontWeight: 500,
  letterSpacing: ".14em",
  padding: "0 14px",
  textTransform: "uppercase",
});
globalStyle(
  `${atel} [data-part="header-cell"][data-sort-direction="asc"]::after`,
  {
    content: '"↑"',
    marginLeft: "8px",
    fontSize: "11px",
    color: "#8a1d2c",
  },
);
globalStyle(
  `${atel} [data-part="header-cell"][data-sort-direction="desc"]::after`,
  {
    content: '"↓"',
    marginLeft: "8px",
    fontSize: "11px",
    color: "#8a1d2c",
  },
);
globalStyle(`${atel} [data-part="row"]`, {
  borderBottom: "1px solid #cbc4b3",
  alignItems: "stretch",
});
globalStyle(`${atel} [data-part="row"]:hover`, {
  background: "rgba(138,29,44,.04)",
});
globalStyle(`${atel} [data-part="row"][data-selected="true"]`, {
  background: "#ece3cf",
  boxShadow: "inset 3px 0 0 #8a1d2c",
});
globalStyle(`${atel} [data-part="cell"]`, {
  display: "flex",
  alignItems: "center",
  padding: "12px 14px",
  overflow: "hidden",
});

// column sizing/typography keyed on :nth-child
interface Col {
  readonly flex: string;
  readonly end?: boolean;
  readonly cell?: Record<string, string | number>;
}
const cols: readonly Col[] = [
  {
    flex: "0 0 90px",
    cell: {
      fontFamily: SERIF,
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: "26px",
      color: "#1a1612",
      letterSpacing: "-.01em",
      fontVariantNumeric: "oldstyle-nums",
    },
  },
  {
    flex: "1 1 320px",
    cell: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "2px",
      justifyContent: "center",
    },
  },
  {
    flex: "1 1 200px",
    cell: {
      fontFamily: SERIF,
      fontStyle: "italic",
      fontSize: "14px",
      color: "#4a3f2c",
      lineHeight: 1.3,
    },
  },
  {
    flex: "0 0 160px",
    end: true,
    cell: {
      fontFamily: SERIF,
      fontVariantNumeric: "oldstyle-nums tabular-nums",
      fontSize: "16px",
      color: "#4a3f2c",
      textAlign: "right",
    },
  },
  {
    flex: "0 0 140px",
    end: true,
    cell: {
      fontFamily: SERIF,
      fontVariantNumeric: "oldstyle-nums tabular-nums",
      fontSize: "18px",
      fontWeight: 500,
      color: "#1a1612",
      textAlign: "right",
    },
  },
];
cols.forEach((col, i) => {
  const n = i + 1;
  const both = `${atel} [data-part="header-cell"]:nth-child(${n}), ${atel} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  globalStyle(both, {
    flex: col.flex,
    ...(col.end ? { justifyContent: "flex-end" } : {}),
  });
  if (col.cell !== undefined) {
    globalStyle(
      `${atel} [data-part="row"] [data-part="cell"]:nth-child(${n})`,
      col.cell,
    );
  }
});
// selected row repaints the lot number in vermilion
globalStyle(
  `${atel} [data-part="row"][data-selected="true"] [data-part="cell"]:nth-child(1)`,
  {
    color: "#8a1d2c",
  },
);
