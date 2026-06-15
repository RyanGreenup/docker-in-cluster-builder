import { TreeView } from "@rs/solid-primitives";
import * as tree from "@zag-js/tree-view";
import { createSignal } from "solid-js";

import {
  catalog,
  drawer,
  eyebrow,
  footer,
  plate,
  pull,
  stage,
  sub,
  tab,
  title,
} from "./exemplars/catalog.css";

import type { TreeNodeData } from "@rs/solid-primitives";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// ---------------------------------------------------------------------------
// A motivating example: a library card catalogue rendered entirely from the
// Headless Tree primitive. The primitive supplies behaviour (expand/collapse,
// Selection, keyboard nav, lazy reveal); the look lives in catalog.css.ts.
// ---------------------------------------------------------------------------

interface Seed {
  name: string;
  count?: number;
  children?: Seed[];
}

const ARCHIVE: Seed[] = [
  {
    name: "Manuscripts",
    count: 312,
    children: [
      {
        name: "Correspondence",
        count: 1840,
        children: [
          { name: "Letters, 1887 to 1902", count: 214 },
          { name: "Telegrams & Cables", count: 77 },
          { name: "Postcards, illustrated" },
        ],
      },
      {
        name: "Diaries & Journals",
        count: 96,
        children: [
          { name: "Field Diary, vol. I" },
          { name: "Field Diary, vol. II" },
          { name: "Commonplace Book" },
        ],
      },
      {
        name: "Marginalia & Fragments",
        count: 54,
        children: [{ name: "Annotated Folios" }, { name: "Loose Endpapers" }],
      },
    ],
  },
  {
    name: "Maps & Atlases",
    count: 207,
    children: [
      { name: "Admiralty Charts, North Sea" },
      { name: "Celestial Atlas, 1729", count: 48 },
      { name: "Survey of the Northern Reach" },
    ],
  },
  {
    name: "Photographs",
    count: 4096,
    children: [
      {
        name: "Glass Plate Negatives",
        count: 880,
        children: [
          { name: "Harbour at Dawn" },
          { name: "The Long Gallery" },
          { name: "Untitled (figures, fog)" },
        ],
      },
      {
        name: "Daguerreotypes",
        count: 64,
        children: [{ name: "Portrait of a Cartographer" }, { name: "Two Sisters, seated" }],
      },
      { name: "Cyanotypes, botanical", count: 130 },
    ],
  },
  {
    name: "Ephemera",
    count: 73,
    children: [
      { name: "Theatre Programmes" },
      { name: "Pressed Ferns & Flora" },
      { name: "Tram Tickets & Stubs" },
    ],
  },
  { name: "Reading Room Notes" },
];

const slug = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/(?:^-|-$)/gu, "");

// Build a fully materialised tree (no lazy loading) so a freshly opened drawer
// Can default-expand straight to its cards. Ids are path slugs (no slashes) so
// They double as stable, readable node values for expansion and selection.
const toNodes = (seeds: Seed[], parentId: string | undefined): TreeNodeData[] =>
  seeds.map((seed) => {
    const id = parentId === undefined ? slug(seed.name) : `${parentId}__${slug(seed.name)}`;
    const node: TreeNodeData = { id, name: seed.name };
    if (seed.count !== undefined) {
      node.meta = { count: seed.count };
    }
    if (seed.children && seed.children.length > 0) {
      node.children = toNodes(seed.children, id);
    }
    return node;
  });

const buildCollection = () =>
  tree.collection<TreeNodeData>({
    nodeToString: (node) => node.name,
    nodeToValue: (node) => node.id,
    rootNode: { children: toNodes(ARCHIVE, undefined), id: "ROOT", name: "" },
  });

const Catalog = () => {
  const [collection] = createSignal(buildCollection());

  return (
    <div class={stage}>
      <div class={drawer}>
        <div class={pull} aria-hidden="true" />
        <div class={catalog}>
          <header class={plate}>
            <p class={eyebrow}>Special Collections</p>
            <h2 class={title}>Card Catalogue</h2>
            <p class={sub}>Drawer VII of XLII &middot; M to P</p>
          </header>

          <TreeView
            collection={collection}
            loadChildren={() => Promise.resolve([])}
            onLoadChildrenComplete={() => undefined}
            defaultExpandedValue={["manuscripts", "manuscripts__correspondence", "photographs"]}
            defaultSelectedValue={["manuscripts__correspondence__letters-1887-to-1902"]}
            onSelectionChange={(values) => {
              // eslint-disable-next-line no-console
              console.log("retrieved:", values);
            }}
          />

          <div class={footer}>
            {["A", "E", "I", "M", "P", "T", "Z"].map((letter) => (
              <span class={tab} data-on={letter === "M" ? "true" : "false"}>
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Primitives/Tree/Exemplars/Card Catalogue",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const ReadingRoom: Story = {
  render: () => <Catalog />,
};
