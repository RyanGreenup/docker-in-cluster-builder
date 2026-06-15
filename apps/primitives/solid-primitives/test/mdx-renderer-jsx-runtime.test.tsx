import { afterEach, describe, expect, it } from "vitest";

import { renderMdx } from "./support/mdx-test-utils";

/**
 * The hand-written mdxJsx runtime maps every non-class, non-`on*` prop through
 * `setAttribute(key, String(value))`. That stringifies objects, keeps falsy
 * boolean/undefined attributes, never translates React-style prop names
 * (htmlFor, style object), and lowercases the whole event suffix
 * (onDoubleClick -> "doubleclick", not the real "dblclick"). Each test asserts
 * the behavior a React/JSX author expects.
 */
afterEach(() => {
  document.body.innerHTML = "";
  delete (globalThis as Record<string, unknown>).__dblFired;
});

describe("MdxRenderer JSX runtime attribute and event mapping", () => {
  it("applies a style object as real inline styles", async () => {
    const wrapper = await renderMdx('<div style={{color: "red"}}>x</div>\n');
    const div = wrapper.querySelector("div");
    expect(div?.style.color).toBe("red");
    expect(div?.getAttribute("style")).not.toBe("[object Object]");
  });

  it("treats disabled={false} as not disabled", async () => {
    const wrapper = await renderMdx("<button disabled={false}>Hit</button>\n");
    const btn = wrapper.querySelector("button");
    expect(btn?.disabled).toBe(false);
  });

  it("maps htmlFor to the `for` attribute", async () => {
    const wrapper = await renderMdx('<label htmlFor="field">Name</label>\n');
    const label = wrapper.querySelector("label");
    expect(label?.htmlFor).toBe("field");
    expect(label?.getAttribute("for")).toBe("field");
  });

  it("omits an attribute whose value is undefined", async () => {
    const wrapper = await renderMdx("<a href={undefined}>link</a>\n");
    const link = wrapper.querySelector("a");
    expect(link?.hasAttribute("href")).toBe(false);
  });

  it("binds onDoubleClick to the real dblclick event", async () => {
    const wrapper = await renderMdx(
      "<button onDoubleClick={() => { globalThis.__dblFired = true }}>Hit</button>\n",
    );
    const btn = wrapper.querySelector("button");
    expect(btn).not.toBeNull();
    btn?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect((globalThis as Record<string, unknown>).__dblFired).toBe(true);
  });
});
