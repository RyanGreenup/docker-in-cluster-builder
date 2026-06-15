import * as Babel from "@babel/standalone";

import { createInlineStoryArgs } from "./core.js";

import type { BabelToolkit } from "./toolkit.js";

// `@babel/standalone` is the vendor's browser-blessed build: it exposes the babel
// Sub-packages on `Babel.packages` and accesses no Node `process`, so this path needs
// None of the `define`/`platform` shimming the individual `@babel/*` packages require
// In a browser. `traverse`/`generator` are namespace imports there, so the callable is
// Under `.default`; `parser` is the module object exposing `.parse`.
const { parser, generator, traverse, types } = Babel.packages;

/** The {@link BabelToolkit} backed by `@babel/standalone` (browser / Storybook). */
export const browserToolkit: BabelToolkit = {
  generate: generator.default,
  parse: parser.parse,
  traverse: traverse.default,
  types,
};

export const inlineStoryArgs = createInlineStoryArgs(browserToolkit);
