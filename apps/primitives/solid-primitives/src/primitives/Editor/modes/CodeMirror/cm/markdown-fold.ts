// oxlint-disable unicorn/no-null -- foldService must return `null`, not `undefined`.
import { foldService } from "@codemirror/language";

import { parseSections } from "./headings";

export const markdownHeadingFold = foldService.of((state, lineStart, lineEnd) => {
  const sections = parseSections(state);
  const here = sections.find((sec) => sec.headingFrom === lineStart);
  if (!here) {
    return null;
  }
  if (here.sectionEnd <= lineEnd) {
    return null;
  }
  return { from: lineEnd, to: here.sectionEnd };
});
