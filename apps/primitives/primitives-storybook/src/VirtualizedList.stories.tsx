import { VirtualizedListExample } from "@rs/solid-primitives/exemplars";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Exemplars/Virtualized/List",
  component: VirtualizedListExample,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof VirtualizedListExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
