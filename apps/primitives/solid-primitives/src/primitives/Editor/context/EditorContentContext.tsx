import { createContext, useContext, type Accessor, type JSXElement } from "solid-js";

export interface EditorContentContextValue {
  content: Accessor<string>;
  setContent: (val: string) => void;
}

const EditorContentContext = createContext<EditorContentContextValue>();

export const useEditorContent = (): EditorContentContextValue => {
  const ctx = useContext(EditorContentContext);
  if (ctx === undefined) {
    throw new Error("useEditorContent must be used inside <EditorContentProvider>");
  }
  return ctx;
};

interface EditorContentProviderProps {
  content: Accessor<string>;
  setContent: (val: string) => void;
  children: JSXElement;
}

export const EditorContentProvider = (props: EditorContentProviderProps): JSXElement => (
  <EditorContentContext.Provider
    value={{ content: () => props.content(), setContent: (val) => props.setContent(val) }}
  >
    {props.children}
  </EditorContentContext.Provider>
);
