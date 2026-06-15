import type generate from "@babel/generator";
import type { parse } from "@babel/parser";
import type traverse from "@babel/traverse";
import type * as types from "@babel/types";

/**
 * The babel surface {@link createInlineStoryArgs} needs, injected so the same core
 * logic runs in either environment. The node adapter wires the real `@babel/*`
 * packages; the browser adapter wires `@babel/standalone`'s `Babel.packages`. All
 * imports here are type-only, so this module emits no runtime code (and no
 * `process` access) — that lives entirely in the adapters.
 */
export interface BabelToolkit {
  readonly parse: typeof parse;
  readonly traverse: typeof traverse;
  readonly generate: typeof generate;
  readonly types: Pick<
    typeof types,
    | "isArrowFunctionExpression"
    | "isFunctionExpression"
    | "isIdentifier"
    | "isJSXAttribute"
    | "isStringLiteral"
    | "valueToNode"
  >;
}
