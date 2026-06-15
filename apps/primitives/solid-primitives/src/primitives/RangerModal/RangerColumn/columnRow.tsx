import Check from "lucide-solid/icons/check";
import FileText from "lucide-solid/icons/file-text";
import Folder from "lucide-solid/icons/folder";
import { Show, type JSXElement, type Accessor } from "solid-js";

import {
  row,
  rowActive,
  rowActiveCurrent,
  rowMarked,
  rowIcon,
  rowMark,
} from "../RangerModal.css/rows.css";
import { isFolder, type VaultNode } from "../rangerTypes";
import { ICON_SIZE } from "./constants";
import { getItemNote } from "./helpers";
import { ColumnRowMeta } from "./rowMeta";
import { RowNameCell } from "./rowNameCell";

interface ColumnRowProps {
  item: VaultNode;
  isActive: Accessor<boolean>;
  isCurrent: boolean;
  isRenaming: Accessor<boolean>;
  isMarked: Accessor<boolean>;
  renameInputRef: (el: HTMLInputElement) => void;
  onActivate: (id: string) => void;
  onContextOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export const ColumnRow = (props: ColumnRowProps): JSXElement => {
  const note = () => getItemNote(props.item);
  return (
    <div
      classList={{
        [row]: true,
        [rowActive]: props.isActive() && !props.isCurrent,
        [rowActiveCurrent]: props.isActive() && props.isCurrent,
        [rowMarked]: props.isMarked(),
      }}
      onClick={() => props.onActivate(props.item.id)}
      onDblClick={() => props.onContextOpen(props.item.id)}
    >
      <div class={rowMark}>
        <Show when={props.isMarked()}>
          <Check size={9} />
        </Show>
      </div>
      <div class={rowIcon}>
        <Show when={isFolder(props.item)} fallback={<FileText size={ICON_SIZE} />}>
          <Folder size={ICON_SIZE} />
        </Show>
      </div>
      <RowNameCell
        item={props.item}
        note={note}
        isRenaming={props.isRenaming}
        isCurrent={props.isCurrent}
        renameInputRef={props.renameInputRef}
        onRename={props.onRename}
      />
      <ColumnRowMeta item={props.item} isCurrent={props.isCurrent} />
    </div>
  );
};
