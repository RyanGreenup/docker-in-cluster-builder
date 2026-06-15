import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../theme.css";
import { font, radius, space, textSize, transition } from "../tokens";

/**
 * The button recipe — the single source of truth for button styling.
 *
 * `base` carries only mode-invariant tokens (radius, font, spacing, motion).
 * Every colour is read from the typed theme contract (`vars.roles.*` /
 * `vars.status.*`), so variants flip light/dark automatically and no component
 * ever hard-codes a value.
 */
export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space["2"],
    fontFamily: font.sans,
    fontWeight: "600",
    lineHeight: "1",
    whiteSpace: "nowrap",
    borderRadius: radius.md,
    border: "1px solid transparent",
    cursor: "pointer",
    transition: transition.fast,
    selectors: {
      "&:focus-visible": {
        outline: "none",
        boxShadow: `0 0 0 3px ${vars.roles.brand.ring}`,
      },
      "&:disabled": {
        opacity: "0.45",
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    variant: {
      primary: {
        background: vars.roles.brand.primary,
        color: vars.roles.brand.onPrimary,
        selectors: {
          "&:hover:not(:disabled)": { background: vars.roles.brand.primaryHover },
          "&:active:not(:disabled)": { background: vars.roles.brand.primaryActive },
        },
      },
      secondary: {
        background: vars.roles.bg.raised,
        color: vars.roles.fg.base,
        borderColor: vars.roles.border.strong,
        selectors: {
          "&:hover:not(:disabled)": { background: vars.roles.bg.hover },
        },
      },
      ghost: {
        background: "transparent",
        color: vars.roles.brand.primary,
        selectors: {
          "&:hover:not(:disabled)": { background: vars.roles.brand.primarySubtle },
        },
      },
      danger: {
        background: vars.status.danger.base,
        color: vars.roles.brand.onPrimary,
        selectors: {
          "&:hover:not(:disabled)": { filter: "brightness(0.95)" },
        },
      },
      // Text-link action (the hi-fi `.linkbtn`): no chrome, brand-primary text,
      // a small hit-area expanded via negative margin so the visual stays inline
      // with body copy while the click target meets minimum size. The
      // padding + cancelling negative margin live in `compoundVariants` below so
      // they win over the independent `size` group's padding (see that entry).
      link: {
        background: "transparent",
        color: vars.roles.brand.primary,
        borderColor: "transparent",
        borderRadius: radius.sm,
        fontSize: textSize.sm,
        // Hover tint only on devices that actually hover (matches the hi-fi
        // `@media (hover: hover)` guard, so touch taps don't leave it tinted).
        "@media": {
          "(hover: hover)": {
            selectors: {
              "&:hover:not(:disabled)": { background: vars.roles.brand.primarySubtle },
            },
          },
        },
      },
    },
    size: {
      sm: { fontSize: textSize.sm, padding: `${space["1"]} ${space["3"]}` },
      md: { fontSize: textSize.md, padding: `${space["2"]} ${space["5"]}` },
      lg: { fontSize: textSize.lg, padding: `${space["3"]} ${space["6"]}` },
    },
    fullWidth: {
      true: { width: "100%" },
      false: {},
    },
  },
  // `variant` and `size` are independent variant groups, and the component always
  // applies a `size` (default `md`). Because `compoundVariants` are emitted after
  // the regular `variants` groups, keying the link's hit-area here re-asserts its
  // padding over whatever `size` padding is in play — at any size.
  compoundVariants: [
    {
      variants: { variant: "link" },
      style: {
        // hi-fi padding is 6px 8px; nearest on-grid tokens are 4px / 8px. The
        // cancelling negative margin mirrors the padding so layout stays flush
        // (the hit-area expansion adds no visual box, keeping the link inline).
        padding: `${space["1"]} ${space["2"]}`,
        margin: `-${space["1"]} -${space["2"]}`,
      },
    },
  ],
  defaultVariants: { variant: "primary", size: "md", fullWidth: false },
});

/**
 * The loading spinner shown inside a button. Sizes to the text (`1em`) and
 * inherits `currentColor`, so it reads correctly on every variant. Uses the
 * global `spin` keyframe defined in this package's `global.css`.
 */
export const buttonSpinner = style({
  width: "1em",
  height: "1em",
  flexShrink: 0,
  borderRadius: "50%",
  border: "2px solid color-mix(in srgb, currentColor 35%, transparent)",
  borderTopColor: "currentColor",
  animation: "spin 0.7s linear infinite",
});
