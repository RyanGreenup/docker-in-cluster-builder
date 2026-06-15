import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { createFuseSearch } from "../src/primitives/DataTables/Virtualized/VirtualizedDataTable/create-fuse-search";

interface Row {
  readonly name: string;
}

const ROWS: Row[] = [{ name: "Priya Gurung" }, { name: "Aanya Sharma" }, { name: "Bishal Thapa" }];

describe("createFuseSearch", () => {
  it("returns the original array reference when the query is empty", () => {
    createRoot((dispose) => {
      const search = createFuseSearch<Row>(
        () => ROWS,
        () => ({ keys: ["name"] }),
      );
      // SAME reference — stable, avoids the infinite-render trap.
      expect(search.results()).toBe(ROWS);
      dispose();
    });
  });

  it("fuzzily matches and returns a stable reference per query", () => {
    createRoot((dispose) => {
      const search = createFuseSearch<Row>(
        () => ROWS,
        () => ({ keys: ["name"], threshold: 0.4 }),
      );
      search.setQuery("aanya");
      const first = search.results();
      expect(first.map((r) => r.name)).toContain("Aanya Sharma");
      // Memoized: same reference on re-read for the same query.
      expect(search.results()).toBe(first);
      dispose();
    });
  });
});
