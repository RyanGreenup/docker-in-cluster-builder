import type { CreatingState, VaultNote, VaultNode } from "../rangerTypes";

export const getFallbackCreateName = (creating: CreatingState | undefined): string => {
  if (creating?.kind === "folder") {
    return "New Folder";
  }
  return "Untitled";
};

export const createPlaceholderNode = (
  kind: CreatingState["kind"],
  id: string,
  name: string,
): VaultNode => {
  if (kind === "folder") {
    return { children: [], id, kind: "folder", name, updated: "just now" };
  }

  return {
    abstract: "",
    backlinks: 0,
    id,
    kind: "note",
    name,
    related: [],
    size: "0.0k",
    syntax: "md",
    tag: "neutral",
    tags: [],
    updated: "just now",
    words: 0,
  } satisfies VaultNote;
};

export const getCreateKind = (shiftKey: boolean): CreatingState["kind"] => {
  if (shiftKey) {
    return "folder";
  }
  return "note";
};
