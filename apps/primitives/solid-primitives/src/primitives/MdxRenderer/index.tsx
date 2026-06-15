import {
  type Accessor,
  type Component,
  createEffect,
  createResource,
  Show,
  Suspense,
} from "solid-js";

export type MdxModule = {
  default: Component<{ components?: Record<string, unknown> }>;
};

export type MdxRendererProps = {
  source: Accessor<string>;
  class?: string;
  components?: Record<string, unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

// Plain-DOM JSX runtime injected into the MDX function-body eval context.
// Returns real DOM nodes so tests can query textContent/dataset/click without
// depending on solid-js/h internals. Component functions are called directly,
// so any SolidJS reactive primitives (createSignal, createEffect) used inside
// a component work correctly when called within a createRoot context.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MdxFragment: any = Symbol("MdxFragment");

function appendNodes(parent: Node, children: unknown): void {
  // Booleans, null, and undefined render as nothing, matching JSX semantics.
  if (children == null || children === false || children === true) return;
  if (Array.isArray(children)) {
    for (const child of children) appendNodes(parent, child);
  } else if (children instanceof Node) {
    parent.appendChild(children);
  } else {
    parent.appendChild(document.createTextNode(String(children)));
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

// Tags that must be created in the SVG namespace. document.createElement always
// produces HTML-namespaced nodes, so SVG content needs createElementNS.
const SVG_TAGS = new Set([
  "svg", "circle", "ellipse", "line", "path", "polygon", "polyline", "rect",
  "g", "defs", "use", "symbol", "text", "tspan", "linearGradient",
  "radialGradient", "stop", "clipPath", "mask", "pattern", "image", "marker",
  "foreignObject", "filter",
]);

// React-style event prop suffix -> real DOM event name. Most are just the
// lowercased suffix, but a handful do not map by naive lowercasing.
const EVENT_NAME_OVERRIDES: Record<string, string> = {
  doubleclick: "dblclick",
};

function applyStyle(el: HTMLElement | SVGElement, value: unknown): void {
  if (value && typeof value === "object") {
    for (const [prop, raw] of Object.entries(value as Record<string, unknown>)) {
      if (raw == null) continue;
      // Support both camelCase (backgroundColor) and kebab-case (background-color).
      (el.style as unknown as Record<string, string>)[prop] = String(raw);
    }
  } else if (value != null) {
    el.setAttribute("style", String(value));
  }
}

// React/JSX prop name -> HTML attribute name for the handful that differ.
const ATTR_NAME_ALIASES: Record<string, string> = {
  className: "class",
  htmlFor: "for",
};

function setAttr(el: Element, key: string, value: unknown): void {
  if (value == null || value === false) return; // omit falsy boolean/undefined attrs
  const name = ATTR_NAME_ALIASES[key] ?? key;
  if (value === true) {
    el.setAttribute(name, "");
    return;
  }
  el.setAttribute(name, String(value));
}

function mdxJsx(
  type: string | symbol | ((...args: AnyProps[]) => unknown),
  props: AnyProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _key?: string,
): unknown {
  const { children, ...rest } = props ?? {};
  const childList = Array.isArray(children) ? children : children != null ? [children] : [];

  if (type === MdxFragment) return childList;

  if (typeof type === "function") {
    return type({ ...rest, children });
  }

  const tag = type as string;
  const el = SVG_TAGS.has(tag)
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  for (const [key, value] of Object.entries(rest)) {
    if (key === "key") continue;
    if (key === "style") {
      applyStyle(el as HTMLElement | SVGElement, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      const suffix = key.slice(2).toLowerCase();
      el.addEventListener(EVENT_NAME_OVERRIDES[suffix] ?? suffix, value as EventListener);
    } else if (key === "class" || key === "className") {
      if (value != null) el.setAttribute("class", String(value));
    } else {
      setAttr(el, key, value);
    }
  }

  appendNodes(el, childList);
  return el;
}

const MDX_RUNTIME = { jsx: mdxJsx, jsxs: mdxJsx, Fragment: MdxFragment };

// Babel plugin: hoist `var` declarations for any identifier that appears on the
// LHS of an assignment expression ({x = 3}) but is not already declared in scope.
// This makes inline variable assignment valid in MDX function-body strict mode.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hoistMdxAssignedVars({ types: t }: { types: any }) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitor: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Program(path: any) {
        const declared = new Set<string>();
        const assigned = new Set<string>();

        // Collect all explicitly declared identifiers.
        path.traverse({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          VariableDeclarator(vp: any) {
            if (t.isIdentifier(vp.node.id)) declared.add(vp.node.id.name as string);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          FunctionDeclaration(fp: any) {
            if (fp.node.id) declared.add(fp.node.id.name as string);
          },
        });

        // Collect identifiers assigned but not declared.
        path.traverse({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          AssignmentExpression(ap: any) {
            if (t.isIdentifier(ap.node.left)) {
              const name = ap.node.left.name as string;
              if (!declared.has(name)) assigned.add(name);
            }
          },
        });

        // Prepend `var name;` for each undeclared assigned identifier.
        const decls = [...assigned].map((name) =>
          t.variableDeclaration("var", [t.variableDeclarator(t.identifier(name))]),
        );
        if (decls.length > 0) path.unshiftContainer("body", decls);
      },
    },
  };
}

async function compileMdxToModule(source: string): Promise<MdxModule> {
  const [{ compile }, Babel, remarkGfm, remarkFrontmatter, remarkMath, rehypeKatex] =
    await Promise.all([
      import("@mdx-js/mdx"),
      import("@babel/standalone"),
      import("remark-gfm"),
      import("remark-frontmatter"),
      import("remark-math"),
      import("rehype-katex"),
    ]);

  // Compile MDX source to a self-contained JS function body.
  // outputFormat: 'function-body' avoids top-level import/export statements,
  // making the output safe to wrap in `new Function()`.
  // remark-gfm: tables, strikethrough, task lists, autolinks, footnotes.
  // remark-frontmatter: strip YAML frontmatter instead of rendering it.
  // remark-math + rehype-katex: typeset inline/display math.
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm.default, remarkFrontmatter.default, remarkMath.default],
    rehypePlugins: [rehypeKatex.default],
  });

  // @babel/standalone transpiles the function body for browser compatibility.
  // allowReturnOutsideFunction is required because the MDX function-body format
  // emits a top-level `return { default: MDXContent }` which Babel's parser
  // would otherwise reject as invalid outside a function context.
  const result = Babel.transform(String(compiled), {
    parserOpts: { allowReturnOutsideFunction: true },
    presets: [["env", { modules: false }]],
    plugins: [hoistMdxAssignedVars],
  });

  if (!result.code) throw new Error("Babel produced no output");

  // Inject the plain-DOM runtime as arguments[0], matching MDX expectations.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const mod = new Function(result.code)(MDX_RUNTIME) as MdxModule;
  return mod;
}

// Inserts MDX output (element, array, or text) into a container node.
export function insertMdxContent(container: HTMLElement, output: unknown): void {
  if (output == null) return;
  if (Array.isArray(output)) {
    for (const child of output) insertMdxContent(container, child);
  } else if (output instanceof Node) {
    container.appendChild(output);
  } else if (output !== false) {
    container.appendChild(document.createTextNode(String(output)));
  }
}

export function createMdxRenderer(
  source: Accessor<string>,
): ReturnType<typeof createResource<MdxModule, string>> {
  return createResource(source, async (s) => {
    try {
      return await compileMdxToModule(s);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const ErrorComponent: Component<{ components?: Record<string, unknown> }> = () => (
        <div data-part="error">{message}</div>
      );
      return { default: ErrorComponent };
    }
  });
}

export const MdxRenderer: Component<MdxRendererProps> = (props) => {
  const [mdxModule] = createMdxRenderer(props.source);

  return (
    <Suspense fallback={<div data-part="loading" />}>
      <Show when={mdxModule()}>
        {(mod) => {
          // Create a real DOM container so that Fragment returns (arrays) and
          // single-element returns are both handled uniformly.
          const wrapper = document.createElement("div");
          wrapper.dataset.part = "content";
          if (props.class) wrapper.className = props.class;

          createEffect(() => {
            while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
            const output = mod().default({ components: props.components ?? {} });
            insertMdxContent(wrapper, output);
          });

          return wrapper;
        }}
      </Show>
    </Suspense>
  );
};
