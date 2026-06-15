import { Accordion } from "@rs/solid-primitives/exemplars";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The exemplar applies the global theme contract over the behavioural
// primitive. This is the branded reference look — consumers building a
// component library layers its own styling
// over the raw primitive the same way.
interface AccordionArgs {
  title: string;
  variant: "brand" | "collapsible" | "default" | "white";
  size: "lg" | "md" | "sm";
  defaultChecked: boolean;
}

const meta = {
  title: "Exemplars/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    variant: {
      control: "select",
      options: ["brand", "collapsible", "default", "white"],
    },
    size: { control: "select", options: ["lg", "md", "sm"] },
    defaultChecked: { control: "boolean" },
  },
  args: {
    title: "What is a headless component?",
    variant: "default",
    size: "md",
    defaultChecked: false,
  },
  render: (args) => (
    <Accordion
      title={() => args.title}
      variant={() => args.variant}
      size={() => args.size}
      defaultChecked={() => args.defaultChecked}
    >
      <p>
        A CSS-only disclosure — the open/close toggle is driven by a checkbox,
        so it renders and stays interactive under pure server-side rendering, no
        hydration required. The primitive ships only machinery; this styling
        comes from the themed exemplar.
      </p>
    </Accordion>
  ),
} satisfies Meta<AccordionArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: { title: "Brand variant", variant: "brand", defaultChecked: true },
};

export const White: Story = {
  args: { title: "White variant", variant: "white" },
};

export const Small: Story = {
  args: { title: "Small size", size: "sm" },
};
