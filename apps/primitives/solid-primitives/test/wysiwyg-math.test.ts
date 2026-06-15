import { Editor } from "@tiptap/core";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";

import { wysiwygExtensions } from "../src/primitives/Editor/modes/Wysiwyg/markdown";

import type { Extensions } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";

// The math extension exposes its behaviour through typing: a user writes
// dollar-delimited LaTeX and it turns into a rendered formula. These tests
// drive ProseMirror's real input pipeline (handleTextInput, the same prop the
// inputRules plugin registers) one character at a time, mirroring how the
// editor responds to a keystroke. They assert on the resulting document, not
// on which extension produced it, so they survive an upstream swap.

const editors: Editor[] = [];

const mountEditor = (extensions: Extensions): Editor => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const editor = new Editor({ element, extensions });
  editors.push(editor);
  editor.commands.focus();
  return editor;
};

// Feed text through the editor as if typed. handleTextInput runs the input
// rules; when no rule claims the keystroke we insert it like the browser would,
// so later characters see the accumulated text.
const typeText = (editor: Editor, text: string): void => {
  for (const char of text) {
    const { view } = editor;
    const { from, to } = view.state.selection;
    const handled = view.someProp("handleTextInput", (fn) =>
      fn(view, from, to, char, () => view.state.tr),
    );
    if (handled !== true) {
      view.dispatch(view.state.tr.insertText(char, from, to));
    }
  }
};

const nodesOfType = (editor: Editor, typeName: string): PMNode[] => {
  const found: PMNode[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === typeName) {
      found.push(node);
    }
  });
  return found;
};

afterEach(() => {
  while (editors.length > 0) {
    editors.pop()?.destroy();
  }
  document.body.innerHTML = "";
});

describe("wysiwyg math typing", () => {
  it("converts $4x$ typed inline into an inline math node", () => {
    const editor = mountEditor(wysiwygExtensions());

    typeText(editor, "$4x$");

    const inline = nodesOfType(editor, "inlineMath");
    expect(inline).toHaveLength(1);
    expect(inline[0]?.attrs.latex).toBe("4x");
  });

  it("converts $$a+b$$ typed inline into a block math node", () => {
    const editor = mountEditor(wysiwygExtensions());

    typeText(editor, "$$a+b$$");

    expect(nodesOfType(editor, "blockMath")).toHaveLength(1);
    expect(nodesOfType(editor, "blockMath")[0]?.attrs.latex).toBe("a+b");
    // The double-dollar form must not also leave a stray inline node behind.
    expect(nodesOfType(editor, "inlineMath")).toHaveLength(0);
  });

  it("preserves LaTeX that the typography rules would otherwise rewrite", () => {
    const editor = mountEditor(wysiwygExtensions());

    // `^2` is exactly the case the Typography extension turns into the
    // superscript glyph; inside math the raw LaTeX must survive verbatim.
    typeText(editor, "$E = mc^2$");

    const inline = nodesOfType(editor, "inlineMath");
    expect(inline).toHaveLength(1);
    expect(inline[0]?.attrs.latex).toBe("E = mc^2");
  });

  it("converts a bare-number $5$ into math by default (math-first)", () => {
    const editor = mountEditor(wysiwygExtensions());

    typeText(editor, "$5$");

    const inline = nodesOfType(editor, "inlineMath");
    expect(inline).toHaveLength(1);
    expect(inline[0]?.attrs.latex).toBe("5");
  });

  it("leaves a bare-number $5$ as text when the numeric setting is off", () => {
    const [numericMath] = createSignal(false);
    const editor = mountEditor(wysiwygExtensions({ numericInlineMath: numericMath }));

    typeText(editor, "$5$");

    expect(nodesOfType(editor, "inlineMath")).toHaveLength(0);
    expect(editor.state.doc.textContent).toBe("$5$");
  });

  it("still converts a $4x$ that contains a letter when the numeric setting is off", () => {
    const [numericMath] = createSignal(false);
    const editor = mountEditor(wysiwygExtensions({ numericInlineMath: numericMath }));

    typeText(editor, "$4x$");

    expect(nodesOfType(editor, "inlineMath")).toHaveLength(1);
  });

  it("reacts to the numeric setting toggling without rebuilding the editor", () => {
    const [numericMath, setNumericMath] = createSignal(false);
    const editor = mountEditor(wysiwygExtensions({ numericInlineMath: numericMath }));

    typeText(editor, "$5$ ");
    expect(nodesOfType(editor, "inlineMath")).toHaveLength(0);

    setNumericMath(true);
    typeText(editor, "$6$");
    const inline = nodesOfType(editor, "inlineMath");
    expect(inline).toHaveLength(1);
    expect(inline[0]?.attrs.latex).toBe("6");
  });
});
