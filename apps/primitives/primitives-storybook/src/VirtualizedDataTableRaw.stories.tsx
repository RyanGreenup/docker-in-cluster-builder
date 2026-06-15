import { VirtualizedDataTable } from "@rs/solid-primitives";

import type { ColumnDef } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw behavioural primitive with no theme applied. It carries only the
// machinery: row windowing, a sticky header, click-to-sort, and row clicks.
// No colours, spacing, or type — a faint outline and fixed height are added
// inline purely so the structure is visible here.

interface DemoRow {
  id: number;
  name: string;
  email: string;
  amount: number;
  status: "active" | "inactive";
}

const STATUSES = ["active", "inactive"] as const;

const makeRows = (count: number): DemoRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Customer ${i}`,
    email: `customer${i}@example.com`,
    amount: Math.round(((i * 1373) % 100000) + (i % 97)) / 100,
    status: STATUSES[i % 2]!,
  }));

const columns: ColumnDef<DemoRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (c) => `$${c.getValue<number>().toFixed(2)}`,
  },
  { accessorKey: "status", header: "Status" },
];

interface TableArgs {
  rowCount: number;
  estimateSize: number;
  stickyHeader: boolean;
  enableSorting: boolean;
}

const meta = {
  title: "Primitives/VirtualizedDataTable",
  component: VirtualizedDataTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    rowCount: { control: { type: "number", min: 0, step: 1000 } },
    estimateSize: { control: { type: "number", min: 16, step: 1 } },
    stickyHeader: { control: "boolean" },
    enableSorting: { control: "boolean" },
  },
  args: {
    rowCount: 10000,
    estimateSize: 32,
    stickyHeader: true,
    enableSorting: true,
  },
  render: (args: TableArgs) => {
    const data = makeRows(args.rowCount);
    return (
      <div
        style={{
          height: "420px",
          border: "1px dashed #cbd5e1",
          "max-width": "48rem",
        }}
      >
        <VirtualizedDataTable<DemoRow>
          data={() => data}
          columns={() => columns}
          estimateSize={() => args.estimateSize}
          stickyHeader={() => args.stickyHeader}
          enableSorting={() => args.enableSorting}
        />
      </div>
    );
  },
} satisfies Meta<TableArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sortable: Story = {
  args: { enableSorting: true, rowCount: 5000 },
};

export const NonSticky: Story = {
  args: { stickyHeader: false, rowCount: 2000 },
};
