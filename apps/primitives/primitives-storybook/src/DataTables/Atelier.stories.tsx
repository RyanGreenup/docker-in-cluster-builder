import { VirtualizedDataTable } from "@rs/solid-primitives";
import { createSignal } from "solid-js";

import {
  artist,
  atDeck,
  atFoot,
  atH1,
  atHouse,
  atMast,
  atTableWrap,
  atel,
  title,
  unsold,
  withFees,
  yr,
} from "./exemplars/atelier.css";

import type { ColumnDef, RowSelectionState } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// EXEMPLAR 2 · ATELIER — auction sale catalogue.

interface Lot {
  lot: string;
  artist: string;
  year: string;
  title: string;
  medium: string;
  est: string;
  result: string;
  unsold?: boolean;
}

const data: Lot[] = [
  {
    lot: "1",
    artist: "Agnes Martin",
    year: "(1912–2004)",
    title: "Untitled (Grey Grid)",
    medium: "Graphite & acrylic on linen, 1973",
    est: "£280,000 – 400,000",
    result: "£412,500",
  },
  {
    lot: "2",
    artist: "Ellsworth Kelly",
    year: "(1923–2015)",
    title: "Two Curves, Black & Red",
    medium: "Oil on two joined canvases, 1988",
    est: "£1,800,000 – 2,400,000",
    result: "£2,250,000",
  },
  {
    lot: "3",
    artist: "Lygia Clark",
    year: "(1920–1988)",
    title: "Bicho (Critter)",
    medium: "Hinged aluminium sculpture, 1962",
    est: "£600,000 – 900,000",
    result: "£1,140,000",
  },
  {
    lot: "4",
    artist: "Bridget Riley",
    year: "(b. 1931)",
    title: "Late Morning II",
    medium: "Emulsion on canvas, 1968",
    est: "£1,200,000 – 1,800,000",
    result: "—",
    unsold: true,
  },
  {
    lot: "5",
    artist: "On Kawara",
    year: "(1932–2014)",
    title: "MAY 25, 1976",
    medium: "Acrylic on canvas, from Today Series",
    est: "£700,000 – 1,000,000",
    result: "£962,500",
  },
  {
    lot: "6",
    artist: "Cy Twombly",
    year: "(1928–2011)",
    title: "Untitled (Roma)",
    medium: "Wax crayon & graphite on paper, 1961",
    est: "£450,000 – 650,000",
    result: "£780,000",
  },
  {
    lot: "7",
    artist: "Hilma af Klint",
    year: "(1862–1944)",
    title: "The Swan, No. 17 (study)",
    medium: "Watercolour & pencil on paper",
    est: "£220,000 – 320,000",
    result: "£345,000",
  },
  {
    lot: "8",
    artist: "Joan Mitchell",
    year: "(1925–1992)",
    title: "Sans titre (Verrières)",
    medium: "Oil on canvas, 1979",
    est: "£2,400,000 – 3,200,000",
    result: "£3,640,000",
  },
  {
    lot: "9",
    artist: "Sol LeWitt",
    year: "(1928–2007)",
    title: "Wall Drawing #834 (cert.)",
    medium: "Coloured ink wash, certificate ed. 1/1",
    est: "£90,000 – 140,000",
    result: "£118,750",
  },
];

const columns: ColumnDef<Lot>[] = [
  { accessorKey: "lot", header: "Lot" },
  {
    id: "work",
    header: "Lot description",
    accessorKey: "artist",
    cell: (c) => {
      const r = c.row.original;
      return (
        <>
          <span class={artist}>
            {r.artist}
            <span class={yr}>{r.year}</span>
          </span>
          <span class={title}>{r.title}</span>
        </>
      );
    },
  },
  { accessorKey: "medium", header: "Medium & date" },
  { accessorKey: "est", header: "Estimate" },
  {
    accessorKey: "result",
    header: "Hammer",
    cell: (c) => {
      const r = c.row.original;
      return r.unsold ? (
        <span class={unsold}>passed</span>
      ) : (
        <span>
          {r.result}
          <span class={withFees}>w/ premium</span>
        </span>
      );
    },
  },
];

const meta = {
  title: "Primitives/VirtualizedDataTable/Exemplars/02 Atelier",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SaleCatalogue: Story = {
  render: () => {
    const [selection, setSelection] = createSignal<RowSelectionState>({
      "7": true,
    });
    return (
      <div class={atel} style={{ height: "100vh" }}>
        <div class={atMast}>
          <div>Sale L26108 · Evening</div>
          <div class={atHouse}>
            Beaumont &amp; <b>Strand</b>
          </div>
          <div>London · 25 May 2026</div>
        </div>
        <h1 class={atH1}>
          Modern &amp; Post-War, <i>evening sale.</i>
        </h1>
        <p class={atDeck}>
          Session results · <b>9 of 9 lots offered</b> · pre-sale low estimate
          £7.7m · realised £9.65m
        </p>
        <div class={atTableWrap}>
          <VirtualizedDataTable<Lot>
            data={() => data}
            columns={() => columns}
            estimateSize={() => 84}
            defaultSorting={[{ id: "lot", desc: false }]}
            rowSelection={selection}
            onRowClick={(row) => setSelection({ [row.id]: true })}
          />
        </div>
        <div class={atFoot}>
          <span>
            Specialist · <i>M. Lautrec</i>
          </span>
          <span>Buyer's premium 26% to £1m · 21% thereafter</span>
          <span>
            Catalogue №<i>26.118</i>
          </span>
        </div>
      </div>
    );
  },
};
