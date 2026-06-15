import { VirtualizedDataTable } from "@rs/solid-primitives";
import { createSignal } from "solid-js";

import {
  grBtn,
  grBtnActive,
  grFormula,
  grLetter,
  grMeta,
  grName,
  grSel,
  grStatusbar,
  grTableWrap,
  grToolbar,
  grid,
  lbl,
  neg,
  totalMark,
} from "./exemplars/grid.css";

import type { ColumnDef } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// EXEMPLAR 4 · GRID — brutalist spreadsheet.

interface Line {
  a: string;
  b: string;
  c: string;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  isTotal?: boolean;
}

const data: Line[] = [
  {
    a: "4100-01",
    b: "Salaries — Engineering",
    c: "R&D",
    d: 412300,
    e: 428700,
    f: 444100,
    g: 461800,
    h: 1746900,
  },
  {
    a: "4100-02",
    b: "Salaries — Design",
    c: "R&D",
    d: 148600,
    e: 151200,
    f: 154800,
    g: 158200,
    h: 612800,
  },
  {
    a: "4100-03",
    b: "Salaries — Product",
    c: "R&D",
    d: 96400,
    e: 98100,
    f: 101200,
    g: 103600,
    h: 399300,
  },
  {
    a: "4200-01",
    b: "Cloud infrastructure",
    c: "COGS",
    d: 72800,
    e: 84300,
    f: 91200,
    g: 103600,
    h: 351900,
  },
  {
    a: "4200-02",
    b: "Software licences",
    c: "COGS",
    d: 18400,
    e: 19200,
    f: 19800,
    g: 20400,
    h: 77800,
  },
  {
    a: "4200-03",
    b: "Data warehousing",
    c: "COGS",
    d: 12100,
    e: 12900,
    f: 13700,
    g: 14400,
    h: 53100,
  },
  {
    a: "4300-01",
    b: "Marketing — paid",
    c: "S&M",
    d: 86000,
    e: 92000,
    f: 104000,
    g: 118000,
    h: 400000,
  },
  {
    a: "4300-02",
    b: "Marketing — content",
    c: "S&M",
    d: 22400,
    e: 22400,
    f: 22400,
    g: 22400,
    h: 89600,
  },
  {
    a: "4300-03",
    b: "Events & sponsorships",
    c: "S&M",
    d: 14800,
    e: 38200,
    f: 16400,
    g: 42800,
    h: 112200,
  },
  {
    a: "4400-01",
    b: "Office rent — HQ",
    c: "G&A",
    d: 42000,
    e: 42000,
    f: 42000,
    g: 42000,
    h: 168000,
  },
  {
    a: "4400-02",
    b: "Travel & subsistence",
    c: "G&A",
    d: 8400,
    e: 11200,
    f: 9600,
    g: 10800,
    h: 40000,
  },
  {
    a: "4400-03",
    b: "Legal & professional",
    c: "G&A",
    d: 12800,
    e: 9400,
    f: 8200,
    g: 11600,
    h: 42000,
  },
  {
    a: "4400-04",
    b: "Insurance",
    c: "G&A",
    d: 6200,
    e: 6200,
    f: 6200,
    g: 6200,
    h: 24800,
  },
  {
    a: "4400-05",
    b: "Recruitment",
    c: "G&A",
    d: 18600,
    e: 24200,
    f: 13800,
    g: 21400,
    h: 78000,
  },
  {
    a: "4500-01",
    b: "FX gain / (loss)",
    c: "Other",
    d: -2400,
    e: 1800,
    f: -3200,
    g: 900,
    h: -2900,
  },
  {
    a: "9999-00",
    b: "TOTAL OPERATING EXPENSE",
    c: "—",
    d: 969400,
    e: 1041800,
    f: 1043800,
    g: 1138100,
    h: 4193100,
    isTotal: true,
  },
];

const fmtUSD = (n: number): string => {
  const s = Math.abs(n).toLocaleString("en-US");
  return n < 0 ? `(${s})` : s;
};
const numCell = (n: number) => (
  <span class={n < 0 ? neg : undefined}>{fmtUSD(n)}</span>
);

const head = (letter: string, label: string) => () => (
  <>
    <span class={grLetter}>{letter}</span>
    <span class={lbl}>{label}</span>
  </>
);

const columns: ColumnDef<Line>[] = [
  {
    accessorKey: "a",
    header: head("A", "Account"),
    cell: (c) => (
      <>
        {c.row.original.a}
        {c.row.original.isTotal ? <i class={totalMark} /> : null}
      </>
    ),
  },
  { accessorKey: "b", header: head("B", "Line item") },
  { accessorKey: "c", header: head("C", "Cat.") },
  {
    accessorKey: "d",
    header: head("D", "Q1 2026"),
    cell: (c) => numCell(c.row.original.d),
  },
  {
    accessorKey: "e",
    header: head("E", "Q2 2026"),
    cell: (c) => numCell(c.row.original.e),
  },
  {
    accessorKey: "f",
    header: head("F", "Q3 2026"),
    cell: (c) => numCell(c.row.original.f),
  },
  {
    accessorKey: "g",
    header: head("G", "Q4 2026"),
    cell: (c) => numCell(c.row.original.g),
  },
  {
    accessorKey: "h",
    header: head("H", "FY total"),
    cell: (c) => numCell(c.row.original.h),
  },
];

const meta = {
  title: "Primitives/VirtualizedDataTable/Exemplars/04 Grid",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Spreadsheet: Story = {
  render: () => {
    const [sel, setSel] = createSignal(0);
    const selRow = (): Line => data[sel()] ?? data[0]!;
    return (
      <div class={grid} style={{ height: "100vh" }}>
        <div class={grToolbar}>
          <span class={grName}>D{sel() + 2}</span>
          <span class={grFormula}>
            <i>ƒ𝑥</i>
            <b>=SUM</b>(D2:D17) <span style={{ color: "#999" }}>// </span>
            {selRow().b}
          </span>
          <button class={grBtn}>Σ</button>
          <button class={grBtn}>↕ Sort</button>
          <button class={`${grBtn} ${grBtnActive}`}>⛶ Freeze</button>
          <button class={grBtn}>⇣ Export</button>
        </div>
        <div class={grMeta}>
          <span>
            Workbook · <b>FY26 OpEx — plan v3.xlsx</b> · Sheet <b>OpEx</b>
          </span>
          <span>
            <b>16</b> rows × <b>8</b> cols · last saved <b>2 min ago</b>
          </span>
        </div>
        <div class={grTableWrap}>
          <VirtualizedDataTable<Line>
            data={() => data}
            columns={() => columns}
            estimateSize={() => 30}
            defaultSorting={[{ id: "d", desc: true }]}
            rowSelection={() => ({ [String(sel())]: true })}
            onRowClick={(row) => setSel(Number(row.id))}
          />
        </div>
        <div class={grStatusbar}>
          <span>
            Cell <b>D{sel() + 2}</b> ·{" "}
            <span class={grSel}>{selRow().d.toLocaleString("en-US")}</span>
          </span>
          <span>
            Sum <b>969,400</b> · Avg <b>60,588</b> · Count <b>16</b>
          </span>
          <span>
            <b>Ready</b> · NUM · CAPS
          </span>
        </div>
      </div>
    );
  },
};
