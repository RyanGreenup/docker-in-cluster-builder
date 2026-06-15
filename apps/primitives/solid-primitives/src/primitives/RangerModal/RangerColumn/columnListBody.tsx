import { For, Show, type JSXElement } from "solid-js";

import { list } from "../RangerModal.css/body.css";
import { emptyMsg } from "../RangerModal.css/rows.css";
import { ColumnItem } from "./columnItem";
import { EMPTY_COUNT } from "./constants";
import { CreateRow } from "./createRow";
import { useColumnFocusEffects, type ColumnRefs } from "./effects";

import type { RangerColumnProps } from "./types";

export const ColumnListBody = (props: Omit<RangerColumnProps, "label" | "sortKey">): JSXElement => {
  const refs: ColumnRefs = { newInput: undefined, rename: undefined };
  useColumnFocusEffects(props, refs);
  return (
    <div class={list}>
      <Show when={props.isCurrent && props.creating()}>
        {(creating) => (
          <CreateRow
            creating={creating()}
            inputRef={(el) => {
              refs.newInput = el;
            }}
            onCommit={props.onCreateCommit}
            onCancel={props.onCreateCancel}
          />
        )}
      </Show>
      <Show when={props.items.length === EMPTY_COUNT && !props.creating()}>
        <div class={emptyMsg}>
          empty — press <kbd>n</kbd> to create
        </div>
      </Show>
      <For each={props.items}>
        {(item) => (
          <ColumnItem
            item={item}
            activeId={props.activeId}
            isCurrent={props.isCurrent}
            marked={props.marked}
            renameId={props.renameId}
            confirmDeleteId={props.confirmDeleteId}
            onActivate={props.onActivate}
            onContextOpen={props.onContextOpen}
            onRename={props.onRename}
            onConfirmDelete={props.onConfirmDelete}
            onCancelDelete={props.onCancelDelete}
            renameInputRef={(el) => {
              refs.rename = el;
            }}
          />
        )}
      </For>
    </div>
  );
};
