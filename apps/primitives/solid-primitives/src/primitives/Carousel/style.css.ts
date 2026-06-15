import { globalStyle, style } from "@vanilla-extract/css";

const selectedTrackOffsets = [
  "0%",
  "-100%",
  "-200%",
  "-300%",
  "-400%",
  "-500%",
  "-600%",
  "-700%",
] as const;

export const root = style({
  display: "grid",
  gap: "0.75rem",
  width: "100%",
});

export const selector = style({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
});

export const stage = style({
  display: "grid",
  position: "relative",
});

export const viewport = style({
  gridArea: "1 / 1",
  overflow: "hidden",
  selectors: {
    [`${root}[data-carousel-scrollable="true"] &`]: {
      WebkitOverflowScrolling: "touch",
      overflowX: "auto",
      overscrollBehaviorX: "contain",
      scrollBehavior: "smooth",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      touchAction: "pan-x",
    },
    [`${root}[data-carousel-scrollable="true"] &::-webkit-scrollbar`]: {
      display: "none",
    },
  },
  width: "100%",
});

export const track = style({
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: "1ms",
    },
  },
  display: "flex",
  transform: "translateX(0%)",
  transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
  width: "100%",
});

export const item = style({
  boxSizing: "border-box",
  display: "grid",
  flex: "0 0 100%",
  gridTemplateAreas: '"image"',
  minWidth: 0,
  position: "relative",
  scrollSnapAlign: "start",
  width: "100%",
});

export const image = style({
  gridArea: "image",
  height: "100%",
  objectFit: "cover",
  width: "100%",
});

export const controls = style({
  gridArea: "1 / 1",
  pointerEvents: "none",
  position: "relative",
  zIndex: 1,
});

/**
 * Behavioural essentials shared by every control regardless of skin. The
 * `data-carousel-*` globalStyle rules below toggle opacity / pointer-events for
 * the active slide's controls, so these stay even when a skin replaces the
 * presentational {@link controlDefault} with its own positioning.
 */
export const controlBase = style({
  cursor: "pointer",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity 180ms ease, transform 180ms ease",
});

/** Default edge positioning used when no skin overrides the control class. */
export const controlDefault = style({
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  minHeight: "2.75rem",
  minWidth: "2.75rem",
  position: "absolute",
  selectors: {
    '&[data-carousel-side="next"]': {
      right: "0.75rem",
    },
    '&[data-carousel-side="previous"]': {
      left: "0.75rem",
    },
  },
  top: "50%",
  transform: "translateY(-50%)",
});

export const indicators = style({
  display: "flex",
  gap: "0.5rem",
  justifyContent: "center",
});

export const indicator = style({
  cursor: "pointer",
  minHeight: "1.5rem",
  minWidth: "1.5rem",
});

for (const [index, offset] of selectedTrackOffsets.entries()) {
  globalStyle(
    `${root}:not([data-carousel-scrollable="true"]):has(input[value="${index}"]:checked) ${track}`,
    {
      transform: `translateX(${offset})`,
    },
  );

  globalStyle(
    `${root}:has(input[value="${index}"]:checked) label[data-carousel-index="${index}"]`,
    {
      pointerEvents: "none",
    },
  );

  globalStyle(
    `${root}:has(input[value="${index}"]:checked) [data-carousel-control][data-carousel-from="${index}"]`,
    {
      opacity: 1,
      pointerEvents: "auto",
    },
  );

  globalStyle(
    `${root}:has(input[value="${index}"]:checked) [data-carousel-control][data-carousel-disabled][data-carousel-from="${index}"]`,
    {
      opacity: 0.3,
      pointerEvents: "none",
    },
  );
}
