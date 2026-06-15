import { Show, type JSXElement } from "solid-js";

import { rowMeta, chevron } from "../RangerModal.css/rows.css";
import { isFolder, type VaultFolder, type VaultNode, type VaultNote } from "../rangerTypes";
import { rangerVars } from "../theme.css";

const asFolder = (node: VaultNode): VaultFolder | undefined =>
  isFolder(node) ? node : undefined;

const asNote = (node: VaultNode): VaultNote | undefined =>
  isFolder(node) ? undefined : node;

export const ColumnRowMeta = (props: { item: VaultNode; isCurrent: boolean }): JSXElement => (
  <div class={rowMeta}>
    <Show
      when={asFolder(props.item)}
      fallback={
        <Show when={asNote(props.item)}>
          {(note) => (
            <>
              <span>{note().size}</span>
              <Show when={props.isCurrent}>
                <span style={{ color: rangerVars.fg.muted }}>·</span>
                <span
                  style={{
                    "min-width": "60px",
                    "text-align": "right",
                  }}
                >
                  {note().updated}
                </span>
              </Show>
            </>
          )}
        </Show>
      }
    >
      {(folder) => (
        <>
          <span>{folder().children.length}</span>
          <span class={chevron}>›</span>
        </>
      )}
    </Show>
  </div>
);
