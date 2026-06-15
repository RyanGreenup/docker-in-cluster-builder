import { createMemo } from "solid-js";

import { findPath, isFolder, sortNodes, type VaultNode } from "../rangerTypes";
import { FIRST_INDEX, PARENT_OFFSET, PATH_DEPTH_MIN } from "./constants";

import type { RangerSignals } from "./signals";

const createPathState = (sig: RangerSignals) => {
  const path = createMemo(() => findPath(sig.tree(), sig.currentFolderId()) ?? [sig.tree()]);
  // `path` always holds at least the root, so the last segment is defined.
  const currentFolder = createMemo(() => {
    const segments = path();
    return segments[segments.length - PATH_DEPTH_MIN] ?? sig.tree();
  });
  const parentFolder = createMemo(() =>
    path().length > PATH_DEPTH_MIN ? path()[path().length - PARENT_OFFSET] : undefined,
  );

  return { currentFolder, parentFolder, path };
};

const createVisibleState = (
  sig: RangerSignals,
  currentFolder: ReturnType<typeof createPathState>["currentFolder"],
) => {
  const visibleCurrent = createMemo(() => {
    let items = currentFolder().children;
    const query = sig.filter().toLowerCase();
    if (query !== "") {
      items = items.filter((ch) => ch.name.toLowerCase().includes(query));
    }
    return sortNodes(items, sig.sortKey());
  });

  return { visibleCurrent };
};

const createSelectionState = (
  sig: RangerSignals,
  currentFolder: ReturnType<typeof createPathState>["currentFolder"],
  visibleCurrent: ReturnType<typeof createVisibleState>["visibleCurrent"],
) => {
  const selectedNode = createMemo((): VaultNode | undefined => {
    const id = sig.selByFolder()[currentFolder().id];
    const exact = visibleCurrent().find((ch) => ch.id === id);
    if (exact !== undefined) {
      return exact;
    }
    return visibleCurrent().at(FIRST_INDEX);
  });

  return { selectedNode };
};

const createParentState = (
  sig: RangerSignals,
  pathState: ReturnType<typeof createPathState>["currentFolder"],
  parentFolder: ReturnType<typeof createPathState>["parentFolder"],
) => {
  const parentSorted = createMemo(() => {
    const parent = parentFolder();
    if (parent === undefined) {
      return [];
    }
    return sortNodes(parent.children, sig.sortKey());
  });
  const parentActiveId = createMemo(() => {
    const parent = parentFolder();
    if (parent === undefined) {
      return;
    }
    return sig.selByFolder()[parent.id] ?? pathState().id;
  });
  return { parentActiveId, parentSorted };
};

const createPreviewState = (
  visibleCurrentNode: ReturnType<typeof createSelectionState>["selectedNode"],
  sortBy: RangerSignals["sortKey"],
) => {
  const previewFolderItems = createMemo((): VaultNode[] | undefined => {
    const node = visibleCurrentNode();
    if (node !== undefined && isFolder(node)) {
      return sortNodes(node.children, sortBy());
    }
    return undefined;
  });
  return { previewFolderItems };
};

export const createDerivedState = (sig: RangerSignals) => {
  const pathState = createPathState(sig);
  const visibleState = createVisibleState(sig, pathState.currentFolder);
  const selectionState = createSelectionState(
    sig,
    pathState.currentFolder,
    visibleState.visibleCurrent,
  );
  const parentState = createParentState(sig, pathState.currentFolder, pathState.parentFolder);
  const previewState = createPreviewState(selectionState.selectedNode, sig.sortKey);

  return {
    currentFolder: pathState.currentFolder,
    parentActiveId: parentState.parentActiveId,
    parentFolder: pathState.parentFolder,
    parentSorted: parentState.parentSorted,
    path: pathState.path,
    previewFolderItems: previewState.previewFolderItems,
    selectedNode: selectionState.selectedNode,
    visibleCurrent: visibleState.visibleCurrent,
  };
};

export type RangerDerived = ReturnType<typeof createDerivedState>;
