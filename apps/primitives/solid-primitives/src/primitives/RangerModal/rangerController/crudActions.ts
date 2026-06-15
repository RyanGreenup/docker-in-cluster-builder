import { isFolder, mapTree, removeFromTree } from "../rangerTypes";
import { ID_SLICE_END, ID_SLICE_START, RADIX_36 } from "./constants";
import { createPlaceholderNode } from "./helpers";

import type { RangerSignals } from "./signals";
import type { RangerDerived } from "./state";

export const createCrudActions = (sig: RangerSignals, der: RangerDerived) => {
  const renameNode = (id: string, newName: string): void => {
    sig.setTree((tr) =>
      mapTree(tr, (nd) => {
        if (nd.id === id) {
          return { ...nd, name: newName };
        }
        return nd;
      }),
    );
    sig.setRenameId();
  };

  const deleteNode = (id: string): void => {
    sig.setTree((tr) => removeFromTree(tr, id));
    sig.setMarked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    sig.setConfirmDeleteId();
  };

  const createInCurrent = (kind: "folder" | "note", name: string): void => {
    const id = `new-${Math.random().toString(RADIX_36).slice(ID_SLICE_START, ID_SLICE_END)}`;
    const node = createPlaceholderNode(kind, id, name);
    const targetId = der.currentFolder().id;
    sig.setTree((tr) =>
      mapTree(tr, (nd) => {
        if (nd.id === targetId && isFolder(nd)) {
          return { ...nd, children: [node, ...nd.children] };
        }
        return nd;
      }),
    );
    sig.setSelByFolder((st) => ({ ...st, [targetId]: id }));
    sig.setCreating();
  };

  return { createInCurrent, deleteNode, renameNode };
};

export type CrudActions = ReturnType<typeof createCrudActions>;
