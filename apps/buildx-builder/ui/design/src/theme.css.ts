import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css";

import { rolesDark, rolesLight } from "./palette/roles";
import { statusDark, statusLight } from "./palette/status";

/**
 * Typed theme contract.
 *
 * `createGlobalThemeContract` turns the `rolesLight`/`statusLight` shapes into a
 * set of typed CSS custom properties with **stable, unhashed** names
 * (`--roles-brand-primary`, `--status-success-bg`, …). The light values are
 * written on `:root`; the dark values override under `prefers-color-scheme:
 * dark`. Components never touch raw hex — they read `vars.roles.*` /
 * `vars.status.*` (via recipes), so colour flips automatically.
 *
 * `roles`  — surface / text / border / brand / accent semantic roles.
 * `status` — the six status families (bg / fg / border / base).
 *
 * These names are deliberately distinct from the hand-authored vars in
 * `global.css`, so this contract is additive and breaks nothing.
 */
const shape = { roles: rolesLight, status: statusLight };

export const vars = createGlobalThemeContract(
  shape,
  (_value: string | null, path: readonly string[]) => path.join("-"),
);

createGlobalTheme(":root", vars, { roles: rolesLight, status: statusLight });

// System preference dark mode (when no explicit choice is made).
globalStyle(":root", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(vars, { roles: rolesDark, status: statusDark }),
    },
  },
});

// Explicit attribute overrides (ThemeToggle island writes these, beating the media query).
globalStyle(":root[data-theme='dark']", {
  vars: assignVars(vars, { roles: rolesDark, status: statusDark }),
});

globalStyle(":root[data-theme='light']", {
  vars: assignVars(vars, { roles: rolesLight, status: statusLight }),
});
