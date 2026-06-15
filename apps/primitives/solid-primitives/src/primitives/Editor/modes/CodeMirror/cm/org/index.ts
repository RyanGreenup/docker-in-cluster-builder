// oxlint-disable unicorn/no-null -- Heading lookup mirrors the `null` convention of the cm helpers.
import {
  Compartment,
  Prec,
  type EditorState,
  type Extension,
  type TransactionSpec,
} from "@codemirror/state";
import { keymap, type Command, type EditorView } from "@codemirror/view";

import { headingAt, parseSections, type Section } from "../headings";
import {
  demoteHeading,
  demoteSubtree,
  insertHeadingAfterSubtree,
  insertHeadingBelow,
  moveSubtreeDown,
  moveSubtreeUp,
  promoteHeading,
  promoteSubtree,
} from "./transforms";

interface HeadingContext {
  here: Section;
  sections: Section[];
}

function headingContext(state: EditorState): HeadingContext | null {
  const sections = parseSections(state);
  const here = headingAt(sections, state.selection.main.head);
  return here ? { here, sections } : null;
}

// Off a heading line the key falls through (vim, default keymap). On a
// Heading line the key is always consumed, even when the transform is a
// No-op (org signals an error there instead of editing text).
function applyOnHeading(
  view: EditorView,
  transform: (ctx: HeadingContext) => TransactionSpec | null,
): boolean {
  const ctx = headingContext(view.state);
  if (!ctx) {
    return false;
  }
  const spec = transform(ctx);
  if (spec) {
    view.dispatch(spec);
  }
  return true;
}

export const orgPromoteHeading: Command = (view) =>
  applyOnHeading(view, (ctx) => promoteHeading(ctx.here));

export const orgDemoteHeading: Command = (view) =>
  applyOnHeading(view, (ctx) => demoteHeading(ctx.here));

export const orgPromoteSubtree: Command = (view) =>
  applyOnHeading(view, (ctx) => promoteSubtree(ctx.sections, ctx.here));

export const orgDemoteSubtree: Command = (view) =>
  applyOnHeading(view, (ctx) => demoteSubtree(ctx.sections, ctx.here));

export const orgMoveSubtreeUp: Command = (view) =>
  applyOnHeading(view, (ctx) => moveSubtreeUp(view.state, ctx.sections, ctx.here));

export const orgMoveSubtreeDown: Command = (view) =>
  applyOnHeading(view, (ctx) => moveSubtreeDown(view.state, ctx.sections, ctx.here));

export const orgInsertHeading: Command = (view) => {
  view.dispatch(insertHeadingBelow(view.state, parseSections(view.state)));
  return true;
};

export const orgInsertHeadingAfter: Command = (view) => {
  view.dispatch(insertHeadingAfterSubtree(view.state, parseSections(view.state)));
  return true;
};

// Highest precedence so vim never swallows the structure keys; each command
// Returns false when not applicable, so Alt-arrows in body text still reach
// The default line-move and cursor bindings.
const orgKeymap = Prec.highest(
  keymap.of([
    { key: "Alt-ArrowUp", run: orgMoveSubtreeUp },
    { key: "Alt-ArrowDown", run: orgMoveSubtreeDown },
    { key: "Alt-ArrowLeft", run: orgPromoteHeading },
    { key: "Alt-ArrowRight", run: orgDemoteHeading },
    { key: "Alt-Shift-ArrowLeft", run: orgPromoteSubtree },
    { key: "Alt-Shift-ArrowRight", run: orgDemoteSubtree },
    { key: "Alt-Enter", run: orgInsertHeading },
    { key: "Mod-Enter", run: orgInsertHeadingAfter },
  ]),
);

const orgCompartment = new Compartment();

export function orgKeybindings(initiallyOn: boolean): Extension {
  return orgCompartment.of(initiallyOn ? orgKeymap : []);
}

export function setOrgKeybindings(view: EditorView, on: boolean): void {
  view.dispatch({ effects: orgCompartment.reconfigure(on ? orgKeymap : []) });
}
