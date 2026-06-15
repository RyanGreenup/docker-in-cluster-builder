import Bold from "lucide-solid/icons/bold";
import Code from "lucide-solid/icons/code";
import Heading1 from "lucide-solid/icons/heading-1";
import Heading2 from "lucide-solid/icons/heading-2";
import Italic from "lucide-solid/icons/italic";
import List from "lucide-solid/icons/list";
import ListOrdered from "lucide-solid/icons/list-ordered";
import ListTodo from "lucide-solid/icons/list-todo";
import Quote from "lucide-solid/icons/quote";
import Redo from "lucide-solid/icons/redo-2";
import RemoveFormatting from "lucide-solid/icons/remove-formatting";
import Sigma from "lucide-solid/icons/sigma";
import CodeSquare from "lucide-solid/icons/square-code";
import SquareSigma from "lucide-solid/icons/square-sigma";
import Strikethrough from "lucide-solid/icons/strikethrough";
import UnderlineIcon from "lucide-solid/icons/underline";
import Undo from "lucide-solid/icons/undo-2";
import { createEditorTransaction } from "solid-tiptap";

import { divider, toolbar } from "../../style.css";
import { ToolbarBtn } from "./ToolbarBtn";

import type { Editor } from "@tiptap/core";
import type { Accessor, JSXElement } from "solid-js";

import type { MathKind } from "./MathPopover";

const ICON_SIZE = 15;

interface ToolbarProps {
  editor: Accessor<Editor | undefined>;
  onMathInsert: (kind: MathKind) => void;
}

const useIsActive = (
  editor: Accessor<Editor | undefined>,
  name: string,
  attrs?: Record<string, unknown>,
): Accessor<boolean> =>
  createEditorTransaction(
    () => editor(),
    (instance) => instance?.isActive(name, attrs) ?? false,
  );

interface GroupProps {
  ed: () => Editor | undefined;
  editor: Accessor<Editor | undefined>;
}

const Divider = (): JSXElement => <div class={divider} data-part="editor-toolbar-divider" />;

const InlineFormatGroup = (props: GroupProps): JSXElement => (
  <>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleBold().run()}
      active={useIsActive(props.editor, "bold")}
      title="Bold (Ctrl+B)"
    >
      <Bold size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleItalic().run()}
      active={useIsActive(props.editor, "italic")}
      title="Italic (Ctrl+I)"
    >
      <Italic size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleUnderline().run()}
      active={useIsActive(props.editor, "underline")}
      title="Underline (Ctrl+U)"
    >
      <UnderlineIcon size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleStrike().run()}
      active={useIsActive(props.editor, "strike")}
      title="Strikethrough"
    >
      <Strikethrough size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleCode().run()}
      active={useIsActive(props.editor, "code")}
      title="Inline code"
    >
      <Code size={ICON_SIZE} />
    </ToolbarBtn>
  </>
);

const HeadingButtons = (props: GroupProps): JSXElement => (
  <>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleHeading({ level: 1 }).run()}
      active={useIsActive(props.editor, "heading", { level: 1 })}
      title="Heading 1"
    >
      <Heading1 size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleHeading({ level: 2 }).run()}
      active={useIsActive(props.editor, "heading", { level: 2 })}
      title="Heading 2"
    >
      <Heading2 size={ICON_SIZE} />
    </ToolbarBtn>
  </>
);

const BlockFormatGroup = (props: GroupProps): JSXElement => (
  <>
    <HeadingButtons ed={props.ed} editor={props.editor} />
    <Divider />
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleBulletList().run()}
      active={useIsActive(props.editor, "bulletList")}
      title="Bullet list"
    >
      <List size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleOrderedList().run()}
      active={useIsActive(props.editor, "orderedList")}
      title="Ordered list"
    >
      <ListOrdered size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleTaskList().run()}
      active={useIsActive(props.editor, "taskList")}
      title="Task list"
    >
      <ListTodo size={ICON_SIZE} />
    </ToolbarBtn>
    <Divider />
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleBlockquote().run()}
      active={useIsActive(props.editor, "blockquote")}
      title="Blockquote"
    >
      <Quote size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().toggleCodeBlock().run()}
      active={useIsActive(props.editor, "codeBlock")}
      title="Code block"
    >
      <CodeSquare size={ICON_SIZE} />
    </ToolbarBtn>
  </>
);

interface MathGroupProps {
  editor: Accessor<Editor | undefined>;
  onInsert: (kind: MathKind) => void;
}

const MathGroup = (props: MathGroupProps): JSXElement => (
  <>
    <ToolbarBtn
      onClick={() => props.onInsert("inline")}
      active={useIsActive(props.editor, "inlineMath")}
      title="Inline math"
    >
      <Sigma size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.onInsert("block")}
      active={useIsActive(props.editor, "blockMath")}
      title="Block math"
    >
      <SquareSigma size={ICON_SIZE} />
    </ToolbarBtn>
  </>
);

const HistoryGroup = (props: { ed: () => Editor | undefined }): JSXElement => (
  <>
    <ToolbarBtn onClick={() => props.ed()?.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
      <Undo size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().redo().run()}
      title="Redo (Ctrl+Shift+Z)"
    >
      <Redo size={ICON_SIZE} />
    </ToolbarBtn>
    <ToolbarBtn
      onClick={() => props.ed()?.chain().focus().clearNodes().unsetAllMarks().run()}
      title="Clear formatting"
    >
      <RemoveFormatting size={ICON_SIZE} />
    </ToolbarBtn>
  </>
);

export const WysiwygToolbar = (props: ToolbarProps): JSXElement => {
  const ed = (): Editor | undefined => props.editor();
  return (
    <div class={toolbar} data-part="editor-toolbar" role="toolbar" aria-label="Text formatting">
      <InlineFormatGroup ed={ed} editor={props.editor} />
      <Divider />
      <BlockFormatGroup ed={ed} editor={props.editor} />
      <Divider />
      <MathGroup editor={props.editor} onInsert={props.onMathInsert} />
      <Divider />
      <HistoryGroup ed={ed} />
    </div>
  );
};
