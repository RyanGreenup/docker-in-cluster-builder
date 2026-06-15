import { Compartment, type Extension } from "@codemirror/state";
import { lineNumbers, type EditorView } from "@codemirror/view";

const gutterCompartment = new Compartment();

export function lineNumbersToggle(initiallyOn: boolean): Extension {
  return gutterCompartment.of(initiallyOn ? lineNumbers() : []);
}

export function setLineNumbers(view: EditorView, on: boolean): void {
  view.dispatch({ effects: gutterCompartment.reconfigure(on ? lineNumbers() : []) });
}
