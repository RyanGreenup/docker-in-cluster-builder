import { col, colCurrent } from "../RangerModal.css/body.css";
import { isFolder, type VaultNode, type VaultNote, type CreatingState } from "../rangerTypes";

export const getCreatePlaceholder = (kind: CreatingState["kind"]): string => {
  if (kind === "folder") {
    return "New folder name…";
  }
  return "Untitled note…";
};

export const getColumnClass = (isCurrent: boolean): string => {
  if (isCurrent) {
    return `${col} ${colCurrent}`;
  }
  return col;
};

export const getItemNote = (item: VaultNode): VaultNote | undefined => {
  if (isFolder(item)) {
    return undefined;
  }
  return item;
};
