import { splitProps, type Component } from "solid-js";

import { Carousel as BaseCarousel, type CarouselProps } from "../../primitives/Carousel";
import * as styles from "./style.css";

export type { CarouselProps };

export const Carousel: Component<CarouselProps> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);

  const carouselClass = (): string => [styles.carousel, local.class].filter(Boolean).join(" ");

  return <BaseCarousel class={carouselClass()} {...rest} />;
};
