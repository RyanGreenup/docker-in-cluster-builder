import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// EXEMPLAR 3 · TELEMETRY ("Mission control")
// Deep navy with cyan glow. Status dots (nominal / caution / alarm). The raw
// primitive carries no per-row data-tag, so row/value theming is driven off
// :has() of the status dot the cell renders.

const MONO = "'DM Mono', 'JetBrains Mono', monospace";
const SANS = "'Inter', sans-serif";

export const tele = style({
  background: [
    "linear-gradient(rgba(255,255,255,.012) 50%, transparent 50%) 0 0/100% 3px",
    "radial-gradient(ellipse at 30% 0%, rgba(54,227,163,.06), transparent 60%)",
    "#051a2e",
  ].join(","),
  color: "#c8e1ff",
  fontFamily: MONO,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: 0,
});

export const teChrome = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto auto",
  alignItems: "center",
  gap: "28px",
  padding: "14px 22px",
  background: "linear-gradient(180deg, #0a2540 0%, #061f37 100%)",
  borderBottom: "1px solid rgba(157,193,255,.28)",
  fontSize: "11px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
});

export const teMark = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "12px",
  color: "#fff",
  fontWeight: 500,
  letterSpacing: ".16em",
});
globalStyle(`${teMark} b`, {
  color: "#36e3a3",
  fontFamily: "'Instrument Serif', serif",
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: "20px",
  letterSpacing: "-.01em",
  textTransform: "none",
});

export const teVehicle = style({ color: "#9dc1ff" });
globalStyle(`${teVehicle} b`, { color: "#fff", fontWeight: 500 });

export const teClock = style({
  fontFamily: MONO,
  fontSize: "16px",
  letterSpacing: ".08em",
  color: "#fff",
});
globalStyle(`${teClock} b`, { color: "#36e3a3" });

export const teMode = style({ color: "#9dc1ff" });
globalStyle(`${teMode} b`, {
  color: "#fff",
  background: "rgba(54,227,163,.15)",
  border: "1px solid #36e3a3",
  padding: "3px 8px",
  marginLeft: "6px",
  fontWeight: 500,
});

export const teSub = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  background: "rgba(255,255,255,.02)",
  borderBottom: "1px solid rgba(157,193,255,.18)",
  fontSize: "10px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#6f96c4",
});
globalStyle(`${teSub} > div`, {
  padding: "10px 22px",
  borderRight: "1px solid rgba(157,193,255,.12)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});
globalStyle(`${teSub} > div:last-child`, { borderRight: 0 });
globalStyle(`${teSub} b`, {
  color: "#fff",
  fontFamily: MONO,
  fontSize: "16px",
  letterSpacing: 0,
  fontWeight: 500,
});
export const ok = style({});
export const warn = style({});
export const alarm = style({});
globalStyle(`${teSub} b.${ok}`, { color: "#36e3a3" });
globalStyle(`${teSub} b.${warn}`, { color: "#ffba2b" });
globalStyle(`${teSub} b.${alarm}`, { color: "#ff5e6a" });

export const teTableWrap = style({ flex: 1, minHeight: 0 });

export const teFoot = style({
  background: "rgba(255,255,255,.02)",
  borderTop: "1px solid rgba(157,193,255,.18)",
  padding: "8px 22px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "10px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#6f96c4",
});
globalStyle(`${teFoot} b`, { color: "#36e3a3", fontWeight: 500 });

// cell content classes
const pulse = keyframes({ "50%": { opacity: 0.35 } });
export const dot = style({
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  display: "inline-block",
  background: "#36e3a3",
  boxShadow: "0 0 8px #36e3a3, inset 0 0 2px rgba(0,0,0,.4)",
});
export const dotWarn = style({
  background: "#ffba2b",
  boxShadow: "0 0 8px #ffba2b, inset 0 0 2px rgba(0,0,0,.4)",
});
export const dotAlarm = style({
  background: "#ff5e6a",
  boxShadow: "0 0 10px #ff5e6a, inset 0 0 2px rgba(0,0,0,.4)",
  animation: `${pulse} 1s infinite`,
});
export const code = style({
  color: "#6f96c4",
  fontFamily: MONO,
  fontSize: "11px",
  letterSpacing: ".08em",
  marginRight: "10px",
});
export const unit = style({
  color: "#9dc1ff",
  fontSize: "11px",
  marginLeft: "4px",
  textTransform: "lowercase",
});

// ---- primitive theming ----
globalStyle(`${tele} [data-part="header"]`, {
  background: "#082238",
  borderBottom: "1px solid rgba(157,193,255,.28)",
});
globalStyle(`${tele} [data-part="header-cell"]`, {
  alignItems: "center",
  color: "#9dc1ff",
  display: "flex",
  fontFamily: SANS,
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: ".16em",
  padding: "0 16px",
  textTransform: "uppercase",
  height: "38px",
});
globalStyle(
  `${tele} [data-part="header-cell"][data-sort-direction="desc"]::after`,
  {
    content: '"▼"',
    marginLeft: "8px",
    color: "#36e3a3",
    fontSize: "8px",
  },
);
globalStyle(
  `${tele} [data-part="header-cell"][data-sort-direction="asc"]::after`,
  {
    content: '"▲"',
    marginLeft: "8px",
    color: "#36e3a3",
    fontSize: "8px",
  },
);
globalStyle(`${tele} [data-part="row"]`, {
  borderBottom: "1px solid rgba(157,193,255,.08)",
  transition: "background .15s",
});
globalStyle(`${tele} [data-part="row"]:hover`, {
  background: "rgba(157,193,255,.04)",
});
globalStyle(`${tele} [data-part="row"][data-selected="true"]`, {
  background:
    "linear-gradient(90deg, rgba(54,227,163,.14), rgba(54,227,163,0) 70%)",
  boxShadow: "inset 3px 0 0 #36e3a3",
});
// per-row alarm/warn tint, keyed off the rendered status dot
globalStyle(`${tele} [data-part="row"]:has(.${dotAlarm})`, {
  background:
    "linear-gradient(90deg, rgba(255,94,106,.16), rgba(255,94,106,0) 70%)",
});
globalStyle(`${tele} [data-part="cell"]`, {
  alignItems: "center",
  display: "flex",
  padding: "0 16px",
  fontFamily: MONO,
  fontSize: "13px",
  color: "#c8e1ff",
});

interface Col {
  readonly flex: string;
  readonly end?: boolean;
  readonly center?: boolean;
  readonly cell?: Record<string, string | number>;
}
const cols: readonly Col[] = [
  { flex: "0 0 38px", center: true },
  {
    flex: "0 0 110px",
    cell: {
      color: "#9dc1ff",
      fontSize: "11px",
      letterSpacing: ".12em",
      textTransform: "uppercase",
    },
  },
  {
    flex: "1 1 280px",
    cell: {
      color: "#fff",
      fontFamily: SANS,
      fontSize: "13px",
      letterSpacing: "-.005em",
    },
  },
  {
    flex: "0 0 130px",
    end: true,
    cell: {
      fontSize: "16px",
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
    },
  },
  {
    flex: "0 0 160px",
    end: true,
    cell: { color: "#6f96c4", fontSize: "11px", letterSpacing: ".04em" },
  },
  {
    flex: "0 0 120px",
    end: true,
    cell: { color: "#9dc1ff", fontSize: "12px", letterSpacing: ".04em" },
  },
];
cols.forEach((col, i) => {
  const n = i + 1;
  const both = `${tele} [data-part="header-cell"]:nth-child(${n}), ${tele} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  const align = col.end
    ? { justifyContent: "flex-end" }
    : col.center
      ? { justifyContent: "center" }
      : {};
  globalStyle(both, { flex: col.flex, ...align });
  if (col.cell !== undefined) {
    globalStyle(
      `${tele} [data-part="row"] [data-part="cell"]:nth-child(${n})`,
      col.cell,
    );
  }
});
// value cell (col 4) recolours on alarm / caution rows
globalStyle(
  `${tele} [data-part="row"]:has(.${dotAlarm}) [data-part="cell"]:nth-child(4)`,
  {
    color: "#ff5e6a",
  },
);
globalStyle(
  `${tele} [data-part="row"]:has(.${dotWarn}) [data-part="cell"]:nth-child(4)`,
  {
    color: "#ffba2b",
  },
);
