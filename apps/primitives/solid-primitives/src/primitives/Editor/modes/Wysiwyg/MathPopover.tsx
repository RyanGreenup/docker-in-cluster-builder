import katex from "katex";
import { createEffect, createSignal, onCleanup, onMount, untrack, type JSXElement } from "solid-js";

import { mathPopover, mathPopoverInput, mathPopoverPreview } from "../../style.css";

import type { Editor } from "@tiptap/core";

export type MathKind = "block" | "inline";

export interface MathEditState {
  /** Viewport coordinates the popover anchors below, captured at open time. */
  anchor: { bottom: number; left: number };
  kind: MathKind;
  latex: string;
  /** Document position of an existing node; undefined inserts at the selection. */
  pos?: number;
}

interface MathPopoverProps {
  editor: () => Editor | undefined;
  onClose: () => void;
  state: MathEditState;
}

const POPOVER_OFFSET_PX = 6;

const COMMANDS = {
  block: { delete: "deleteBlockMath", insert: "insertBlockMath", update: "updateBlockMath" },
  inline: { delete: "deleteInlineMath", insert: "insertInlineMath", update: "updateInlineMath" },
} as const;

// All document changes go through one command chain so a popover session is a
// Single undo step: insert new, delete when emptied, otherwise update.
const applyMathEdit = (ed: Editor | undefined, state: MathEditState, latex: string): void => {
  if (!ed) {
    return;
  }
  const { kind, pos } = state;
  const chain = ed.chain().focus();
  if (pos === undefined) {
    if (latex !== "") {
      chain[COMMANDS[kind].insert]({ latex });
    }
  } else if (latex === "") {
    chain[COMMANDS[kind].delete]({ pos });
  } else if (latex !== state.latex) {
    chain[COMMANDS[kind].update]({ latex, pos });
  }
  chain.run();
};

const handleMathKey = (evt: KeyboardEvent, commit: () => void, cancel: () => void): void => {
  if (evt.key === "Enter") {
    evt.preventDefault();
    commit();
  } else if (evt.key === "Escape") {
    evt.preventDefault();
    cancel();
  }
};

// Focus the LaTeX field on open; a pointerdown anywhere outside commits, so
// Clicking back into the document "just saves" the edit.
const setupPopoverInteractions = (
  getRoot: () => HTMLElement,
  getInput: () => HTMLInputElement,
  commit: () => void,
): void => {
  onMount(() => {
    getInput().focus();
    getInput().select();
    const onPointerDown = (evt: PointerEvent): void => {
      if (evt.target instanceof Node && !getRoot().contains(evt.target)) {
        commit();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    onCleanup(() => {
      document.removeEventListener("pointerdown", onPointerDown);
    });
  });
};

const MathPreview = (props: { displayMode: boolean; latex: string }): JSXElement => {
  // oxlint-disable-next-line init-declarations, no-unassigned-vars
  let el!: HTMLDivElement;
  createEffect(() => {
    if (props.latex === "") {
      el.textContent = "";
      return;
    }
    katex.render(props.latex, el, { displayMode: props.displayMode, throwOnError: false });
  });
  return (
    <div ref={el} class={mathPopoverPreview} data-part="math-popover-preview" aria-hidden="true" />
  );
};

/**
 * Anchored LaTeX editor for math nodes: live KaTeX preview, Enter commits,
 * Escape cancels, clicking outside commits, and an emptied field deletes the
 * node. All document changes go through editor command chains so undo/redo
 * stays correct.
 */
export const MathPopover = (props: MathPopoverProps): JSXElement => {
  const [draft, setDraft] = createSignal(untrack(() => props.state.latex));
  // oxlint-disable-next-line init-declarations, no-unassigned-vars
  let rootRef!: HTMLDivElement;
  // oxlint-disable-next-line init-declarations, no-unassigned-vars
  let inputRef!: HTMLInputElement;

  const commit = (): void => {
    applyMathEdit(props.editor(), props.state, draft().trim());
    props.onClose();
  };

  const cancel = (): void => {
    props.editor()?.chain().focus().run();
    props.onClose();
  };

  // The commit callback only ever runs inside the document pointerdown
  // Listener (an event handler); the rule cannot see across the helper.
  // oxlint-disable-next-line solid/reactivity
  setupPopoverInteractions(
    () => rootRef,
    () => inputRef,
    () => commit(),
  );

  return (
    <div
      ref={rootRef}
      class={mathPopover}
      data-part="math-popover"
      role="dialog"
      aria-label="Edit math"
      style={{
        left: `${props.state.anchor.left}px`,
        top: `${props.state.anchor.bottom + POPOVER_OFFSET_PX}px`,
      }}
    >
      <input
        ref={inputRef}
        class={mathPopoverInput}
        data-part="math-popover-input"
        type="text"
        placeholder="LaTeX, e.g. \frac{a}{b}"
        aria-label="LaTeX source"
        value={draft()}
        onInput={(evt) => setDraft(evt.currentTarget.value)}
        onKeyDown={(evt) => handleMathKey(evt, commit, cancel)}
      />
      <MathPreview displayMode={props.state.kind === "block"} latex={draft().trim()} />
    </div>
  );
};
