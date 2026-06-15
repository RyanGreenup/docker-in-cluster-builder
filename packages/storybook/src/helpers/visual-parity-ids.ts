/**
 * Shared `data-testid` contract for visual-parity stories and their Playwright
 * specs.
 *
 * The {@link VisualParity} story component stamps these ids onto each specimen
 * stage; the e2e visual-parity helper queries by the same ids. Keeping the
 * contract here — in a dependency-free module — lets the Playwright/Node side
 * import it without pulling in Solid or vanilla-extract, and stops the story and
 * the spec from drifting apart on hand-typed id strings.
 */

/** The stage wrapping the live component under test. */
export const LIVE_TEST_ID = "live";

/** The stage wrapping the Nth Figma reference SVG (0-based, declaration order). */
export const figmaTestId = (index: number): string => `figma-${index}`;
