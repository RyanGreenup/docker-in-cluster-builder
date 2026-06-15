import { globalStyle, style } from "@vanilla-extract/css";

const SANS = "'IBM Plex Sans', 'Inter', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

export const stage = style({
  background: "#f3f0e8",
  color: "#17201c",
  fontFamily: SANS,
  minHeight: "100vh",
});

export const shell = style({
  background: "#f3f0e8",
  vars: {
    "--dashboard-layout-nav-height": "64px",
    "--dashboard-layout-bottom-bar-height": "68px",
    "--dashboard-layout-sidebar-width": "264px",
    "--dashboard-layout-drawer-width": "300px",
  },
});

export const sidebar = style({
  background: "#20362f",
  borderRight: "1px solid rgba(23,32,28,.18)",
  color: "#f6f2e8",
  padding: "18px 14px",
});

export const navbar = style({
  alignItems: "center",
  background: "rgba(249,247,241,.96)",
  borderBottom: "1px solid #d8d1c0",
  display: "flex",
  gap: "14px",
  justifyContent: "space-between",
  padding: "0 20px",
  "@media": {
    "(max-width: 640px)": {
      gap: "10px",
      padding: "0 12px",
    },
  },
});

export const main = style({
  overflow: "auto",
  padding: "22px",
  "@media": {
    "(max-width: 640px)": {
      padding: "16px 12px 86px",
    },
  },
});

export const scrim = style({
  background: "rgba(23,32,28,.44)",
});

export const bottomBar = style({
  alignItems: "center",
  background: "#fbfaf6",
  borderTop: "1px solid #d8d1c0",
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
});

export const navItem = style({
  alignItems: "center",
  background: "transparent",
  border: 0,
  borderRadius: "6px",
  color: "inherit",
  cursor: "pointer",
  display: "flex",
  font: "inherit",
  gap: "10px",
  minHeight: "40px",
  padding: "0 10px",
  textAlign: "left",
});

export const brand = style({
  alignItems: "center",
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
});

export const mark = style({
  alignItems: "center",
  background: "#f0b43c",
  borderRadius: "6px",
  color: "#17201c",
  display: "grid",
  fontFamily: MONO,
  fontSize: "13px",
  fontWeight: 700,
  height: "36px",
  placeItems: "center",
  width: "36px",
});

export const brandText = style({
  display: "grid",
  gap: "2px",
});

export const brandName = style({
  fontSize: "15px",
  fontWeight: 700,
});

export const brandMeta = style({
  color: "rgba(246,242,232,.66)",
  fontFamily: MONO,
  fontSize: "10px",
  textTransform: "uppercase",
});

export const drawerButton = style({
  alignItems: "center",
  background: "#20362f",
  border: 0,
  borderRadius: "6px",
  color: "#fffaf0",
  cursor: "pointer",
  display: "none",
  fontFamily: SANS,
  fontSize: "13px",
  fontWeight: 700,
  gap: "8px",
  minHeight: "38px",
  padding: "0 12px",
});

export const search = style({
  alignItems: "center",
  background: "#f3f0e8",
  border: "1px solid #d8d1c0",
  borderRadius: "6px",
  display: "flex",
  flex: "1 1 420px",
  maxWidth: "560px",
  minHeight: "38px",
  padding: "0 12px",
});

export const searchInput = style({
  background: "transparent",
  border: 0,
  color: "#17201c",
  flex: 1,
  fontFamily: SANS,
  fontSize: "14px",
  minWidth: 0,
  outline: 0,
});

export const actionGroup = style({
  alignItems: "center",
  display: "flex",
  gap: "10px",
});

export const pill = style({
  alignItems: "center",
  background: "#e8eee6",
  border: "1px solid #bed0bd",
  borderRadius: "999px",
  color: "#274333",
  display: "inline-flex",
  fontFamily: MONO,
  fontSize: "11px",
  gap: "7px",
  minHeight: "28px",
  padding: "0 10px",
  "@media": {
    "(max-width: 640px)": {
      selectors: {
        [`${actionGroup} &`]: {
          display: "none",
        },
      },
    },
  },
});

export const content = style({
  display: "grid",
  gap: "18px",
  margin: "0 auto",
  maxWidth: "1180px",
});

export const headerRow = style({
  alignItems: "end",
  display: "flex",
  gap: "18px",
  justifyContent: "space-between",
  "@media": {
    "(max-width: 640px)": {
      alignItems: "start",
      flexDirection: "column",
    },
  },
});

export const kicker = style({
  color: "#6e6658",
  fontFamily: MONO,
  fontSize: "11px",
  margin: 0,
  textTransform: "uppercase",
});

export const title = style({
  fontSize: "26px",
  fontWeight: 700,
  lineHeight: 1.15,
  margin: "4px 0 0",
});

export const metrics = style({
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  "@media": {
    "(max-width: 900px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "(max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const metric = style({
  background: "#fffdf8",
  border: "1px solid #d8d1c0",
  borderRadius: "8px",
  boxShadow: "0 1px 0 rgba(23,32,28,.04)",
  minHeight: "104px",
  padding: "14px",
});

export const metricLabel = style({
  color: "#6e6658",
  fontFamily: MONO,
  fontSize: "11px",
  textTransform: "uppercase",
});

export const metricValue = style({
  fontSize: "26px",
  fontWeight: 700,
  marginTop: "10px",
});

export const metricDetail = style({
  color: "#4f5f56",
  fontSize: "13px",
  marginTop: "4px",
});

export const panelGrid = style({
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, .75fr)",
  "@media": {
    "(max-width: 900px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const panel = style({
  background: "#fffdf8",
  border: "1px solid #d8d1c0",
  borderRadius: "8px",
  minHeight: 0,
});

export const panelHeader = style({
  alignItems: "center",
  borderBottom: "1px solid #e5decd",
  display: "flex",
  justifyContent: "space-between",
  minHeight: "48px",
  padding: "0 14px",
});

export const panelTitle = style({
  fontSize: "14px",
  fontWeight: 700,
});

export const table = style({
  display: "grid",
});

export const tableRow = style({
  alignItems: "center",
  borderBottom: "1px solid #eee7d8",
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "86px minmax(180px, 1fr) 120px 110px",
  minHeight: "54px",
  padding: "0 14px",
  "@media": {
    "(max-width: 640px)": {
      gridTemplateColumns: "72px minmax(120px, 1fr)",
      padding: "10px 12px",
    },
  },
});

export const code = style({
  color: "#4b594f",
  fontFamily: MONO,
  fontSize: "12px",
});

export const amount = style({
  fontFamily: MONO,
  fontSize: "13px",
  textAlign: "right",
  "@media": {
    "(max-width: 640px)": {
      selectors: {
        [`${tableRow} &`]: {
          justifySelf: "start",
          textAlign: "left",
        },
      },
    },
  },
});

export const status = style({
  borderRadius: "999px",
  fontFamily: MONO,
  fontSize: "11px",
  justifySelf: "end",
  padding: "4px 8px",
  "@media": {
    "(max-width: 640px)": {
      selectors: {
        [`${tableRow} &`]: {
          justifySelf: "start",
          textAlign: "left",
        },
      },
    },
  },
});

export const statusReview = style({
  background: "#fff1d5",
  color: "#725014",
});

export const statusClear = style({
  background: "#e2f2e8",
  color: "#1f653f",
});

export const queue = style({
  display: "grid",
  gap: "10px",
  padding: "14px",
});

export const queueItem = style({
  border: "1px solid #e5decd",
  borderRadius: "8px",
  display: "grid",
  gap: "6px",
  padding: "12px",
});

export const queueTitle = style({
  fontSize: "13px",
  fontWeight: 700,
});

export const queueMeta = style({
  color: "#6e6658",
  fontFamily: MONO,
  fontSize: "11px",
});

globalStyle(`${sidebar} ${navItem}`, {
  color: "rgba(246,242,232,.82)",
  marginBottom: "4px",
  width: "100%",
});

globalStyle(`${sidebar} ${navItem}[aria-current="page"]`, {
  background: "rgba(240,180,60,.16)",
  color: "#fffaf0",
  fontWeight: 700,
});

globalStyle(`${bottomBar} ${navItem}`, {
  alignItems: "center",
  borderRadius: 0,
  color: "#4d5a51",
  display: "grid",
  fontSize: "11px",
  gap: "3px",
  justifyItems: "center",
  minHeight: "67px",
  padding: "6px 4px",
});

globalStyle(`${bottomBar} ${navItem}[aria-current="page"]`, {
  color: "#20362f",
  fontWeight: 700,
});

globalStyle(`${bottomBar} ${navItem} span:first-child`, {
  fontSize: "18px",
  lineHeight: 1,
});

globalStyle(`${shell}[data-viewport="mobile"] ${drawerButton}`, {
  display: "inline-flex",
});

globalStyle(`${shell}[data-viewport="mobile"] ${search}`, {
  flexBasis: "auto",
});
