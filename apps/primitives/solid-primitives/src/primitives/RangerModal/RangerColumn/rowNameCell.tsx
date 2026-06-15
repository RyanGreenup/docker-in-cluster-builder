import { Show, type JSXElement } from "solid-js";

import { rowName, rowTagDot, renameInput } from "../RangerModal.css/rows.css";
import { tagColor } from "../tags";

import type { VaultNode, VaultNote } from "../rangerTypes";

export const RowNameCell = (props: {
  item: VaultNode;
  note: () => VaultNote | undefined;
  isRenaming: () => boolean;
  isCurrent: boolean;
  renameInputRef: (el: HTMLInputElement) => void;
  onRename: (id: string, name: string) => void;
}): JSXElement => (
  <div class={rowName}>
    <Show
      when={
        props.note() !== undefined &&
        props.note()?.tag !== undefined &&
        props.note()?.tag !== "neutral"
      }
    >
      <span
        class={rowTagDot}
        style={{
          background: tagColor(props.note()?.tag).fg,
        }}
      />
    </Show>
    <Show when={props.isRenaming() && props.isCurrent} fallback={<span>{props.item.name}</span>}>
      <input
        ref={props.renameInputRef}
        class={renameInput}
        value={props.item.name}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.onRename(props.item.id, event.currentTarget.value);
          }
          if (event.key === "Escape") {
            props.onRename(props.item.id, props.item.name);
          }
        }}
        onBlur={(event) => {
          const nextName = event.currentTarget.value || props.item.name;
          props.onRename(props.item.id, nextName);
        }}
      />
    </Show>
  </div>
);
