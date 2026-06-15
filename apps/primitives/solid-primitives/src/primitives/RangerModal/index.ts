/*
 * RangerModal: a ranger-style, keyboard-driven vault browser presented in a
 * modal. Miller-column navigation (parent / current / preview), a filter bar,
 * multi-select with a bulk action bar, inline create/rename/delete, and a
 * keyboard layer (j/k, h/l, space, n, r, d, /, enter).
 *
 * Styling is entirely vanilla-extract and theme-agnostic: every colour, font,
 * radius and space resolves from the `rangerVars` theme contract. The built-in
 * `rangerTheme` skin is applied unless a consumer passes their own `themeClass`
 * (built with `createTheme(rangerVars, { ... })`).
 */
export { RangerModal } from "./RangerModal";
export type { RangerModalProps } from "./RangerModal";
export { rangerVars, rangerTheme, tagVars } from "./theme.css";
export type { RangerTag } from "./theme.css";
export { createRangerTheme } from "./theme";
export type { RangerThemeValues } from "./theme";
export { tagColor } from "./tags";
export {
  isFolder,
  isNote,
  DUMMY_VAULT_TREE,
  findPath,
  mapTree,
  removeFromTree,
  sortNodes,
} from "./rangerTypes";
export type {
  VaultNode,
  VaultNote,
  VaultFolder,
  SortKey,
  ViewMode,
  CreatingState,
} from "./rangerTypes";
