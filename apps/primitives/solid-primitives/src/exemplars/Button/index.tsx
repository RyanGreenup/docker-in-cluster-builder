import { splitProps, type Component } from "solid-js";

import { Button as BaseButton, type ButtonProps } from "../../primitives/Button";
import * as styles from "./style.css";

export type { ButtonProps };

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  const buttonClass = (): string => [styles.button, local.class].filter(Boolean).join(" ");

  return (
    <BaseButton class={buttonClass()} {...rest}>
      {local.children}
    </BaseButton>
  );
};
