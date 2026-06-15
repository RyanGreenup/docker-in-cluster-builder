import { VirtualizedDataTable } from "@rs/solid-primitives";
import { createSignal } from "solid-js";

import {
  arrow,
  dn,
  pctChip,
  term,
  tmBrand,
  tmChrome,
  tmCmd,
  tmFoot,
  tmKeys,
  tmStatus,
  tmSub,
  tmTableWrap,
  up,
} from "./exemplars/terminal.css";

import type { ColumnDef, RowSelectionState } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// EXEMPLAR 1 · TERMINAL — Bloomberg-style financial workstation.
// Same behavioural primitive as the Raw story; all colour, type, and density
// is layered purely through the data-part hooks (see terminal.css.ts).

interface TermRow {
  ticker: string;
  name: string;
  last: number;
  chg: number;
  pct: number;
  vol: string;
  high: number;
  low: number;
}

const data: TermRow[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    last: 1284.3,
    chg: 24.18,
    pct: 1.92,
    vol: "42.1M",
    high: 1290.1,
    low: 1251.06,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc",
    last: 214.92,
    chg: -1.04,
    pct: -0.48,
    vol: "58.3M",
    high: 216.85,
    low: 213.4,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp",
    last: 445.71,
    chg: 3.12,
    pct: 0.71,
    vol: "21.7M",
    high: 447.2,
    low: 441.05,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc-A",
    last: 178.36,
    chg: 0.42,
    pct: 0.24,
    vol: "18.9M",
    high: 179.42,
    low: 176.84,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    last: 519.27,
    chg: -4.85,
    pct: -0.93,
    vol: "12.4M",
    high: 526.1,
    low: 517.31,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc",
    last: 201.86,
    chg: 1.71,
    pct: 0.86,
    vol: "33.0M",
    high: 202.94,
    low: 199.4,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc",
    last: 178.05,
    chg: -6.42,
    pct: -3.48,
    vol: "94.6M",
    high: 186.2,
    low: 177.12,
  },
  {
    ticker: "AVGO",
    name: "Broadcom Inc",
    last: 1612.45,
    chg: 14.3,
    pct: 0.89,
    vol: "4.8M",
    high: 1620.0,
    low: 1593.1,
  },
  {
    ticker: "BRK.B",
    name: "Berkshire Hathaway-B",
    last: 442.18,
    chg: 0.86,
    pct: 0.19,
    vol: "3.1M",
    high: 443.2,
    low: 440.5,
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co",
    last: 198.74,
    chg: -0.91,
    pct: -0.46,
    vol: "7.9M",
    high: 200.3,
    low: 197.85,
  },
  {
    ticker: "V",
    name: "Visa Inc-A",
    last: 278.39,
    chg: 1.05,
    pct: 0.38,
    vol: "5.2M",
    high: 279.85,
    low: 276.1,
  },
  {
    ticker: "WMT",
    name: "Walmart Inc",
    last: 68.42,
    chg: 0.31,
    pct: 0.46,
    vol: "11.6M",
    high: 68.9,
    low: 67.95,
  },
  {
    ticker: "XOM",
    name: "Exxon Mobil Corp",
    last: 115.07,
    chg: -2.18,
    pct: -1.86,
    vol: "14.3M",
    high: 117.4,
    low: 114.66,
  },
  {
    ticker: "UNH",
    name: "UnitedHealth Group",
    last: 504.92,
    chg: -3.61,
    pct: -0.71,
    vol: "3.4M",
    high: 510.2,
    low: 502.48,
  },
  {
    ticker: "COST",
    name: "Costco Wholesale",
    last: 864.2,
    chg: 11.45,
    pct: 1.34,
    vol: "1.9M",
    high: 867.1,
    low: 852.3,
  },
  {
    ticker: "NFLX",
    name: "Netflix Inc",
    last: 680.55,
    chg: 5.84,
    pct: 0.87,
    vol: "4.1M",
    high: 683.4,
    low: 672.18,
  },
  {
    ticker: "ORCL",
    name: "Oracle Corp",
    last: 141.83,
    chg: -1.02,
    pct: -0.71,
    vol: "8.6M",
    high: 143.85,
    low: 140.92,
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    last: 158.21,
    chg: 0.18,
    pct: 0.11,
    vol: "5.7M",
    high: 158.8,
    low: 157.43,
  },
  {
    ticker: "HD",
    name: "Home Depot Inc",
    last: 339.46,
    chg: -2.5,
    pct: -0.73,
    vol: "3.3M",
    high: 342.8,
    low: 338.1,
  },
  {
    ticker: "BAC",
    name: "Bank of America",
    last: 42.31,
    chg: 0.21,
    pct: 0.5,
    vol: "32.2M",
    high: 42.55,
    low: 41.92,
  },
];

const fmt = (n: number, dp = 2): string =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
const signed = (n: number, dp = 2): string => (n >= 0 ? "+" : "") + fmt(n, dp);

const columns: ColumnDef<TermRow>[] = [
  { accessorKey: "ticker", header: "Ticker" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "last",
    header: "Last",
    cell: (c) => fmt(c.row.original.last),
  },
  {
    accessorKey: "chg",
    header: "Chg",
    cell: (c) => {
      const v = c.row.original.chg;
      return (
        <span class={v >= 0 ? up : dn}>
          <span class={arrow}>{v >= 0 ? "▲" : "▼"}</span>
          {signed(v)}
        </span>
      );
    },
  },
  {
    accessorKey: "pct",
    header: "Chg%",
    cell: (c) => {
      const v = c.row.original.pct;
      return <span class={`${pctChip} ${v >= 0 ? up : dn}`}>{signed(v)}%</span>;
    },
  },
  { accessorKey: "vol", header: "Vol" },
  { accessorKey: "high", header: "Hi", cell: (c) => fmt(c.row.original.high) },
  { accessorKey: "low", header: "Lo", cell: (c) => fmt(c.row.original.low) },
];

const meta = {
  title: "Primitives/VirtualizedDataTable/Exemplars/01 Terminal",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Watchlist: Story = {
  render: () => {
    const [selection, setSelection] = createSignal<RowSelectionState>({
      "0": true,
    });
    return (
      <div class={term} style={{ height: "100vh" }}>
        <div class={tmChrome}>
          <span class={tmBrand}>
            <b>PRMT</b> TERMINAL · WATCHLIST
          </span>
          <span class={tmCmd}>
            <b>&gt;</b> EQUITY.US.WATCH.01 / LIVE FEED
          </span>
          <span class={tmStatus}>MKT OPEN</span>
          <span>14:23:08 EDT · MON 25 MAY</span>
        </div>
        <div class={tmSub}>
          <div>
            S&amp;P 500{" "}
            <b>
              5,318.42 <span class={up}>+0.48%</span>
            </b>
          </div>
          <div>
            NASDAQ{" "}
            <b>
              16,902.10 <span class={up}>+0.84%</span>
            </b>
          </div>
          <div>
            DOW{" "}
            <b>
              40,165.30 <span class={dn}>−0.12%</span>
            </b>
          </div>
          <div>
            VIX{" "}
            <b>
              13.21 <span class={dn}>−2.04%</span>
            </b>
          </div>
          <div>
            UST 10Y{" "}
            <b>
              4.412% <span class={up}>+3.1bp</span>
            </b>
          </div>
          <div>
            BTC{" "}
            <b>
              67,420 <span class={up}>+1.62%</span>
            </b>
          </div>
        </div>
        <div class={tmTableWrap}>
          <VirtualizedDataTable<TermRow>
            data={() => data}
            columns={() => columns}
            estimateSize={() => 28}
            defaultSorting={[{ id: "pct", desc: true }]}
            rowSelection={selection}
            onRowClick={(row) => setSelection({ [row.id]: true })}
          />
        </div>
        <div class={tmFoot}>
          <span>
            <b>20</b> ROWS · <b>1</b> SELECTED
          </span>
          <span class={tmKeys}>
            <span>
              <b>↑↓</b> NAV
            </span>
            <span>
              <b>SPC</b> SELECT
            </span>
            <span>
              <b>S</b> SORT
            </span>
            <span>
              <b>/</b> FIND
            </span>
          </span>
          <span>
            LATENCY <b>14ms</b>
          </span>
        </div>
      </div>
    );
  },
};
