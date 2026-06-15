import {
  flexRender,
  type Header,
  type Row,
  type SortDirection,
  type Table,
} from "@tanstack/solid-table";
import { type Virtualizer } from "@tanstack/solid-virtual";
import { For, Show, type JSX } from "solid-js";

import { useVirtualTable, type VirtualizedDataTableProps } from "./create-virtual-table";
import * as styles from "./style.css";

export type { VirtualizedDataTableProps };

/*
 * Behavioural primitive only. Virtualization requires client-side scroll
 * measurement and absolute row positioning, so — unlike the Accordion — this
 * is NOT SSR-static. Only structural CSS ships; theme via the data-part hooks.
 */

const joinClass = (...classes: (string | undefined)[]): string => classes.filter(Boolean).join(" ");

// The header occupies one ARIA row above the body rows; aria-rowcount must
// Include it so assistive tech reports header + data rows.
const HEADER_ROW_COUNT = 1;
const FOCUSABLE_TAB_INDEX = 0;

const columnSizeStyle = (size: number): JSX.CSSProperties => ({
  "flex-basis": `${size}px`,
  "max-width": `${size}px`,
  "min-width": `${size}px`,
  width: `${size}px`,
});

const tableWidthStyle = (size: number): JSX.CSSProperties => ({
  "min-width": "100%",
  width: `${size}px`,
});

const sortableTabIndex = (canSort: boolean): number | undefined => {
  if (canSort) {
    return FOCUSABLE_TAB_INDEX;
  }
  return undefined;
};

const boolAttr = (value: boolean): "false" | "true" => {
  if (value) {
    return "true";
  }
  return "false";
};

const sortDirectionAttr = (sorted: false | SortDirection): SortDirection | undefined => {
  if (sorted === false) {
    return undefined;
  }
  return sorted;
};

const ariaSortAttr = (
  canSort: boolean,
  sorted: false | SortDirection,
): "ascending" | "descending" | "none" | undefined => {
  if (!canSort) {
    return undefined;
  }
  if (sorted === "asc") {
    return "ascending";
  }
  if (sorted === "desc") {
    return "descending";
  }
  return "none";
};

const selectedAttr = (selected: boolean): true | undefined => {
  if (selected) {
    return true;
  }
  return undefined;
};

const HeaderCellView = <TData,>(props: {
  readonly header: Header<TData, unknown>;
}): JSX.Element => {
  const canSort = (): boolean => props.header.column.getCanSort();
  const activate = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    props.header.column.getToggleSortingHandler()?.(event);
  };
  return (
    <div
      aria-sort={ariaSortAttr(canSort(), props.header.column.getIsSorted())}
      class={styles.headerCell}
      data-column-id={props.header.column.id}
      data-part="header-cell"
      data-sortable={boolAttr(canSort())}
      data-sort-direction={sortDirectionAttr(props.header.column.getIsSorted())}
      onClick={(event) => props.header.column.getToggleSortingHandler()?.(event)}
      onKeyDown={activate}
      role="columnheader"
      style={columnSizeStyle(props.header.getSize())}
      tabindex={sortableTabIndex(canSort())}
    >
      <Show when={!props.header.isPlaceholder}>
        {flexRender(props.header.column.columnDef.header, props.header.getContext())}
      </Show>
    </div>
  );
};

const HeaderView = <TData,>(props: {
  readonly table: Table<TData>;
  readonly sticky: boolean;
}): JSX.Element => (
  <div
    class={styles.header}
    data-part="header"
    data-sticky={boolAttr(props.sticky)}
    role="rowgroup"
  >
    <For each={props.table.getHeaderGroups()}>
      {(headerGroup) => (
        <div
          class={styles.headerRow}
          data-part="header-row"
          role="row"
          style={tableWidthStyle(props.table.getTotalSize())}
        >
          <For each={headerGroup.headers}>{(header) => <HeaderCellView header={header} />}</For>
        </div>
      )}
    </For>
  </div>
);

const RowView = <TData,>(props: {
  readonly row: Row<TData> | undefined;
  readonly index: number;
  readonly size: number;
  readonly start: number;
  readonly tableWidth: number;
  readonly onRowClick: ((row: Row<TData>) => void) | undefined;
}): JSX.Element => (
  <Show when={props.row}>
    {(row) => (
      <div
        class={styles.row}
        data-index={props.index}
        data-part="row"
        data-selected={selectedAttr(row().getIsSelected())}
        onClick={() => props.onRowClick?.(row())}
        role="row"
        style={{
          height: `${props.size}px`,
          ...tableWidthStyle(props.tableWidth),
          transform: `translateY(${props.start}px)`,
        }}
      >
        <For each={row().getVisibleCells()}>
          {(cell) => (
            <div
              class={styles.cell}
              data-column-id={cell.column.id}
              data-part="cell"
              role="gridcell"
              style={columnSizeStyle(cell.column.getSize())}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          )}
        </For>
      </div>
    )}
  </Show>
);

const BodyView = <TData,>(props: {
  readonly table: Table<TData>;
  readonly virtualizer: Virtualizer<HTMLDivElement, Element>;
  readonly onRowClick: ((row: Row<TData>) => void) | undefined;
}): JSX.Element => (
  <div
    class={styles.rowsViewport}
    data-part="body"
    role="rowgroup"
    style={{ height: `${props.virtualizer.getTotalSize()}px` }}
  >
    <For each={props.virtualizer.getVirtualItems()}>
      {(virtualItem) => (
        <RowView
          index={virtualItem.index}
          onRowClick={props.onRowClick}
          row={props.table.getRowModel().rows[virtualItem.index]}
          size={virtualItem.size}
          start={virtualItem.start}
          tableWidth={props.table.getTotalSize()}
        />
      )}
    </For>
  </div>
);

export const VirtualizedDataTable = <TData,>(
  props: VirtualizedDataTableProps<TData>,
): JSX.Element => {
  let scrollRef: HTMLDivElement | undefined = undefined;
  /*
   * The getScrollElement thunk must stay lazy: the virtualizer calls it after
   * mount, by which point the ref is assigned. Do not read scrollRef eagerly.
   */
  const { table, virtualizer } = useVirtualTable(props, () => scrollRef ?? null);

  return (
    <div class={joinClass(styles.root, props.class)} data-part="root">
      <div
        aria-colcount={table.getVisibleLeafColumns().length}
        aria-rowcount={table.getRowModel().rows.length + HEADER_ROW_COUNT}
        class={styles.scrollContainer}
        data-part="scroll"
        ref={(el) => {
          scrollRef = el;
        }}
        role="grid"
      >
        <HeaderView sticky={props.stickyHeader?.() ?? true} table={table} />
        <BodyView onRowClick={props.onRowClick} table={table} virtualizer={virtualizer} />
      </div>
    </div>
  );
};

export default VirtualizedDataTable;
