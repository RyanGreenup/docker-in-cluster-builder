import { For, Show, splitProps, type JSX } from "solid-js";

import { FIRST_SLIDE_INDEX, SLIDE_INDEX_STEP } from "./constants";
import { createCarouselSetup, type CarouselRuntime } from "./runtime";
import * as styles from "./style.css";

import type { CarouselClassNames, CarouselDirection, CarouselProps } from "./types";

export type {
  AtLeastThree,
  AtLeastThreeImages,
  CarouselClassNames,
  CarouselDirection,
  CarouselImage,
  CarouselImagesProps,
  CarouselProps,
  CarouselSlidesProps,
} from "./types";

/** Presentation hooks a skin supplies to repaint the carousel. */
interface CarouselSkin {
  classes?: CarouselClassNames;
  renderControl?: (direction: CarouselDirection, slideIndex: number) => JSX.Element;
  renderIndicator?: (slideIndex: number) => JSX.Element;
  indicatorsLabel?: string;
}

interface CarouselStageProps {
  runtime: CarouselRuntime;
  /** Whether the viewport is a native-scroll (swipeable) surface. */
  scrollable: () => boolean;
  setViewportElement: (element: HTMLDivElement) => void;
  skin: CarouselSkin;
  syncIndexFromScroll: JSX.EventHandler<HTMLDivElement, Event>;
}

interface CarouselControlProps {
  currentIndex: () => number;
  direction: CarouselDirection;
  isAvailable: () => boolean;
  runtime: CarouselRuntime;
  skin: CarouselSkin;
  targetIndex: () => number;
}

const joinClassNames = (...classNames: (string | undefined)[]): string =>
  classNames.filter(Boolean).join(" ");

/** `tabindex` that makes the scroll surface keyboard-focusable (Safari a11y). */
const SCROLLABLE_TAB_INDEX = 0;

/**
 * Returns `value` only while the viewport is scrollable, else `undefined` — so
 * the swipe surface's keyboard affordances (`tabindex`, `role`, name) attach
 * exclusively in scroll mode and leave no stray tab stop in transform mode.
 */
const whenScrollable = <Value,>(scrollable: boolean, value: Value): Value | undefined => {
  if (scrollable) {
    return value;
  }
  return undefined;
};

/** A skin-provided class fully replaces the primitive default for this part. */
const overrideClass = (skinClass: string | undefined, fallback: string): string =>
  skinClass ?? fallback;

const DEFAULT_CONTROL_LABEL: Record<CarouselDirection, string> = {
  next: "Next",
  previous: "Previous",
};

const controlContent = (
  skin: CarouselSkin,
  direction: CarouselDirection,
  slideIndex: number,
): JSX.Element => skin.renderControl?.(direction, slideIndex) ?? DEFAULT_CONTROL_LABEL[direction];

const SelectorInputs = (props: { runtime: CarouselRuntime }) => (
  <For each={props.runtime.indices()}>
    {(index) => (
      <input
        checked={props.runtime.selectedIndex() === index}
        class={styles.selector}
        id={`${props.runtime.baseId()}-slide-${index}`}
        name={props.runtime.fieldName()}
        onChange={() => props.runtime.selectIndex(index)}
        type="radio"
        value={index}
      />
    )}
  </For>
);

const SlideTrack = (props: { runtime: CarouselRuntime; skin: CarouselSkin }) => {
  const itemClass = (): string => overrideClass(props.skin.classes?.item, styles.item);

  return (
    <div class={joinClassNames(styles.track, props.skin.classes?.track)} data-carousel-track>
      <Show
        fallback={
          <For each={props.runtime.images()}>
            {(imageAttributes) => (
              <div class={itemClass()} data-carousel-item>
                <img
                  {...imageAttributes}
                  class={[styles.image, imageAttributes.class].filter(Boolean).join(" ")}
                />
              </div>
            )}
          </For>
        }
        when={props.runtime.slides()}
      >
        {(slides) => (
          <For each={slides()}>
            {(slide) => (
              <div class={itemClass()} data-carousel-item>
                {slide}
              </div>
            )}
          </For>
        )}
      </Show>
    </div>
  );
};

const CarouselControl = (props: CarouselControlProps) => {
  const controlClass = (): string =>
    joinClassNames(
      styles.controlBase,
      overrideClass(props.skin.classes?.control, styles.controlDefault),
    );

  return (
    <Show
      fallback={
        <span
          aria-hidden="true"
          class={controlClass()}
          data-carousel-control
          data-carousel-disabled
          data-carousel-from={props.currentIndex()}
          data-carousel-side={props.direction}
        >
          {controlContent(props.skin, props.direction, props.currentIndex())}
        </span>
      }
      when={props.isAvailable()}
    >
      <label
        aria-label={`Show ${props.direction} slide`}
        class={controlClass()}
        data-carousel-control
        data-carousel-from={props.currentIndex()}
        data-carousel-side={props.direction}
        for={`${props.runtime.baseId()}-slide-${props.targetIndex()}`}
        onClick={() => props.runtime.selectIndex(props.targetIndex())}
      >
        {controlContent(props.skin, props.direction, props.currentIndex())}
      </label>
    </Show>
  );
};

const CarouselControls = (props: { runtime: CarouselRuntime; skin: CarouselSkin }) => (
  <div class={overrideClass(props.skin.classes?.controls, styles.controls)} data-carousel-controls>
    <For each={props.runtime.indices()}>
      {(index) => {
        const previousIndex = (): number => index - SLIDE_INDEX_STEP;
        const nextIndex = (): number => index + SLIDE_INDEX_STEP;
        const hasPrevious = (): boolean => previousIndex() >= FIRST_SLIDE_INDEX;
        const hasNext = (): boolean => nextIndex() < props.runtime.slideCount();

        return (
          <>
            <CarouselControl
              currentIndex={() => index}
              direction="previous"
              isAvailable={hasPrevious}
              runtime={props.runtime}
              skin={props.skin}
              targetIndex={previousIndex}
            />
            <CarouselControl
              currentIndex={() => index}
              direction="next"
              isAvailable={hasNext}
              runtime={props.runtime}
              skin={props.skin}
              targetIndex={nextIndex}
            />
          </>
        );
      }}
    </For>
  </div>
);

const CarouselStage = (props: CarouselStageProps) => (
  <div class={overrideClass(props.skin.classes?.stage, styles.stage)} data-carousel-stage>
    <div
      aria-label={whenScrollable(props.scrollable(), props.skin.indicatorsLabel ?? "Slides")}
      class={overrideClass(props.skin.classes?.viewport, styles.viewport)}
      data-carousel-viewport
      onScroll={(event) => props.syncIndexFromScroll(event)}
      ref={props.setViewportElement}
      role={whenScrollable(props.scrollable(), "group")}
      tabindex={whenScrollable(props.scrollable(), SCROLLABLE_TAB_INDEX)}
    >
      <SlideTrack runtime={props.runtime} skin={props.skin} />
    </div>

    <CarouselControls runtime={props.runtime} skin={props.skin} />
  </div>
);

const CarouselIndicators = (props: { runtime: CarouselRuntime; skin: CarouselSkin }) => (
  <div
    aria-label={props.skin.indicatorsLabel ?? "Choose slide"}
    class={overrideClass(props.skin.classes?.indicators, styles.indicators)}
  >
    <For each={props.runtime.indices()}>
      {(index) => (
        <label
          aria-label={`Show slide ${index + SLIDE_INDEX_STEP}`}
          class={overrideClass(props.skin.classes?.indicator, styles.indicator)}
          data-carousel-index={index}
          data-carousel-indicator
          for={`${props.runtime.baseId()}-slide-${index}`}
          onClick={() => props.runtime.selectIndex(index)}
        >
          {props.skin.renderIndicator?.(index) ?? index + SLIDE_INDEX_STEP}
        </label>
      )}
    </For>
  </div>
);

export const Carousel = (props: CarouselProps) => {
  const [local, rest] = splitProps(props, [
    "class",
    "classes",
    "id",
    "images",
    "indicatorsLabel",
    "key",
    "renderControl",
    "renderIndicator",
    "scrollable",
    "slides",
  ]);
  const setup = createCarouselSetup(local);
  const skin: CarouselSkin = {
    get classes() {
      return local.classes;
    },
    get indicatorsLabel() {
      return local.indicatorsLabel;
    },
    get renderControl() {
      return local.renderControl;
    },
    get renderIndicator() {
      return local.renderIndicator;
    },
  };

  return (
    <div
      data-carousel-root
      data-carousel-scrollable={setup.scrollabilityAttribute()}
      id={local.id}
      class={setup.rootClass()}
      {...rest}
    >
      <SelectorInputs runtime={setup.runtime} />
      <CarouselStage
        runtime={setup.runtime}
        scrollable={() => setup.scrollabilityAttribute() === "true"}
        setViewportElement={setup.setViewportElement}
        skin={skin}
        syncIndexFromScroll={setup.syncIndexFromScroll}
      />
      <CarouselIndicators runtime={setup.runtime} skin={skin} />
    </div>
  );
};
