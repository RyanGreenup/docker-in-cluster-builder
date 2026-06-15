import { Compartment, type Extension } from "@codemirror/state";
import { vim } from "@replit/codemirror-vim";

import type { EditorView } from "@codemirror/view";

const vimCompartment = new Compartment();
const vimExtension: Extension = vim();

export function vimMode(initiallyOn = false): Extension {
  return vimCompartment.of(initiallyOn ? vimExtension : []);
}

export function isVimOn(view: EditorView): boolean {
  return vimCompartment.get(view.state) === vimExtension;
}

export function setVim(view: EditorView, on: boolean): void {
  view.dispatch({
    effects: vimCompartment.reconfigure(on ? vimExtension : []),
  });
}

export function toggleVim(view: EditorView): boolean {
  setVim(view, !isVimOn(view));
  return true;
}
