import Fuse, { type IFuseOptions } from "fuse.js";
import { createMemo, type Accessor } from "solid-js";

import type { FileHit, FileSearchProvider } from "../types";

const DEFAULT_OPTIONS: IFuseOptions<FileHit> = {
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 2 },
    { name: "path", weight: 1 },
  ],
  threshold: 0.4,
};

/**
 * Fuse.js-backed {@link FileSearchProvider} over a reactive file list. The
 * Fuse index is rebuilt only when the list changes; an empty or whitespace
 * query returns the unfiltered list. This is the default provider shipped
 * with {@link CommandPalette}; swap it for a Meilisearch or custom provider
 * without touching the palette UI.
 */
export const createFuseFileSearchProvider = (
  files: Accessor<FileHit[]>,
  options?: IFuseOptions<FileHit>,
): FileSearchProvider => {
  const index = createMemo(() => new Fuse(files(), options ?? DEFAULT_OPTIONS));

  return {
    search: (query: string): Promise<FileHit[]> => {
      const trimmed = query.trim();
      if (trimmed === "") {
        return Promise.resolve(files());
      }
      return Promise.resolve(
        index()
          .search(trimmed)
          .map((result) => result.item),
      );
    },
  };
};
