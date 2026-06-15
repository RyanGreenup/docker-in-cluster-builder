import { isFolder } from "../rangerTypes";
import { EMPTY_COUNT } from "./constants";
import { getFallbackCreateName } from "./helpers";

import type { CrudActions } from "./crudActions";
import type { RangerSignals } from "./signals";
import type { RangerDerived } from "./state";
import type { ColumnHandlers } from "./types";

export const createParentHandlers = (
  sig: RangerSignals,
  der: RangerDerived,
  crud: CrudActions,
): ColumnHandlers => ({
  onActivate: (id) => {
    const parent = der.parentFolder();
    if (parent !== undefined) {
      sig.setCurrentFolderId(parent.id);
      sig.setSelByFolder((st) => ({ ...st, [parent.id]: id }));
    }
  },
  onCancelDelete: () => {},
  onConfirmDelete: () => {},
  onContextOpen: (id) => {
    const parent = der.parentFolder();
    if (parent === undefined) {
      return;
    }
    const node = parent.children.find((ch) => ch.id === id);
    if (node !== undefined && isFolder(node)) {
      sig.setCurrentFolderId(id);
    }
  },
  onCreateCancel: () => {},
  onCreateCommit: () => {},
  onRename: crud.renameNode,
});

export const createCurrentHandlers = (
  sig: RangerSignals,
  der: RangerDerived,
  crud: CrudActions,
): ColumnHandlers => ({
  onActivate: (id) => {
    sig.setSelByFolder((st) => ({ ...st, [der.currentFolder().id]: id }));
    const node = der.currentFolder().children.find((ch) => ch.id === id);
    if (node !== undefined && isFolder(node) && node.children.length > EMPTY_COUNT) {
      sig.setCurrentFolderId(id);
    }
  },
  onCancelDelete: () => sig.setConfirmDeleteId(),
  onConfirmDelete: () => {
    const id = sig.confirmDeleteId();
    if (id !== undefined) {
      crud.deleteNode(id);
    }
  },
  onContextOpen: (id) => {
    const node = der.currentFolder().children.find((ch) => ch.id === id);
    if (node !== undefined && isFolder(node)) {
      sig.setCurrentFolderId(id);
    }
  },
  onCreateCancel: () => sig.setCreating(),
  onCreateCommit: (name) =>
    crud.createInCurrent(
      sig.creating()?.kind ?? "note",
      name || getFallbackCreateName(sig.creating()),
    ),
  onRename: crud.renameNode,
});
