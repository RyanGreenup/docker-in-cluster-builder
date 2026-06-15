import { Accordion } from "@rs/solid-primitives";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw behavioural primitive with no theme applied. It carries only the
// disclosure machinery: the checkbox-driven toggle, the 0fr->1fr grid
// collapse, and the plus/minus icon cross-fade. No colours, spacing, or type.
// A faint outline is added inline purely so the structure is visible here.
interface AccordionArgs {
  title: string;
  size: "lg" | "md" | "sm";
  defaultChecked: boolean;
}

const meta = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    size: { control: "select", options: ["lg", "md", "sm"] },
    defaultChecked: { control: "boolean" },
  },
  args: {
    title: "What is a headless component?",
    size: "md",
    defaultChecked: false,
  },
  render: (args) => (
    <Accordion
      style={{ border: "1px dashed #cbd5e1", "max-width": "34rem" }}
      title={() => args.title}
      size={() => args.size}
      defaultChecked={() => args.defaultChecked}
    >
      <p>
        Unstyled. Everything you see is behaviour: the trigger toggles, the
        panel collapses, the icon swaps. Branding is added by a themed layer —
        see the Exemplars/Accordion story.
      </p>
    </Accordion>
  ),
} satisfies Meta<AccordionArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultChecked: true },
};
