import { Show, type JSXElement, type Accessor } from "solid-js";

import { ColumnRow } from "./columnRow";
import { ConfirmDeleteOverlay } from "./confirmDeleteOverlay";

import type { VaultNode } from "../rangerTypes";

interface ColumnItemProps {
  item: VaultNode;
  activeId: string | undefined;
  isCurrent: boolean;
  marked: Accessor<Set<string>>;
  renameId: Accessor<string | undefined>;
  confirmDeleteId: Accessor<string | undefined>;
  onActivate: (id: string) => void;
  onContextOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  renameInputRef: (el: HTMLInputElement) => void;
}

export const ColumnItem = (props: ColumnItemProps): JSXElement => {
  const isActive = () => props.item.id === props.activeId;
  const isRenaming = () => props.renameId() === props.item.id;
  const isConfirming = () => props.confirmDeleteId() === props.item.id;
  const isMarked = () => props.marked().has(props.item.id);

  return (
    <Show
      when={isConfirming() && props.isCurrent}
      fallback={
        <ColumnRow
          item={props.item}
          isActive={isActive}
          isCurrent={props.isCurrent}
          isRenaming={isRenaming}
          isMarked={isMarked}
          renameInputRef={props.renameInputRef}
          onActivate={props.onActivate}
          onContextOpen={props.onContextOpen}
          onRename={props.onRename}
        />
      }
    >
      <ConfirmDeleteOverlay
        name={props.item.name}
        onConfirm={props.onConfirmDelete}
        onCancel={props.onCancelDelete}
      />
    </Show>
  );
};
