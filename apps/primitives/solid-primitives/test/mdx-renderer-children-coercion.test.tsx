import { afterEach, describe, expect, it } from "vitest";

import { insertMdxContent } from "../src/primitives/MdxRenderer";
import { renderMdx } from "./support/mdx-test-utils";

/**
 * appendNodes / insertMdxContent decide what an expression value becomes in the
 * DOM. They skip only null and false, so `true` leaks as the text "true"
 * (JSX/React render nothing). They also append child nodes directly, so a child
 * DOM node reused in two parents obeys the single-parent rule and survives in
 * only the last one: the manifestation of "components are rendered once, eagerly".
 */
afterEach(() => {
  document.body.innerHTML = "";
});

describe("MdxRenderer children coercion", () => {
  it("renders {true} as nothing, like JSX", async () => {
    const wrapper = await renderMdx("Flag: {true} end.\n");
    expect(wrapper.textContent).not.toContain("true");
  });

  it("renders {null} and {false} as nothing (sanity anchor)", async () => {
    const wrapper = await renderMdx("Empty {null}{false} done.\n");
    expect(wrapper.textContent).not.toContain("null");
    expect(wrapper.textContent).not.toContain("false");
  });

  it("renders {0} as the text '0'", async () => {
    const wrapper = await renderMdx("Count: {0} items.\n");
    expect(wrapper.textContent).toContain("0");
  });

  it("renders {NaN} as the text 'NaN' (documents observed behavior)", async () => {
    const wrapper = await renderMdx("Value {NaN} here.\n");
    expect(wrapper.textContent).toContain("NaN");
  });

  it("flattens a component returning nested arrays (sanity anchor)", async () => {
    const Nested = () => {
      const a = document.createElement("i");
      a.textContent = "a";
      const b = document.createElement("i");
      b.textContent = "b";
      return [[a], [b]];
    };
    const wrapper = await renderMdx("<Nested />\n", { Nested });
    expect(wrapper.querySelectorAll("i").length).toBe(2);
  });

  it.fails("renders reused children DOM nodes in every slot", async () => {
    // A layout component that drops its children into two slots. Because the
    // children arrive as already-built DOM nodes, appendChild MOVES them, so the
    // first slot ends up empty.
    const TwoSlots = (props: { children?: unknown }) => {
      const a = document.createElement("section");
      const b = document.createElement("section");
      insertMdxContent(a, props.children);
      insertMdxContent(b, props.children);
      return [a, b];
    };
    const wrapper = await renderMdx("<TwoSlots>**hi**</TwoSlots>\n", { TwoSlots });
    expect(wrapper.querySelectorAll("strong").length).toBe(2);
  });
});
