import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";

import { createMdxRenderer, MdxRenderer, type MdxModule } from "../src/primitives/MdxRenderer";
import { renderMdxDefault, resolveResource } from "./support/mdx-test-utils";

/**
 * Lifecycle of the MdxRenderer component itself: reacting to a changing source
 * signal, surfacing compile errors, and the loading fallback. The compile-only
 * error boundary means a render-time error has no graceful path, which the final
 * it.fails frames as the ideal behavior.
 */
afterEach(() => {
  document.body.innerHTML = "";
});

/** Polls a predicate until true or the timeout elapses. */
function waitFor(predicate: () => boolean, timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = (): void => {
      let ok = false;
      try {
        ok = predicate();
      } catch {
        ok = false;
      }
      if (ok) return resolve();
      if (Date.now() - start > timeout) return reject(new Error("waitFor timeout"));
      setTimeout(tick, 10);
    };
    tick();
  });
}

describe("MdxRenderer component lifecycle", () => {
  it("re-renders when the source signal changes", async () => {
    const [src, setSrc] = createSignal("# First\n");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(() => <MdxRenderer source={src} />, host);

    await waitFor(() => host.querySelector("h1")?.textContent === "First");
    setSrc("# Second\n");
    await waitFor(() => host.querySelector("h1")?.textContent === "Second");

    expect(host.querySelector("h1")?.textContent).toBe("Second");
    expect(host.textContent).not.toContain("First");
    dispose();
  }, 20000);

  it("shows the data-part='error' fallback for a compile error", async () => {
    const [src] = createSignal("# Broken\n\n{unclosedBrace");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(() => <MdxRenderer source={src} />, host);

    await waitFor(() => host.querySelector("[data-part='error']") !== null);
    expect(host.querySelector("[data-part='error']")).not.toBeNull();
    dispose();
  }, 20000);

  it.todo("renders the data-part='loading' fallback before the resource resolves");

  it.fails("catches a render-time reference error into an error node", async () => {
    // The source compiles fine ({missingVar} is only undefined at runtime), so an
    // ideal renderer would still degrade to data-part='error'. Today renderMdxDefault
    // throws because the compile-only try/catch does not cover module.default().
    const module = await resolveResource<MdxModule>(() =>
      createMdxRenderer(() => "Total is {missingVar}.\n"),
    );
    const wrapper = renderMdxDefault(module);
    expect(wrapper.querySelector("[data-part='error']")).not.toBeNull();
  });
});
