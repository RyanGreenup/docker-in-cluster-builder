// oxlint-disable unicorn/no-null -- CodeMirror fold APIs use `null`, not `undefined`.
import type { EditorState } from "@codemirror/state";

export interface Section {
  bodyEnd: number;
  headingFrom: number;
  headingTo: number;
  level: number;
  sectionEnd: number;
}

interface Head {
  from: number;
  level: number;
  lineNo: number;
  to: number;
}

interface Extent {
  bodyEnd: number;
  sectionEnd: number;
}

const ATX_PATTERN = /^(#{1,6})(?:\s|$)/u;

// oxlint-disable-next-line no-magic-numbers
const MAX_HEADING_LEVEL = 6;
const NOT_A_HEADING = 0;
const HASH_GROUP = 1;
const PREVIOUS_LINE = 1;

function atxLevel(text: string): number {
  const match = ATX_PATTERN.exec(text);
  const hashes = match?.[HASH_GROUP];
  if (hashes === undefined || hashes.length === NOT_A_HEADING) {
    return NOT_A_HEADING;
  }
  return hashes.length;
}

function collectHeads(state: EditorState): Head[] {
  const { doc } = state;
  const heads: Head[] = [];
  for (let lineNum = 1; lineNum <= doc.lines; lineNum++) {
    const line = doc.line(lineNum);
    const level = atxLevel(line.text);
    if (level > NOT_A_HEADING) {
      heads.push({ from: line.from, level, lineNo: lineNum, to: line.to });
    }
  }
  return heads;
}

// oxlint-disable-next-line max-statements
function extentOf(state: EditorState, heads: Head[], headIdx: number): Extent {
  const { doc } = state;
  const head = heads[headIdx];
  if (head === undefined) {
    return { bodyEnd: doc.length, sectionEnd: doc.length };
  }
  let sectionEnd = doc.length;
  let bodyEnd = doc.length;
  let bodySet = false;
  for (let nextIdx = headIdx + PREVIOUS_LINE; nextIdx < heads.length; nextIdx++) {
    const next = heads[nextIdx];
    if (next === undefined) {
      break;
    }
    if (next.level <= head.level) {
      sectionEnd = doc.line(next.lineNo - PREVIOUS_LINE).to;
      if (!bodySet) {
        bodyEnd = sectionEnd;
      }
      break;
    }
    if (!bodySet) {
      bodyEnd = doc.line(next.lineNo - PREVIOUS_LINE).to;
      bodySet = true;
    }
  }
  return { bodyEnd, sectionEnd };
}

export function parseSections(state: EditorState): Section[] {
  const heads = collectHeads(state);
  return heads.map((head, headIdx) => {
    const { bodyEnd, sectionEnd } = extentOf(state, heads, headIdx);
    return {
      bodyEnd,
      headingFrom: head.from,
      headingTo: head.to,
      level: head.level,
      sectionEnd,
    };
  });
}

export function headingAt(sections: Section[], pos: number): Section | null {
  return sections.find((sec) => sec.headingFrom <= pos && pos <= sec.headingTo) ?? null;
}

export function directChildren(sections: Section[], parent: Section): Section[] {
  const children: Section[] = [];
  let nextStart = parent.headingTo;
  for (const sec of sections) {
    const isDescendant =
      sec.headingFrom > parent.headingFrom && sec.sectionEnd <= parent.sectionEnd;
    if (isDescendant && sec.headingFrom >= nextStart) {
      children.push(sec);
      nextStart = sec.sectionEnd;
    }
  }
  return children;
}

export function topLevel(sections: Section[]): number {
  return sections.reduce((min, sec) => Math.min(min, sec.level), MAX_HEADING_LEVEL);
}
