import { Button } from "@rs/solid-primitives/exemplars";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// Themed Button: the behavioural primitive with the global theme contract
// applied (brand colour, radius, type).
interface ButtonArgs {
  label: string;
  disabled: boolean;
}

const meta = {
  title: "Exemplars/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Get in touch",
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
