import { btn } from "../../style.css";

import type { Accessor, JSXElement } from "solid-js";

interface ToolbarBtnProps {
  onClick: () => void;
  active?: Accessor<boolean>;
  title: string;
  children: JSXElement;
}

export const ToolbarBtn = (props: ToolbarBtnProps): JSXElement => {
  const isActive = (): boolean => props.active?.() ?? false;
  return (
    <button
      type="button"
      class={btn}
      data-part="editor-toolbar-btn"
      data-active={isActive() ? "true" : undefined}
      onMouseDown={(evt) => {
        evt.preventDefault();
        props.onClick();
      }}
      title={props.title}
    >
      {props.children}
    </button>
  );
};
