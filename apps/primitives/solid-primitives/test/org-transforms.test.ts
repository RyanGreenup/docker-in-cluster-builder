import { EditorState, type TransactionSpec } from "@codemirror/state";
import { describe, expect, it } from "vitest";

import {
  headingAt,
  parseSections,
  type Section,
} from "../src/primitives/Editor/modes/CodeMirror/cm/headings";
import {
  demoteHeading,
  demoteSubtree,
  insertHeadingAfterSubtree,
  insertHeadingBelow,
  moveSubtreeDown,
  moveSubtreeUp,
  promoteHeading,
  promoteSubtree,
} from "../src/primitives/Editor/modes/CodeMirror/cm/org/transforms";

const PRE = "# Top\n\nintro\n\n";
const A_TEXT = "## A\n\na body\n\n### A1\n\ndeep\n";
const B_TEXT = "## B\n\nb body";
const DOC = `${PRE}${A_TEXT}\n${B_TEXT}`;

function stateAt(doc: string, needle: string): EditorState {
  return EditorState.create({ doc, selection: { anchor: doc.indexOf(needle) } });
}

interface HeadingContext {
  here: Section;
  sections: Section[];
}

function ctxAt(state: EditorState, needle: string): HeadingContext {
  const sections = parseSections(state);
  const here = headingAt(sections, state.doc.toString().indexOf(needle));
  if (!here) {
    throw new Error(`no heading at "${needle}"`);
  }
  return { here, sections };
}

function apply(state: EditorState, spec: TransactionSpec | null): EditorState {
  if (!spec) {
    throw new Error("expected a transaction spec");
  }
  return state.update(spec).state;
}

describe("promote and demote a single heading", () => {
  it("demotes a heading one level without touching its children", () => {
    const state = stateAt(DOC, "## A");
    const { here } = ctxAt(state, "## A");
    const doc = apply(state, demoteHeading(here)).doc.toString();
    expect(doc).toContain("### A\n");
    expect(doc).toContain("### A1\n");
  });

  it("promotes a heading one level", () => {
    const state = stateAt(DOC, "## A");
    const { here } = ctxAt(state, "## A");
    expect(apply(state, promoteHeading(here)).doc.toString()).toContain("\n# A\n");
  });

  it("refuses to promote a top-level heading", () => {
    const state = stateAt(DOC, "# Top");
    const { here } = ctxAt(state, "# Top");
    expect(promoteHeading(here)).toBeNull();
  });

  it("refuses to demote past the deepest level", () => {
    const state = stateAt("###### Deep\n", "###### Deep");
    const { here } = ctxAt(state, "###### Deep");
    expect(demoteHeading(here)).toBeNull();
  });
});

describe("promote and demote a whole subtree", () => {
  it("demotes the heading and every descendant", () => {
    const state = stateAt(DOC, "## A");
    const { here, sections } = ctxAt(state, "## A");
    const doc = apply(state, demoteSubtree(sections, here)).doc.toString();
    expect(doc).toContain("### A\n");
    expect(doc).toContain("#### A1\n");
    expect(doc).toContain("## B\n");
  });

  it("promotes the heading and every descendant", () => {
    const state = stateAt(DOC, "## A");
    const { here, sections } = ctxAt(state, "## A");
    const doc = apply(state, promoteSubtree(sections, here)).doc.toString();
    expect(doc).toContain("\n# A\n");
    expect(doc).toContain("\n## A1\n");
  });

  it("refuses to demote when a descendant is already at the deepest level", () => {
    const state = stateAt("# P\n\n###### D\n", "# P");
    const { here, sections } = ctxAt(state, "# P");
    expect(demoteSubtree(sections, here)).toBeNull();
  });
});

describe("move subtree among siblings", () => {
  it("moves a subtree up past its previous sibling and keeps the cursor on it", () => {
    const state = stateAt(DOC, "## B");
    const { here, sections } = ctxAt(state, "## B");
    const next = apply(state, moveSubtreeUp(state, sections, here));
    expect(next.doc.toString()).toBe(`${PRE}${B_TEXT}\n${A_TEXT}`);
    expect(next.selection.main.head).toBe(next.doc.toString().indexOf("## B"));
  });

  it("moves a subtree down past its next sibling", () => {
    const state = stateAt(DOC, "## A");
    const { here, sections } = ctxAt(state, "## A");
    const next = apply(state, moveSubtreeDown(state, sections, here));
    expect(next.doc.toString()).toBe(`${PRE}${B_TEXT}\n${A_TEXT}`);
    expect(next.selection.main.head).toBe(next.doc.toString().indexOf("## A"));
  });

  it("does nothing without a previous sibling", () => {
    const state = stateAt(DOC, "## A");
    const { here, sections } = ctxAt(state, "## A");
    expect(moveSubtreeUp(state, sections, here)).toBeNull();
  });

  it("does nothing without a next sibling", () => {
    const state = stateAt(DOC, "## B");
    const { here, sections } = ctxAt(state, "## B");
    expect(moveSubtreeDown(state, sections, here)).toBeNull();
  });

  it("never swaps across different parents", () => {
    const doc = "# X\n\n## A\n\n# Y\n\n## B\n";
    const state = stateAt(doc, "## B");
    const { here, sections } = ctxAt(state, "## B");
    expect(moveSubtreeUp(state, sections, here)).toBeNull();
  });
});

describe("insert heading", () => {
  it("inserts a sibling headline after the current line at the enclosing level", () => {
    const state = stateAt(DOC, "a body");
    const next = apply(state, insertHeadingBelow(state, parseSections(state)));
    expect(next.doc.toString()).toContain("a body\n## \n");
    expect(next.selection.main.head).toBe(
      next.doc.toString().indexOf("a body\n## \n") + "a body\n## ".length,
    );
  });

  it("matches the level of the heading under the cursor", () => {
    const state = stateAt(DOC, "### A1");
    const doc = apply(state, insertHeadingBelow(state, parseSections(state))).doc.toString();
    expect(doc).toContain("### A1\n### \n");
  });

  it("falls back to level one outside any section", () => {
    const state = stateAt("plain\ntext", "plain");
    const doc = apply(state, insertHeadingBelow(state, parseSections(state))).doc.toString();
    expect(doc).toBe("plain\n# \ntext");
  });

  it("inserts after the whole subtree for insert-after", () => {
    const state = stateAt(DOC, "a body");
    const doc = apply(state, insertHeadingAfterSubtree(state, parseSections(state))).doc.toString();
    expect(doc).toContain("deep\n\n## \n## B");
  });

  it("inserts after the cursor heading's own subtree at its level", () => {
    const state = stateAt(DOC, "### A1");
    const doc = apply(state, insertHeadingAfterSubtree(state, parseSections(state))).doc.toString();
    expect(doc).toContain("deep\n\n### \n## B");
  });
});
