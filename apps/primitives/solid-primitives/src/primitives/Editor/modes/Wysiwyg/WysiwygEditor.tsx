import Placeholder from "@tiptap/extension-placeholder";
import { createSignal, Show, type Accessor, type JSXElement, type Setter } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";

import { useEditorContent } from "../../context/EditorContentContext";
import { useEditorSettings } from "../../context/EditorSettingsContext";
import { editorArea, editorContent, wysiwygWrapper } from "../../style.css";
import { wysiwygExtensions } from "./markdown";
import { MathPopover, type MathEditState, type MathKind } from "./MathPopover";
import { WysiwygToolbar } from "./Toolbar";

import type { Editor, Extensions } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";

interface WysiwygEditorProps {
  placeholder?: string;
}

type OpenMathPopover = Setter<MathEditState | undefined>;

// Clicking a formula opens the math popover anchored under the node, prefilled
// With its LaTeX source. `getEditor` is read lazily because the handlers only
// Fire after the editor has mounted.
const makeMathClickHandler =
  (getEditor: () => Editor | undefined, open: OpenMathPopover, kind: MathKind) =>
  (node: PMNode, pos: number): void => {
    const view = getEditor()?.view;
    if (!view) {
      return;
    }
    const dom = view.nodeDOM(pos);
    const rect = dom instanceof HTMLElement ? dom.getBoundingClientRect() : view.coordsAtPos(pos);
    open({
      anchor: { bottom: rect.bottom, left: rect.left },
      kind,
      latex: String(node.attrs.latex ?? ""),
      pos,
    });
  };

// A non-empty selection converts directly into math, no UI involved.
const convertSelectionToMath = (ed: Editor, kind: MathKind): boolean => {
  const { empty, from, to } = ed.state.selection;
  const latex = empty ? "" : ed.state.doc.textBetween(from, to, " ").trim();
  if (latex === "") {
    return false;
  }
  const chain = ed.chain().focus().deleteSelection();
  if (kind === "inline") {
    chain.insertInlineMath({ latex, pos: from });
  } else {
    chain.insertBlockMath({ latex, pos: from });
  }
  chain.run();
  return true;
};

// Toolbar insert: convert the selection if there is one, otherwise open the
// Popover at the cursor to compose a new formula.
const makeMathInserter =
  (getEditor: () => Editor | undefined, open: OpenMathPopover) =>
  (kind: MathKind): void => {
    const ed = getEditor();
    if (!ed || convertSelectionToMath(ed, kind)) {
      return;
    }
    const coords = ed.view.coordsAtPos(ed.state.selection.from);
    open({ anchor: { bottom: coords.bottom, left: coords.left }, kind, latex: "" });
  };

const MathPopoverHost = (props: {
  editor: () => Editor | undefined;
  mathEdit: () => MathEditState | undefined;
  onClose: () => void;
}): JSXElement => (
  <Show when={props.mathEdit()} keyed>
    {(state) => <MathPopover editor={props.editor} state={state} onClose={props.onClose} />}
  </Show>
);

interface BuildExtensionsParams {
  getEditor: () => Editor | undefined;
  open: OpenMathPopover;
  numericInlineMath: () => boolean;
  placeholder?: string;
}

const buildExtensions = (params: BuildExtensionsParams): Extensions => [
  ...wysiwygExtensions({
    numericInlineMath: params.numericInlineMath,
    onBlockMathClick: makeMathClickHandler(params.getEditor, params.open, "block"),
    onInlineMathClick: makeMathClickHandler(params.getEditor, params.open, "inline"),
  }),
  Placeholder.configure({ placeholder: params.placeholder ?? "Start writing..." }),
];

interface CreateEditorParams {
  getElement: () => HTMLElement;
  initialContent: string;
  numericInlineMath: () => boolean;
  open: OpenMathPopover;
  placeholder: () => string | undefined;
  setContent: (val: string) => void;
}

// Keeps the createTiptapEditor options literal inline (so it stays contextually
// Typed) while pulling the recursive editor wiring out of the component body.
// The math click handlers reference `editor` inside its own initializer, hence
// The explicit annotation to avoid a circular inferred type.
const createWysiwygEditor = (params: CreateEditorParams): (() => Editor | undefined) => {
  const editor: () => Editor | undefined = createTiptapEditor(() => ({
    content: params.initialContent,
    contentType: "markdown",
    editorProps: { attributes: { class: editorContent, "data-part": "wysiwyg-content" } },
    element: params.getElement(),
    extensions: buildExtensions({
      getEditor: () => editor(),
      numericInlineMath: params.numericInlineMath,
      open: params.open,
      placeholder: params.placeholder(),
    }),
    onUpdate: ({ editor: instance }) => {
      params.setContent(instance.getMarkdown());
    },
  }));
  return editor;
};

export const WysiwygEditor = (props: WysiwygEditorProps): JSXElement => {
  // oxlint-disable-next-line init-declarations
  let editorRef!: HTMLElement;
  const { content, setContent } = useEditorContent();
  const { numericInlineMath } = useEditorSettings();
  const [mathEdit, setMathEdit] = createSignal<MathEditState>();

  // Capture content() once here: reading it reactively would recreate the
  // Editor on every keystroke (setContent -> content() changes).
  const editor = createWysiwygEditor({
    getElement: () => editorRef,
    initialContent: content(),
    numericInlineMath: () => numericInlineMath(),
    open: setMathEdit,
    placeholder: () => props.placeholder,
    setContent,
  });

  return (
    <div class={wysiwygWrapper}>
      <Show when={editor()}>
        {(ed) => (
          <WysiwygToolbar
            editor={ed as Accessor<Editor | undefined>}
            onMathInsert={makeMathInserter(() => editor(), setMathEdit)}
          />
        )}
      </Show>
      <div class={editorArea}>
        <div
          ref={(el) => {
            editorRef = el;
          }}
        />
      </div>
      <MathPopoverHost
        editor={() => editor()}
        mathEdit={mathEdit}
        onClose={() => setMathEdit(undefined)}
      />
    </div>
  );
};
