import { globalStyle, style } from "@vanilla-extract/css";

// EXEMPLAR 5 · DOSSIER ("Classified case file")
// Manila paper, typewriter type, vermilion stamps, redaction bars. The
// selected row gets a hand-stamped "PULLED" rotated ribbon via ::after.

const TYPE = "'Special Elite', 'Courier New', monospace";
const SANS = "'Inter', sans-serif";

export const dos = style({
  background: [
    "radial-gradient(circle at 20% 20%, rgba(0,0,0,.05) 0 .5px, transparent .5px)",
    "radial-gradient(circle at 70% 60%, rgba(0,0,0,.04) 0 .5px, transparent .5px)",
    "#ebe5d4",
  ].join(","),
  backgroundSize: "5px 5px, 7px 7px, auto",
  color: "#1f1a14",
  fontFamily: TYPE,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "32px 44px 28px",
  position: "relative",
  overflow: "hidden",
});
globalStyle(`${dos}::after`, {
  content: '""',
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.08) 100%)",
  pointerEvents: "none",
});

export const dsHeader = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "start",
  gap: "28px",
  marginBottom: "18px",
  position: "relative",
});
export const dsFolder = style({
  fontFamily: TYPE,
  fontSize: "11px",
  letterSpacing: ".12em",
  lineHeight: 1.5,
  color: "#1f1a14",
});
globalStyle(`${dsFolder} b`, {
  display: "block",
  fontFamily: SANS,
  fontWeight: 800,
  fontSize: "22px",
  letterSpacing: ".04em",
  marginTop: "2px",
});
export const dsClassified = style({
  border: "3px double #9b1f1f",
  color: "#9b1f1f",
  padding: "6px 14px",
  fontFamily: TYPE,
  fontSize: "16px",
  letterSpacing: ".22em",
  textAlign: "center",
  lineHeight: 1.2,
  transform: "rotate(-2deg)",
  alignSelf: "center",
});
globalStyle(`${dsClassified} small`, {
  display: "block",
  fontSize: "9px",
  letterSpacing: ".18em",
  color: "#9b1f1f",
  marginTop: "2px",
  opacity: 0.8,
});
export const dsMeta = style({
  textAlign: "right",
  fontFamily: TYPE,
  fontSize: "11px",
  letterSpacing: ".1em",
  lineHeight: 1.6,
  color: "#1f1a14",
});
globalStyle(`${dsMeta} b`, { color: "#9b1f1f", fontWeight: 400 });

export const dsTitleBar = style({
  borderTop: "2px solid #1f1a14",
  borderBottom: "2px solid #1f1a14",
  padding: "8px 0",
  marginBottom: "14px",
  fontFamily: TYPE,
  fontSize: "12px",
  letterSpacing: ".14em",
  display: "flex",
  justifyContent: "space-between",
});
globalStyle(`${dsTitleBar} b`, { color: "#9b1f1f" });

export const dsTableWrap = style({
  flex: 1,
  minHeight: 0,
  position: "relative",
  zIndex: 1,
});

export const dsFooter = style({
  borderTop: "2px solid #1f1a14",
  marginTop: "12px",
  paddingTop: "10px",
  display: "flex",
  justifyContent: "space-between",
  fontFamily: TYPE,
  fontSize: "10px",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#1f1a14",
  position: "relative",
  zIndex: 1,
});
globalStyle(`${dsFooter} b`, { color: "#9b1f1f" });
export const dsPage = style({
  border: "1.5px solid #1f1a14",
  padding: "2px 8px",
});

// cell content classes
export const redact = style({
  background: "#1f1a14",
  color: "transparent",
  padding: "0 4px",
  userSelect: "none",
});
export const stamp = style({
  border: "1.5px solid currentColor",
  padding: "2px 6px",
  fontSize: "10px",
  letterSpacing: ".16em",
  textTransform: "uppercase",
});
export const stampTop = style({ color: "#9b1f1f" });
export const stampSecret = style({
  color: "#9b1f1f",
  background: "rgba(155,31,31,.08)",
});
export const stampConf = style({ color: "#6a4a14" });
export const stampUnclas = style({ color: "#4a5a14" });

// ---- primitive theming ----
globalStyle(`${dos} [data-part="header"]`, { background: "transparent" });
globalStyle(`${dos} [data-part="header-row"]`, {
  borderTop: "1px solid #1f1a14",
  borderBottom: "1px solid #1f1a14",
  height: "32px",
});
globalStyle(`${dos} [data-part="header-cell"]`, {
  alignItems: "center",
  color: "#1f1a14",
  display: "flex",
  fontFamily: TYPE,
  fontSize: "11px",
  letterSpacing: ".14em",
  padding: "0 10px",
  textTransform: "uppercase",
});
globalStyle(
  `${dos} [data-part="header-cell"][data-sort-direction="asc"]::after`,
  {
    content: '" ▲"',
    marginLeft: "6px",
    color: "#9b1f1f",
    fontSize: "9px",
  },
);
globalStyle(
  `${dos} [data-part="header-cell"][data-sort-direction="desc"]::after`,
  {
    content: '" ▼"',
    marginLeft: "6px",
    color: "#9b1f1f",
    fontSize: "9px",
  },
);
globalStyle(`${dos} [data-part="row"]`, {
  borderBottom: "1px dashed rgba(31,26,20,.4)",
  alignItems: "center",
});
globalStyle(`${dos} [data-part="row"]:hover`, {
  background: "rgba(31,26,20,.04)",
});
globalStyle(`${dos} [data-part="row"][data-selected="true"]`, {
  background: "rgba(155,31,31,.06)",
  boxShadow: "inset 0 0 0 1.5px #9b1f1f",
});
globalStyle(`${dos} [data-part="row"][data-selected="true"]::after`, {
  content: '"PULLED"',
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%) rotate(-6deg)",
  border: "2.5px solid #9b1f1f",
  color: "#9b1f1f",
  padding: "3px 8px",
  fontFamily: TYPE,
  fontSize: "13px",
  letterSpacing: ".2em",
  background: "rgba(235,229,212,.6)",
  pointerEvents: "none",
});
globalStyle(`${dos} [data-part="cell"]`, {
  alignItems: "center",
  display: "flex",
  fontFamily: TYPE,
  fontSize: "13px",
  padding: "0 10px",
  color: "#1f1a14",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

interface Col {
  readonly flex: string;
  readonly center?: boolean;
  readonly cell?: Record<string, string | number>;
}
const cols: readonly Col[] = [
  { flex: "0 0 110px", cell: { color: "#1f1a14", letterSpacing: ".04em" } },
  {
    flex: "0 0 180px",
    cell: {
      color: "#1f1a14",
      textTransform: "uppercase",
      letterSpacing: ".1em",
      fontSize: "12px",
    },
  },
  { flex: "1 1 240px", cell: { fontSize: "13px", letterSpacing: ".02em" } },
  { flex: "0 0 130px", center: true },
  {
    flex: "0 0 130px",
    cell: { color: "#4a3f2c", fontSize: "12px", letterSpacing: ".04em" },
  },
  {
    flex: "0 0 150px",
    cell: { color: "#1f1a14", fontSize: "12px", letterSpacing: ".04em" },
  },
];
cols.forEach((col, i) => {
  const n = i + 1;
  const both = `${dos} [data-part="header-cell"]:nth-child(${n}), ${dos} [data-part="row"] [data-part="cell"]:nth-child(${n})`;
  globalStyle(both, {
    flex: col.flex,
    ...(col.center ? { justifyContent: "center" } : {}),
  });
  if (col.cell !== undefined) {
    globalStyle(
      `${dos} [data-part="row"] [data-part="cell"]:nth-child(${n})`,
      col.cell,
    );
  }
});
