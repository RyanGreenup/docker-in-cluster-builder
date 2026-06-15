import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { page } from "vitest/browser";

import { EditorShell, type EditorMode } from "./index";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const mountEditor = (ui: () => ReturnType<typeof EditorShell>): void => {
  const dispose = render(ui, document.body);
  disposers.push(dispose);
};

const commitMathPopoverInput = (latex: string): void => {
  const input = document.querySelector<HTMLInputElement>('[data-part="math-popover-input"]');
  if (!input) {
    return;
  }
  input.value = latex;
  input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
};

it("emits markdown from the textarea mode (controlled)", async () => {
  let latest = "";
  mountEditor(() => (
    <EditorShell
      mode="textarea"
      value=""
      onChange={(markdown) => {
        latest = markdown;
      }}
    />
  ));

  const area = document.querySelector<HTMLTextAreaElement>('[aria-label="Note body"]');
  expect(area).not.toBeNull();

  if (area) {
    area.value = "hello world";
    area.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }

  await expect.poll(() => latest).toBe("hello world");
});

it("mounts the wysiwyg toolbar and content", async () => {
  const [markdown, setMarkdown] = createSignal("# Title\n");
  mountEditor(() => <EditorShell mode="wysiwyg" value={markdown()} onChange={setMarkdown} />);

  await expect.element(page.getByRole("toolbar", { name: "Text formatting" })).toBeInTheDocument();

  await expect.poll(() => document.querySelector('[data-part="wysiwyg-content"]')).toBeTruthy();
});

it("renders inline and block math with KaTeX in wysiwyg mode", async () => {
  mountEditor(() => (
    <EditorShell mode="wysiwyg" value={"Euler: $E = mc^2$\n\n$$\n\\int_0^1 x^2\\,dx\n$$\n"} />
  ));

  await expect.poll(() => document.querySelector('[data-type="inline-math"] .katex')).toBeTruthy();
  await expect.poll(() => document.querySelector('[data-type="block-math"] .katex')).toBeTruthy();
});

it("inserts inline math through the toolbar popover and round-trips markdown", async () => {
  let latest = "";
  mountEditor(() => (
    <EditorShell
      mode="wysiwyg"
      value={"Euler: $E = mc^2$\n\n$$\na + b\n$$\n"}
      onChange={(markdown) => {
        latest = markdown;
      }}
    />
  ));

  await expect
    .poll(() => document.querySelector<HTMLButtonElement>('button[title="Inline math"]'))
    .toBeTruthy();

  document
    .querySelector<HTMLButtonElement>('button[title="Inline math"]')
    ?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

  await expect
    .poll(() => document.querySelector<HTMLInputElement>('[data-part="math-popover-input"]'))
    .toBeTruthy();

  commitMathPopoverInput("x^2");

  await expect.poll(() => latest).toContain("$x^2$");
  expect(latest).toContain("$E = mc^2$");
  expect(latest).toContain("$$\na + b\n$$");
  expect(document.querySelector('[data-part="math-popover"]')).toBeNull();
});

it("opens the math popover prefilled when clicking a formula and cancels on Escape", async () => {
  let latest = "";
  mountEditor(() => (
    <EditorShell
      mode="wysiwyg"
      value={"Euler: $E = mc^2$\n"}
      onChange={(markdown) => {
        latest = markdown;
      }}
    />
  ));

  await expect.poll(() => document.querySelector('[data-type="inline-math"] .katex')).toBeTruthy();

  document
    .querySelector('[data-type="inline-math"]')
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  await expect
    .poll(() => document.querySelector<HTMLInputElement>('[data-part="math-popover-input"]')?.value)
    .toBe("E = mc^2");

  const input = document.querySelector<HTMLInputElement>('[data-part="math-popover-input"]');
  input?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));

  await expect.poll(() => document.querySelector('[data-part="math-popover"]')).toBeNull();
  expect(latest).toBe("");
});

it("cycles a leaf heading fold with Tab in codemirror mode", async () => {
  const [markdown, setMarkdown] = createSignal("# Leaf\n\nonly text body\n");
  mountEditor(() => <EditorShell mode="codemirror" value={markdown()} onChange={setMarkdown} />);

  await expect
    .poll(() => document.querySelector('[data-part="codemirror"] .cm-content'))
    .toBeTruthy();
  const content = document.querySelector<HTMLElement>('[data-part="codemirror"] .cm-content');

  // The initial cursor sits at position 0, on the heading line.
  content?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
  await expect.poll(() => document.querySelector(".cm-foldPlaceholder")).toBeTruthy();

  content?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
  await expect.poll(() => document.querySelector(".cm-foldPlaceholder")).toBeNull();
});

it("demotes a heading with Alt-ArrowRight when org keybindings are on", async () => {
  let latest = "";
  mountEditor(() => (
    <EditorShell
      mode="codemirror"
      value={"# Title\n\nbody\n"}
      onChange={(markdown) => {
        latest = markdown;
      }}
    />
  ));

  await expect
    .poll(() => document.querySelector('[data-part="codemirror"] .cm-content'))
    .toBeTruthy();
  const content = document.querySelector<HTMLElement>('[data-part="codemirror"] .cm-content');

  // The initial cursor sits at position 0, on the heading line.
  content?.dispatchEvent(
    new KeyboardEvent("keydown", { altKey: true, bubbles: true, key: "ArrowRight" }),
  );
  await expect.poll(() => latest).toContain("## Title");
});

it("leaves the document alone with Alt-ArrowRight when org keybindings are off", async () => {
  let latest = "";
  mountEditor(() => (
    <EditorShell
      mode="codemirror"
      orgKeybindings={false}
      value={"# Title\n\nbody\n"}
      onChange={(markdown) => {
        latest = markdown;
      }}
    />
  ));

  await expect
    .poll(() => document.querySelector('[data-part="codemirror"] .cm-content'))
    .toBeTruthy();
  const content = document.querySelector<HTMLElement>('[data-part="codemirror"] .cm-content');

  // CodeMirror handles keydown synchronously, so no change means no handler ran.
  content?.dispatchEvent(
    new KeyboardEvent("keydown", { altKey: true, bubbles: true, key: "ArrowRight" }),
  );
  expect(latest).toBe("");
});

it("shows the line number gutter by default in codemirror mode", async () => {
  mountEditor(() => <EditorShell mode="codemirror" value={"# Title\n"} />);

  await expect.poll(() => document.querySelector(".cm-lineNumbers")).toBeTruthy();
});

it("hides the line number gutter when lineNumbers is false", async () => {
  mountEditor(() => <EditorShell lineNumbers={false} mode="codemirror" value={"# Title\n"} />);

  await expect
    .poll(() => document.querySelector('[data-part="codemirror"] .cm-content'))
    .toBeTruthy();
  expect(document.querySelector(".cm-lineNumbers")).toBeNull();
  expect(document.querySelector(".cm-foldGutter")).toBeTruthy();
});

it("switches modes from textarea to codemirror", async () => {
  const [editorMode, setEditorMode] = createSignal<EditorMode>("textarea");
  mountEditor(() => <EditorShell mode={editorMode()} onModeChange={setEditorMode} value="x" />);

  expect(document.querySelector('[aria-label="Note body"]')).toBeTruthy();
  expect(document.querySelector('[data-part="codemirror"]')).toBeNull();

  setEditorMode("codemirror");

  await expect.poll(() => document.querySelector('[data-part="codemirror"]')).toBeTruthy();
  expect(document.querySelector('[aria-label="Note body"]')).toBeNull();
});
