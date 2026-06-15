import type { JSXElement } from "solid-js";
import { EditorShell, type EditorShellProps } from "../../primitives/Editor";
import { editorTheme } from "./style.css";

const joinClass = (...parts: (string | undefined)[]): string =>
  parts.filter((part): part is string => part !== undefined && part !== "").join(" ");

export const Editor = (props: EditorShellProps): JSXElement => (
  <EditorShell {...props} class={joinClass(editorTheme, props.class)} />
);
