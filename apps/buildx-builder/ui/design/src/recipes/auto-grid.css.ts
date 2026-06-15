import { autoGridConfig } from "@rs/layout/recipes";
import { recipe } from "@vanilla-extract/recipes";

import { space } from "../tokens";

/** Intrinsic minmax wrap thresholds (geometry, not theme tokens). */
const autoGridMins = { xs: "8rem", sm: "12rem", md: "16rem", lg: "20rem", xl: "24rem" } as const;

/**
 * The breakpoint-free auto-fit grid, bound to the design tokens. The `min`
 * thresholds are intrinsic layout geometry; `gap` reuses the shared scale.
 * Mechanism lives in @rs/layout.
 */
export const autoGrid = recipe(autoGridConfig(space, autoGridMins));
