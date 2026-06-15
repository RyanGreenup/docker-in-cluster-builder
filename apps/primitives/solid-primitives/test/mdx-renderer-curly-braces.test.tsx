import { afterEach, describe, expect, it } from "vitest";

import { getError, renderMdx } from "./support/mdx-test-utils";

/**
 * MDX treats every `{ ... }` in prose as a JavaScript expression. Authors coming
 * from plain markdown (or pasting LaTeX) hit two sharp edges:
 *   1. A literal brace references an undefined identifier and throws.
 *   2. The throw happens while module.default() RUNS, but createMdxRenderer only
 *      try/catches compilation, so the data-part='error' fallback never appears
 *      and the exception escapes to the caller.
 */
afterEach(() => {
  document.body.innerHTML = "";
});

describe("MdxRenderer curly-brace and math footguns", () => {
  it.fails("renders literal curly braces in prose as text", async () => {
    const wrapper = await renderMdx("Use {curly} braces in your config.\n");
    expect(wrapper.textContent).toContain("{curly}");
  });

  it("render-time ReferenceError escapes the compile-only error fallback", async () => {
    // Documents current behavior: the throw is NOT converted to data-part='error'.
    await expect(renderMdx("Use {curly} braces.\n")).rejects.toThrow();
  });

  it("an undefined-reference body still compiles cleanly (no compile error node)", async () => {
    // The expression is only undefined at runtime, so compilation succeeds and
    // there is no data-part='error' to observe; it blows up on render instead.
    await expect(async () => {
      const wrapper = await renderMdx("Total is {grandTotal}.\n");
      expect(getError(wrapper)).toBeNull();
    }).rejects.toThrow();
  });

  it("renders inline LaTeX math instead of evaluating its braces", async () => {
    // `$\frac{a}{b}$` -> the `{a}` and `{b}` are parsed as JS expressions.
    const wrapper = await renderMdx("The ratio $\\frac{a}{b}$ is fixed.\n");
    expect(wrapper.querySelector(".katex")).not.toBeNull();
  });

  it("renders simple inline math `$x$` as a typeset node", async () => {
    const wrapper = await renderMdx("Let $x$ be a real number.\n");
    expect(wrapper.querySelector(".katex")).not.toBeNull();
    expect(wrapper.textContent).not.toContain("$x$");
  });

  it("a bare dollar amount with no braces is plain text (sanity anchor)", async () => {
    const wrapper = await renderMdx("It costs $5 today.\n");
    expect(wrapper.textContent).toContain("$5");
  });
});
