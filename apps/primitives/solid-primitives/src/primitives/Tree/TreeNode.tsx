import { createMemo, Index, Show, type Accessor, type JSX } from "solid-js";

import {
  chevronIndicator,
  chevronSpacer,
  itemCount,
  itemLabel,
  nodeIcon,
  treeChildren,
  treeItemRow,
} from "./style.css";

import type * as tree from "@zag-js/tree-view";

import type { TreeNode as TreeNodeData } from "./lib/generate-tree";

export interface TreeNodeProps {
  node: TreeNodeData;
  indexPath: number[];
  api: Accessor<tree.Api>;
}

// Pull a numeric count badge out of the untyped node meta bag, if present.
const readCount = (node: TreeNodeData): number | undefined => {
  const value = node.meta?.count;
  return typeof value === "number" ? value : undefined;
};

// Filled right-pointing triangle, matching the design's 9x9 chevron exactly.
const ChevronFill = (): JSX.Element => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5l8 7-8 7z" />
  </svg>
);

// Inline folder / file glyphs keep the primitive dependency-free, matching the
// Convention used by the Accordion primitive (which ships its own inline icon).
const FolderIcon = (props: { readonly class?: string }): JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
    aria-hidden="true"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
);

const FileIcon = (props: { readonly class?: string }): JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={props.class}
    aria-hidden="true"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

interface BranchControlProps {
  nodeProps: () => { indexPath: number[]; node: TreeNodeData };
  api: Accessor<tree.Api>;
  node: TreeNodeData;
}

const BranchControl = (props: BranchControlProps): JSX.Element => {
  const count = () => readCount(props.node);
  return (
    <div {...props.api().getBranchControlProps(props.nodeProps())} class={treeItemRow}>
      <span {...props.api().getBranchIndicatorProps(props.nodeProps())} class={chevronIndicator}>
        <ChevronFill />
      </span>
      <FolderIcon class={nodeIcon} />
      <span {...props.api().getBranchTextProps(props.nodeProps())} class={itemLabel}>
        {props.node.name}
      </span>
      <Show when={count() !== undefined}>
        <span class={itemCount}>{count()}</span>
      </Show>
    </div>
  );
};

const BranchNode = (props: TreeNodeProps): JSX.Element => {
  const nodeProps = () => ({
    indexPath: props.indexPath,
    node: props.node,
  });
  const nodeState = createMemo(() => props.api().getNodeState(nodeProps()));

  return (
    <div {...props.api().getBranchProps(nodeProps())}>
      <BranchControl nodeProps={nodeProps} api={props.api} node={props.node} />
      <div {...props.api().getBranchContentProps(nodeProps())} class={treeChildren}>
        <Show when={nodeState().expanded}>
          <Index each={props.node.children}>
            {(child, index) => (
              <TreeNode node={child()} indexPath={[...props.indexPath, index]} api={props.api} />
            )}
          </Index>
        </Show>
      </div>
    </div>
  );
};

const LeafNode = (props: TreeNodeProps): JSX.Element => {
  const nodeProps = () => ({
    indexPath: props.indexPath,
    node: props.node,
  });
  const count = () => readCount(props.node);

  return (
    <div {...props.api().getItemProps(nodeProps())} class={treeItemRow}>
      <span class={chevronSpacer} aria-hidden="true" />
      <FileIcon class={nodeIcon} />
      <span {...props.api().getItemTextProps(nodeProps())} class={itemLabel}>
        {props.node.name}
      </span>
      <Show when={count() !== undefined}>
        <span class={itemCount}>{count()}</span>
      </Show>
    </div>
  );
};

export const TreeNode = (props: TreeNodeProps): JSX.Element => {
  const nodeProps = () => ({
    indexPath: props.indexPath,
    node: props.node,
  });
  const nodeState = createMemo(() => props.api().getNodeState(nodeProps()));

  return (
    <Show when={nodeState().isBranch} fallback={<LeafNode {...props} />}>
      <BranchNode {...props} />
    </Show>
  );
};
