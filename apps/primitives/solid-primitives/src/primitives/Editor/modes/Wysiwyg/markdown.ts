import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Mathematics from "@tiptap/extension-mathematics";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";

import { mathInputRules } from "./mathInputRules";

import type { Extensions } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";

const lowlight = createLowlight(common);

// oxlint-disable-next-line no-magic-numbers -- heading levels are domain constants (H1/H2/H3), not arbitrary numbers
const HEADING_LEVELS = [1, 2, 3] as const;

export interface WysiwygExtensionOptions {
  onBlockMathClick?: (node: PMNode, pos: number) => void;
  onInlineMathClick?: (node: PMNode, pos: number) => void;
  // Reactive getter: when it returns false, a bare-number span like `$5$` stays
  // As text instead of becoming math. Read live, so a settings toggle applies
  // Without rebuilding the editor.
  numericInlineMath?: () => boolean;
}

export const wysiwygExtensions = (options?: WysiwygExtensionOptions): Extensions => [
  StarterKit.configure({
    codeBlock: false,
    heading: { levels: [...HEADING_LEVELS] },
    link: { openOnClick: false },
  }),
  Markdown,
  CodeBlockLowlight.configure({ lowlight }),
  Highlight.configure({ multicolor: true }),
  Mathematics.configure({
    blockOptions: { onClick: options?.onBlockMathClick },
    inlineOptions: { onClick: options?.onInlineMathClick },
    katexOptions: { throwOnError: false },
  }),
  mathInputRules({ numericInlineMath: options?.numericInlineMath }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Typography,
];
