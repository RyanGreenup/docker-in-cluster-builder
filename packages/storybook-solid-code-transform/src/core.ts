import type { Node } from "@babel/types";

import type { BabelToolkit } from "./toolkit.js";

type Types = BabelToolkit["types"];

const isRenderKey = (types: Types, key: Node): boolean =>
  (types.isIdentifier(key) && key.name === "render") ||
  (types.isStringLiteral(key) && key.value === "render");

const renderBody = (types: Types, value: Node): Node => {
  if (types.isArrowFunctionExpression(value) || types.isFunctionExpression(value)) {
    return value.body;
  }
  return value;
};

// Replace `args.X` member expressions throughout the tree with the live value.
const substituteArgs = (toolkit: BabelToolkit, ast: Node, args: Record<string, unknown>): void => {
  const { traverse, types } = toolkit;
  traverse(ast, {
    MemberExpression(path) {
      const { object, property, computed } = path.node;
      if (
        types.isIdentifier(object, { name: "args" }) &&
        !computed &&
        types.isIdentifier(property) &&
        property.name in args
      ) {
        const value = args[property.name];
        if (typeof value === "function" || value === undefined) {
          return;
        }
        path.replaceWith(types.valueToNode(value));
        path.skip();
      }
    },
  });
};

// Collapse `attr={"str"}` to `attr="str"` and return the `render` function's body.
const extractRenderBody = (toolkit: BabelToolkit, ast: Node): Node | undefined => {
  const { traverse, types } = toolkit;
  let body: Node | undefined = undefined;
  traverse(ast, {
    JSXExpressionContainer(path) {
      if (types.isJSXAttribute(path.parent) && types.isStringLiteral(path.node.expression)) {
        path.replaceWith(path.node.expression);
      }
    },
    ObjectProperty(path) {
      if (!isRenderKey(types, path.node.key)) {
        return;
      }
      body = renderBody(types, path.node.value);
    },
  });
  return body;
};

/**
 * Build an `inlineStoryArgs` over an injected {@link BabelToolkit}: inline a story's
 * arg values into the JSX its `render` function returns, for Storybook's docs
 * "Show code" panel.
 *
 * Storybook's Solid renderer ships no source serializer, so the docs panel would
 * otherwise dump the whole story object (`{ args, render: (args) => <JSX/> }`) with
 * unresolved `args.min` references. Given that object's source text plus args, the
 * returned function emits just the rendered JSX with the args substituted in
 * (`<AutoGrid min="md" gap="normal">…`), so the panel reads like real usage.
 *
 * Reactivity lives in the caller, not here: this is a pure string→string transform. The
 * shared `@rs/storybook` preview ships a Solid `sourceDecorator` that calls this on
 * every (re-)render and emits `SNIPPET_RENDERED`, so the docs panel re-runs it with the
 * live args and tracks the controls. (Before that decorator existed, the panel was static
 * — the Solid renderer emitted no `SNIPPET_RENDERED` — which is the bug it fixes.)
 *
 * Self-healing: never throws. On any parse/transform failure it logs the error and
 * returns the original `source` unchanged so the panel still shows something.
 */
export const createInlineStoryArgs =
  (toolkit: BabelToolkit) =>
  (source: string, args: Record<string, unknown>): string => {
    try {
      // The source is an object-literal expression; wrap in parens so it parses as
      // An expression rather than a block statement.
      const ast = toolkit.parse(`(${source})`, {
        plugins: ["jsx", "typescript"],
        sourceType: "module",
      });
      substituteArgs(toolkit, ast, args);
      const body = extractRenderBody(toolkit, ast);
      if (body === undefined) {
        return source;
      }
      return toolkit.generate(body).code;
    } catch (error) {
      console.error(
        "[storybook-solid-code-transform] could not inline story args; showing raw source",
        error,
      );
      return source;
    }
  };
