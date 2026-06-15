import * as tree from "@zag-js/tree-view";
import { createSignal, type Accessor } from "solid-js";
import { createStore, produce } from "solid-js/store";

import {
  ensureChildren,
  getChildren,
  insertRecord,
  moveRecord,
  removeRecord,
  renameRecord,
  updateRecordMeta,
  type FlatStore,
  type TreeNode,
  type TreeRecord,
} from "./generate-tree";

type Collection = ReturnType<typeof tree.collection<TreeNode>>;

export interface TreeStore {
  /** Flat store proxy — records keyed by id, child lists keyed by parentId. */
  store: FlatStore;
  /** Reactive collection accessor for the Zag machine. */
  collection: Accessor<Collection>;
  /** Async child loader — wire to useMachine's loadChildren prop. */
  loadChildren: (details: { node: TreeNode }) => Promise<TreeNode[]>;
  /** Handle Zag's onLoadChildrenComplete — updates the collection signal. */
  handleLoadComplete: (details: { collection: Collection }) => void;

  rename: (id: string, name: string) => void;
  setMeta: (id: string, meta: Record<string, unknown>) => void;
  insert: (record: TreeRecord, index: number) => void;
  remove: (id: string) => void;
  move: (id: string, toParentId: string | undefined, toIndex: number) => void;
}

const DEFAULT_BREADTH = 5;
const DEFAULT_MAX_DEPTH = 7;

interface PatchNameOptions {
  collection: Collection;
  id: string;
  name: string;
  setCollection: (col: Collection) => void;
}

const patchCollectionName = (options: PatchNameOptions): void => {
  const { collection, id, name, setCollection } = options;
  const indexPath = collection.getIndexPath(id);
  if (!indexPath) {
    return;
  }
  const node = collection.findNode(id);
  if (!node) {
    return;
  }
  setCollection(collection.replace(indexPath, { ...node, id: node.id, name }));
};

interface PatchMetaOptions {
  collection: Collection;
  id: string;
  meta: Record<string, unknown>;
  setCollection: (col: Collection) => void;
}

const patchCollectionMeta = (options: PatchMetaOptions): void => {
  const { collection, id, meta, setCollection } = options;
  const indexPath = collection.getIndexPath(id);
  if (!indexPath) {
    return;
  }
  const node = collection.findNode(id);
  if (!node) {
    return;
  }
  const merged = { ...node.meta, ...meta };
  setCollection(collection.replace(indexPath, { ...node, id: node.id, meta: merged }));
};

export const createTreeStore = (
  initial: FlatStore,
  breadth = DEFAULT_BREADTH,
  maxDepth = DEFAULT_MAX_DEPTH,
): TreeStore => {
  const [store, setStore] = createStore<FlatStore>(initial);
  const buildCollection = (): Collection =>
    tree.collection<TreeNode>({
      nodeToString: (nn) => nn.name,
      nodeToValue: (nn) => nn.id,
      rootNode: { children: getChildren(store), id: "ROOT", name: "" },
    });

  const [collection, setCollection] = createSignal<Collection>(buildCollection());
  return {
    collection,
    handleLoadComplete: ({ collection: col }) => setCollection(col),
    insert(record, index) {
      setStore(produce(insertRecord(record, index)));
      setCollection(buildCollection());
    },
    loadChildren: ({ node }) => {
      setStore(produce(ensureChildren(node.id, breadth, maxDepth)));
      return Promise.resolve(getChildren(store, node.id));
    },
    move(id, toParentId, toIndex) {
      setStore(produce(moveRecord(id, toParentId, toIndex)));
      setCollection(buildCollection());
    },
    remove(id) {
      setStore(produce(removeRecord(id)));
      setCollection(buildCollection());
    },
    rename(id, name) {
      setStore(produce(renameRecord(id, name)));
      patchCollectionName({ collection: collection(), id, name, setCollection });
    },
    setMeta(id, meta) {
      setStore(produce(updateRecordMeta(id, meta)));
      patchCollectionMeta({ collection: collection(), id, meta, setCollection });
    },
    store,
  };
};
