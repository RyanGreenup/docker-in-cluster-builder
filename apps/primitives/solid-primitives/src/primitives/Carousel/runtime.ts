import { createSignal, type Accessor, type JSX, type Setter } from "solid-js";

import {
  FIRST_SLIDE_INDEX,
  INITIAL_SELECTED_INDEX,
  SLIDE_INDEX_STEP,
  UNMEASURABLE_VIEWPORT_WIDTH,
} from "./constants";
import * as styles from "./style.css";

import type { AtLeastThree, AtLeastThreeImages, CarouselProps } from "./types";

export interface CarouselRuntime {
  baseId: Accessor<string>;
  fieldName: Accessor<string>;
  slideCount: Accessor<number>;
  /** `[0, 1, …, slideCount - 1]` — the iteration source for every slide-keyed list. */
  indices: Accessor<number[]>;
  images: Accessor<AtLeastThreeImages | undefined>;
  slides: Accessor<AtLeastThree<JSX.Element> | undefined>;
  selectIndex: (index: number) => void;
  selectedIndex: Accessor<number>;
}

export interface CarouselSetup {
  rootClass: Accessor<string>;
  runtime: CarouselRuntime;
  scrollabilityAttribute: Accessor<string>;
  setViewportElement: (element: HTMLDivElement) => void;
  syncIndexFromScroll: JSX.EventHandler<HTMLDivElement, Event>;
}

type CarouselLocalProps = Pick<
  CarouselProps,
  "class" | "classes" | "id" | "images" | "key" | "scrollable" | "slides"
>;

interface CarouselSelection {
  selectIndex: (index: number) => void;
  selectedIndex: Accessor<number>;
  setViewportElement: (element: HTMLDivElement) => void;
  syncIndexFromScroll: JSX.EventHandler<HTMLDivElement, Event>;
}

interface SelectCarouselIndexParams {
  clampIndex: (index: number) => number;
  index: number;
  isScrollable: Accessor<boolean>;
  setSelectedIndex: Setter<number>;
  viewportElement: Accessor<HTMLDivElement | undefined>;
}

interface SyncCarouselIndexParams {
  clampIndex: (index: number) => number;
  event: Event & { currentTarget: HTMLDivElement; target: Element };
  isScrollable: Accessor<boolean>;
  setSelectedIndex: Setter<number>;
}

const joinClassNames = (...classNames: (string | undefined)[]): string =>
  classNames.filter(Boolean).join(" ");

const createScrollabilityAttribute =
  (isScrollable: Accessor<boolean>): Accessor<string> =>
  () => {
    if (isScrollable()) {
      return "true";
    }

    return "false";
  };

const selectCarouselIndex = (params: SelectCarouselIndexParams): void => {
  const nextIndex = params.clampIndex(params.index);

  params.setSelectedIndex(nextIndex);

  const viewport = params.viewportElement();

  if (params.isScrollable() && viewport !== undefined) {
    viewport.scrollTo({
      behavior: "smooth",
      left: viewport.clientWidth * nextIndex,
    });
  }
};

const syncCarouselIndexFromScroll = (params: SyncCarouselIndexParams): void => {
  if (!params.isScrollable()) {
    return;
  }

  const viewport = params.event.currentTarget;
  const slideWidth = viewport.clientWidth;

  if (slideWidth === UNMEASURABLE_VIEWPORT_WIDTH) {
    return;
  }

  params.setSelectedIndex(params.clampIndex(Math.round(viewport.scrollLeft / slideWidth)));
};

const createCarouselSelection = (
  slideCount: Accessor<number>,
  isScrollable: Accessor<boolean>,
): CarouselSelection => {
  const [selectedIndex, setSelectedIndex] = createSignal(INITIAL_SELECTED_INDEX);
  const [viewportElement, setViewportElementSignal] = createSignal<HTMLDivElement>();
  const clampIndex = (index: number): number =>
    Math.max(FIRST_SLIDE_INDEX, Math.min(index, slideCount() - SLIDE_INDEX_STEP));
  const selectIndex = (index: number): void => {
    selectCarouselIndex({
      clampIndex,
      index,
      isScrollable,
      setSelectedIndex,
      viewportElement,
    });
  };
  const setViewportElement = (element: HTMLDivElement): void => {
    setViewportElementSignal(element);
  };
  const syncIndexFromScroll: JSX.EventHandler<HTMLDivElement, Event> = (event) => {
    syncCarouselIndexFromScroll({
      clampIndex,
      event,
      isScrollable,
      setSelectedIndex,
    });
  };

  return {
    selectIndex,
    selectedIndex,
    setViewportElement,
    syncIndexFromScroll,
  };
};

export const createCarouselSetup = (local: CarouselLocalProps): CarouselSetup => {
  const baseId = (): string => local.key;
  const fieldName = (): string => `${baseId()}-carousel`;
  const images = (): AtLeastThreeImages | undefined => local.images;
  const slides = (): AtLeastThree<JSX.Element> | undefined => local.slides;
  const slideCount = (): number => (local.slides ?? local.images ?? []).length;
  const indices = (): number[] => Array.from({ length: slideCount() }, (_unused, index) => index);
  const isScrollable = (): boolean => local.scrollable ?? true;
  const rootClass = (): string => joinClassNames(styles.root, local.classes?.root, local.class);
  const selection = createCarouselSelection(slideCount, isScrollable);

  return {
    rootClass,
    runtime: { baseId, fieldName, images, indices, slideCount, slides, ...selection },
    scrollabilityAttribute: createScrollabilityAttribute(isScrollable),
    setViewportElement: selection.setViewportElement,
    syncIndexFromScroll: selection.syncIndexFromScroll,
  };
};
