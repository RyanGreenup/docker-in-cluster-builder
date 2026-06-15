import { createTheme } from "@vanilla-extract/css";

import { rangerVars } from "./theme.css";

/*
 * Public theme API for the RangerModal primitive.
 *
 * The contract and the built-in skin live in `theme.css.ts` (a vanilla-extract
 * file, which may only export styles/vars). This plain module re-exports them
 * and adds the `createRangerTheme` factory: a `.css.ts` file cannot export a
 * function, but the factory must call `createTheme` so that wrapping it here
 * keeps the contract/tokens overload resolved inside this package. Consumers
 * (e.g. the storybook Exemplar) call the factory from their own `.css.ts` and
 * vanilla-extract still extracts the generated theme.
 */
export { rangerVars, rangerTheme, tagVars } from "./theme.css";
export type { RangerTag } from "./theme.css";

interface RangerTagColor {
  fg: string;
  bg: string;
}

/** Concrete token values for a RangerModal skin (the shape of `rangerVars`). */
export interface RangerThemeValues {
  accent: { base: string; border: string; soft: string };
  border: { default: string; subtle: string };
  ease: { out: string };
  fg: { muted: string; onAccent: string; primary: string; secondary: string; tertiary: string };
  font: { mono: string };
  radius: { lg: string; sm: string };
  sp: { lg: string; md: string; sm: string; xl: string; xs: string };
  surface: { base: string; hover: string; raised: string; sunken: string };
  tag: {
    amber: RangerTagColor;
    cyan: RangerTagColor;
    emerald: RangerTagColor;
    neutral: RangerTagColor;
    rose: RangerTagColor;
    violet: RangerTagColor;
  };
  text: { "2xs": string; md: string; sm: string; xs: string };
}

/**
 * Build an alternative skin from the `rangerVars` contract and return its theme
 * class for `RangerModal`'s `themeClass` prop.
 */
export const createRangerTheme = (values: RangerThemeValues): string =>
  createTheme(rangerVars, values);
