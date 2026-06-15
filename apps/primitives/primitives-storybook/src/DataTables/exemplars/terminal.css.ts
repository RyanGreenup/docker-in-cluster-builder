import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// EXEMPLAR 1 · TERMINAL ("Bloomberg")
// Dense financial workstation. Amber + tabular monospace on near-black.
// The raw primitive emits only [data-part] / [data-sort-direction] /
// [data-selected] hooks and no per-column identity, so column sizing and
// alignment are keyed on :nth-child (header + body cells share column order).

const MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export const term = style({
  background: "#0b0b0c",
  color: "#e6e0d4",
  fontFamily: MONO,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: 0,
});

export const tmChrome = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto",
  alignItems: "center",
  gap: "24px",
  padding: "10px 16px",
  background: "#131312",
  borderBottom: "1px solid #ff9b1f",
  fontSize: "11px",
  letterSpacing: ".08em",
  textTransform: "uppercase",
});

export const tmBrand = style({
  color: "#ff9b1f",
  fontWeight: 700,
  letterSpacing: ".14em",
});
globalStyle(`${tmBrand} b`, {
  color: "#0b0b0c",
  background: "#ff9b1f",
  padding: "3px 7px",
  marginRight: "8px",
  fontWeight: 700,
  letterSpacing: ".14em",
});

export const tmCmd = style({
  color: "#888279",
  fontSize: "11px",
  letterSpacing: ".08em",
});
globalStyle(`${tmCmd} b`, { color: "#ff9b1f", fontWeight: 500 });

const blink = keyframes({ "50%": { opacity: 0.35 } });
export const tmStatus = style({
  color: "#4ce0a0",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
});
globalStyle(`${tmStatus}::before`, {
  content: '""',
  width: "7px",
  height: "7px",
  background: "#4ce0a0",
  borderRadius: "999px",
  boxShadow: "0 0 8px #4ce0a0",
  animation: `${blink} 1.5s infinite`,
});

export const tmSub = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 0,
  padding: "10px 16px",
  background: "#0b0b0c",
  borderBottom: "1px solid #2a2826",
  fontSize: "10px",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "#888279",
});
globalStyle(`${tmSub} > div`, {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});
globalStyle(`${tmSub} b`, {
  color: "#e6e0d4",
  fontSize: "13px",
  letterSpacing: 0,
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",
});

export const tmTableWrap = style({ flex: 1, minHeight: 0 });

export const tmFoot = style({
  borderTop: "1px solid #ff9b1f",
  padding: "8px 16px",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  gap: "24px",
  background: "#131312",
  fontSize: "11px",
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#888279",
});
globalStyle(`${tmFoot} b`, { color: "#ff9b1f", fontWeight: 500 });
export const tmKeys = style({});
globalStyle(`${tmKeys} span`, { marginRight: "12px" });
globalStyle(`${tmKeys} b`, {
  background: "#2a2826",
  color: "#ff9b1f",
  padding: "1px 6px",
  marginRight: "4px",
});

// cell content classes
export const up = style({ color: "#4ce0a0" });
export const dn = style({ color: "#ff5b6a" });
export const arrow = style({
  display: "inline-block",
  width: "8px",
  marginRight: "4px",
  opacity: 0.9,
});
export const pctChip = style({
  display: "inline-block",
  padding: "1px 6px",
  borderRadius: "2px",
  fontWeight: 500,
  fontSize: "12px",
});
globalStyle(`${pctChip}.${up}`, {
  background: "rgba(76,224,160,.15)",
  color: "#4ce0a0",
});
globalStyle(`${pctChip}.${dn}`, {
  background: "rgba(255,91,106,.18)",
  color: "#ff5b6a",
});

// ---- primitive theming ----
globalStyle(`${term} [data-part="scroll"]`, {
  scrollbarColor: "#ff9b1f #131312",
  scrollbarWidth: "thin",
});
globalStyle(`${term} [data-part="header"]`, { background: "#131312" });
globalStyle(`${term} [data-part="header-row"]`, {
  borderBottom: "1px solid #ff9b1f",
  height: "26px",
});
globalStyle(`${term} [data-part="header-cell"]`, {
  alignItems: "center",
  color: "#ff9b1f",
  display: "flex",
  fontSize: "10px",
  fontWeight: 500,
  letterSpacing: ".12em",
  padding: "0 12px",
  textTransform: "uppercase",
});
globalStyle(
  `${term} [data-part="header-cell"][data-sort-direction="asc"]::after`,
  {
    content: '" ▲"',
    marginLeft: "6px",
    color: "#e6e0d4",
    fontSize: "9px",
  },
);
globalStyle(
  `${term} [data-part="header-cell"][data-sort-direction="desc"]::after`,
  {
    content: '" ▼"',
    marginLeft: "6px",
    color: "#e6e0d4",
    fontSize: "9px",
  },
);
globalStyle(`${term} [data-part="row"]`, {
  borderBottom: "1px solid #1a1918",
  fontSize: "13px",
  fontVariantNumeric: "tabular-nums",
});
globalStyle(`${term} [data-part="row"]:hover`, { background: "#161513" });
globalStyle(`${term} [data-part="row"][data-selected="true"]`, {
  background: "#ff9b1f",
  color: "#0b0b0c",
});
globalStyle(`${term} [data-part="row"][data-selected="true"] ${up}`, {
  color: "#0b0b0c",
});
globalStyle(`${term} [data-part="row"][data-selected="true"] ${dn}`, {
  color: "#0b0b0c",
});
globalStyle(
  `${term} [data-part="row"][data-selected="true"] ${pctChip}.${up}`,
  {
    background: "rgba(11,11,12,.18)",
    color: "#0b0b0c",
  },
);
globalStyle(
  `${term} [data-part="row"][data-selected="true"] ${pctChip}.${dn}`,
  {
    background: "rgba(11,11,12,.18)",
    color: "#0b0b0c",
  },
);
globalStyle(`${term} [data-part="cell"]`, {
  alignItems: "center",
  display: "flex",
  padding: "0 12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// column sizing — ticker narrow, name takes slack, numbers right-align.
// flex (width) + justify apply to header AND body cells so columns align;
// text colour applies to body cells only (header keeps its amber).
interface Col {
  readonly flex: string;
  readonly end?: boolean;
  readonly color?: string;
  readonly weight?: number;
  readonly tracking?: string;
}
const cols: readonly Col[] = [
  { flex: "0 0 92px", color: "#fff", weight: 500, tracking: ".04em" },
  { flex: "1 1 220px", color: "#b6afa3" },
  { flex: "0 0 100px", end: true, color: "#fff" },
  { flex: "0 0 96px", end: true },
  { flex: "0 0 88px", end: true },
  { flex: "0 0 110px", end: true, color: "#b6afa3" },
  { flex: "0 0 92px", end: true, color: "#b6afa3" },
  { flex: "0 0 92px", end: true, color: "#b6afa3" },
];
cols.forEach((col, i) => {
  const n = i + 1;
  const both = `${term} [data-part="header-cell"]:nth-child(${n}), ${term} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  globalStyle(both, {
    flex: col.flex,
    ...(col.end ? { justifyContent: "flex-end" } : {}),
  });
  const cell = `${term} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  const props: Record<string, string | number> = {};
  if (col.color !== undefined) props.color = col.color;
  if (col.weight !== undefined) props.fontWeight = col.weight;
  if (col.tracking !== undefined) props.letterSpacing = col.tracking;
  if (Object.keys(props).length > 0) globalStyle(cell, props);
});
