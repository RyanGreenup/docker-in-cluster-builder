import type { Accessor } from "solid-js";

import type { VaultNode, SortKey, CreatingState } from "../rangerTypes";

export interface RangerColumnProps {
  label: string;
  items: VaultNode[];
  activeId: string | undefined;
  isCurrent: boolean;
  marked: Accessor<Set<string>>;
  renameId: Accessor<string | undefined>;
  confirmDeleteId: Accessor<string | undefined>;
  creating: Accessor<CreatingState | undefined>;
  sortKey: Accessor<SortKey>;
  onActivate: (id: string) => void;
  onContextOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCreateCommit: (name: string) => void;
  onCreateCancel: () => void;
}
