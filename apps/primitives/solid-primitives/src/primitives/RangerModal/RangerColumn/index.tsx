import { colHead, colCount } from "../RangerModal.css/body.css";
import { ColumnListBody } from "./columnListBody";
import { getColumnClass } from "./helpers";

import type { JSXElement } from "solid-js";

import type { RangerColumnProps } from "./types";

export const RangerColumn = (props: RangerColumnProps): JSXElement => (
  <div class={getColumnClass(props.isCurrent)}>
    <div class={colHead}>
      <span>{props.label}</span>
      <span class={colCount}>{props.items.length}</span>
    </div>
    <ColumnListBody
      isCurrent={props.isCurrent}
      creating={props.creating}
      items={props.items}
      activeId={props.activeId}
      marked={props.marked}
      renameId={props.renameId}
      confirmDeleteId={props.confirmDeleteId}
      onActivate={props.onActivate}
      onContextOpen={props.onContextOpen}
      onRename={props.onRename}
      onConfirmDelete={props.onConfirmDelete}
      onCancelDelete={props.onCancelDelete}
      onCreateCommit={props.onCreateCommit}
      onCreateCancel={props.onCreateCancel}
    />
  </div>
);
