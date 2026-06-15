import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, radius, space, textSize, transition } from "../tokens";

/**
 * The field recipe — input wrapper, input, label, hint, and error-text styles.
 *
 * `base` carries only mode-invariant tokens (font, spacing, radius, motion).
 * All colours are read from the typed theme contract (`vars.roles.*` /
 * `vars.status.*`), so states flip light/dark automatically.
 *
 * Multi-part: the recipe covers the `<input>` itself; helper styles are
 * exported as plain `style()` rules for the label, hint, and error-text spans.
 */
export const fieldInput = recipe({
  base: {
    height: "2.625rem", // 42px
    padding: `0 ${space["3"]}`, // 0 12px
    borderRadius: radius.md,
    border: `1px solid ${vars.roles.border.strong}`,
    background: vars.roles.bg.surface,
    fontFamily: font.sans,
    fontSize: textSize.sm,
    color: vars.roles.fg.base,
    width: "100%",
    boxSizing: "border-box",
    transition: transition.fast,
    selectors: {
      "&::placeholder": { color: vars.roles.fg.subtle },
      "&:focus": {
        outline: "none",
        borderColor: vars.roles.brand.primary,
        boxShadow: `0 0 0 3px ${vars.roles.brand.ring}`,
      },
      "&:disabled": {
        background: vars.roles.bg.sunken,
        color: vars.roles.fg.subtle,
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    state: {
      /** Default: no validation feedback. */
      default: {},
      /** Error: border flips to danger. */
      error: {
        borderColor: vars.status.danger.base,
        selectors: {
          "&:focus": {
            borderColor: vars.status.danger.base,
            boxShadow: `0 0 0 3px color-mix(in srgb, ${vars.status.danger.base} 30%, transparent)`,
          },
        },
      },
    },
  },
  defaultVariants: { state: "default" },
});

/** The field wrapper — column flex with a 4px gap between label / input / hint / error. */
export const fieldRoot = style({
  display: "flex",
  flexDirection: "column",
  gap: space["1"], // space['1'] = 4px (approved token-budget value; no space['1.5'] exists)
});

/** The `<label>` above the input. */
export const fieldLabel = style({
  fontSize: textSize.xs, // 12px
  fontWeight: "600",
  color: vars.roles.fg.base,
  fontFamily: font.sans,
});

/** Optional hint text beneath the input. */
export const fieldHint = style({
  fontSize: textSize["2xs"], // 11px
  color: vars.roles.fg.subtle,
  fontFamily: font.sans,
});

/** Error-text row (icon + message) shown when state === 'error'. */
export const fieldError = style({
  display: "flex",
  alignItems: "center",
  gap: space["1"],
  fontSize: textSize["2xs"], // 11px
  color: vars.status.danger.fg,
  fontFamily: font.sans,
});

globalStyle(`${fieldError} svg`, {
  width: "0.75rem", // 12px
  height: "0.75rem",
  flexShrink: 0,
});
