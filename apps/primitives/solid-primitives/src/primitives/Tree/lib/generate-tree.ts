// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Flat record as it would exist in a SQL table. */
export interface TreeRecord {
  id: string;
  name: string;
  description?: string;
  parentId: string | undefined;
  type: "folder" | "note";
  meta?: Record<string, unknown>;
}

/** Node shape that Zag.js tree-view expects. */
export interface TreeNode {
  id: string;
  name: string;
  description?: string;
  children?: TreeNode[];
  /** Hint for Zag: node is a branch even when children is empty. */
  childrenCount?: number;
  meta?: Record<string, unknown>;
}

/** Shape of the flat store that backs the tree. */
export interface FlatStore {
  records: Record<string, TreeRecord>;
  childIds: Partial<Record<string, string[]>>;
}

// ---------------------------------------------------------------------------
// Data generation — infinite exemplar
// ---------------------------------------------------------------------------

/**
 * Seed a flat store with only root-level folders.
 * The tree is infinite — deeper levels are materialised on demand
 * via `ensureChildren` when a branch is first expanded.
 */
export const createExemplar = (breadth: number): FlatStore => {
  const records: Record<string, TreeRecord> = {};
  const childIds: Partial<Record<string, string[]>> = {};
  const ids: string[] = [];
  for (let idx = 0; idx < breadth; idx++) {
    const id = `node-${idx}`;
    records[id] = { id, name: id, parentId: undefined, type: "folder" };
    ids.push(id);
  }
  childIds.ROOT = ids;
  return { childIds, records };
};

// Number of path segments to subtract when computing depth from id.
const NODE_PREFIX_SEGMENTS = 1;

/** Derive the depth of a node from its id (root children = depth 1). */
export const nodeDepth = (id: string): number => id.split("-").length - NODE_PREFIX_SEGMENTS;

/** Convert a flat record to a Zag-compatible TreeNode. */
export const toTreeNode = (record: TreeRecord): TreeNode => {
  const node: TreeNode = { id: record.id, name: record.name };
  if (record.description !== undefined && record.description !== "") {
    node.description = record.description;
  }
  if (record.meta) {
    node.meta = record.meta;
  }
  // ChildrenCount tells Zag this is a branch even when children is empty.
  // LoadChildren will be called on first expand to populate them.
  if (record.type === "folder") {
    node.children = [];
    node.childrenCount = 1;
  }
  return node;
};

/** Get children of a parent as TreeNodes, reading from the flat store. */
export const getChildren = (store: FlatStore, parentId = "ROOT"): TreeNode[] => {
  const ids = store.childIds[parentId];
  if (!ids) {
    return [];
  }
  return ids
    .map((id) => store.records[id])
    .filter((record): record is TreeRecord => record !== undefined)
    .map((record) => toTreeNode(record));
};

const EXEMPLAR_DESCRIPTIONS = [
  "Overview of the module structure and public API surface.",
  "Tracks pending migrations and schema drift since last deploy.",
  "Summarises weekly error rates across upstream dependencies.",
  "Design notes for the revised onboarding flow.",
  "Benchmarks comparing serialisation formats under load.",
];

const DEFAULT_MAX_DEPTH = 7;

const NOT_FOUND = -1;
const REMOVE_ONE = 1;
// Splice deleteCount when inserting without removing any existing entries.
const SPLICE_KEEP = 0;

const makeChildId = (parentId: string | undefined, index: number): string => {
  if (parentId !== undefined) {
    return `${parentId}-${index}`;
  }
  return `node-${index}`;
};

const resolveChildType = (isLeaf: boolean): "note" | "folder" => {
  if (isLeaf) {
    return "note";
  }
  return "folder";
};

interface ChildRecordOptions {
  parentId: string | undefined;
  index: number;
  maxDepth: number;
}

const makeChildRecord = (options: ChildRecordOptions): TreeRecord => {
  const { parentId, index, maxDepth } = options;
  const id = makeChildId(parentId, index);
  const isLeaf = nodeDepth(id) >= maxDepth;
  const type = resolveChildType(isLeaf);
  const record: TreeRecord = { id, name: id, parentId, type };
  if (isLeaf) {
    record.description = EXEMPLAR_DESCRIPTIONS[index % EXEMPLAR_DESCRIPTIONS.length];
  }
  return record;
};

/**
 * Materialise children for a parent that hasn't been expanded yet.
 * Returns a produce recipe so callers can apply it to a Solid store.
 * Children at `maxDepth` are generated as leaf notes instead of folders.
 */
export const ensureChildren =
  (parentId: string | undefined, breadth: number, maxDepth = DEFAULT_MAX_DEPTH): Recipe =>
  (store) => {
    const key = parentId ?? "ROOT";
    if (store.childIds[key] !== undefined) {
      return;
    }
    const ids: string[] = [];
    for (let idx = 0; idx < breadth; idx++) {
      const record = makeChildRecord({ index: idx, maxDepth, parentId });
      store.records[record.id] = record;
      ids.push(record.id);
    }
    store.childIds[key] = ids;
  };

// ---------------------------------------------------------------------------
// CRUD recipes — (store: FlatStore) => void for use with produce
// ---------------------------------------------------------------------------

let counter = 0;
export const makeId = (): string => `id-${Date.now()}-${counter++}`;

type Recipe = (store: FlatStore) => void;

/** Rename a record. */
export const renameRecord =
  (id: string, name: string): Recipe =>
  (store) => {
    const rec = store.records[id];
    if (rec) {
      rec.name = name;
    }
  };

/** Merge metadata into a record. */
export const updateRecordMeta =
  (id: string, meta: Record<string, unknown>): Recipe =>
  (store) => {
    const rec = store.records[id];
    if (!rec) {
      return;
    }
    rec.meta = { ...rec.meta, ...meta };
  };

/** Insert a new record as a child of parentId at the given index. */
export const insertRecord =
  (record: TreeRecord, index: number): Recipe =>
  (store) => {
    store.records[record.id] = record;
    const key = record.parentId ?? "ROOT";
    store.childIds[key] ??= [];
    store.childIds[key].splice(index, SPLICE_KEEP, record.id);
  };

const removeFromSiblings = (siblings: string[], id: string): void => {
  const idx = siblings.indexOf(id);
  if (idx !== NOT_FOUND) {
    siblings.splice(idx, REMOVE_ONE);
  }
};

const purgeDescendants = (store: FlatStore, id: string): void => {
  const stack = [id];
  let current = stack.pop();
  while (current !== undefined) {
    delete store.records[current];
    const kids = store.childIds[current];
    if (kids) {
      stack.push(...kids);
      delete store.childIds[current];
    }
    current = stack.pop();
  }
};

/** Remove a record and all its descendants. */
export const removeRecord =
  (id: string): Recipe =>
  (store) => {
    const rec = store.records[id] as TreeRecord | undefined;
    if (!rec) {
      return;
    }
    // Remove from parent's child list
    const parentKey = rec.parentId ?? "ROOT";
    const siblings = store.childIds[parentKey];
    if (siblings) {
      removeFromSiblings(siblings, id);
    }
    purgeDescendants(store, id);
  };

interface ReparentOptions {
  store: FlatStore;
  rec: TreeRecord;
  id: string;
  toParentId: string | undefined;
  toIndex: number;
}

const reparentRecord = (options: ReparentOptions): void => {
  const { store, rec, id, toParentId, toIndex } = options;
  // Remove from old parent
  const oldKey = rec.parentId ?? "ROOT";
  const oldSiblings = store.childIds[oldKey];
  if (oldSiblings) {
    removeFromSiblings(oldSiblings, id);
  }
  // Insert into new parent
  const newKey = toParentId ?? "ROOT";
  store.childIds[newKey] ??= [];
  store.childIds[newKey].splice(toIndex, SPLICE_KEEP, id);
  rec.parentId = toParentId;
};

/** Move a record to a new parent at the given index. */
export const moveRecord =
  (id: string, toParentId: string | undefined, toIndex: number): Recipe =>
  (store) => {
    const rec = store.records[id] as TreeRecord | undefined;
    if (!rec) {
      return;
    }
    reparentRecord({ id, rec, store, toIndex, toParentId });
  };
