import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, leading, radius, shadow, space, textSize } from "../tokens";

/**
 * Card recipes provide the generic surface container used to wrap the
 * in-progress transfer, the rate chart, and the transfers table on the hi-fi
 * home.
 *
 * The set has four parts. `card` is the surface shell (surface bg, 1px border,
 * radius-lg, shadow-sm) and offers the variants `pad` (space-6 padding) and
 * `flat` (no shadow). `cardHead` is the header row (title and sub stack on the
 * left, action slot on the right) using flex, align-start, space-between, and
 * gap space-4. `cardTitle` is the title (`<h2>`): semibold text-md, leading-snug
 * sans, fg.base. `cardSub` is the subtitle (`<p>`): regular text-sm,
 * leading-snug sans, fg.muted.
 *
 * All colours come from `vars.*`, so no hard-coded hex appears. Static tokens
 * (radius, shadow, space, font, textSize, leading) are mode-invariant and come
 * from tokens.ts. Font weights are CSS literals; there is no weight token in
 * tokens.ts, which matches the quote-card and kv precedent.
 */

// ---------------------------------------------------------------------------
// card -- surface shell
// ---------------------------------------------------------------------------

/**
 * Card surface: surface bg, 1px base border, radius-lg, shadow-sm.
 *
 * The `pad` variant toggles space-6 (24px) padding (default true). The `flat`
 * variant removes the box-shadow, keeping shadow-sm when false (default false).
 */
export const card = recipe({
  base: {
    background: vars.roles.bg.surface,
    border: `1px solid ${vars.roles.border.base}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  variants: {
    pad: {
      true: { padding: space["6"] },
      false: {},
    },
    flat: {
      true: { boxShadow: "none" },
      false: {},
    },
  },
  defaultVariants: { pad: true, flat: false },
});

// ---------------------------------------------------------------------------
// cardBody -- body slot beneath the header
// ---------------------------------------------------------------------------

/**
 * Card body wrapper. By default it sits within the card's padding (its inset
 * matches the header). The `bleed` variant cancels the card's `space-6` padding
 * on the inline and bottom edges so a full-bleed body such as the transfers
 * table reaches the card edges while the header above it stays inset.
 */
export const cardBody = recipe({
  base: {},
  variants: {
    bleed: {
      true: {
        marginLeft: `calc(-1 * ${space["6"]})`,
        marginRight: `calc(-1 * ${space["6"]})`,
        marginBottom: `calc(-1 * ${space["6"]})`,
      },
      false: {},
    },
  },
  defaultVariants: { bleed: false },
});

// ---------------------------------------------------------------------------
// cardHead -- header row (title/sub stack + action slot)
// ---------------------------------------------------------------------------

/**
 * Header row: flex, align items to the top, push the title stack and the
 * action slot (badge/link) apart, gap space-4 (16px).
 */
export const cardHead = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: space["4"],
});

// ---------------------------------------------------------------------------
// cardTitle -- title (h2)
// ---------------------------------------------------------------------------

/**
 * Title: semibold text-md (16px) / leading-snug sans, fg.base. Resets the
 * browser-default `<h2>` margin.
 */
export const cardTitle = style({
  margin: 0,
  fontFamily: font.sans,
  fontSize: textSize.md,
  fontWeight: "600",
  lineHeight: leading.snug,
  color: vars.roles.fg.base,
});

// ---------------------------------------------------------------------------
// cardSub -- subtitle (p)
// ---------------------------------------------------------------------------

/**
 * Subtitle: regular text-sm (13px) / leading-snug sans, fg.muted.
 *
 * `margin-top: 2px` (hi-fi spec) is off-grid -- there is no 2px space token.
 * Using the nearest token would be space['1'] (4px), which is too large and
 * would change the visual; a literal '2px' preserves the design exactly. Also
 * resets the browser-default `<p>` block margins.
 */
export const cardSub = style({
  margin: 0,
  marginTop: "2px", // hi-fi spec -- off-grid, no 2px token; literal preserves design
  fontFamily: font.sans,
  fontSize: textSize.sm,
  fontWeight: "400",
  lineHeight: leading.snug,
  color: vars.roles.fg.muted,
});
