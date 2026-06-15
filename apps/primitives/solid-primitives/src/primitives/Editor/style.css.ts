import { style } from "@vanilla-extract/css";

export const shell = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
});

export const wysiwygWrapper = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const editorArea = style({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

export const editorContent = style({
  padding: "28px 32px",
  minHeight: "300px",
  maxWidth: "72ch",
  margin: "0 auto",
  outline: "none",
  fontSize: "16px",
  lineHeight: "1.75",
});

export const toolbar = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "2px",
  padding: "6px 8px",
});

export const divider = style({
  width: "1px",
  height: "20px",
  margin: "0 2px",
  flexShrink: 0,
});

export const btn = style({
  display: "grid",
  placeItems: "center",
  padding: "5px",
  borderRadius: "4px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transition: "background 120ms, color 120ms",
});

export const textarea = style({
  width: "100%",
  height: "100%",
  minHeight: "300px",
  padding: "16px",
  resize: "none",
  border: "none",
  outline: "none",
  fontSize: "14px",
  lineHeight: "1.6",
});

export const cmContainer = style({
  height: "100%",
});

export const mathPopover = style({
  position: "fixed",
  zIndex: 50,
  display: "grid",
  gap: "6px",
  padding: "8px",
  minWidth: "280px",
  maxWidth: "360px",
  borderRadius: "8px",
  border: "1px solid rgba(0, 0, 0, 0.15)",
  background: "Canvas",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
});

export const mathPopoverInput = style({
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  borderRadius: "4px",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  outline: "none",
  fontFamily: "monospace",
  fontSize: "13px",
});

export const mathPopoverPreview = style({
  display: "grid",
  placeItems: "center",
  minHeight: "28px",
  padding: "4px",
  overflowX: "auto",
});
