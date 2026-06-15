import { isFolder } from "../rangerTypes";
import { DIRECTION_UP, EMPTY_COUNT, FIRST_INDEX, PATH_DEPTH_MIN } from "./constants";
import { getCreateKind } from "./helpers";

import type { KeyboardContext } from "./types";

const KEY_FILTER = "/";
const KEY_MOVE_NEXT = "j";
const KEY_MOVE_NEXT_ALT = "ArrowDown";
const KEY_MOVE_PREV = "k";
const KEY_MOVE_PREV_ALT = "ArrowUp";
const KEY_PARENT = "h";
const KEY_PARENT_ALT = "ArrowLeft";
const KEY_OPEN = "l";
const KEY_OPEN_ALT = "ArrowRight";

const ACTION_KEY_SPACE = " ";
const ACTION_KEY_RENAME = "r";
const ACTION_KEY_DELETE = "d";
const ACTION_KEY_CREATE = "n";
const ACTION_KEY_CREATE_FOLDER = "N";
const ACTION_KEY_TOP = "g";
const ACTION_KEY_BOTTOM = "G";

type NavigationAction = (ctx: KeyboardContext, ev: KeyboardEvent) => void;

interface KeyboardActionEntry {
  execute: NavigationAction;
  preventDefault?: boolean;
}

const getRenameEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  if (ctx.sig.renameId() !== undefined) {
    return () => ctx.sig.setRenameId();
  }
  return undefined;
};

const getCreateEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  if (ctx.sig.creating()) {
    return () => ctx.sig.setCreating();
  }
  return undefined;
};

const getDeleteEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  if (ctx.sig.confirmDeleteId() !== undefined) {
    return () => ctx.sig.setConfirmDeleteId();
  }
  return undefined;
};

const getFilterBlurEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  if (ctx.sig.filterFocused()) {
    return () => ctx.sig.filterRef.current?.blur();
  }
  return undefined;
};

const getFilterClearEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  if (ctx.sig.filter()) {
    return () => ctx.sig.setFilter("");
  }
  return undefined;
};

const createEscapeAction = (ctx: KeyboardContext): (() => void) | undefined => {
  const actions = [
    getRenameEscapeAction(ctx),
    getCreateEscapeAction(ctx),
    getDeleteEscapeAction(ctx),
    getFilterBlurEscapeAction(ctx),
    getFilterClearEscapeAction(ctx),
  ];
  for (const action of actions) {
    if (action !== undefined) {
      return action;
    }
  }
  return undefined;
};

const navigateToParent = (ctx: KeyboardContext): void => {
  const parent = ctx.der.parentFolder();
  if (parent !== undefined) {
    ctx.sig.setCurrentFolderId(parent.id);
  }
};

const focusFilterAction = (ctx: KeyboardContext): void => {
  ctx.sig.filterRef.current?.focus();
};

const openPathAction = (ctx: KeyboardContext, ev: KeyboardEvent): void => {
  handleOpen(ctx, ev);
};

const ACTIONS_BY_NAVIGATION: Record<string, KeyboardActionEntry | undefined> = {
  [KEY_FILTER]: {
    execute: focusFilterAction,
    preventDefault: true,
  },
  [KEY_MOVE_NEXT]: {
    execute: (ctx) => {
      moveSelection(PATH_DEPTH_MIN, ctx);
    },
    preventDefault: true,
  },
  [KEY_MOVE_NEXT_ALT]: {
    execute: (ctx) => {
      moveSelection(PATH_DEPTH_MIN, ctx);
    },
    preventDefault: true,
  },
  [KEY_MOVE_PREV]: {
    execute: (ctx) => {
      moveSelection(DIRECTION_UP, ctx);
    },
    preventDefault: true,
  },
  [KEY_MOVE_PREV_ALT]: {
    execute: (ctx) => {
      moveSelection(DIRECTION_UP, ctx);
    },
    preventDefault: true,
  },
  [KEY_PARENT]: {
    execute: navigateToParent,
    preventDefault: true,
  },
  [KEY_PARENT_ALT]: {
    execute: navigateToParent,
    preventDefault: true,
  },
  [KEY_OPEN]: { execute: openPathAction },
  [KEY_OPEN_ALT]: { execute: openPathAction },
};

const applyNavigationAction = (
  ctx: KeyboardContext,
  ev: KeyboardEvent,
  action: KeyboardActionEntry,
): void => {
  action.execute(ctx, ev);
  if (action.preventDefault === true) {
    ev.preventDefault();
  }
};

export const handleKeyboardEscape = (ctx: KeyboardContext, ev: KeyboardEvent): void => {
  const action = createEscapeAction(ctx);
  if (action !== undefined) {
    action();
    ev.preventDefault();
    return;
  }
  ctx.onClose();
  ev.preventDefault();
};

export const handleKeyboardAction = (ctx: KeyboardContext, ev: KeyboardEvent): void => {
  const action = ACTIONS_BY_NAVIGATION[ev.key];
  if (action === undefined) {
    if (ev.key === "Enter") {
      openPathAction(ctx, ev);
      return;
    }
    handleSecondaryActions(ctx, ev);
    return;
  }
  applyNavigationAction(ctx, ev, action);
};

const getActionForKey = (ev: KeyboardEvent): string => {
  if (ev.key === ACTION_KEY_CREATE && ev.shiftKey) {
    return ACTION_KEY_CREATE_FOLDER;
  }
  return ev.key;
};

const getSelectedActionNode = (ctx: KeyboardContext) => ctx.der.selectedNode();

const markSelectedForAction = (ctx: KeyboardContext): void => {
  const sel = getSelectedActionNode(ctx);
  if (sel !== undefined) {
    toggleMark(sel.id, ctx.sig);
  }
};

const renameSelectedForAction = (ctx: KeyboardContext): void => {
  const sel = getSelectedActionNode(ctx);
  if (sel !== undefined) {
    ctx.sig.setRenameId(sel.id);
  }
};

const deleteSelectedForAction = (ctx: KeyboardContext): void => {
  const sel = getSelectedActionNode(ctx);
  if (sel !== undefined) {
    ctx.sig.setConfirmDeleteId(sel.id);
  }
};

const beginCreateAction: NavigationAction = (ctx) => {
  ctx.sig.setCreating({ kind: getCreateKind(false) });
};

const beginCreateFolderAction: NavigationAction = (ctx) => {
  ctx.sig.setCreating({ kind: "folder" });
};

const jumpFirstAction: NavigationAction = (ctx) => {
  jumpTo(FIRST_INDEX, ctx);
};

const jumpLastAction: NavigationAction = (ctx) => {
  jumpTo(ctx.der.visibleCurrent().length - PATH_DEPTH_MIN, ctx);
};

const ACTIONS_BY_KEY: Record<string, NavigationAction | undefined> = {
  [ACTION_KEY_SPACE]: markSelectedForAction,
  [ACTION_KEY_RENAME]: renameSelectedForAction,
  [ACTION_KEY_DELETE]: deleteSelectedForAction,
  [ACTION_KEY_CREATE]: beginCreateAction,
  [ACTION_KEY_CREATE_FOLDER]: beginCreateFolderAction,
  [ACTION_KEY_TOP]: jumpFirstAction,
  [ACTION_KEY_BOTTOM]: jumpLastAction,
};

const handleSecondaryActions = (ctx: KeyboardContext, ev: KeyboardEvent): void => {
  const key = getActionForKey(ev);
  const action = ACTIONS_BY_KEY[key];
  if (action === undefined) {
    return;
  }
  action(ctx, ev);
  ev.preventDefault();
};

const moveSelection = (dir: number, ctx: KeyboardContext): void => {
  const sel = ctx.der.selectedNode();
  if (sel === undefined) {
    return;
  }
  const visibleItems = ctx.der.visibleCurrent();
  const idx = visibleItems.findIndex((ch) => ch.id === sel.id);
  const last = visibleItems.length - PATH_DEPTH_MIN;
  const target = visibleItems.at(Math.max(FIRST_INDEX, Math.min(last, idx + dir)));
  if (target === undefined) {
    return;
  }
  ctx.sig.setSelByFolder((st) => ({
    ...st,
    [ctx.der.currentFolder().id]: target.id,
  }));
};

const handleOpen = (ctx: KeyboardContext, ev: KeyboardEvent): void => {
  const sel = ctx.der.selectedNode();
  if (sel === undefined) {
    return;
  }
  if (isFolder(sel) && sel.children.length > EMPTY_COUNT) {
    ctx.sig.setCurrentFolderId(sel.id);
  } else if (!isFolder(sel) && ev.key === "Enter") {
    ctx.onClose();
  }
  ev.preventDefault();
};
const toggleMark = (id: string, sig: KeyboardContext["sig"]): void => {
  sig.setMarked((prev) => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};

const jumpTo = (idx: number, ctx: KeyboardContext): void => {
  const item = ctx.der.visibleCurrent()[idx];
  if (item === undefined) {
    return;
  }
  ctx.sig.setSelByFolder((st) => ({
    ...st,
    [ctx.der.currentFolder().id]: item.id,
  }));
};
