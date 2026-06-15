import type { RangerSignals } from "./signals";
import type { RangerDerived } from "./state";

export interface ColumnHandlers {
  onActivate: (id: string) => void;
  onContextOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCreateCommit: (name: string) => void;
  onCreateCancel: () => void;
}

export interface KeyboardContext {
  sig: RangerSignals;
  der: RangerDerived;
  onClose: () => void;
}
