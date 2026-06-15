import { Accordion } from "@rs/solid-primitives";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw primitive ships only behaviour and a stable set of styling hooks:
// `data-part="root|trigger|title|icon|content"` on its elements, plus
// `data-size`/`data-variant` on the root. Anything that can write a CSS
// selector can skin it — no theme contract, no recipe, no build step from the
// primitive's side. These stories prove that by dropping in two completely
// unrelated looks using nothing but plain CSS targeting those data-parts.
//
// Each skin is scoped under a wrapper class (passed straight through to the
// root via `class`) so the rules don't leak between stories. The open/close
// machinery, grid collapse, and icon cross-fade all keep working untouched —
// they live in the primitive's base layer.

interface AccordionArgs {
  title: string;
  defaultChecked: boolean;
}

const neonCss = `
.demo-neon[data-part="root"] {
  border: 1px solid #1e293b;
  border-radius: 12px;
  background: #0b1020;
  color: #e2e8f0;
  padding: 0 1.25rem;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
}
.demo-neon [data-part="trigger"] { padding: 1.1rem 0; }
.demo-neon [data-part="title"] {
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #5eead4;
}
.demo-neon [data-part="icon"] { color: #5eead4; }
.demo-neon [data-part="content"] { color: #94a3b8; }
.demo-neon [data-part="content"] p { margin: 0 0 1.1rem; line-height: 1.65; }
`;

const cardCss = `
.demo-card[data-part="root"] {
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 40px -20px rgba(15, 23, 42, 0.45);
  padding: 0 1.5rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.demo-card [data-part="trigger"] { padding: 1.35rem 0; }
.demo-card [data-part="title"] {
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
}
.demo-card [data-part="icon"] { color: #6366f1; }
.demo-card [data-part="content"] { color: #475569; }
.demo-card [data-part="content"] p { margin: 0 0 1.35rem; line-height: 1.6; }
`;

const meta = {
  title: "Primitives/Accordion (Arbitrary Styling)",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    title: "How is this styled?",
    defaultChecked: false,
  },
} satisfies Meta<AccordionArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeonTerminal: Story = {
  render: (args: AccordionArgs) => (
    <div style={{ "max-width": "34rem" }}>
      <style>{neonCss}</style>
      <Accordion
        class="demo-neon"
        title={() => args.title}
        defaultChecked={() => args.defaultChecked}
      >
        <p>
          Pure CSS over <code>data-part</code> hooks — dark surface, monospace
          type, teal accents. The primitive contributed zero colour or spacing;
          everything here is the story's own stylesheet.
        </p>
      </Accordion>
    </div>
  ),
};

export const SoftCard: Story = {
  args: { title: "A softer look", defaultChecked: true },
  render: (args: AccordionArgs) => (
    <div style={{ "max-width": "34rem" }}>
      <style>{cardCss}</style>
      <Accordion
        class="demo-card"
        title={() => args.title}
        defaultChecked={() => args.defaultChecked}
      >
        <p>
          Same component, same markup, entirely different skin — a rounded card
          with a soft shadow and indigo icon. Swapping the wrapper class is the
          only difference between this and the neon story.
        </p>
      </Accordion>
    </div>
  ),
};

export const SideBySide: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", "max-width": "34rem" }}>
      <style>{neonCss + cardCss}</style>
      <Accordion class="demo-neon" title={() => "Neon terminal"}>
        <p>One set of behaviour, two unrelated looks.</p>
      </Accordion>
      <Accordion class="demo-card" title={() => "Soft card"}>
        <p>Both skinned with nothing but plain CSS on the data-parts.</p>
      </Accordion>
    </div>
  ),
};
