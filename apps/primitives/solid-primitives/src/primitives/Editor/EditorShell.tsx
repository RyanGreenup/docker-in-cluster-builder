import { createSignal, Match, Switch, untrack, type JSXElement } from "solid-js";

import { EditorContentProvider } from "./context/EditorContentContext";
import { EditorSettingsProvider, type EditorMode } from "./context/EditorSettingsContext";
import { CodeMirrorEditor } from "./modes/CodeMirror/CodeMirrorEditor";
import { TextAreaEditor } from "./modes/TextAreaEditor";
import { WysiwygEditor } from "./modes/Wysiwyg/WysiwygEditor";
import { shell } from "./style.css";

export interface EditorShellProps {
  class?: string;
  initialContent?: string;
  lineNumbers?: boolean;
  mode?: EditorMode;
  onChange?: (markdown: string) => void;
  onModeChange?: (mode: EditorMode) => void;
  onVimModeChange?: (on: boolean) => void;
  orgKeybindings?: boolean;
  placeholder?: string;
  value?: string;
  vimMode?: boolean;
}

const joinClass = (...parts: (string | undefined)[]): string => parts.filter(Boolean).join(" ");

const makeContentSignal = (props: EditorShellProps) => {
  const [val, setVal] = createSignal(untrack(() => props.value ?? props.initialContent ?? ""));
  const get = (): string => props.value ?? val();
  const set = (next: string): void => {
    props.onChange?.(next);
    if (props.value === undefined) {
      setVal(next);
    }
  };
  return [get, set] as const;
};

const makeModeSignal = (props: EditorShellProps) => {
  const [val, setVal] = createSignal<EditorMode>(untrack(() => props.mode ?? "wysiwyg"));
  const get = (): EditorMode => props.mode ?? val();
  const set = (mode: EditorMode): void => {
    props.onModeChange?.(mode);
    if (props.mode === undefined) {
      setVal(mode);
    }
  };
  return [get, set] as const;
};

const makeVimSignal = (props: EditorShellProps) => {
  const [val, setVal] = createSignal(untrack(() => props.vimMode ?? true));
  const get = (): boolean => props.vimMode ?? val();
  const set = (on: boolean): void => {
    props.onVimModeChange?.(on);
    if (props.vimMode === undefined) {
      setVal(on);
    }
  };
  return [get, set] as const;
};

/**
 * Markdown editor with wysiwyg, codemirror, and textarea modes.
 *
 * The wysiwyg mode renders LaTeX math (inline `$...$`, block `$$...$$`) via
 * KaTeX; consumers must import `katex/dist/katex.min.css` themselves, since
 * the library does not bundle CSS.
 */
export const EditorShell = (props: EditorShellProps): JSXElement => {
  const [content, setContent] = makeContentSignal(props);
  const [editorMode, setEditorMode] = makeModeSignal(props);
  const [vimMode, setVimMode] = makeVimSignal(props);

  return (
    <EditorContentProvider content={content} setContent={setContent}>
      <EditorSettingsProvider
        editorMode={editorMode}
        lineNumbers={() => props.lineNumbers ?? true}
        orgKeybindings={() => props.orgKeybindings ?? true}
        setEditorMode={setEditorMode}
        vimMode={vimMode}
        setVimMode={setVimMode}
      >
        <div class={joinClass(shell, props.class)} data-part="editor-root">
          <Switch>
            <Match when={editorMode() === "textarea"}>
              <TextAreaEditor />
            </Match>
            <Match when={editorMode() === "wysiwyg"}>
              <WysiwygEditor placeholder={props.placeholder} />
            </Match>
            <Match when={editorMode() === "codemirror"}>
              <CodeMirrorEditor />
            </Match>
          </Switch>
        </div>
      </EditorSettingsProvider>
    </EditorContentProvider>
  );
};
