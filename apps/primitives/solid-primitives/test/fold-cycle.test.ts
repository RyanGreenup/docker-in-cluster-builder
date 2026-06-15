import { codeFolding, foldEffect, foldedRanges } from "@codemirror/language";
import { EditorState, type TransactionSpec } from "@codemirror/state";
import { describe, expect, it } from "vitest";

import {
  cycleGlobalFold,
  cycleLocalFold,
  foldCycleState,
  subtreeFoldState,
} from "../src/primitives/Editor/modes/CodeMirror/cm/fold-cycle";
import {
  directChildren,
  headingAt,
  parseSections,
  type Section,
} from "../src/primitives/Editor/modes/CodeMirror/cm/headings";

import type { EditorView } from "@codemirror/view";

const DOC = [
  "intro text",
  "",
  "# Alpha",
  "",
  "alpha body",
  "",
  "## Child One",
  "",
  "child one body",
  "",
  "### Grand",
  "",
  "grand body",
  "",
  "## Child Two",
  "",
  "child two body",
  "",
  "# Leaf",
  "",
  "leaf body only",
].join("\n");

interface FoldRange {
  from: number;
  to: number;
}

interface TestView {
  dispatchCount: number;
  state: EditorState;
  dispatch: (spec: TransactionSpec) => void;
}

// Commands only touch `state`, `dispatch`, and the selection, so a minimal
// stand-in lets the fold logic run headlessly without a real EditorView.
function makeView(doc: string, cursor: number): TestView {
  const view: TestView = {
    dispatch(spec: TransactionSpec) {
      view.dispatchCount += 1;
      view.state = view.state.update(spec).state;
    },
    dispatchCount: 0,
    state: EditorState.create({
      doc,
      extensions: [codeFolding(), foldCycleState()],
      selection: { anchor: cursor },
    }),
  };
  return view;
}

function asEditorView(view: TestView): EditorView {
  return view as unknown as EditorView;
}

function foldsOf(state: EditorState): FoldRange[] {
  const out: FoldRange[] = [];
  foldedRanges(state).between(0, state.doc.length, (from, to) => {
    out.push({ from, to });
  });
  return out;
}

function sectionFor(sections: Section[], doc: string, heading: string): Section {
  const at = doc.indexOf(heading);
  const found = sections.find((sec) => sec.headingFrom === at);
  if (!found) {
    throw new Error(`no section for ${heading}`);
  }
  return found;
}

function covered(folds: FoldRange[], pos: number): boolean {
  return folds.some((fold) => fold.from <= pos && pos < fold.to);
}

describe("parseSections", () => {
  const state = EditorState.create({ doc: DOC });
  const sections = parseSections(state);

  it("finds every ATX heading with its level", () => {
    expect(sections.map((sec) => sec.level)).toEqual([1, 2, 3, 2, 1]);
  });

  it("separates own body from the whole subtree", () => {
    const alpha = sectionFor(sections, DOC, "# Alpha");
    const childOne = sectionFor(sections, DOC, "## Child One");
    const leaf = sectionFor(sections, DOC, "# Leaf");

    expect(alpha.bodyEnd).toBeLessThan(childOne.headingFrom);
    expect(alpha.sectionEnd).toBeLessThan(leaf.headingFrom);
    expect(alpha.sectionEnd).toBe(sectionFor(sections, DOC, "## Child Two").sectionEnd);
  });

  it("gives leaf sections an identical bodyEnd and sectionEnd", () => {
    const leaf = sectionFor(sections, DOC, "# Leaf");
    expect(leaf.bodyEnd).toBe(leaf.sectionEnd);
    expect(leaf.sectionEnd).toBe(DOC.length);
  });
});

describe("directChildren", () => {
  it("returns only the direct children, not grandchildren", () => {
    const state = EditorState.create({ doc: DOC });
    const sections = parseSections(state);
    const alpha = sectionFor(sections, DOC, "# Alpha");

    const children = directChildren(sections, alpha);
    expect(children.map((sec) => sec.headingFrom)).toEqual([
      DOC.indexOf("## Child One"),
      DOC.indexOf("## Child Two"),
    ]);
  });

  it("treats a skipped-level heading as a direct child", () => {
    const doc = "# A\n\n### B\n\nb body";
    const sections = parseSections(EditorState.create({ doc }));
    const top = sectionFor(sections, doc, "# A");

    const children = directChildren(sections, top);
    expect(children.map((sec) => sec.headingFrom)).toEqual([doc.indexOf("### B")]);
  });

  it("returns nothing for a leaf section", () => {
    const sections = parseSections(EditorState.create({ doc: DOC }));
    const leaf = sectionFor(sections, DOC, "# Leaf");
    expect(directChildren(sections, leaf)).toEqual([]);
  });
});

describe("headingAt", () => {
  const sections = parseSections(EditorState.create({ doc: DOC }));

  it("matches anywhere on the heading line, including both ends", () => {
    const alpha = sectionFor(sections, DOC, "# Alpha");
    expect(headingAt(sections, alpha.headingFrom)).toBe(alpha);
    expect(headingAt(sections, alpha.headingFrom + 3)).toBe(alpha);
    expect(headingAt(sections, alpha.headingTo)).toBe(alpha);
  });

  it("returns null in body text and before the first heading", () => {
    expect(headingAt(sections, DOC.indexOf("alpha body"))).toBeNull();
    expect(headingAt(sections, DOC.indexOf("intro text"))).toBeNull();
  });
});

describe("cycleLocalFold", () => {
  it("toggles a leaf heading: shown -> folded -> shown", () => {
    const view = makeView(DOC, DOC.indexOf("# Leaf"));
    const sections = parseSections(view.state);
    const leaf = sectionFor(sections, DOC, "# Leaf");

    expect(cycleLocalFold(asEditorView(view))).toBe(true);
    expect(foldsOf(view.state)).toEqual([{ from: leaf.headingTo, to: leaf.sectionEnd }]);
    expect(subtreeFoldState(view.state, leaf)).toBe("folded");

    expect(cycleLocalFold(asEditorView(view))).toBe(true);
    expect(foldsOf(view.state)).toEqual([]);
    expect(subtreeFoldState(view.state, leaf)).toBe("shown");

    expect(cycleLocalFold(asEditorView(view))).toBe(true);
    expect(foldsOf(view.state)).toEqual([{ from: leaf.headingTo, to: leaf.sectionEnd }]);
  });

  it("cycles a parent: FOLDED -> CHILDREN -> SUBTREE -> FOLDED", () => {
    const view = makeView(DOC, DOC.indexOf("# Alpha"));
    const sections = parseSections(view.state);
    const alpha = sectionFor(sections, DOC, "# Alpha");
    const childOne = sectionFor(sections, DOC, "## Child One");
    const childTwo = sectionFor(sections, DOC, "## Child Two");
    const grand = sectionFor(sections, DOC, "### Grand");

    cycleLocalFold(asEditorView(view));
    expect(foldsOf(view.state)).toEqual([{ from: alpha.headingTo, to: alpha.sectionEnd }]);

    cycleLocalFold(asEditorView(view));
    const childrenView = foldsOf(view.state);
    expect(childrenView).toEqual([
      { from: alpha.headingTo, to: alpha.bodyEnd },
      { from: childOne.headingTo, to: childOne.sectionEnd },
      { from: childTwo.headingTo, to: childTwo.sectionEnd },
    ]);
    expect(covered(childrenView, childOne.headingFrom)).toBe(false);
    expect(covered(childrenView, childTwo.headingFrom)).toBe(false);
    expect(covered(childrenView, grand.headingFrom)).toBe(true);

    cycleLocalFold(asEditorView(view));
    expect(foldsOf(view.state)).toEqual([]);

    cycleLocalFold(asEditorView(view));
    expect(foldsOf(view.state)).toEqual([{ from: alpha.headingTo, to: alpha.sectionEnd }]);
  });

  it("unfolds everything from a partial state (e.g. a gutter fold)", () => {
    const view = makeView(DOC, DOC.indexOf("# Alpha"));
    const sections = parseSections(view.state);
    const alpha = sectionFor(sections, DOC, "# Alpha");
    const childOne = sectionFor(sections, DOC, "## Child One");

    view.dispatch({
      effects: [foldEffect.of({ from: childOne.headingTo, to: childOne.sectionEnd })],
    });
    expect(subtreeFoldState(view.state, alpha)).toBe("partial");

    cycleLocalFold(asEditorView(view));
    expect(foldsOf(view.state)).toEqual([]);
  });

  it("is a handled no-op on an entry with nothing to fold", () => {
    const doc = "intro\n\n# Empty";
    const view = makeView(doc, doc.indexOf("# Empty"));

    expect(cycleLocalFold(asEditorView(view))).toBe(true);
    expect(view.dispatchCount).toBe(0);
    expect(foldsOf(view.state)).toEqual([]);
  });

  it("falls through when the cursor is not on a heading line", () => {
    const inBody = makeView(DOC, DOC.indexOf("alpha body"));
    expect(cycleLocalFold(asEditorView(inBody))).toBe(false);

    const inIntro = makeView(DOC, 0);
    expect(cycleLocalFold(asEditorView(inIntro))).toBe(false);
  });
});

describe("cycleGlobalFold", () => {
  it("cycles OVERVIEW -> CONTENTS -> SHOW ALL in single transactions", () => {
    const view = makeView(DOC, 0);
    const sections = parseSections(view.state);
    const alpha = sectionFor(sections, DOC, "# Alpha");
    const leaf = sectionFor(sections, DOC, "# Leaf");
    const grand = sectionFor(sections, DOC, "### Grand");

    expect(cycleGlobalFold(asEditorView(view))).toBe(true);
    expect(view.dispatchCount).toBe(1);
    const overview = foldsOf(view.state);
    expect(overview).toEqual([
      { from: alpha.headingTo, to: alpha.sectionEnd },
      { from: leaf.headingTo, to: leaf.sectionEnd },
    ]);
    expect(covered(overview, DOC.indexOf("intro text"))).toBe(false);

    expect(cycleGlobalFold(asEditorView(view))).toBe(true);
    const contents = foldsOf(view.state);
    expect(contents).toEqual(sections.map((sec) => ({ from: sec.headingTo, to: sec.bodyEnd })));
    expect(covered(contents, grand.headingFrom)).toBe(false);

    expect(cycleGlobalFold(asEditorView(view))).toBe(true);
    expect(foldsOf(view.state)).toEqual([]);

    expect(cycleGlobalFold(asEditorView(view))).toBe(true);
    expect(foldsOf(view.state)).toEqual(overview);
  });

  it("does nothing in a document without headings", () => {
    const view = makeView("plain text only", 0);
    expect(cycleGlobalFold(asEditorView(view))).toBe(false);
    expect(view.dispatchCount).toBe(0);
  });
});
