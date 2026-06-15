import { afterEach, describe, expect, it } from "vitest";

import { insertMdxContent } from "../src/primitives/MdxRenderer";
import { getError, renderMdx } from "./support/mdx-test-utils";

/**
 * Raw-HTML expectations from authors migrating .md to this MDX renderer. MDX is
 * stricter than markdown: HTML comments and unclosed void tags are compile
 * errors (surfaced as data-part='error'), and the runtime builds every element
 * with document.createElement, so SVG ends up in the wrong namespace. Component
 * overrides for intrinsic tags are exercised as positive coverage.
 */
afterEach(() => {
  document.body.innerHTML = "";
});

describe("MdxRenderer HTML interop", () => {
  it.fails("ignores an HTML comment instead of erroring", async () => {
    const wrapper = await renderMdx("Before <!-- hidden --> after.\n");
    expect(getError(wrapper)).toBeNull();
    expect(wrapper.textContent).not.toContain("hidden");
  });

  it.fails("accepts an unclosed <br> void element", async () => {
    const wrapper = await renderMdx("Line one<br>line two\n");
    expect(getError(wrapper)).toBeNull();
    expect(wrapper.querySelector("br")).not.toBeNull();
  });

  it.fails("accepts an unclosed <img> with a src", async () => {
    const wrapper = await renderMdx('<img src="a.png" alt="a">\n');
    expect(getError(wrapper)).toBeNull();
    expect(wrapper.querySelector("img")?.getAttribute("src")).toBe("a.png");
  });

  it("creates SVG elements in the SVG namespace", async () => {
    const wrapper = await renderMdx('<svg><circle r="5" /></svg>\n');
    const svg = wrapper.querySelector("svg");
    expect(svg?.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("lets the components map override an intrinsic tag (positive coverage)", async () => {
    const H1 = (props: { children?: unknown }) => {
      const el = document.createElement("h1");
      el.dataset.custom = "yes";
      insertMdxContent(el, props.children);
      return el;
    };
    const wrapper = await renderMdx("# Hi there\n", { h1: H1 });
    const h1 = wrapper.querySelector("h1");
    expect(h1?.dataset.custom).toBe("yes");
    expect(h1?.textContent).toContain("Hi there");
  });
});
