import FileText from "lucide-solid/icons/file-text";
import Folder from "lucide-solid/icons/folder";
import { Show, type JSXElement } from "solid-js";

import { row, rowMark, rowIcon, rowName, renameInput, newRow } from "../RangerModal.css/rows.css";
import { ICON_SIZE } from "./constants";
import { getCreatePlaceholder } from "./helpers";

import type { CreatingState } from "../rangerTypes";

interface CreateRowProps {
  creating: CreatingState;
  inputRef: (el: HTMLInputElement) => void;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

export const CreateRow = (props: CreateRowProps): JSXElement => (
  <div class={`${row} ${newRow}`}>
    <div class={rowMark} />
    <div class={rowIcon}>
      <Show when={props.creating.kind === "folder"} fallback={<FileText size={ICON_SIZE} />}>
        <Folder size={ICON_SIZE} />
      </Show>
    </div>
    <div class={rowName}>
      <input
        ref={props.inputRef}
        class={renameInput}
        placeholder={getCreatePlaceholder(props.creating.kind)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.onCommit(event.currentTarget.value);
          }
          if (event.key === "Escape") {
            props.onCancel();
          }
        }}
        onBlur={(event) => {
          if (event.currentTarget.value) {
            props.onCommit(event.currentTarget.value);
          } else {
            props.onCancel();
          }
        }}
      />
    </div>
  </div>
);
