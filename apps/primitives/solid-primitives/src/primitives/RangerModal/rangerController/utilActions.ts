import { removeFromTree } from "../rangerTypes";

import type { RangerSignals } from "./signals";

export const createUtilActions = (sig: RangerSignals) => {
  const cycleSortKey = (): void => {
    sig.setSortKey((ky) => {
      if (ky === "name") {
        return "updated";
      }
      if (ky === "updated") {
        return "size";
      }
      return "name";
    });
  };

  const clearMarks = (): void => {
    sig.setMarked(new Set<string>());
  };

  const bulkDelete = (): void => {
    const ids = new Set(sig.marked());
    sig.setTree((tr) => {
      let next = tr;
      ids.forEach((id) => {
        next = removeFromTree(next, id);
      });
      return next;
    });
    sig.setMarked(new Set<string>());
  };

  return { bulkDelete, clearMarks, cycleSortKey };
};

export type UtilActions = ReturnType<typeof createUtilActions>;
