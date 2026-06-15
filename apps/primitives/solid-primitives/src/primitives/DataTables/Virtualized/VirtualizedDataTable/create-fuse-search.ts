import Fuse, { type IFuseOptions } from "fuse.js";
import { createMemo, createSignal, type Accessor } from "solid-js";

export interface FuseSearch<TData> {
  /** The current query string. */
  readonly query: Accessor<string>;
  /** Update the query. */
  readonly setQuery: (value: string) => void;
  /**
   * Matched rows. STABLE reference per (rows, query) — safe to pass straight
   * into VirtualizedDataTable's `data` accessor. An empty query returns the
   * ORIGINAL rows reference (no copy), so identity is preserved.
   */
  readonly results: Accessor<TData[]>;
}

/*
 * Fuzzy search OUTSIDE TanStack Table. Fuse ranks the whole collection and
 * returns ordered results; a per-row globalFilterFn would throw that ranking
 * away. The index is memoized on `rows` (rebuilt only when rows change) and the
 * results are memoized on (index, query), so the returned array reference is
 * stable — see REACTIVITY.md rule 3.
 */
export const createFuseSearch = <TData>(
  rows: Accessor<TData[]>,
  options: Accessor<IFuseOptions<TData>>,
): FuseSearch<TData> => {
  const [query, setQuery] = createSignal("");
  const index = createMemo(() => new Fuse(rows(), options()));
  const results = createMemo<TData[]>(() => {
    const trimmed = query().trim();
    if (trimmed === "") {
      return rows();
    }
    return index()
      .search(trimmed)
      .map((match) => match.item);
  });
  return { query, results, setQuery };
};
