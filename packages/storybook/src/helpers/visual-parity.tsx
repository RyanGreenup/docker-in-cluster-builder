import { For, type JSX } from "solid-js";

import { figmaTestId, LIVE_TEST_ID } from "./visual-parity-ids";
import * as styles from "./visual-parity.css";

/** One Figma reference export shown alongside the live component. */
export type FigmaReference = {
  /** Caption shown beneath the specimen. */
  readonly label: string;
  /** Resolved URL of the exported SVG (e.g. via `new URL(..., import.meta.url)`). */
  readonly src: string;
};

export type VisualParityProps = {
  /** The live component under test. */
  readonly live: JSX.Element;
  /** Figma reference exports to compare against, in declaration order. */
  readonly figmas: readonly FigmaReference[];
  /** Caption for the live specimen. Defaults to `"Our component"`. */
  readonly liveLabel?: string;
  /**
   * Square edge of each specimen stage (any CSS length). Defaults to `"52px"`
   * to match the common 52×52 Figma export; override per component to match its
   * artwork so the pixel comparison lines up. For NON-SQUARE artwork use
   * {@link VisualParityProps.stageWidth} / {@link VisualParityProps.stageHeight}
   * instead, which take precedence over this value.
   */
  readonly stageSize?: string;
  /**
   * Stage width for non-square artwork (any CSS length). Overrides the width
   * derived from {@link VisualParityProps.stageSize}. Provide alongside
   * {@link VisualParityProps.stageHeight} so the live SVG and the Figma `<img>`
   * occupy an identically-shaped box — otherwise the `<img>` stretches and the
   * pixel comparison fails for a layout reason, not a design one.
   */
  readonly stageWidth?: string;
  /** Stage height for non-square artwork. See {@link VisualParityProps.stageWidth}. */
  readonly stageHeight?: string;
};

type Specimen = {
  readonly content: JSX.Element;
  readonly label: string;
  readonly testId: string;
};

/**
 * Frames a live component next to its Figma reference SVG(s) for visual-parity
 * stories. Each specimen stage carries a stable `data-testid` from the shared
 * {@link figmaTestId}/{@link LIVE_TEST_ID} contract, which the Playwright
 * visual-parity helper queries — so a new component's parity story is just this
 * one element, with no per-component CSS or hand-typed test ids.
 *
 * The live specimen is placed after the first Figma reference, so the common
 * two-reference case reads `[figma-0] [live] [figma-1]`.
 *
 * @example
 * ```tsx
 * <VisualParity
 *   live={<Arrows />}
 *   figmas={[
 *     { label: "Figma default", src: figmaDefaultSvg },
 *     { label: "Figma hovered", src: figmaHoveredSvg },
 *   ]}
 * />
 * ```
 */
export function VisualParity(props: VisualParityProps): JSX.Element {
  const stageWidth = (): string =>
    props.stageWidth ?? props.stageSize ?? "52px";
  const stageHeight = (): string =>
    props.stageHeight ?? props.stageSize ?? "52px";

  const specimens = (): Specimen[] => {
    const liveSpecimen: Specimen = {
      content: props.live,
      label: props.liveLabel ?? "Our component",
      testId: LIVE_TEST_ID,
    };
    if (props.figmas.length === 0) return [liveSpecimen];

    // Place the live specimen after the first Figma reference, so the common
    // two-reference case reads [figma-0] [live] [figma-1].
    return props.figmas.flatMap((figma, index): Specimen[] => {
      const figmaSpecimen: Specimen = {
        content: (
          <img
            src={figma.src}
            alt={figma.label}
            style={{ height: "100%", width: "100%" }}
          />
        ),
        label: figma.label,
        testId: figmaTestId(index),
      };
      return index === 0 ? [figmaSpecimen, liveSpecimen] : [figmaSpecimen];
    });
  };

  return (
    <div class={styles.comparison}>
      <For each={specimens()}>
        {(specimen) => (
          <figure class={styles.specimen}>
            <div
              class={styles.stage}
              data-testid={specimen.testId}
              style={{ height: stageHeight(), width: stageWidth() }}
            >
              {specimen.content}
            </div>
            <figcaption class={styles.label}>{specimen.label}</figcaption>
          </figure>
        )}
      </For>
    </div>
  );
}
