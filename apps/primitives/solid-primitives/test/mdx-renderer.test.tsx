import { createEffect, createRoot, createSignal } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";

import {
  createMdxRenderer,
  insertMdxContent,
  type MdxModule,
} from "../src/primitives/MdxRenderer";
import { renderMdxDefault, resolveResource } from "./support/mdx-test-utils";

// Rich MDX document exercising headings, formatting, expression evaluation,
// lists, and inline variable assignment.
const RICH_MDX = `
# Hello from MDX

> A blockquote rendered client-side via \`@mdx-js/mdx\` and \`@babel/standalone\`.

Plain **bold**, _italic_, and \`inline code\` all work.

Expressions evaluate too: {2 + 2} is four.

## List

- Alpha
- Beta
- Gamma

{x = 3}

The value of variable x is {x}
`.trim();

afterEach(() => {
  document.body.innerHTML = "";
});

describe("createMdxRenderer", () => {
  it("renders valid MDX as content, not as an error node", async () => {
    // Regression: Babel's parser threw 'return outside of function' when
    // processing the MDX function-body output, causing the error fallback to
    // render instead of the actual content.
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => "# Hello\n\nWorld.\n"),
    );
    const el = renderMdxDefault(module);
    expect(el?.dataset?.part).not.toBe("error");
  });

  it("resolves MDX containing a JSX expression without error", async () => {
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => "Result: {1 + 1}\n"),
    );
    const el = renderMdxDefault(module);
    expect(el?.dataset?.part).not.toBe("error");
  });

  it("renders a variable defined with export const and referenced in content", async () => {
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(
        () => 'export const greeting = "World"\n\n# Hello {greeting}\n',
      ),
    );
    const el = renderMdxDefault(module);
    expect(el?.dataset?.part).not.toBe("error");
    expect(el?.textContent).toContain("World");
  });

  it("renders a counter button passed via components and increments on click", async () => {
    // A component with SolidJS state passed via the components prop.
    // createEffect runs within the createRoot inside renderMdxDefault, so
    // the button text updates synchronously when the signal changes.
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => "<Counter />\n"),
    );

    let btn: HTMLButtonElement | null = null;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      const [count, setCount] = createSignal(0);

      const Counter = () => {
        const el = document.createElement("button");
        el.onclick = () => setCount((c) => c + 1);
        createEffect(() => {
          el.textContent = `Count: ${count()}`;
        });
        return el;
      };

      const wrapper = document.createElement("div");
      const output = (module.default as (p: { components: Record<string, unknown> }) => unknown)({
        components: { Counter },
      });
      insertMdxContent(wrapper, output);
      btn = wrapper.querySelector("button");
    });

    expect(btn).not.toBeNull();
    expect(btn!.textContent).toBe("Count: 0");
    btn!.click();
    expect(btn!.textContent).toBe("Count: 1");
    btn!.click();
    expect(btn!.textContent).toBe("Count: 2");

    dispose();
  });

  it("returns an error module when MDX is syntactically invalid", async () => {
    // The primitive catches errors and returns a module whose default renders
    // a data-part='error' element rather than throwing.
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => "# Broken\n\n{unclosedBrace"),
    );
    const wrapper = renderMdxDefault(module);
    const errorEl = wrapper.querySelector("[data-part='error']") as HTMLElement | null;
    expect(errorEl).not.toBeNull();
    expect(errorEl?.dataset.part).toBe("error");
  });

  it("renders a rich MDX document with headings, formatting, expressions, lists, and inline variable assignment", async () => {
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => RICH_MDX),
    );
    const wrapper = renderMdxDefault(module);

    // No compilation error
    expect(wrapper.querySelector("[data-part='error']")).toBeNull();

    // h1 heading
    expect(wrapper.querySelector("h1")?.textContent).toBe("Hello from MDX");

    // h2 sub-heading
    expect(wrapper.querySelector("h2")?.textContent).toBe("List");

    // blockquote present
    expect(wrapper.querySelector("blockquote")).not.toBeNull();

    // inline formatting elements
    expect(wrapper.querySelector("strong")).not.toBeNull();
    expect(wrapper.querySelector("em")).not.toBeNull();
    expect(wrapper.querySelector("code")).not.toBeNull();

    // expression {2 + 2} renders as "4"
    expect(wrapper.textContent).toContain("4");

    // list items
    const items = wrapper.querySelectorAll("li");
    expect(items.length).toBe(3);
    expect(items[0]?.textContent).toBe("Alpha");
    expect(items[1]?.textContent).toBe("Beta");
    expect(items[2]?.textContent).toBe("Gamma");

    // inline variable assignment {x = 3} and reuse {x}
    const paragraphs = Array.from(wrapper.querySelectorAll("p"));
    const xPara = paragraphs.find((p) => p.textContent?.includes("variable x is"));
    expect(xPara).not.toBeNull();
    expect(xPara?.textContent).toContain("3");
  });
});
