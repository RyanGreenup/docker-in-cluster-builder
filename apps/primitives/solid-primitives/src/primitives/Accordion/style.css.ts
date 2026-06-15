import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

export const accordionVariantOptions = {
  brand: {},
  collapsible: {},
  default: {},
  sustainability: {},
  white: {},
} as const;

export const accordionSizeOptions = {
  lg: {},
  md: {},
  sm: {},
} as const;

const transition = "300ms ease-in-out";

export const wrapper = recipe({
  base: {},
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export type AccordionStyleVariants = NonNullable<RecipeVariants<typeof wrapper>>;
export type AccordionRecipeSize = NonNullable<AccordionStyleVariants["size"]>;
export type AccordionRecipeVariant = NonNullable<AccordionStyleVariants["variant"]>;

export const input = recipe({
  base: {
    // Visually hide the checkbox while keeping it focusable and in the
    // Accessibility tree, so the accordion is keyboard-operable (Tab + Space).
    // `display:none` / `visibility:hidden` would drop it from the tab order.
    border: 0,
    clip: "rect(0, 0, 0, 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px",
  },
});

export const header = recipe({
  base: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    gap: "0.75em",
    justifyContent: "space-between",
    selectors: {
      // The visually-hidden checkbox can't render its own focus ring, so surface
      // A visible indicator on the trigger when it takes keyboard focus.
      "&:has(input:focus-visible)": {
        outline: "2px solid",
        outlineOffset: "2px",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const title = recipe({
  base: {
    flex: "1 1 auto",
    minWidth: 0,
    textAlign: "left",
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const iconWrapper = recipe({
  base: {
    flexShrink: 0,
    height: "1em",
    position: "relative",
    width: "1em",
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

const iconBase = {
  height: "1em",
  inset: 0,
  position: "absolute",
  transition: `opacity ${transition}, rotate ${transition}`,
  width: "1em",
} as const;

export const plusIcon = recipe({
  base: {
    ...iconBase,
    opacity: 1,
    rotate: "0deg",
    selectors: {
      [`${wrapper.classNames.base}:has(input:checked) &`]: {
        opacity: 0,
        rotate: "90deg",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const minusIcon = recipe({
  base: {
    ...iconBase,
    opacity: 0,
    rotate: "-90deg",
    selectors: {
      [`${wrapper.classNames.base}:has(input:checked) &`]: {
        opacity: 1,
        rotate: "0deg",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const content = recipe({
  base: {
    display: "grid",
    gridTemplateRows: "0fr",
    overflow: "hidden",
    selectors: {
      [`${wrapper.classNames.base}:has(input:checked) &`]: {
        gridTemplateRows: "1fr",
      },
    },
    transition: `grid-template-rows ${transition}`,
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const contentClip = recipe({
  base: {
    // Grid items default to min-height: auto, which refuses to shrink below
    // Their content size — that keeps the 0fr track from collapsing to zero.
    // Keep this private clipping layer separate from data-content-inner so
    // Consumers can safely add padding and borders to their content slot.
    minHeight: 0,
    overflow: "hidden",
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});

export const contentInner = recipe({
  base: {},
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    size: accordionSizeOptions,
    variant: accordionVariantOptions,
  },
});
