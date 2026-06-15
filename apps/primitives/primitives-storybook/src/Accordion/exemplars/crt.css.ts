import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const blink = keyframes({ "50%": { opacity: 0 } });

export const crt = style({
  background: "#060a06",
  color: "#9bff9b",
  fontFamily: "'VT323', monospace",
  padding: "56px 52px",
  minHeight: "100%",
  position: "relative",
  overflow: "hidden",
  textShadow: "0 0 4px rgba(120,255,140,.6), 0 0 1px rgba(120,255,140,.9)",
});

globalStyle(`${crt}::before`, {
  content: '""',
  position: "absolute",
  inset: 0,
  backgroundImage:
    "repeating-linear-gradient(to bottom, rgba(255,255,255,.04) 0px, rgba(255,255,255,.04) 1px, transparent 1px, transparent 3px)",
  pointerEvents: "none",
  mixBlendMode: "screen",
});

globalStyle(`${crt}::after`, {
  content: '""',
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)",
  pointerEvents: "none",
});

export const crtBar = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  borderBottom: "1px solid #1f4a1f",
  paddingBottom: "10px",
  fontSize: "22px",
  letterSpacing: ".05em",
});

globalStyle(`${crtBar} span:last-child`, {
  fontSize: "18px",
  color: "#5cb05c",
});

export const crtH1 = style({
  fontSize: "44px",
  lineHeight: 1,
  margin: "22px 0 6px",
  letterSpacing: ".02em",
});

export const crtSub = style({
  fontSize: "20px",
  color: "#5cb05c",
  margin: "0 0 28px",
});

export const crtLine = style({
  display: "block",
  color: "#5cb05c",
});

globalStyle(`${crtLine}::before`, {
  content: '"> "',
  color: "#9bff9b",
});

globalStyle(`${crt} [data-part="root"]`, {
  borderBottom: "1px dashed #1f4a1f",
});

globalStyle(`${crt} [data-part="trigger"]`, {
  padding: "14px 0",
  fontSize: "22px",
  letterSpacing: ".02em",
});

globalStyle(`${crt} [data-part="title"]`, {
  display: "flex",
  gap: "14px",
  alignItems: "baseline",
});

globalStyle(`${crt} [data-part="title"]::before`, {
  content: '"$"',
  color: "#5cb05c",
});

globalStyle(`${crt} [data-part="title"]::after`, {
  content: '"_"',
  color: "#9bff9b",
  marginLeft: "6px",
  animation: `${blink} 1.05s steps(1,end) infinite`,
  opacity: 0,
});

globalStyle(
  `${crt} [data-part="root"]:has(input:checked) [data-part="title"]::after`,
  {
    opacity: 1,
  },
);

globalStyle(`${crt} [data-part="icon"]`, {
  width: "auto",
  height: "auto",
});

globalStyle(`${crt} [data-part="icon"] > svg`, {
  display: "none",
});

globalStyle(`${crt} [data-part="icon"]::before`, {
  content: '"▸"',
  fontSize: "18px",
  color: "#5cb05c",
  display: "inline-block",
  transition: "transform .25s ease, color .2s",
});

globalStyle(
  `${crt} [data-part="root"]:has(input:checked) [data-part="icon"]::before`,
  {
    transform: "rotate(90deg)",
    color: "#9bff9b",
  },
);

globalStyle(`${crt} [data-content-inner]`, {
  padding: "4px 0 18px 18px",
  fontSize: "19px",
  lineHeight: 1.45,
  color: "#7fd07f",
  borderLeft: "1px solid #1f4a1f",
  marginLeft: "14px",
});

globalStyle(`${crt} [data-content-inner] b`, {
  color: "#9bff9b",
  fontWeight: 400,
});
