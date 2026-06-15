import { createExemplar, createTreeStore, TreeView } from "@rs/solid-primitives";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw behavioural primitive: a headless Zag.js tree-view skinned with the
// Package theme contract. It carries the real machinery only: lazy/async child
// Loading (click a folder to materialise its children), single selection,
// Keyboard navigation (arrows, Home/End, typeahead), and horizontal scroll for
// Deeply nested rows. The data is an infinite exemplar generated on demand.
interface TreeArgs {
  breadth: number;
  maxDepth: number;
}

const TreeDemo = (props: TreeArgs) => {
  const store = createTreeStore(createExemplar(props.breadth), props.breadth, props.maxDepth);

  return (
    <div
      style={{
        border: "1px dashed #cbd5e1",
        "border-radius": "8px",
        "max-width": "22rem",
        padding: "0.5rem 0",
      }}
    >
      <TreeView
        collection={store.collection}
        loadChildren={store.loadChildren}
        onLoadChildrenComplete={store.handleLoadComplete}
        onSelectionChange={(values) => {
          // eslint-disable-next-line no-console
          console.log("selected:", values);
        }}
      />
    </div>
  );
};

const meta = {
  title: "Primitives/Tree",
  component: TreeDemo,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    breadth: { control: { type: "number", min: 1, max: 12 } },
    maxDepth: { control: { type: "number", min: 1, max: 12 } },
  },
  args: {
    breadth: 5,
    maxDepth: 7,
  },
  // Recreate the store whenever the controls change so a new breadth/maxDepth
  // Regenerates the exemplar from scratch.
  render: (args) => <TreeDemo breadth={args.breadth} maxDepth={args.maxDepth} />,
} satisfies Meta<TreeArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = {
  args: { breadth: 8, maxDepth: 4 },
};

export const Deep: Story = {
  args: { breadth: 3, maxDepth: 10 },
};
