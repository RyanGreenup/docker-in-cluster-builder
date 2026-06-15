import { userEvent } from "@vitest/browser/context";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";

import { EditorShell } from "../../EditorShell";

// Real-browser integration of the live editor and its math popover. The
// Cursor-jump only shows up in the full flow (type a formula, click it open,
// Edit mid-string), so these drive that path the way a user does rather than
// Rendering the popover in isolation.

const disposers: Array<() => void> = [];

const mountShell = (): HTMLElement => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  disposers.push(render(() => <EditorShell mode="wysiwyg" />, host));
  return host;
};

const requireEl = <T extends Element>(root: ParentNode, selector: string): T => {
  const el = root.querySelector<T>(selector);
  if (el === null) {
    throw new Error(`missing element: ${selector}`);
  }
  return el;
};

afterEach(async () => {
  while (disposers.length > 0) {
    disposers.pop()?.();
  }
  document.body.innerHTML = "";
  // Release focus so the next test starts clean.
  await userEvent.keyboard("{Escape}");
});

describe("math popover caret (live editor)", () => {
  it("keeps the caret in place after editing mid-formula", async () => {
    const host = mountShell();
    const surface = requireEl<HTMLElement>(host, '[data-part="wysiwyg-content"]');

    await userEvent.click(surface);
    await userEvent.keyboard("$$a+b$$");

    const formula = requireEl<HTMLElement>(host, '[data-type="block-math"]');
    await userEvent.click(formula);

    const input = requireEl<HTMLInputElement>(host, '[data-part="math-popover-input"]');
    // Mirror a real user: the field opens fully selected; collapse to the start
    // With Home, step in one, then type. A per-keystroke caret reset would push
    // The caret to the end and scramble the result.
    await userEvent.keyboard("{Home}{ArrowRight}");
    await userEvent.keyboard("X");
    expect(input.value).toBe("aX+b");
    expect(input.selectionStart).toBe(2);

    await userEvent.keyboard("Y");
    expect(input.value).toBe("aXY+b");
    expect(input.selectionStart).toBe(3);
  });

  it("commits an edited block formula back into the document", async () => {
    const host = mountShell();
    const surface = requireEl<HTMLElement>(host, '[data-part="wysiwyg-content"]');

    await userEvent.click(surface);
    await userEvent.keyboard("$$a+b$$");
    await userEvent.click(requireEl<HTMLElement>(host, '[data-type="block-math"]'));

    const input = requireEl<HTMLInputElement>(host, '[data-part="math-popover-input"]');
    await userEvent.keyboard("{Home}{ArrowRight}c");
    await userEvent.keyboard("{Enter}");

    expect(requireEl<HTMLElement>(host, '[data-type="block-math"]').dataset.latex).toBe("ac+b");
  });
});
