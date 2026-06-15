import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { codeFolding, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorState, Prec, type Extension } from "@codemirror/state";
import { EditorView, highlightActiveLine, keymap } from "@codemirror/view";
import { createEffect, onCleanup, onMount, type JSXElement } from "solid-js";

import { useEditorContent } from "../../context/EditorContentContext";
import { useEditorSettings } from "../../context/EditorSettingsContext";
import { cmContainer } from "../../style.css";
import { adaptiveAppearance, prefersDark, setAppearance, watchColorScheme } from "./cm/appearance";
import { cycleGlobalFold, cycleLocalFold, foldCycleState } from "./cm/fold-cycle";
import { lineNumbersToggle, setLineNumbers } from "./cm/line-numbers";
import { markdownHeadingFold } from "./cm/markdown-fold";
import { orgKeybindings, setOrgKeybindings } from "./cm/org";
import { setVim, vimMode } from "./cm/vim-toggle";

const foldCycleKeymap = Prec.highest(
  keymap.of([
    { key: "Shift-Tab", run: cycleGlobalFold },
    { key: "Tab", run: cycleLocalFold },
  ]),
);

// Structural only: height, scroll, and inherited font. The themed exemplar
// Skins all colours and fonts via the `data-part="codemirror"` mount.
const structuralTheme = EditorView.theme({
  "&": { height: "100%" },
  ".cm-content": { fontFamily: "inherit" },
  ".cm-scroller": { overflow: "auto" },
});

interface ExtensionDeps {
  initialDark: boolean;
  initialLineNumbers: boolean;
  initialOrgKeys: boolean;
  initialVim: boolean;
  onDocChange: (value: string) => void;
}

function buildExtensions(deps: ExtensionDeps): Extension[] {
  return [
    vimMode(deps.initialVim),
    foldCycleKeymap,
    orgKeybindings(deps.initialOrgKeys),
    lineNumbersToggle(deps.initialLineNumbers),
    highlightActiveLine(),
    history(),
    indentOnInput(),
    codeFolding(),
    foldGutter(),
    foldCycleState(),
    markdownHeadingFold,
    markdown({ codeLanguages: languages }),
    adaptiveAppearance(deps.initialDark),
    EditorView.lineWrapping,
    keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        deps.onDocChange(update.state.doc.toString());
      }
    }),
    structuralTheme,
  ];
}

interface MountDeps {
  doc: string;
  lineNumbersOn: () => boolean;
  onDocChange: (value: string) => void;
  orgKeysOn: () => boolean;
  parent: HTMLDivElement;
  setVimMode: (on: boolean) => void;
  vimOn: () => boolean;
}

function mountEditorView(deps: MountDeps): { dispose: () => void; view: EditorView } {
  const state = EditorState.create({
    doc: deps.doc,
    extensions: buildExtensions({
      initialDark: prefersDark(),
      initialLineNumbers: deps.lineNumbersOn(),
      initialOrgKeys: deps.orgKeysOn(),
      initialVim: deps.vimOn(),
      onDocChange: deps.onDocChange,
    }),
  });
  const view = new EditorView({ parent: deps.parent, state });

  const handleTouch = (): void => {
    if (deps.vimOn()) {
      deps.setVimMode(false);
    }
  };
  deps.parent.addEventListener("touchstart", handleTouch, { once: true });

  const unwatchScheme = watchColorScheme((dark) => {
    setAppearance(view, dark);
  });

  return {
    dispose: (): void => {
      unwatchScheme();
      view.destroy();
    },
    view,
  };
}

// Reactive bridge: rerun `apply` (which reads settings signals) once the
// View exists, skipping the pre-mount window.
function syncSetting(view: () => EditorView | undefined, apply: (view: EditorView) => void): void {
  createEffect(() => {
    const instance = view();
    if (instance) {
      apply(instance);
    }
  });
}

export const CodeMirrorEditor = (): JSXElement => {
  // oxlint-disable-next-line init-declarations, no-unassigned-vars
  let mountRef!: HTMLDivElement;
  const { content, setContent } = useEditorContent();
  const {
    lineNumbers: lineNumbersOn,
    orgKeybindings: orgKeysOn,
    setVimMode,
    vimMode: vimOn,
  } = useEditorSettings();

  // oxlint-disable-next-line init-declarations
  let viewInstance: EditorView | undefined;

  onMount(() => {
    const { dispose, view } = mountEditorView({
      doc: content(),
      lineNumbersOn,
      onDocChange: setContent,
      orgKeysOn,
      parent: mountRef,
      setVimMode,
      vimOn,
    });
    viewInstance = view;
    onCleanup(dispose);
  });

  syncSetting(
    () => viewInstance,
    (view) => setVim(view, vimOn()),
  );
  syncSetting(
    () => viewInstance,
    (view) => setLineNumbers(view, lineNumbersOn()),
  );
  syncSetting(
    () => viewInstance,
    (view) => setOrgKeybindings(view, orgKeysOn()),
  );

  return <div class={cmContainer} data-part="codemirror" ref={mountRef} />;
};
