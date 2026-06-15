import { globalStyle, style } from "@vanilla-extract/css";

// EXEMPLAR 4 · GRID ("Brutalist spreadsheet")
// Exposed cell borders, gray header strip with column-letter chips, a left
// row-number gutter (CSS counter on the body), and a formula bar above.
// Selection is a 2px blue active-cell rim on column D, like a real sheet.

const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', 'Inter', system-ui, sans-serif";

export const grid = style({
  background: "#f3f3f3",
  color: "#111",
  fontFamily: SANS,
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

export const grToolbar = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto auto auto",
  alignItems: "center",
  gap: "10px",
  padding: "8px 12px",
  background: "#fff",
  borderBottom: "1px solid #d4d4d4",
  fontSize: "12px",
  color: "#333",
});
export const grName = style({
  fontFamily: MONO,
  fontSize: "13px",
  fontWeight: 600,
  background: "#f3f3f3",
  border: "1px solid #c8c8c8",
  padding: "4px 10px",
  minWidth: "64px",
  textAlign: "center",
  color: "#111",
});
export const grFormula = style({
  fontFamily: MONO,
  fontSize: "13px",
  background: "#fff",
  border: "1px solid #c8c8c8",
  padding: "4px 10px",
  color: "#111",
});
globalStyle(`${grFormula} b`, { color: "#1463ff" });
globalStyle(`${grFormula} i`, {
  color: "#999",
  marginRight: "8px",
  fontStyle: "normal",
  fontFamily: SANS,
  fontWeight: 600,
});
export const grBtn = style({
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: "12px",
  padding: "4px 10px",
  border: "1px solid #c8c8c8",
  background: "#fff",
  color: "#333",
});
export const grBtnActive = style({
  background: "#1463ff",
  color: "#fff",
  borderColor: "#1463ff",
});

export const grMeta = style({
  background: "#fff",
  borderBottom: "1px solid #d4d4d4",
  padding: "6px 12px",
  fontFamily: MONO,
  fontSize: "11px",
  color: "#666",
  display: "flex",
  justifyContent: "space-between",
});
globalStyle(`${grMeta} b`, { color: "#111", fontWeight: 600 });

export const grTableWrap = style({ flex: 1, minHeight: 0 });

export const grStatusbar = style({
  background: "#ebebeb",
  borderTop: "1px solid #c8c8c8",
  padding: "5px 12px",
  fontFamily: MONO,
  fontSize: "11px",
  color: "#555",
  display: "flex",
  justifyContent: "space-between",
});
globalStyle(`${grStatusbar} b`, { color: "#111", fontWeight: 600 });
export const grSel = style({ color: "#1463ff" });

// header content + cell content classes
export const grLetter = style({
  fontFamily: MONO,
  fontSize: "10px",
  color: "#666",
  fontWeight: 700,
  letterSpacing: ".08em",
  background: "#d8d8d8",
  padding: "1px 5px",
  marginRight: "8px",
});
export const lbl = style({ flex: 1 });
export const neg = style({ color: "#c53030" });
// invisible marker rendered into the totals row so :has() can theme the row
export const totalMark = style({ display: "none" });

// ---- primitive theming ----
globalStyle(`${grid} [data-part="root"]`, { background: "#fff" });
globalStyle(`${grid} [data-part="header"]`, {
  background: "#ebebeb",
  borderBottom: "1.5px solid #888",
});
globalStyle(`${grid} [data-part="header-row"]`, {
  height: "26px",
  paddingLeft: "56px",
});
globalStyle(`${grid} [data-part="header-cell"]`, {
  alignItems: "center",
  color: "#111",
  display: "flex",
  fontFamily: SANS,
  fontSize: "12px",
  fontWeight: 600,
  padding: "0 10px",
  borderRight: "1px solid #c8c8c8",
  position: "relative",
  background: "#ebebeb",
  justifyContent: "space-between",
});
globalStyle(
  `${grid} [data-part="header-cell"][data-sort-direction="asc"]::after`,
  {
    content: '"▲"',
    fontSize: "8px",
    color: "#1463ff",
    marginLeft: "6px",
  },
);
globalStyle(
  `${grid} [data-part="header-cell"][data-sort-direction="desc"]::after`,
  {
    content: '"▼"',
    fontSize: "8px",
    color: "#1463ff",
    marginLeft: "6px",
  },
);

globalStyle(`${grid} [data-part="body"]`, { counterReset: "gr-row" });
globalStyle(`${grid} [data-part="row"]`, {
  counterIncrement: "gr-row",
  paddingLeft: "56px",
  borderBottom: "1px solid #e2e2e2",
  alignItems: "stretch",
});
globalStyle(`${grid} [data-part="row"]::before`, {
  content: "counter(gr-row)",
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ebebeb",
  borderRight: "1px solid #c8c8c8",
  borderBottom: "1px solid #d4d4d4",
  fontFamily: MONO,
  fontSize: "11px",
  fontWeight: 600,
  color: "#666",
});
globalStyle(`${grid} [data-part="row"]:hover::before`, {
  background: "#dedede",
  color: "#111",
});
globalStyle(`${grid} [data-part="row"][data-selected="true"]::before`, {
  background: "#1463ff",
  color: "#fff",
  borderRightColor: "#1463ff",
});
globalStyle(`${grid} [data-part="cell"]`, {
  alignItems: "center",
  background: "#fff",
  borderRight: "1px solid #e2e2e2",
  color: "#111",
  display: "flex",
  fontFamily: SANS,
  fontSize: "13px",
  padding: "0 10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
// active-cell rim on column D of the selected row
globalStyle(
  `${grid} [data-part="row"][data-selected="true"] [data-part="cell"]:nth-child(4)`,
  {
    boxShadow: "inset 0 0 0 2px #1463ff",
    background: "rgba(20,99,255,.06)",
  },
);

// totals row (last logical row) — detected via the hidden marker it renders
globalStyle(`${grid} [data-part="row"]:has(.${totalMark}) [data-part="cell"]`, {
  background: "#fff8d6 !important",
  fontWeight: 600,
  borderTop: "1.5px solid #888",
});
globalStyle(`${grid} [data-part="row"]:has(.${totalMark})::before`, {
  background: "#d8d2a4",
  color: "#111",
});

// column widths a–h (header + body share order)
interface Col {
  readonly flex: string;
  readonly end?: boolean;
  readonly cell?: Record<string, string | number>;
}
const cols: readonly Col[] = [
  {
    flex: "0 0 110px",
    cell: { fontFamily: MONO, fontSize: "12px", color: "#333" },
  },
  { flex: "1 1 280px" },
  { flex: "0 0 140px", cell: { color: "#555" } },
  {
    flex: "0 0 110px",
    end: true,
    cell: { fontVariantNumeric: "tabular-nums" },
  },
  {
    flex: "0 0 110px",
    end: true,
    cell: { fontVariantNumeric: "tabular-nums" },
  },
  {
    flex: "0 0 110px",
    end: true,
    cell: { fontVariantNumeric: "tabular-nums" },
  },
  {
    flex: "0 0 110px",
    end: true,
    cell: { fontVariantNumeric: "tabular-nums" },
  },
  {
    flex: "0 0 130px",
    end: true,
    cell: {
      fontVariantNumeric: "tabular-nums",
      fontWeight: 600,
      background: "#fafafa",
    },
  },
];
cols.forEach((col, i) => {
  const n = i + 1;
  const both = `${grid} [data-part="header-cell"]:nth-child(${n}), ${grid} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  globalStyle(both, {
    flex: col.flex,
    ...(col.end ? { justifyContent: "flex-end" } : {}),
  });
  if (col.cell !== undefined) {
    globalStyle(
      `${grid} [data-part="row"] [data-part="cell"]:nth-child(${n})`,
      col.cell,
    );
  }
});
