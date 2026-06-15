import { globalStyle, style } from "@vanilla-extract/css";

import { tokens, vars } from "../../styles/theme.css";

const colors = vars.color.pop;

/**
 * The exemplar mirrors the primitive's supported CSS selector range for
 * zero-based carousel slide states.
 */
const INDICATOR_INDEX_ZERO = 0;

/**
 * The second zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_ONE = 1;

/**
 * The third zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_TWO = 2;

/**
 * The fourth zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_THREE = 3;

/**
 * The fifth zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_FOUR = 4;

/**
 * The sixth zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_FIVE = 5;

/**
 * The seventh zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_SIX = 6;

/**
 * The eighth zero-based slide index used by generated active indicator CSS.
 */
const INDICATOR_INDEX_SEVEN = 7;

const activeIndicatorSelectors = [
  INDICATOR_INDEX_ZERO,
  INDICATOR_INDEX_ONE,
  INDICATOR_INDEX_TWO,
  INDICATOR_INDEX_THREE,
  INDICATOR_INDEX_FOUR,
  INDICATOR_INDEX_FIVE,
  INDICATOR_INDEX_SIX,
  INDICATOR_INDEX_SEVEN,
] as const;

export const carousel = style({
  background: colors.paper,
  border: `2px solid ${colors.ink}`,
  borderRadius: tokens.radius.card,
  boxShadow: `8px 8px 0 ${colors.ink}`,
  maxWidth: "42rem",
  overflow: "hidden",
  padding: "0.75rem",
});

globalStyle(`${carousel} [data-carousel-viewport]`, {
  borderRadius: "calc(0.5rem - 2px)",
});

globalStyle(`${carousel} [data-carousel-item]`, {
  aspectRatio: "16 / 10",
  background: colors.paperShade,
});

globalStyle(`${carousel} img`, {
  display: "block",
});

globalStyle(`${carousel} [data-carousel-control]`, {
  alignItems: "center",
  background: colors.marigold,
  border: `2px solid ${colors.ink}`,
  borderRadius: "999px",
  boxShadow: `3px 3px 0 ${colors.ink}`,
  color: colors.ink,
  display: "inline-flex",
  fontFamily: tokens.font.outfit,
  fontSize: "0",
  justifyContent: "center",
  marginRight: "1rem",
  transition:
    "background-color 160ms ease, box-shadow 160ms ease, opacity 180ms ease, transform 160ms ease",
});

globalStyle(`${carousel} [data-carousel-side="previous"]`, {
  marginLeft: "1rem",
});

globalStyle(`${carousel} [data-carousel-side="next"]`, {
  marginRight: "1rem",
});

globalStyle(`${carousel} [data-carousel-side="previous"]::after`, {
  content: '"‹"',
  fontSize: "1.75rem",
  lineHeight: 1,
  marginTop: "-0.125rem",
});

globalStyle(`${carousel} [data-carousel-side="next"]::after`, {
  content: '"›"',
  fontSize: "1.75rem",
  lineHeight: 1,
  marginTop: "-0.125rem",
});

globalStyle(`${carousel} [data-carousel-control]:hover`, {
  background: colors.pink,
});

globalStyle(`${carousel} [data-carousel-side="previous"]:hover`, {
  transform: "translateY(-50%) translateX(-2px)",
});

globalStyle(`${carousel} [data-carousel-side="next"]:hover`, {
  transform: "translateY(-50%) translateX(2px)",
});

globalStyle(`${carousel} [data-carousel-control][data-carousel-disabled]`, {
  opacity: "0 !important",
});

globalStyle(`${carousel} [data-carousel-indicator]`, {
  alignItems: "center",
  background: colors.paper,
  border: `2px solid ${colors.ink}`,
  borderRadius: "999px",
  color: colors.ink,
  display: "inline-flex",
  fontFamily: tokens.font.outfit,
  fontSize: tokens.text.sm,
  fontWeight: 700,
  justifyContent: "center",
  transition:
    "background-color 160ms ease, box-shadow 160ms ease, color 160ms ease, transform 160ms ease",
});

globalStyle(`${carousel} [data-carousel-indicator]:hover`, {
  background: colors.marigold,
  transform: "translateY(-1px)",
});

for (const index of activeIndicatorSelectors) {
  globalStyle(`${carousel}:has(input[value="${index}"]:checked) [data-carousel-index="${index}"]`, {
    background: colors.pink,
    boxShadow: `2px 2px 0 ${colors.ink}`,
    color: colors.cloud,
  });
}
