/**
 * Semantic status colour families.
 *
 * Each family carries four roles: `base` (solid), `fg` (text or icon on tint),
 * `bg` (subtle tint fill), and `border` (tint outline). Light and dark are
 * independent value sets, so badges read fg over bg at 7:1 or better in both
 * modes.
 *
 * The families map to ERD enum intent as follows. `success` covers approved,
 * sent, applied, verified, deposited, and active. `warning` covers adjusted
 * (needs re-accept) and expiring. `danger` covers rejected, cancelled
 * (failure), blocked corridor, and error. `info` covers quoted, provisional,
 * and informational. `neutral` covers pending (awaiting), cancelled
 * (withdrawn), disabled, and muted. `promo` covers the promotional rate and
 * promo codes; it is not a status and is never error-like.
 */

// type required: interface lacks an index signature so it can't satisfy
// vanilla-extract NullableTokens
// eslint-disable-next-line typescript/consistent-type-definitions
export type StatusFamily = {
  base: string;
  fg: string;
  bg: string;
  border: string;
};

export type StatusKey = "success" | "warning" | "danger" | "info" | "neutral" | "promo";

export type StatusScale = Record<StatusKey, StatusFamily>;

/** Light-mode status families. */
export const statusLight: StatusScale = {
  success: { base: "#1E9E62", fg: "#0B6B3E", bg: "#E7F6EE", border: "#B6E2C9" },
  warning: { base: "#C9780C", fg: "#8A530A", bg: "#FBF1E1", border: "#F2D9AA" },
  danger: { base: "#D63A3A", fg: "#AC2222", bg: "#FCEAEA", border: "#F2C2C2" },
  info: { base: "#1488C7", fg: "#0E6896", bg: "#E4F3FB", border: "#B5E0F1" },
  neutral: { base: "#6B7A84", fg: "#4D5A63", bg: "#EFF2F4", border: "#DCE3E7" },
  promo: { base: "#7C4DD6", fg: "#5B33A8", bg: "#F1EAFC", border: "#D9C6F4" },
};

/** Dark-mode status families — deep desaturated tint bg + light fg. */
export const statusDark: StatusScale = {
  success: { base: "#2FAE70", fg: "#6FD89B", bg: "#122A20", border: "#245238" },
  warning: { base: "#D9952B", fg: "#F0C079", bg: "#2A2110", border: "#4E3C18" },
  danger: { base: "#E15B5B", fg: "#F19A9A", bg: "#2C1718", border: "#56282A" },
  info: { base: "#34A6DC", fg: "#84CFEF", bg: "#0F2630", border: "#235365" },
  neutral: { base: "#7E8C95", fg: "#AEB9C2", bg: "#1B242C", border: "#323C45" },
  promo: { base: "#9B79E0", fg: "#C3ACEF", bg: "#221A38", border: "#3E305F" },
};
