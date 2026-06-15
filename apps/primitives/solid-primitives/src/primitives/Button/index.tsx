import { splitProps, type Component, type JSX } from "solid-js";

import * as styles from "./style.css";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  const buttonClass = (): string => [styles.button, local.class].filter(Boolean).join(" ");

  return (
    <button class={buttonClass()} data-part="button" {...rest}>
      {local.children}
    </button>
  );
};
