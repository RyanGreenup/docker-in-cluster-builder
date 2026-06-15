import type { JSX } from "solid-js";

export type CarouselImage = JSX.ImgHTMLAttributes<HTMLImageElement>;

export type AtLeastThree<Item> = [Item, Item, Item, ...Item[]];

export type AtLeastThreeImages = AtLeastThree<CarouselImage>;

/** Direction of a navigation control relative to the selected slide. */
export type CarouselDirection = "next" | "previous";

/**
 * Per-part class overrides. The primitive keeps full ownership of the
 * state-machine-critical `root` and `track` classes (skins are merged onto
 * them); for every other part a provided class fully replaces the primitive's
 * structural default, so a design contract can repaint the carousel without
 * fighting the base presentation. Slide selection, control visibility and
 * indicator state are driven by `data-*` attributes, so overriding presentation
 * never breaks behaviour.
 */
export interface CarouselClassNames {
  root?: string;
  stage?: string;
  viewport?: string;
  track?: string;
  item?: string;
  controls?: string;
  control?: string;
  indicators?: string;
  indicator?: string;
}

interface CarouselCommonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Stable namespace for this carousel's radio inputs and labels. It must be
   * unique for every carousel rendered on the same document, including across
   * independently-rendered SSR islands.
   */
  key: string;
  scrollable?: boolean;
  /** Per-part class overrides applied by a design-contract skin. */
  classes?: CarouselClassNames;
  /**
   * Render custom content (e.g. an arrow icon) inside each previous/next
   * control. Defaults to the text "Previous" / "Next".
   */
  renderControl?: (direction: CarouselDirection, slideIndex: number) => JSX.Element;
  /**
   * Render custom content (e.g. a dot) inside each indicator. Defaults to the
   * 1-based slide number.
   */
  renderIndicator?: (slideIndex: number) => JSX.Element;
  /** Accessible label for the indicator group. Defaults to "Choose slide". */
  indicatorsLabel?: string;
}

/** Image-track carousel: each slide is a plain `<img>`. */
export interface CarouselImagesProps extends CarouselCommonProps {
  images: AtLeastThreeImages;
  slides?: never;
}

/** Content carousel: each slide is arbitrary markup supplied by a skin. */
export interface CarouselSlidesProps extends CarouselCommonProps {
  slides: AtLeastThree<JSX.Element>;
  images?: never;
}

export type CarouselProps = CarouselImagesProps | CarouselSlidesProps;
