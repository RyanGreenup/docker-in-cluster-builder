import { normalizeProps, useMachine } from "@zag-js/solid";
import * as tree from "@zag-js/tree-view";
import { createMemo, createUniqueId, Index, type Accessor } from "solid-js";

import { folderTree, srOnly, treeScrollWrapper } from "./style.css";
import { TreeNode } from "./TreeNode";

import type { TreeNode as TreeNodeData } from "./lib/generate-tree";

type Collection = ReturnType<typeof tree.collection<TreeNodeData>>;

export interface TreeViewProps {
  /** Reactive collection accessor, rebuilt only on structural changes. */
  collection: Accessor<Collection>;
  /** Async child loader for lazy branch expansion. */
  loadChildren: (details: { node: TreeNodeData }) => Promise<TreeNodeData[]>;
  /** Called when Zag finishes loading children. Must update the collection signal. */
  onLoadChildrenComplete: (details: { collection: Collection }) => void;
  /** Called when the selection changes. */
  onSelectionChange?: (values: string[]) => void;
  /** Called when the focused node changes. */
  onFocusChange?: (value: string | null) => void;
  /** Node values expanded on first render (uncontrolled). */
  defaultExpandedValue?: string[];
  /** Node values selected on first render (uncontrolled). */
  defaultSelectedValue?: string[];
}

const restoreFocusAfterLoad = (
  activeId: string,
  treeEl: Element | null,
  active: Element | null,
): void => {
  const focusWasInTree = activeId !== "" && treeEl?.contains(active) === true;
  if (focusWasInTree) {
    queueMicrotask(() => {
      document.querySelector<HTMLElement>(`#${activeId}`)?.focus({ preventScroll: true });
    });
  }
};

interface TreeScrollPaneProps {
  api: Accessor<ReturnType<typeof tree.connect>>;
  collection: Accessor<Collection>;
}

const TreeScrollPane = (props: TreeScrollPaneProps) => (
  <div class={treeScrollWrapper}>
    <div {...props.api().getTreeProps()} class={folderTree}>
      <Index each={props.collection().rootNode.children}>
        {(node, index) => <TreeNode node={node()} indexPath={[index]} api={props.api} />}
      </Index>
    </div>
  </div>
);

export const TreeView = (props: TreeViewProps) => {
  const id = createUniqueId();

  const onLoadChildrenComplete = (details: { collection: Collection }): void => {
    const { activeElement: active } = document;
    const activeId = active?.id ?? "";
    const treeEl = document.querySelector('[data-part="tree"]');
    props.onLoadChildrenComplete(details);
    restoreFocusAfterLoad(activeId, treeEl, active);
  };

  const service = useMachine(tree.machine, () => ({
    collection: props.collection(),
    defaultExpandedValue: props.defaultExpandedValue,
    defaultSelectedValue: props.defaultSelectedValue,
    id,
    loadChildren: props.loadChildren,
    onFocusChange(details) {
      props.onFocusChange?.(details.focusedValue);
    },
    onLoadChildrenComplete,
    onSelectionChange(details) {
      props.onSelectionChange?.(details.selectedValue);
    },
  }));

  const api = createMemo(() => tree.connect(service, normalizeProps));

  return (
    <div {...api().getRootProps()}>
      <span {...api().getLabelProps()} class={srOnly}>
        Folders
      </span>
      <TreeScrollPane api={api} collection={props.collection} />
    </div>
  );
};

export * as treeStyles from "./style.css";
export { TreeNode } from "./TreeNode";
export type { TreeNodeProps } from "./TreeNode";
export { createTreeStore } from "./lib/use-tree";
export type { TreeStore } from "./lib/use-tree";
export {
  createExemplar,
  ensureChildren,
  getChildren,
  insertRecord,
  makeId,
  moveRecord,
  nodeDepth,
  removeRecord,
  renameRecord,
  toTreeNode,
  updateRecordMeta,
} from "./lib/generate-tree";
export type { FlatStore, TreeNode as TreeNodeData, TreeRecord } from "./lib/generate-tree";
