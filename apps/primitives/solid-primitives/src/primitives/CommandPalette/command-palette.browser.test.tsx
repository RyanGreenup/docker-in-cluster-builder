import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";

import { CommandPalette, type FileHit, type FileSearchProvider } from "./index";
import { createFuseFileSearchProvider } from "./providers/fuse-file-search";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const FILES: FileHit[] = [
  { id: "/ws/notes/journal.md", name: "journal.md", path: "notes/journal.md" },
  { id: "/ws/notes/todo.md", name: "todo.md", path: "notes/todo.md" },
  { id: "/ws/readme.md", name: "readme.md", path: "readme.md" },
];

const stubProvider: FileSearchProvider = {
  search: (query) =>
    Promise.resolve(FILES.filter((file) => file.name.includes(query.toLowerCase()))),
};

interface Mounted {
  selected: FileHit[];
  openStates: boolean[];
}

const mountPalette = (provider: FileSearchProvider): Mounted => {
  const mounted: Mounted = { openStates: [], selected: [] };
  const [open, setOpen] = createSignal(true);
  const dispose = render(
    () => (
      <CommandPalette
        open={open}
        onOpenChange={(next) => {
          mounted.openStates.push(next);
          setOpen(next);
        }}
        onSelect={(hit) => mounted.selected.push(hit)}
        provider={provider}
      />
    ),
    document.body,
  );
  disposers.push(dispose);
  return mounted;
};

const paletteInput = (): HTMLInputElement | null =>
  document.querySelector<HTMLInputElement>('[data-part="palette-input"]');

const itemNames = (): string[] =>
  [...document.querySelectorAll('[data-part="palette-item-name"]')].map(
    (element) => element.textContent ?? "",
  );

const typeQuery = (value: string): void => {
  const input = paletteInput();
  if (!input) {
    return;
  }
  input.value = value;
  input.dispatchEvent(new InputEvent("input", { bubbles: true }));
};

const pressKey = (key: string): void => {
  paletteInput()?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key }));
};

it("lists all files for an empty query and filters as the user types", async () => {
  mountPalette(stubProvider);

  await expect.poll(() => itemNames()).toEqual(["journal.md", "todo.md", "readme.md"]);

  typeQuery("todo");
  await expect.poll(() => itemNames()).toEqual(["todo.md"]);
});

it("selects with arrow keys and Enter", async () => {
  const mounted = mountPalette(stubProvider);
  await expect.poll(() => itemNames().length).toBe(3);

  pressKey("ArrowDown");
  pressKey("Enter");
  await expect.poll(() => mounted.selected.map((hit) => hit.name)).toEqual(["todo.md"]);
});

it("shows the empty state when nothing matches", async () => {
  mountPalette(stubProvider);
  typeQuery("zzz");
  await expect
    .poll(() => document.querySelector('[data-part="palette-empty"]')?.textContent)
    .toBe("No matching files");
});

it("closes via Escape through the dialog", async () => {
  const mounted = mountPalette(stubProvider);
  await expect.poll(() => paletteInput()).not.toBeNull();

  paletteInput()?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
  await expect.poll(() => mounted.openStates.at(-1)).toBe(false);
});

it("ranks name matches above path-only matches via the fuse provider", async () => {
  const files: FileHit[] = [
    { id: "/ws/docs/alpha/setup.md", name: "setup.md", path: "docs/alpha/setup.md" },
    { id: "/ws/alpha.md", name: "alpha.md", path: "alpha.md" },
  ];
  const provider = createFuseFileSearchProvider(() => files);

  const hits = await provider.search("alpha");
  expect(hits[0]?.name).toBe("alpha.md");
  expect(hits.map((hit) => hit.name)).toContain("setup.md");
});
