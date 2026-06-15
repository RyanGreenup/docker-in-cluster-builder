import { createEffect, createRoot } from "solid-js";

import {
  createMdxRenderer,
  insertMdxContent,
  type MdxModule,
} from "../../src/primitives/MdxRenderer";

/**
 * Waits for a createResource to leave 'pending'/'refreshing' and either
 * resolves (returns value) or rejects (throws error). Lifted from the original
 * mdx-renderer.test.tsx so every breakage file can share one resolver.
 */
export function resolveResource<T>(
  factory: () => readonly [
    { (): T | undefined; state: string; error: unknown },
    ...unknown[],
  ],
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    createRoot((dispose) => {
      const [resource] = factory();
      createEffect(() => {
        const state = resource.state;
        if (state === "ready") {
          const value = resource();
          dispose();
          resolve(value as T);
        } else if (state === "errored") {
          dispose();
          reject(
            resource.error instanceof Error
              ? resource.error
              : new Error(String(resource.error)),
          );
        }
      });
    });
  });
}

/**
 * Renders module.default into a wrapper div so Fragment output (arrays) and
 * single-element output are both accessible via a single HTMLDivElement.
 */
export function renderMdxDefault(
  module: MdxModule,
  components: Record<string, unknown> = {},
): HTMLDivElement {
  return createRoot(() => {
    const wrapper = document.createElement("div");
    const output = (
      module.default as (p: { components: Record<string, unknown> }) => unknown
    )({ components });
    insertMdxContent(wrapper, output);
    return wrapper;
  });
}

/**
 * Compiles + renders an MDX source string in one step, returning the populated
 * wrapper. The common case for breakage tests that only care about the final
 * DOM. Throws if compilation rejects; render-time throws propagate too (which is
 * itself a documented breakage, see the curly-brace / lifecycle suites).
 */
export async function renderMdx(
  source: string,
  components: Record<string, unknown> = {},
): Promise<HTMLDivElement> {
  const module = await resolveResource<MdxModule>(() =>
    createMdxRenderer(() => source),
  );
  return renderMdxDefault(module, components);
}

/** The compile-error fallback node the primitive emits, or null. */
export function getError(wrapper: HTMLElement): HTMLElement | null {
  return wrapper.querySelector("[data-part='error']");
}
