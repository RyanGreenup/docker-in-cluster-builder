// oxlint-disable unicorn/no-null -- Transforms return `null` when a structure edit does not apply.
import type { EditorState, TransactionSpec } from "@codemirror/state";

import type { Section } from "../headings";

const HASH = "#";
const HASH_WIDTH = 1;
const HEADING_SUFFIX = " ";
const MIN_LEVEL = 1;
// oxlint-disable-next-line no-magic-numbers
const MAX_LEVEL = 6;
const NEWLINE = "\n";
const NEWLINE_WIDTH = 1;

// The section itself plus every descendant section.
function subtreeOf(sections: Section[], here: Section): Section[] {
  return sections.filter(
    (sec) => sec.headingFrom >= here.headingFrom && sec.sectionEnd <= here.sectionEnd,
  );
}

function shiftChanges(
  headings: Section[],
  direction: "promote" | "demote",
): { from: number; insert?: string; to?: number }[] {
  return headings.map((sec) =>
    direction === "demote"
      ? { from: sec.headingFrom, insert: HASH }
      : { from: sec.headingFrom, to: sec.headingFrom + HASH_WIDTH },
  );
}

export function promoteHeading(here: Section): TransactionSpec | null {
  if (here.level <= MIN_LEVEL) {
    return null;
  }
  return { changes: shiftChanges([here], "promote") };
}

export function demoteHeading(here: Section): TransactionSpec | null {
  if (here.level >= MAX_LEVEL) {
    return null;
  }
  return { changes: shiftChanges([here], "demote") };
}

export function promoteSubtree(sections: Section[], here: Section): TransactionSpec | null {
  if (here.level <= MIN_LEVEL) {
    return null;
  }
  return { changes: shiftChanges(subtreeOf(sections, here), "promote") };
}

// Org refuses to demote when any heading in the subtree is already at the
// Deepest level, so the relative structure is never flattened.
export function demoteSubtree(sections: Section[], here: Section): TransactionSpec | null {
  const subtree = subtreeOf(sections, here);
  if (subtree.some((sec) => sec.level >= MAX_LEVEL)) {
    return null;
  }
  return { changes: shiftChanges(subtree, "demote") };
}

// A sibling is a same-level section separated from `here` by exactly the
// Newline between their sections; anything further away sits under another
// Parent and is not a swap candidate.
function previousSibling(sections: Section[], here: Section): Section | null {
  return (
    sections.find(
      (sec) => sec.level === here.level && sec.sectionEnd + NEWLINE_WIDTH === here.headingFrom,
    ) ?? null
  );
}

function nextSibling(sections: Section[], here: Section): Section | null {
  return (
    sections.find(
      (sec) => sec.level === here.level && here.sectionEnd + NEWLINE_WIDTH === sec.headingFrom,
    ) ?? null
  );
}

// Swap two adjacent sibling subtrees, keeping the cursor at the same offset
// Within the subtree it started in.
function swapSiblings(state: EditorState, upper: Section, lower: Section): TransactionSpec {
  const upperText = state.sliceDoc(upper.headingFrom, upper.sectionEnd);
  const lowerText = state.sliceDoc(lower.headingFrom, lower.sectionEnd);
  const { head } = state.selection.main;
  const startedInLower = head >= lower.headingFrom;
  const home = startedInLower ? lower : upper;
  const newHomeStart = startedInLower
    ? upper.headingFrom
    : upper.headingFrom + lowerText.length + NEWLINE_WIDTH;
  return {
    changes: {
      from: upper.headingFrom,
      insert: lowerText + NEWLINE + upperText,
      to: lower.sectionEnd,
    },
    selection: { anchor: newHomeStart + (head - home.headingFrom) },
  };
}

export function moveSubtreeUp(
  state: EditorState,
  sections: Section[],
  here: Section,
): TransactionSpec | null {
  const prev = previousSibling(sections, here);
  return prev ? swapSiblings(state, prev, here) : null;
}

export function moveSubtreeDown(
  state: EditorState,
  sections: Section[],
  here: Section,
): TransactionSpec | null {
  const next = nextSibling(sections, here);
  return next ? swapSiblings(state, here, next) : null;
}

// Innermost section containing `pos`; sections come in document order, so the
// Last match is the deepest.
function enclosingSection(sections: Section[], pos: number): Section | null {
  let innermost: Section | null = null;
  for (const sec of sections) {
    if (sec.headingFrom <= pos && pos <= sec.sectionEnd) {
      innermost = sec;
    }
  }
  return innermost;
}

function headingInsertion(at: number, level: number): TransactionSpec {
  const marker = NEWLINE + HASH.repeat(level) + HEADING_SUFFIX;
  return {
    changes: { from: at, insert: marker },
    selection: { anchor: at + marker.length },
  };
}

// Org M-RET: insert a sibling headline right after the current line.
export function insertHeadingBelow(state: EditorState, sections: Section[]): TransactionSpec {
  const pos = state.selection.main.head;
  const level = enclosingSection(sections, pos)?.level ?? MIN_LEVEL;
  return headingInsertion(state.doc.lineAt(pos).to, level);
}

// Org C-RET: insert a sibling headline after the whole current subtree.
export function insertHeadingAfterSubtree(
  state: EditorState,
  sections: Section[],
): TransactionSpec {
  const pos = state.selection.main.head;
  const enclosing = enclosingSection(sections, pos);
  const at = enclosing?.sectionEnd ?? state.doc.lineAt(pos).to;
  return headingInsertion(at, enclosing?.level ?? MIN_LEVEL);
}
