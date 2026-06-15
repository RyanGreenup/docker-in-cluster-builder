import { Editor } from "@tiptap/core";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";

import { wysiwygExtensions } from "../src/primitives/Editor/modes/Wysiwyg/markdown";
import { MathPopover, type MathKind } from "../src/primitives/Editor/modes/Wysiwyg/MathPopover";

import type { Node as PMNode } from "@tiptap/pm/model";

// These tests drive the math editing popover against a real Tiptap editor: the
// Popover's only job is to turn keystrokes in its LaTeX field into editor
// Command chains, so we assert on the resulting document node, not on internals.

const editors: Editor[] = [];
const disposers: Array<() => void> = [];

const mountEditor = (): Editor => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const editor = new Editor({ element, extensions: wysiwygExtensions() });
  editors.push(editor);
  return editor;
};

const findNode = (editor: Editor, typeName: string): { node: PMNode; pos: number } => {
  let result: { node: PMNode; pos: number } | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (result === undefined && node.type.name === typeName) {
      result = { node, pos };
    }
  });
  if (result === undefined) {
    throw new Error(`no ${typeName} node in document`);
  }
  return result;
};

// Render the popover for an existing math node and return its input element.
const openPopover = (
  editor: Editor,
  kind: MathKind,
  typeName: string,
): { input: HTMLInputElement } => {
  const { node, pos } = findNode(editor, typeName);
  const host = document.createElement("div");
  document.body.appendChild(host);
  const dispose = render(
    () => (
      <MathPopover
        editor={() => editor}
        state={{ anchor: { bottom: 0, left: 0 }, kind, latex: String(node.attrs.latex), pos }}
        onClose={() => undefined}
      />
    ),
    host,
  );
  disposers.push(dispose);
  const input = host.querySelector("input");
  if (input === null) {
    throw new Error("popover input not rendered");
  }
  return { input };
};

const setValue = (input: HTMLInputElement, value: string): void => {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

const pressEnter = (input: HTMLInputElement): void => {
  input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
};

afterEach(() => {
  while (disposers.length > 0) {
    disposers.pop()?.();
  }
  while (editors.length > 0) {
    editors.pop()?.destroy();
  }
  document.body.innerHTML = "";
});

describe("math popover editing", () => {
  it("commits an edited block formula back to the document", () => {
    const editor = mountEditor();
    editor.commands.insertBlockMath({ latex: "a+b" });

    const { input } = openPopover(editor, "block", "blockMath");
    setValue(input, "a+c");
    pressEnter(input);

    expect(findNode(editor, "blockMath").node.attrs.latex).toBe("a+c");
  });
});
