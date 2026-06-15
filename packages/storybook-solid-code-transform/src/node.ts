import generateImport from "@babel/generator";
import { parse } from "@babel/parser";
import traverseImport from "@babel/traverse";
import {
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isJSXAttribute,
  isStringLiteral,
  valueToNode,
} from "@babel/types";

import { createInlineStoryArgs } from "./core.js";

import type { BabelToolkit } from "./toolkit.js";

// `@babel/traverse` and `@babel/generator` are CJS; under ESM/bundler interop the
// Callable can hide under `.default`. Normalise once so this works in Node directly
// And when bundled. Node ships a real `process`, so no browser shimming is needed.
const traverse =
  (traverseImport as unknown as { default?: typeof traverseImport }).default ?? traverseImport;
const generate =
  (generateImport as unknown as { default?: typeof generateImport }).default ?? generateImport;

/** The {@link BabelToolkit} backed by the real `@babel/*` packages (Node / CLI). */
export const nodeToolkit: BabelToolkit = {
  generate,
  parse,
  traverse,
  types: {
    isArrowFunctionExpression,
    isFunctionExpression,
    isIdentifier,
    isJSXAttribute,
    isStringLiteral,
    valueToNode,
  },
};

export const inlineStoryArgs = createInlineStoryArgs(nodeToolkit);
