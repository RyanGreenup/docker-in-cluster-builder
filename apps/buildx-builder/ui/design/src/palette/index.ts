/**
 * Colour dictionaries, barrel.
 *
 * Two layers: primitives are the raw role-free ramps (teal, blue, slate,
 * violet); roles and status are the theme-dependent semantic dictionaries
 * (light and dark). Both document and mirror the live CSS custom properties
 * in `global.css`.
 */

import { palette } from "./primitives";
import { rolesLight, rolesDark } from "./roles";
import { statusLight, statusDark } from "./status";

export * from "./primitives";
export * from "./roles";
export * from "./status";

/** Everything for one theme, addressable as `colors.light.*` / `colors.dark.*`. */
export const colors = {
  palette,
  light: { ...rolesLight, status: statusLight },
  dark: { ...rolesDark, status: statusDark },
} as const;

export type Colors = typeof colors;
