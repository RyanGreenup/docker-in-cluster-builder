/**
 * The first rendered slide is selected before the user interacts with the
 * carousel.
 */
export const INITIAL_SELECTED_INDEX = 0;

/**
 * Slide indexes are zero-based, so this marks the first valid slide position.
 */
export const FIRST_SLIDE_INDEX = 0;

/**
 * Navigation moves exactly one slide at a time for previous and next controls.
 */
export const SLIDE_INDEX_STEP = 1;

/**
 * A viewport width of zero means layout is not measurable yet, so scroll sync
 * cannot infer a slide index.
 */
export const UNMEASURABLE_VIEWPORT_WIDTH = 0;
