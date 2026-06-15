import { style } from "@vanilla-extract/css";

// Structural-only styles: just the layout virtualization needs to function.
// No colours, spacing, or type — theming is layered by a consumer via the
// Data-part attributes emitted by the component.

/*
 * Fills the consumer-provided height (the consumer MUST give an ancestor a
 * bounded height) so the scroll container below becomes a bounded scrollport.
 * Without this the scroll element grows to content height, defeating
 * virtualization — every row renders and the page hangs.
 */
export const root = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
});

export const scrollContainer = style({
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  position: "relative",
});

export const header = style({
  position: "sticky",
  selectors: {
    '&[data-sticky="false"]': {
      position: "static",
    },
  },
  top: 0,
  zIndex: 1,
});

export const headerRow = style({
  display: "flex",
});

export const headerCell = style({
  boxSizing: "border-box",
  flex: "0 0 auto",
  selectors: {
    '&[data-sortable="true"]': {
      cursor: "pointer",
      userSelect: "none",
    },
  },
});

export const rowsViewport = style({
  position: "relative",
  width: "100%",
});

export const row = style({
  display: "flex",
  left: 0,
  position: "absolute",
  top: 0,
  width: "100%",
});

export const cell = style({
  boxSizing: "border-box",
  flex: "0 0 auto",
  overflow: "hidden",
});
