import { onCleanup, onMount, type Accessor } from "solid-js";

import { handleKeyboardAction, handleKeyboardEscape } from "./keyboardActions";

import type { KeyboardContext } from "./types";

export const setupKeyboard = (open: Accessor<boolean>, ctx: KeyboardContext): void => {
  onMount(() => {
    const onKey = (ev: KeyboardEvent): void => {
      if (!open()) {
        return;
      }
      const inInput =
        ctx.sig.filterFocused() ||
        ctx.sig.renameId() !== undefined ||
        ctx.sig.creating() !== undefined;
      if (ev.key === "Escape") {
        handleKeyboardEscape(ctx, ev);
        return;
      }
      if (inInput) {
        return;
      }
      handleKeyboardAction(ctx, ev);
    };
    globalThis.addEventListener("keydown", onKey);
    onCleanup(() => globalThis.removeEventListener("keydown", onKey));
  });
};
