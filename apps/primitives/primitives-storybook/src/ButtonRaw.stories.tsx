import { Button } from "@rs/solid-primitives";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw behavioural Button: layout affordances (inline-flex, gap) and the
// not-allowed cursor when disabled. No colour, radius, or type — a consumer
// supplies those. See Exemplars/Button for the themed version.
interface ButtonArgs {
  label: string;
  disabled: boolean;
}

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Unstyled button",
    disabled: false,
  },
  render: (args) => <Button disabled={args.disabled}>{args.label}</Button>,
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
