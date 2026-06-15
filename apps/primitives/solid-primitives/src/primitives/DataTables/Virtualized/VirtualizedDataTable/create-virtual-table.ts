import {
  createSolidTable,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
  type Updater,
} from "@tanstack/solid-table";
import { createVirtualizer, type Virtualizer } from "@tanstack/solid-virtual";
import { createEffect, createSignal, on, type Accessor } from "solid-js";

const DEFAULT_ESTIMATE_SIZE = 35;
const DEFAULT_OVERSCAN = 5;

export interface VirtualizedDataTableProps<TData> {
  /*
   * The data and columns accessors MUST return stable array references —
   * TanStack Table compares them by reference, so returning a fresh array on
   * every read (e.g. `() => rows.map(...)` or a spread copy) causes an infinite
   * re-render loop. Build each array once (outside the accessor) and return the
   * same reference.
   */
  readonly data: Accessor<TData[]>;
  readonly columns: Accessor<ColumnDef<TData>[]>;

  readonly estimateSize?: Accessor<number>;
  readonly overscan?: Accessor<number>;
  readonly stickyHeader?: Accessor<boolean>;

  readonly enableSorting?: Accessor<boolean>;
  readonly sorting?: Accessor<SortingState>;
  readonly defaultSorting?: SortingState;
  readonly onSortingChange?: (sorting: SortingState) => void;

  readonly columnFilters?: Accessor<ColumnFiltersState>;
  readonly defaultColumnFilters?: ColumnFiltersState;
  readonly onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

  readonly globalFilter?: Accessor<string>;
  readonly defaultGlobalFilter?: string;
  readonly onGlobalFilterChange?: (value: string) => void;

  readonly rowSelection?: Accessor<RowSelectionState>;
  readonly defaultRowSelection?: RowSelectionState;
  readonly onRowSelectionChange?: (selection: RowSelectionState) => void;

  readonly onRowClick?: (row: Row<TData>) => void;

  readonly class?: string;
}

interface ControlledState<TValue> {
  readonly value: Accessor<TValue>;
  readonly setInternal: (updater: Updater<TValue>) => void;
}

/*
 * A controlled-or-uncontrolled signal: reads the controlled accessor when one
 * is supplied, otherwise its own internal signal. Consumer notification fires
 * via on() against the internal signal, so it works in both modes and does not
 * depend on where the signal is read. `controlled` and `notify` are thunks so
 * the underlying prop reads stay lazy (inside the value accessor / effect),
 * which keeps reactivity intact.
 */
const createControlledState = <TValue>(
  controlled: () => TValue | undefined,
  initial: TValue,
  notify: (value: TValue) => void,
): ControlledState<TValue> => {
  const [internal, setInternalSignal] = createSignal<TValue>(initial);
  const value = (): TValue => controlled() ?? internal();
  const setInternal = (updater: Updater<TValue>): void => {
    setInternalSignal((prev) => functionalUpdate(updater, prev));
  };
  createEffect(on(internal, (next) => notify(next), { defer: true }));
  return { setInternal, value };
};

interface TableStates {
  readonly sorting: ControlledState<SortingState>;
  readonly columnFilters: ControlledState<ColumnFiltersState>;
  readonly globalFilter: ControlledState<string>;
  readonly rowSelection: ControlledState<RowSelectionState>;
}

const createTableStates = <TData>(props: VirtualizedDataTableProps<TData>): TableStates => ({
  columnFilters: createControlledState<ColumnFiltersState>(
    () => props.columnFilters?.(),
    props.defaultColumnFilters ?? [],
    (value) => props.onColumnFiltersChange?.(value),
  ),
  globalFilter: createControlledState<string>(
    () => props.globalFilter?.(),
    props.defaultGlobalFilter ?? "",
    (value) => props.onGlobalFilterChange?.(value),
  ),
  rowSelection: createControlledState<RowSelectionState>(
    () => props.rowSelection?.(),
    props.defaultRowSelection ?? {},
    (value) => props.onRowSelectionChange?.(value),
  ),
  sorting: createControlledState<SortingState>(
    () => props.sorting?.(),
    props.defaultSorting ?? [],
    (value) => props.onSortingChange?.(value),
  ),
});

const createDataTable = <TData>(
  props: VirtualizedDataTableProps<TData>,
  states: TableStates,
): Table<TData> =>
  createSolidTable<TData>({
    get columns() {
      return props.columns();
    },
    get data() {
      return props.data();
    },
    get enableSorting() {
      return props.enableSorting?.() ?? true;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: states.columnFilters.setInternal,
    onGlobalFilterChange: states.globalFilter.setInternal,
    onRowSelectionChange: states.rowSelection.setInternal,
    onSortingChange: states.sorting.setInternal,
    sortDescFirst: false,
    state: {
      get columnFilters() {
        return states.columnFilters.value();
      },
      get globalFilter() {
        return states.globalFilter.value();
      },
      get rowSelection() {
        return states.rowSelection.value();
      },
      get sorting() {
        return states.sorting.value();
      },
    },
  });

export interface VirtualTable<TData> {
  readonly table: Table<TData>;
  readonly virtualizer: Virtualizer<HTMLDivElement, Element>;
}

export const useVirtualTable = <TData>(
  props: VirtualizedDataTableProps<TData>,
  getScrollElement: () => HTMLDivElement | null,
): VirtualTable<TData> => {
  const states = createTableStates(props);
  const table = createDataTable(props, states);
  const virtualizer = createVirtualizer({
    get count() {
      return table.getRowModel().rows.length;
    },
    estimateSize: () => props.estimateSize?.() ?? DEFAULT_ESTIMATE_SIZE,
    getScrollElement,
    get overscan() {
      return props.overscan?.() ?? DEFAULT_OVERSCAN;
    },
  });

  return { table, virtualizer };
};
