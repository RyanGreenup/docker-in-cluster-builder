import { Show, type Accessor, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";

import { RangerColumn } from "./RangerColumn";
import {
  createRangerController,
  noId,
  noCreating,
  getItemPluralSuffix,
  PATH_DEPTH_MIN,
} from "./rangerController";
import { RangerFooter, BulkBar } from "./RangerFooter";
import { RangerHeader } from "./RangerHeader";
import { backdrop, shell } from "./RangerModal.css/backdropShell.css";
import { body } from "./RangerModal.css/body.css";
import {
  filterBar,
  filterPrompt,
  filterInput,
  filterStats,
  filterStatDivider,
  filterSortKey,
} from "./RangerModal.css/filter.css";
import { RangerPreview } from "./RangerPreview";
import { rangerVars, rangerTheme } from "./theme.css";

import type { SortKey } from "./rangerTypes";

const EMPTY_COUNT = 0;

export interface RangerModalProps {
  open: Accessor<boolean>;
  onClose: () => void;
  /**
   * Theme class assigning the `rangerVars` contract. Defaults to the built-in
   * `rangerTheme` skin. Supply a class from `createTheme(rangerVars, { ... })`
   * to reskin the modal (it is set on the backdrop, the outermost portal node,
   * so every part below it inherits the tokens).
   */
  themeClass?: string;
}

const joinClass = (...classes: (string | undefined)[]): string =>
  classes.filter((value): value is string => typeof value === "string" && value !== "").join(" ");

export const RangerModal = (props: RangerModalProps): JSXElement => {
  const ctrl = createRangerController(
    () => props.open(),
    () => props.onClose(),
  );
  return (
    <Portal>
      <Show when={props.open()}>
        <div
          class={joinClass(props.themeClass ?? rangerTheme, backdrop)}
          onMouseDown={ctrl.onBackdropMouseDown}
        >
          <div class={shell} onMouseDown={(ev) => ev.stopPropagation()}>
            <RangerHeader
              path={ctrl.path()}
              view={ctrl.view()}
              onViewChange={ctrl.setView}
              onNavigate={ctrl.setCurrentFolderId}
              onClose={props.onClose}
              canBack={ctrl.path().length > PATH_DEPTH_MIN}
            />
            <FilterBar
              filterRef={(el) => {
                ctrl.filterRef.current = el;
              }}
              filter={ctrl.filter}
              setFilter={ctrl.setFilter}
              setFilterFocused={ctrl.setFilterFocused}
              visibleCount={() => ctrl.visibleCurrent().length}
              markedCount={() => ctrl.marked().size}
              sortKey={ctrl.sortKey}
              cycleSortKey={ctrl.cycleSortKey}
            />
            <RangerColumns ctrl={ctrl} />
            <RangerFooter selectedNode={ctrl.selectedNode()} path={ctrl.path()} />
            <BulkBarSection
              marked={ctrl.marked}
              onClear={ctrl.clearMarks}
              onDelete={ctrl.bulkDelete}
            />
          </div>
        </div>
      </Show>
    </Portal>
  );
};

// ── Body columns ──────────────────────────────────────────────

type Ctrl = ReturnType<typeof createRangerController>;

const RangerColumns = (props: { ctrl: Ctrl }): JSXElement => (
  <div class={body}>
    <RangerColumn
      label="Parent"
      items={props.ctrl.parentSorted()}
      activeId={props.ctrl.parentActiveId()}
      isCurrent={false}
      marked={props.ctrl.marked}
      renameId={noId}
      confirmDeleteId={noId}
      creating={noCreating}
      sortKey={props.ctrl.sortKey}
      {...props.ctrl.parentHandlers}
    />
    <RangerColumn
      label={props.ctrl.currentFolder().name}
      items={props.ctrl.visibleCurrent()}
      activeId={props.ctrl.selectedNode()?.id}
      isCurrent={true}
      marked={props.ctrl.marked}
      renameId={props.ctrl.renameId}
      confirmDeleteId={props.ctrl.confirmDeleteId}
      creating={props.ctrl.creating}
      sortKey={props.ctrl.sortKey}
      {...props.ctrl.currentHandlers}
    />
    <RangerPreview node={props.ctrl.selectedNode()} folderItems={props.ctrl.previewFolderItems()} />
  </div>
);

// ── Bulk bar wrapper ──────────────────────────────────────────

const BulkBarSection = (props: {
  marked: Accessor<Set<string>>;
  onClear: () => void;
  onDelete: () => void;
}): JSXElement => (
  <Show when={props.marked().size > EMPTY_COUNT}>
    <BulkBar count={props.marked().size} onClear={props.onClear} onDelete={props.onDelete} />
  </Show>
);

// ── FilterBar ─────────────────────────────────────────────────

interface FilterBarProps {
  filterRef: (el: HTMLInputElement) => void;
  filter: Accessor<string>;
  setFilter: (val: string) => void;
  setFilterFocused: (val: boolean) => void;
  visibleCount: Accessor<number>;
  markedCount: Accessor<number>;
  sortKey: Accessor<SortKey>;
  cycleSortKey: () => void;
}

const FilterBar = (props: FilterBarProps): JSXElement => (
  <div class={filterBar}>
    <span class={filterPrompt}>/</span>
    <input
      ref={props.filterRef}
      class={filterInput}
      value={props.filter()}
      onInput={(ev) => props.setFilter(ev.currentTarget.value)}
      onFocus={() => props.setFilterFocused(true)}
      onBlur={() => props.setFilterFocused(false)}
      placeholder="filter — type to narrow this folder..."
      spellcheck={false}
    />
    <div class={filterStats}>
      <span>
        {props.visibleCount()} item
        {getItemPluralSuffix(props.visibleCount())}
      </span>
      <Show when={props.markedCount() > EMPTY_COUNT}>
        <span class={filterStatDivider}>.</span>
        <span
          style={{
            color: rangerVars.accent.base,
            "font-weight": "600",
          }}
        >
          {props.markedCount()} marked
        </span>
      </Show>
      <span class={filterStatDivider}>.</span>
      <span class={filterSortKey} onClick={() => props.cycleSortKey()} title="Cycle sort">
        sort:
        <span style={{ color: rangerVars.fg.secondary }}>{props.sortKey()}</span>
      </span>
    </div>
  </div>
);
