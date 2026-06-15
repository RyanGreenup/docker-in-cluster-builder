import { PATH_DEPTH_MIN, noCreating, noId, getItemPluralSuffix } from "./constants";
import { createCrudActions } from "./crudActions";
import { createCurrentHandlers, createParentHandlers } from "./handlers";
import { setupKeyboard } from "./keyboard";
import { createSignals } from "./signals";
import { createDerivedState } from "./state";
import { createUtilActions } from "./utilActions";

import type { Accessor } from "solid-js";

import type { ColumnHandlers } from "./types";

export { getItemPluralSuffix, noId, noCreating, PATH_DEPTH_MIN };
export type { ColumnHandlers };

export const createRangerController = (open: Accessor<boolean>, onClose: () => void) => {
  const sig = createSignals();
  const der = createDerivedState(sig);
  const crud = createCrudActions(sig, der);
  const util = createUtilActions(sig);
  const parentH = createParentHandlers(sig, der, crud);
  const currentH = createCurrentHandlers(sig, der, crud);
  setupKeyboard(open, { der, onClose, sig });
  return {
    bulkDelete: util.bulkDelete,
    clearMarks: util.clearMarks,
    confirmDeleteId: sig.confirmDeleteId,
    creating: sig.creating,
    currentFolder: der.currentFolder,
    currentHandlers: currentH,
    cycleSortKey: util.cycleSortKey,
    filter: sig.filter,
    filterRef: sig.filterRef,
    marked: sig.marked,
    onBackdropMouseDown: (ev: MouseEvent): void => {
      if (ev.target === ev.currentTarget) {
        onClose();
      }
    },
    parentActiveId: der.parentActiveId,
    parentHandlers: parentH,
    parentSorted: der.parentSorted,
    path: der.path,
    previewFolderItems: der.previewFolderItems,
    renameId: sig.renameId,
    selectedNode: der.selectedNode,
    setCurrentFolderId: sig.setCurrentFolderId,
    setFilter: sig.setFilter,
    setFilterFocused: sig.setFilterFocused,
    setView: sig.setView,
    sortKey: sig.sortKey,
    view: sig.view,
    visibleCurrent: der.visibleCurrent,
  };
};
