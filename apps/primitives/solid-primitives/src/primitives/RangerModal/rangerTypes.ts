/* eslint-disable max-lines -- Dummy data makes this exceed 300 lines; will shrink once backend is connected */
export interface VaultNote {
  id: string;
  kind: "note";
  name: string;
  tag?: string;
  size?: string;
  updated: string;
  words?: number;
  backlinks?: number;
  syntax?: string;
  abstract?: string;
  tags?: string[];
  related?: string[];
}

export interface VaultFolder {
  id: string;
  kind: "folder";
  name: string;
  updated?: string;
  children: VaultNode[];
}

export type VaultNode = VaultNote | VaultFolder;

export const isFolder = (node: VaultNode): node is VaultFolder => node.kind === "folder";
export const isNote = (node: VaultNode): node is VaultNote => node.kind === "note";

export type SortKey = "name" | "updated" | "size";
export type ViewMode = "folders" | "all" | "tags";
export interface CreatingState {
  kind: "folder" | "note";
}

// ── Tree helpers ────────────────────────────────────────────

export const findPath = (
  root: VaultFolder,
  id: string,
  trail: VaultFolder[] = [],
): VaultFolder[] | undefined => {
  if (root.id === id) {
    return [...trail, root];
  }
  for (const child of root.children) {
    if (isFolder(child)) {
      const result = findPath(child, id, [...trail, root]);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

export const mapTree = (node: VaultFolder, fn: (nd: VaultNode) => VaultNode): VaultFolder => {
  const mapped = fn(node);
  if (!isFolder(mapped)) {
    return node;
  }
  return {
    ...mapped,
    children: mapped.children.map((ch) => {
      if (isFolder(ch)) {
        return mapTree(ch, fn);
      }
      return fn(ch);
    }),
  };
};

export const removeFromTree = (node: VaultFolder, id: string): VaultFolder => ({
  ...node,
  children: node.children
    .filter((ch) => ch.id !== id)
    .map((ch) => {
      if (isFolder(ch)) {
        return removeFromTree(ch, id);
      }
      return ch;
    }),
});

const FOLDER_FIRST = -1;
const FOLDER_LAST = 1;
const SAME_ORDER = 0;

const compareNodeKind = (left: VaultNode, right: VaultNode): number => {
  if (left.kind === right.kind) {
    return SAME_ORDER;
  }
  if (left.kind === "folder") {
    return FOLDER_FIRST;
  }
  return FOLDER_LAST;
};

const compareNodeSize = (left: VaultNode, right: VaultNode): number => {
  const leftSize = getNodeSize(left);
  const rightSize = getNodeSize(right);
  return rightSize.localeCompare(leftSize);
};

const getNodeSize = (node: VaultNode): string => {
  if (isNote(node)) {
    return node.size ?? "";
  }
  return "";
};

export const sortNodes = (items: VaultNode[], key: SortKey): VaultNode[] => {
  const sorted = [...items];
  sorted.sort((left, right) => {
    const kindOrder = compareNodeKind(left, right);
    if (kindOrder !== SAME_ORDER) {
      return kindOrder;
    }
    if (key === "name") {
      return left.name.localeCompare(right.name);
    }
    if (key === "size") {
      return compareNodeSize(left, right);
    }
    return SAME_ORDER;
  });
  return sorted;
};

// ── Backend integration notes ────────────────────────────────
// DUMMY_VAULT_TREE mirrors the future VaultFolder API response shape.
// The tree helpers above are backend-agnostic once the root is fetched.
export const DUMMY_VAULT_TREE: VaultFolder = {
  children: [
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  abstract:
                    "Detailed walkthrough of the transformer architecture from Vaswani et al.",
                  backlinks: 4,
                  id: "n1",
                  kind: "note",
                  name: "Attention Is All You Need — Annotated",
                  related: ["GPT Architecture Deep Dive", "Vision Transformers (ViT)"],
                  size: "14.2k",
                  syntax: "md",
                  tag: "violet",
                  tags: ["paper-notes", "pytorch"],
                  updated: "2h ago",
                  words: 3420,
                },
                {
                  abstract: "Tracing the lineage from decoder-only transformers.",
                  backlinks: 7,
                  id: "n2",
                  kind: "note",
                  name: "GPT Architecture Deep Dive",
                  related: ["Attention Is All You Need"],
                  size: "9.1k",
                  syntax: "md",
                  tag: "violet",
                  tags: ["paper-notes"],
                  updated: "Yesterday",
                  words: 2180,
                },
                {
                  abstract:
                    "How patches replace convolutions: tokenizing images for self-attention.",
                  backlinks: 2,
                  id: "n3",
                  kind: "note",
                  name: "Vision Transformers (ViT)",
                  related: ["Attention Is All You Need"],
                  size: "6.8k",
                  syntax: "md",
                  tag: "violet",
                  tags: ["paper-notes", "vision"],
                  updated: "3 days ago",
                  words: 1640,
                },
              ],
              id: "transformers",
              kind: "folder",
              name: "Transformers",
              updated: "2h",
            },
            {
              abstract: "Implementing backprop in raw numpy to understand gradient flow.",
              backlinks: 3,
              id: "n5",
              kind: "note",
              name: "Backpropagation From Scratch",
              related: [],
              size: "8.3k",
              syntax: "md",
              tag: "emerald",
              tags: ["python", "numpy"],
              updated: "1 week ago",
              words: 1980,
            },
          ],
          id: "ml",
          kind: "folder",
          name: "Machine Learning",
          updated: "2h",
        },
        {
          children: [
            {
              abstract: "Notes on leader election, log replication, and safety guarantees.",
              backlinks: 2,
              id: "n7",
              kind: "note",
              name: "RAFT Consensus Protocol",
              related: [],
              size: "7.2k",
              syntax: "md",
              tag: "amber",
              tags: ["architecture"],
              updated: "Yesterday",
              words: 1750,
            },
            {
              abstract: "Survey of CRDTs. Yjs vs Automerge benchmarks.",
              backlinks: 5,
              id: "n8",
              kind: "note",
              name: "CRDTs for Collaborative Editing",
              related: ["RAFT Consensus Protocol"],
              size: "12.1k",
              syntax: "md",
              tag: "amber",
              tags: ["architecture", "typescript"],
              updated: "5 days ago",
              words: 2940,
            },
          ],
          id: "distrib",
          kind: "folder",
          name: "Distributed Systems",
          updated: "Yesterday",
        },
      ],
      id: "research",
      kind: "folder",
      name: "Research",
      updated: "2h",
    },
    {
      children: [
        {
          children: [
            {
              abstract: "Morning standup, focus work, evening review.",
              backlinks: 0,
              id: "n10",
              kind: "note",
              name: "2026-04-26 Today",
              related: [],
              size: "0.9k",
              syntax: "md",
              tag: "cyan",
              tags: ["daily"],
              updated: "2 min ago",
              words: 220,
            },
          ],
          id: "j2026",
          kind: "folder",
          name: "2026",
          updated: "Today",
        },
      ],
      id: "journal",
      kind: "folder",
      name: "Journal",
      updated: "Today",
    },
    {
      children: [
        {
          children: [
            {
              abstract: "Top-line objectives and constraints for the Q2 redesign.",
              backlinks: 0,
              id: "n12",
              kind: "note",
              name: "Brief & Goals",
              related: [],
              size: "3.2k",
              syntax: "md",
              tag: "rose",
              tags: ["design"],
              updated: "3 days ago",
              words: 760,
            },
          ],
          id: "p1",
          kind: "folder",
          name: "Notes App Redesign",
          updated: "3 days ago",
        },
      ],
      id: "projects",
      kind: "folder",
      name: "Projects",
      updated: "3 days ago",
    },
    {
      children: [
        {
          abstract: "Modal navigator inspired by ranger but professional.",
          backlinks: 0,
          id: "n14",
          kind: "note",
          name: "Voice memo · ranger idea",
          related: [],
          size: "0.4k",
          syntax: "md",
          tag: "neutral",
          tags: [],
          updated: "1 hour ago",
          words: 90,
        },
      ],
      id: "inbox",
      kind: "folder",
      name: "Inbox",
      updated: "1 hour ago",
    },
    {
      children: [],
      id: "archive",
      kind: "folder",
      name: "Archive",
      updated: "2 months ago",
    },
  ],
  id: "root",
  kind: "folder",
  name: "Vault",
};
