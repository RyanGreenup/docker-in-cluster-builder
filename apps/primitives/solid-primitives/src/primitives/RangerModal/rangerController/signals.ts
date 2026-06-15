import { createSignal } from "solid-js";

import {
  DUMMY_VAULT_TREE,
  type CreatingState,
  type SortKey,
  type VaultFolder,
  type ViewMode,
} from "../rangerTypes";
import { INITIAL_FOLDER, INITIAL_SEL } from "./constants";

const createTreeSignals = () => {
  const [tree, setTree] = createSignal<VaultFolder>(DUMMY_VAULT_TREE);
  const [selByFolder, setSelByFolder] = createSignal<Record<string, string>>(INITIAL_SEL);
  const [currentFolderId, setCurrentFolderId] = createSignal(INITIAL_FOLDER);
  const [marked, setMarked] = createSignal(new Set<string>());
  return {
    currentFolderId,
    marked,
    selByFolder,
    setCurrentFolderId,
    setMarked,
    setSelByFolder,
    setTree,
    tree,
  };
};

const createUiSignals = () => {
  const [filter, setFilter] = createSignal("");
  const [filterFocused, setFilterFocused] = createSignal(false);
  const [renameId, setRenameId] = createSignal<string | undefined>();
  const [confirmDeleteId, setConfirmDeleteId] = createSignal<string | undefined>();
  const [creating, setCreating] = createSignal<CreatingState | undefined>();
  const [view, setView] = createSignal<ViewMode>("folders");
  const [sortKey, setSortKey] = createSignal<SortKey>("name");
  const filterRef = { current: undefined as HTMLInputElement | undefined };

  return {
    confirmDeleteId,
    creating,
    filter,
    filterFocused,
    filterRef,
    renameId,
    setConfirmDeleteId,
    setCreating,
    setFilter,
    setFilterFocused,
    setRenameId,
    setSortKey,
    setView,
    sortKey,
    view,
  };
};

export const createSignals = (): RangerSignals => ({
  ...createTreeSignals(),
  ...createUiSignals(),
});

export type RangerSignals = ReturnType<typeof createTreeSignals> &
  ReturnType<typeof createUiSignals>;
