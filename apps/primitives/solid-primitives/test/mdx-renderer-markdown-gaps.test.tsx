import { afterEach, describe, expect, it } from "vitest";

import { renderMdx } from "./support/mdx-test-utils";

/**
 * Markdown features a user assumes "just work" because the renderer is sold as
 * markdown/MDX, but which silently degrade to plain text: no remark-gfm,
 * remark-frontmatter, or any other plugin is wired into compileMdxToModule.
 * Each test asserts the EXPECTED (correct) element, so it currently fails and is
 * marked it.fails; it flips red the day the relevant plugin is added.
 */
afterEach(() => {
  document.body.innerHTML = "";
});

describe("MdxRenderer markdown feature gaps", () => {
  it("renders a GFM pipe table as a <table>", async () => {
    const wrapper = await renderMdx(
      ["| A | B |", "| - | - |", "| 1 | 2 |", ""].join("\n"),
    );
    expect(wrapper.querySelector("table")).not.toBeNull();
    expect(wrapper.querySelectorAll("td").length).toBe(2);
  });

  it("renders ~~strikethrough~~ as a <del>", async () => {
    const wrapper = await renderMdx("This is ~~gone~~ now.\n");
    expect(wrapper.querySelector("del")).not.toBeNull();
    expect(wrapper.textContent).not.toContain("~~");
  });

  it("renders a GFM task list as checkbox inputs", async () => {
    const wrapper = await renderMdx(["- [ ] todo", "- [x] done", ""].join("\n"));
    const boxes = wrapper.querySelectorAll("input[type='checkbox']");
    expect(boxes.length).toBe(2);
    expect((boxes[1] as HTMLInputElement).checked).toBe(true);
  });

  it("autolinks a bare URL into an <a href>", async () => {
    const wrapper = await renderMdx("See https://example.com for details.\n");
    const link = wrapper.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("https://example.com");
  });

  it("renders a footnote reference and definition", async () => {
    const wrapper = await renderMdx(
      ["Here is a note.[^1]", "", "[^1]: the note body", ""].join("\n"),
    );
    // gfm footnotes produce a sup > a ref and an ordered footnote list.
    expect(wrapper.querySelector("sup a, a[href^='#']")).not.toBeNull();
    expect(wrapper.textContent).not.toContain("[^1]");
  });

  it("strips YAML frontmatter instead of rendering it as a heading", async () => {
    const wrapper = await renderMdx(
      ["---", "title: Secret", "---", "", "# Body", ""].join("\n"),
    );
    // Without remark-frontmatter the closing --- makes "title: Secret" a setext
    // heading and the opening --- an <hr>; the title text leaks into the output.
    expect(wrapper.textContent).not.toContain("Secret");
    expect(wrapper.querySelector("hr")).toBeNull();
    expect(wrapper.querySelector("h1")?.textContent).toBe("Body");
  });
});
