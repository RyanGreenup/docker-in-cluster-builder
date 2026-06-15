import Trash2 from "lucide-solid/icons/trash-2";

import {
  confirmRow,
  confirmText,
  confirmBtn,
  confirmBtnDanger,
} from "../RangerModal.css/confirm.css";
import { TRASH_SIZE } from "./constants";

import type { JSXElement } from "solid-js";

export const ConfirmDeleteOverlay = (props: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}): JSXElement => (
  <div class={confirmRow}>
    <div class={confirmText}>
      <Trash2 size={TRASH_SIZE} />
      <span>
        Delete <strong>{props.name}</strong>?
      </span>
    </div>
    <button
      class={confirmBtn}
      onClick={(event) => {
        event.stopPropagation();
        props.onCancel();
      }}
    >
      Cancel
    </button>
    <button
      class={`${confirmBtn} ${confirmBtnDanger}`}
      onClick={(event) => {
        event.stopPropagation();
        props.onConfirm();
      }}
    >
      Delete ↵
    </button>
  </div>
);
