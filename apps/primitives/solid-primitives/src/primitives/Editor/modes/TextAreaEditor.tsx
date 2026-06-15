import { useEditorContent } from "../context/EditorContentContext";
import { textarea } from "../style.css";

import type { JSXElement } from "solid-js";

export const TextAreaEditor = (): JSXElement => {
  const { content, setContent } = useEditorContent();

  return (
    <textarea
      class={textarea}
      data-part="textarea"
      value={content()}
      onInput={(evt) => setContent(evt.currentTarget.value)}
      spellcheck={false}
      aria-label="Note body"
    />
  );
};
