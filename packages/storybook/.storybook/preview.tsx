import { inlineStoryArgs } from "@rs/storybook-solid-code-transform";
import { SNIPPET_RENDERED } from "storybook/internal/docs-tools";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";

import type { Decorator, StoryContext } from "storybook-solidjs-vite";
import type { Preview } from "storybook-solidjs-vite";
import "./preview.css";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// The Solid renderer (`storybook-solidjs-vite`) ships `decorators = []`, so nothing ever
// emits `SNIPPET_RENDERED` — the one channel event the docs Source block listens for. The
// result: the "Show code" panel is computed once with the story's initial args and never
// updates when a control changes. This decorator is the missing piece every other renderer
// (React, Vue) ships: on each (re-)render it generates the snippet with the live args and
// emits it, so addon-docs re-keys the Source block by `argsHash(args)` and the panel tracks
// the controls. It is a plain (non-JSX) decorator, so the renderer re-invokes it on every
// arg change rather than skipping it as an already-mounted component.
const emitSnippet = (context: StoryContext): void => {
  const original = context.parameters?.docs?.source?.originalSource;
  if (typeof original !== "string") {
    return;
  }
  // `unmappedArgs` is what the Source block hashes its lookup by; read concrete values off
  // the (reactive) context so the emitted snippet reflects the current control state.
  const args = { ...(context.unmappedArgs ?? context.args) };
  const source = inlineStoryArgs(original, args);
  addons.getChannel().emit(SNIPPET_RENDERED, { id: context.id, args, source });
};

const sourceDecorator: Decorator = (Story, context) => {
  try {
    emitSnippet(context);
  } catch (error) {
    console.error("[storybook] sourceDecorator could not emit a code snippet", error);
  }
  return Story();
};

const preview: Preview = {
  decorators: [sourceDecorator],
  parameters: {
    docs: {
      source: {
        // `dynamic` makes the Source block read the snippet emitted above (via
        // `SNIPPET_RENDERED`) instead of the raw story object — which is what makes the
        // panel reactive. `inlineStoryArgs` self-heals to the raw source on any failure.
        type: "dynamic",
      },
      theme: prefersDark ? themes.dark : themes.light,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
