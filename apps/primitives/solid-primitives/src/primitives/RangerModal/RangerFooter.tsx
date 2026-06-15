import Copy from "lucide-solid/icons/copy";
import Hash from "lucide-solid/icons/hash";
import Trash2 from "lucide-solid/icons/trash-2";
import XIcon from "lucide-solid/icons/x";
import { For, Show, type JSXElement } from "solid-js";

import {
  bulkBar,
  bulkCount,
  bulkDivider,
  bulkBtn,
  bulkBtnDanger,
} from "./RangerModal.css/bulk.css";
import {
  footer,
  footerStatusPath,
  footerDivider,
  footerSpacer,
  footerGroup,
  kbdMini,
} from "./RangerModal.css/footer.css";
import { rangerVars } from "./theme.css";

import type { VaultFolder, VaultNode } from "./rangerTypes";

const ICON_SM = 12;
const LAST_INDEX_OFFSET = 1;

const HINTS = [
  { keys: ["j", "k"], label: "move" },
  { keys: ["h", "l"], label: "level" },
  { keys: ["space"], label: "mark" },
  { keys: ["n"], label: "new" },
  { keys: ["r"], label: "rename" },
  { keys: ["d"], label: "delete" },
  { keys: ["/"], label: "filter" },
  { keys: ["↵"], label: "open" },
] as const;

const getSelectedPath = (path: VaultFolder[], selectedNode: VaultNode | undefined): string => {
  const folderPath = path.map((seg) => seg.name).join("/");
  if (selectedNode === undefined) {
    return folderPath;
  }
  return `${folderPath}/${selectedNode.name}`;
};

interface RangerFooterProps {
  selectedNode: VaultNode | undefined;
  path: VaultFolder[];
}

interface BulkBarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
}

export const BulkBar = (props: BulkBarProps): JSXElement => (
  <div class={bulkBar} role="toolbar">
    <span class={bulkCount}>{props.count} selected</span>
    <div class={bulkDivider} />
    <button class={bulkBtn}>
      <Copy size={ICON_SM} />
      <span>Move</span>
    </button>
    <button class={bulkBtn}>
      <Copy size={ICON_SM} />
      <span>Copy</span>
    </button>
    <button class={bulkBtn}>
      <Hash size={ICON_SM} />
      <span>Tag</span>
    </button>
    <button class={`${bulkBtn} ${bulkBtnDanger}`} onClick={() => props.onDelete()}>
      <Trash2 size={ICON_SM} />
      <span>Delete</span>
    </button>
    <div class={bulkDivider} />
    <button class={bulkBtn} onClick={() => props.onClear()} title="Clear selection (Esc)">
      <XIcon size={ICON_SM} />
      <span>Clear</span>
    </button>
  </div>
);

export const RangerFooter = (props: RangerFooterProps): JSXElement => {
  const fullPath = () => getSelectedPath(props.path, props.selectedNode);

  return (
    <div class={footer}>
      <span class={footerStatusPath}>{props.selectedNode?.name ?? "—"}</span>
      <span class={footerDivider}>·</span>
      <span
        style={{
          color: rangerVars.fg.tertiary,
          overflow: "hidden",
          "text-overflow": "ellipsis",
          "white-space": "nowrap",
        }}
      >
        {fullPath()}
      </span>
      <span class={footerSpacer} />
      <For each={HINTS}>
        {(hint, idx) => (
          <>
            <span class={footerGroup}>
              <For each={hint.keys}>{(key) => <span class={kbdMini}>{key}</span>}</For>
              <span>{hint.label}</span>
            </span>
            <Show when={idx() < HINTS.length - LAST_INDEX_OFFSET}>
              <span class={footerDivider}>·</span>
            </Show>
          </>
        )}
      </For>
    </div>
  );
};
