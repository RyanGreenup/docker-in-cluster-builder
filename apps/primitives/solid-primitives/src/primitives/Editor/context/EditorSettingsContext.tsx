import { createContext, useContext, type Accessor, type JSXElement } from "solid-js";

export type EditorMode = "textarea" | "wysiwyg" | "codemirror";

export interface EditorSettingsContextValue {
  editorMode: Accessor<EditorMode>;
  setEditorMode: (mode: EditorMode) => void;
  lineNumbers: Accessor<boolean>;
  setLineNumbers: (val: boolean) => void;
  orgKeybindings: Accessor<boolean>;
  setOrgKeybindings: (val: boolean) => void;
  // When false, a bare-number wysiwyg span like `$5$` stays as text instead of
  // Becoming math (currency-safe). Defaults to true (math-first).
  numericInlineMath: Accessor<boolean>;
  setNumericInlineMath: (val: boolean) => void;
  vimMode: Accessor<boolean>;
  setVimMode: (val: boolean) => void;
  // When true (the default), hosts should persist edits automatically
  // (debounced); when false, saving is the host's explicit-save path.
  autosave: Accessor<boolean>;
  setAutosave: (val: boolean) => void;
}

const EditorSettingsContext = createContext<EditorSettingsContextValue>();

export const useEditorSettings = (): EditorSettingsContextValue => {
  const ctx = useContext(EditorSettingsContext);
  if (ctx === undefined) {
    throw new Error("useEditorSettings must be used inside <EditorSettingsProvider>");
  }
  return ctx;
};

interface EditorSettingsProviderProps {
  editorMode: Accessor<EditorMode>;
  setEditorMode: (mode: EditorMode) => void;
  lineNumbers?: Accessor<boolean>;
  setLineNumbers?: (val: boolean) => void;
  orgKeybindings?: Accessor<boolean>;
  setOrgKeybindings?: (val: boolean) => void;
  numericInlineMath?: Accessor<boolean>;
  setNumericInlineMath?: (val: boolean) => void;
  vimMode: Accessor<boolean>;
  setVimMode: (val: boolean) => void;
  autosave?: Accessor<boolean>;
  setAutosave?: (val: boolean) => void;
  children: JSXElement;
}

export const EditorSettingsProvider = (props: EditorSettingsProviderProps): JSXElement => (
  <EditorSettingsContext.Provider
    value={{
      autosave: () => props.autosave?.() ?? true,
      editorMode: () => props.editorMode(),
      lineNumbers: () => props.lineNumbers?.() ?? true,
      numericInlineMath: () => props.numericInlineMath?.() ?? true,
      orgKeybindings: () => props.orgKeybindings?.() ?? true,
      setAutosave: (val) => props.setAutosave?.(val),
      setEditorMode: (mode) => props.setEditorMode(mode),
      setLineNumbers: (val) => props.setLineNumbers?.(val),
      setNumericInlineMath: (val) => props.setNumericInlineMath?.(val),
      setOrgKeybindings: (val) => props.setOrgKeybindings?.(val),
      setVimMode: (val) => props.setVimMode(val),
      vimMode: () => props.vimMode(),
    }}
  >
    {props.children}
  </EditorSettingsContext.Provider>
);
