import { Dialog } from "@rs/solid-primitives";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The headless Dialog ships only behaviour (focus trap, Escape / outside-pointer
// dismissal, scroll lock, full aria wiring) and `data-part` hooks. This Raw
// story applies the bare minimum of inline styling needed to *see* the modal —
// the polished looks live in the Skins stories, layered purely through the
// data-part hooks.

const meta = {
  title: "Primitives/Dialog",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Raw: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay style={{ background: "rgba(0, 0, 0, 0.5)" }} />
        <Dialog.Content
          style={{
            background: "white",
            color: "black",
            padding: "1.5rem",
            "border-radius": "0.5rem",
            "min-width": "20rem",
            "max-width": "28rem",
            "box-shadow": "0 1.25rem 3rem rgba(0, 0, 0, 0.25)",
          }}
        >
          <Dialog.Label style={{ margin: "0 0 0.5rem", "font-size": "1.125rem" }}>
            Unstyled dialog
          </Dialog.Label>
          <Dialog.Description style={{ margin: "0 0 1rem", color: "#555" }}>
            corvu supplies the behaviour; the primitive only adds <code>data-part</code> hooks.
          </Dialog.Description>
          <p style={{ margin: "0 0 1.5rem" }}>
            Press <kbd>Escape</kbd>, click the backdrop, or use the button to close. Focus is
            trapped while open and returns to the trigger on close.
          </p>
          <Dialog.Close
            style={{
              padding: "0.5rem 1rem",
              border: "0.0625rem solid #ccc",
              "border-radius": "0.375rem",
              cursor: "pointer",
            }}
          >
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
