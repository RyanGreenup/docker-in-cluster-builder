import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, type Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

import type { EditorView } from "@codemirror/view";

const appearanceCompartment = new Compartment();

const DARK_QUERY = "(prefers-color-scheme: dark)";

// Light keeps CodeMirror's default chrome and highlight style; dark swaps in
// The complete one-dark theme (editor chrome, gutters, and syntax colours).
function appearanceFor(dark: boolean): Extension {
  return dark ? oneDark : syntaxHighlighting(defaultHighlightStyle, { fallback: true });
}

export function adaptiveAppearance(initiallyDark: boolean): Extension {
  return appearanceCompartment.of(appearanceFor(initiallyDark));
}

export function setAppearance(view: EditorView, dark: boolean): void {
  view.dispatch({ effects: appearanceCompartment.reconfigure(appearanceFor(dark)) });
}

export function prefersDark(): boolean {
  return globalThis.matchMedia(DARK_QUERY).matches;
}

export function watchColorScheme(onChange: (dark: boolean) => void): () => void {
  const query = globalThis.matchMedia(DARK_QUERY);
  const handler = (event: MediaQueryListEvent): void => {
    onChange(event.matches);
  };
  query.addEventListener("change", handler);
  return (): void => {
    query.removeEventListener("change", handler);
  };
}
