import { Extension, InputRule } from "@tiptap/core";

import type { NodeType } from "@tiptap/pm/model";

// Upstream @tiptap/extension-mathematics wires its live input rules to doubled
// Delimiters ($$..$$ inline, $$$..$$$ block), which disagrees with the single/
// Double dollar convention its own markdown serializer round-trips. So typing
// The conventional `$4x$` does nothing. These rules restore the convention:
// `$..$` becomes inline math and `$$..$$` becomes block math as you type, in
// Step with how the document serializes back to markdown.

// Inline: a single-dollar span not adjacent to another dollar (so it never
// Fires mid-way through a $$..$$ block being typed).
const INLINE_MATH = /(?<!\$)\$([^$\n]+)\$$/u;

// Block: a double-dollar span. Checked before the inline rule so $$..$$ becomes
// A display formula rather than an inline one.
const BLOCK_MATH = /(?<!\$)\$\$([^$\n]+)\$\$$/u;

// Pending: while the caret sits inside an unterminated $ or $$ span, the user is
// Typing raw LaTeX. This matches that pending span (one or two opening dollars,
// Then any non-dollar run ending at the caret). It deliberately fails once the
// Span is closed, so the conversion rules above still fire on the closing dollar.
const PENDING_MATH = /(?<!\$)\$\$?[^$\n]*$/u;

// Bare number: a latex body that is nothing but digits (with optional
// Separators), e.g. the `5` in `$5$`. These collide with currency, so whether
// They convert is a reactive setting rather than a hard rule.
const BARE_NUMBER = /^[\d.,]+$/u;

// Regex capture group holding the latex body of a conversion match.
const LATEX_GROUP = 1;
// Whole-match group, used to recover the just-typed characters.
const WHOLE_MATCH = 0;
// ProseMirror resolved-position depth offset for the parent of the textblock.
const PARENT_DEPTH = -1;

export interface MathInputRuleOptions {
  // Read at keystroke time so a settings toggle takes effect live. When it
  // Returns false a bare-number span like `$5$` stays as text (currency-safe);
  // Otherwise such spans become math. Spans with any non-digit always convert.
  numericInlineMath?: () => boolean;
}

const inlineRule = (type: NodeType, options?: MathInputRuleOptions): InputRule =>
  new InputRule({
    find: INLINE_MATH,
    handler: ({ state, range, match }) => {
      const latex = match[LATEX_GROUP]?.trim();
      if (latex === undefined || latex === "") {
        return;
      }
      // Bare numbers only convert when the (reactive) setting allows it, so
      // Prices like `$5$` can stay as text in a finance context.
      if (BARE_NUMBER.test(latex) && options?.numericInlineMath?.() === false) {
        return;
      }
      state.tr.replaceWith(range.from, range.to, type.create({ latex }));
    },
  });

const blockRule = (type: NodeType): InputRule =>
  new InputRule({
    find: BLOCK_MATH,
    handler: ({ state, range, match }) => {
      const latex = match[LATEX_GROUP]?.trim();
      if (latex === undefined || latex === "") {
        return;
      }
      const node = type.create({ latex });
      const $from = state.doc.resolve(range.from);
      // A block node cannot live inside a paragraph, so when the typed text
      // Fills the whole textblock, replace that block; otherwise (mid-paragraph)
      // Fall back to the matched range.
      const fillsTextblock =
        $from.parent.isTextblock && range.from === $from.start() && range.to === $from.end();
      const canReplaceBlock =
        fillsTextblock &&
        $from
          .node(PARENT_DEPTH)
          .canReplaceWith($from.index(PARENT_DEPTH), $from.indexAfter(PARENT_DEPTH), type);
      const target = canReplaceBlock ? { from: $from.before(), to: $from.after() } : range;
      state.tr.replaceWith(target.from, target.to, node);
    },
  });

// Suppress every other input rule (notably Typography turning `^2` into the
// Superscript glyph) while inside an open math span, by claiming the keystroke
// And re-inserting it verbatim. Registered last so the conversion rules win on
// The closing dollar; first-match-wins means it only fires on the in-between
// Characters they ignore.
const pendingGuardRule = (): InputRule =>
  new InputRule({
    find: PENDING_MATH,
    handler: ({ state, range, match }) => {
      const typed = match[WHOLE_MATCH].slice(range.to - range.from);
      if (typed === "") {
        return;
      }
      state.tr.insertText(typed, range.to, range.to);
    },
  });

export const mathInputRules = (options?: MathInputRuleOptions): Extension =>
  Extension.create({
    addInputRules() {
      const { blockMath, inlineMath } = this.editor.schema.nodes;
      const rules: InputRule[] = [];
      if (blockMath !== undefined) {
        rules.push(blockRule(blockMath));
      }
      if (inlineMath !== undefined) {
        rules.push(inlineRule(inlineMath, options));
      }
      rules.push(pendingGuardRule());
      return rules;
    },

    name: "mathInputRules",

    // Each extension owns a separate input-rules plugin, evaluated in priority
    // Order. A high priority puts these rules ahead of Typography so the math
    // Span guard claims a keystroke before Typography can rewrite it.
    priority: 1000,
  });
