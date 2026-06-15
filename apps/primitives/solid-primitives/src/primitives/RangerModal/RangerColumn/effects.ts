import { createEffect, type Accessor } from "solid-js";

import type { CreatingState } from "../rangerTypes";

export interface ColumnRefs {
  newInput: HTMLInputElement | undefined;
  rename: HTMLInputElement | undefined;
}

export const useColumnFocusEffects = (
  props: {
    isCurrent: boolean;
    creating: Accessor<CreatingState | undefined>;
    renameId: Accessor<string | undefined>;
  },
  refs: ColumnRefs,
): void => {
  createEffect(() => {
    if (props.isCurrent && props.creating() && refs.newInput) {
      requestAnimationFrame(() => refs.newInput?.focus());
    }
  });
  createEffect(() => {
    if (props.isCurrent && props.renameId() !== undefined && refs.rename !== undefined) {
      requestAnimationFrame(() => refs.rename?.select());
    }
  });
};
