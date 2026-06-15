import { createTheme, style } from "@vanilla-extract/css";

/**
 * Story-only presentation tokens for the visual-parity specimen comparison.
 *
 * These describe how the docs page *frames* each specimen — they are not part
 * of any shipped component. `specimenTheme` is composed onto the comparison
 * root (see {@link comparison}) so the vars cascade to every specimen rendered
 * inside it. The per-artwork stage size is applied inline by the component
 * (it is the only value that varies between stories), so it lives there rather
 * than in this shared contract.
 */
export const [specimenTheme, vars] = createTheme({
  gap: {
    /** Space between the specimens in the comparison row. */
    comparison: "1.5rem",
    /** Space between a specimen's stage and its caption. */
    specimen: "0.5rem",
  },
  /** Caption column width, keeping labels aligned across specimens. */
  specimenWidth: "8rem",
  label: {
    color: "#4b5563",
    fontSize: "0.8125rem",
    fontWeight: "600",
  },
});

/** Flex row that lays the Figma references either side of the live component. */
export const comparison = style([
  specimenTheme,
  {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: vars.gap.comparison,
  },
]);

/**
 * A single labelled specimen: stage on top, caption beneath.
 *
 * Width is `max-content` with a `vars.specimenWidth` (8rem) floor — NOT a fixed
 * 8rem. A fixed width works for small icon stages (≤ 8rem) but is catastrophic
 * for large artwork: a 426×622 card stage centred in a 128px figure overflows
 * ~150px on each side and visually overlaps the neighbouring specimen, so an
 * element screenshot of one stage captures the other's bleed and the pixel diff
 * compares corrupted images. `max-content` sizes the figure to its widest child
 * (the stage), eliminating the overlap, while `minWidth` keeps the original 8rem
 * caption column for the small-icon case.
 */
export const specimen = style({
  alignItems: "center",
  display: "grid",
  gap: vars.gap.specimen,
  justifyItems: "center",
  minWidth: vars.specimenWidth,
  width: "max-content",
});

/**
 * Frame the artwork is centred within. Its square size is set inline per story
 * (default 52px) so the comparison can match each component's Figma export.
 */
export const stage = style({
  position: "relative",
});

/** Caption typography beneath each specimen. */
export const label = style({
  color: vars.label.color,
  fontSize: vars.label.fontSize,
  fontWeight: vars.label.fontWeight,
  "@media": {
    "(prefers-color-scheme: dark)": {
      color: "#e5e7eb",
    },
  },
});
