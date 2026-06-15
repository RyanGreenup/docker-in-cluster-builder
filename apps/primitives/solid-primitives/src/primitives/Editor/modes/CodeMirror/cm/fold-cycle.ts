import { foldEffect, foldedRanges, unfoldEffect } from "@codemirror/language";
import { StateEffect, StateField, type EditorState, type Extension } from "@codemirror/state";

import { directChildren, headingAt, parseSections, topLevel, type Section } from "./headings";

import type { Command, EditorView } from "@codemirror/view";

interface Range {
  from: number;
  to: number;
}

interface Region {
  from: number;
  to: number;
}

type SubtreeState = "folded" | "partial" | "shown";

const EMPTY = 0;
const DOC_START = 0;
const PHASE_STEP = 1;
// oxlint-disable-next-line no-magic-numbers
const NUM_PHASES = 3;
const OVERVIEW = 0;
const CONTENTS = 1;
const SHOW_ALL = 2;

function foldReplacementEffects(
  state: EditorState,
  region: Region,
  ranges: Range[],
): StateEffect<Range>[] {
  const effects: StateEffect<Range>[] = [];
  foldedRanges(state).between(region.from, region.to, (from, to) => {
    effects.push(unfoldEffect.of({ from, to }));
  });
  for (const rng of ranges) {
    if (rng.to > rng.from) {
      effects.push(foldEffect.of({ from: rng.from, to: rng.to }));
    }
  }
  return effects;
}

function setFoldsIn(view: EditorView, region: Region, ranges: Range[]): void {
  const effects = foldReplacementEffects(view.state, region, ranges);
  if (effects.length > EMPTY) {
    view.dispatch({ effects });
  }
}

const advanceGlobalPhase = StateEffect.define<number>();

const globalPhase = StateField.define<number>({
  create: () => SHOW_ALL,
  update(value, tr) {
    for (const eff of tr.effects) {
      if (eff.is(advanceGlobalPhase)) {
        return eff.value;
      }
    }
    return value;
  },
});

function wholeSubtreeFolds(sections: Section[], level: number): Range[] {
  return sections
    .filter((sec) => sec.level === level)
    .map((sec) => ({ from: sec.headingTo, to: sec.sectionEnd }));
}

function bodyOnlyFolds(sections: Section[]): Range[] {
  return sections.map((sec) => ({ from: sec.headingTo, to: sec.bodyEnd }));
}

function rangesForPhase(sections: Section[], phase: number): Range[] {
  if (phase === OVERVIEW) {
    return wholeSubtreeFolds(sections, topLevel(sections));
  }
  if (phase === CONTENTS) {
    return bodyOnlyFolds(sections);
  }
  return [];
}

export const cycleGlobalFold: Command = (view) => {
  const sections = parseSections(view.state);
  if (sections.length === EMPTY) {
    return false;
  }

  const next = (view.state.field(globalPhase) + PHASE_STEP) % NUM_PHASES;
  const docLen = view.state.doc.length;
  const region = { from: DOC_START, to: docLen };
  const effects = foldReplacementEffects(view.state, region, rangesForPhase(sections, next));
  view.dispatch({ effects: [...effects, advanceGlobalPhase.of(next)] });
  return true;
};

export function subtreeFoldState(state: EditorState, here: Section): SubtreeState {
  const folds: Range[] = [];
  foldedRanges(state).between(here.headingFrom, here.sectionEnd, (from, to) => {
    folds.push({ from, to });
  });
  if (folds.some((fold) => fold.from === here.headingTo && fold.to >= here.sectionEnd)) {
    return "folded";
  }
  return folds.length > EMPTY ? "partial" : "shown";
}

// Org's CHILDREN view hides the entry's own body and shows each direct child
// As a folded whole subtree, so grandchildren stay hidden.
function childrenViewFolds(sections: Section[], here: Section): Range[] {
  const children = directChildren(sections, here);
  const folds: Range[] = children.map((sec) => ({ from: sec.headingTo, to: sec.sectionEnd }));
  if (here.bodyEnd > here.headingTo) {
    folds.unshift({ from: here.headingTo, to: here.bodyEnd });
  }
  return folds;
}

// Transition table for org-cycle on a headline: shown -> FOLDED; folded ->
// CHILDREN, or fully shown when the entry has no child headings; anything
// Else (partial/CHILDREN) -> SUBTREE with everything shown.
export function localCycleRanges(state: EditorState, sections: Section[], here: Section): Range[] {
  const current = subtreeFoldState(state, here);
  if (current === "shown") {
    return [{ from: here.headingTo, to: here.sectionEnd }];
  }
  if (current === "folded" && directChildren(sections, here).length > EMPTY) {
    return childrenViewFolds(sections, here);
  }
  return [];
}

export const cycleLocalFold: Command = (view) => {
  const sections = parseSections(view.state);
  const pos = view.state.selection.main.head;
  const here = headingAt(sections, pos);
  if (!here) {
    return false;
  }

  const ranges = localCycleRanges(view.state, sections, here);
  setFoldsIn(view, { from: here.headingFrom, to: here.sectionEnd }, ranges);
  return true;
};

export function foldCycleState(): Extension {
  return [globalPhase];
}
