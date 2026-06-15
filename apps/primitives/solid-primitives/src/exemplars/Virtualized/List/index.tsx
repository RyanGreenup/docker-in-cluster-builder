import { QueryClient, QueryClientProvider, createQuery } from "@tanstack/solid-query";
import { createVirtualizer } from "@tanstack/solid-virtual";
import {
  createEffect,
  createSignal,
  onCleanup,
  mergeProps,
  Show,
  type Accessor,
  type JSX,
} from "solid-js";

import Slider from "../../Slider";
import { VirtualRows } from "./rows";

const ESTIMATED_ROW_HEIGHT_PX = 35;
const DEFAULT_OVERSCAN = 4;
const DEFAULT_ITEM_COUNT = 5;
const MAX_ITEM_COUNT = 50;
const DEBOUNCE_MS = 80;
const ASYNC_ITEM_COUNT = 1000;
const MOCK_FETCH_DELAY_MS = 800;

const DEBUG_OUTER: JSX.CSSProperties = {
  background: "rgba(59, 130, 246, 0.15)",
  border: "2px solid rgba(29, 78, 216, 0.8)",
};

const outerDebugStyle = (debug?: boolean): JSX.CSSProperties => {
  if (debug !== true) {
    return {};
  }
  return DEBUG_OUTER;
};

const createDebouncedSignal = <TValue,>(
  source: Accessor<TValue>,
  delayMs: number,
): Accessor<TValue> => {
  const [debounced, setDebounced] = createSignal<TValue>(source());
  createEffect(() => {
    const next = source();
    const timer = setTimeout(() => setDebounced(() => next), delayMs);
    onCleanup(() => clearTimeout(timer));
  });
  return debounced;
};

// ─── VirtualizedList ───────────────────────────────────────────────────────

interface VirtualizedListProps {
  /** Reactive total item count — wire directly to a query or signal. */
  count: Accessor<number>;
  /** Called for each visible row inside a fine-grained reactive scope. */
  renderItem: (index: number) => JSX.Element;
  /** Height of the scroll container. Defaults to `'100%'`. */
  height?: string;
  /** Per-row size estimate in px. Defaults to a fixed 35 px. */
  estimateSize?: (index: number) => number;
  /** Rows rendered above/below the viewport to smooth fast scrolling. */
  overscan?: number;
  /**
   * Measure each rendered row's real height instead of trusting the estimate.
   * Use for genuinely dynamic content; rows then size to their own content, so
   * `estimateSize` only seeds the initial guess. Leave off for known heights.
   */
  measureElement?: boolean;
  /** Notified with the live count of rows mounted in the DOM. */
  onVisibleItemsChange?: (visibleCount: number) => void;
  /** Visualise container boundaries with primary debug colours. */
  debug?: boolean;
}

export const VirtualizedList = (rawProps: VirtualizedListProps): JSX.Element => {
  const props = mergeProps(
    { estimateSize: () => ESTIMATED_ROW_HEIGHT_PX, height: "100%", overscan: DEFAULT_OVERSCAN },
    rawProps,
  );

  // eslint-disable-next-line init-declarations, no-unassigned-vars
  let parentRef!: HTMLDivElement;

  const rowVirtualizer = createVirtualizer({
    get count() {
      return props.count();
    },
    estimateSize: (index) => props.estimateSize(index),
    getScrollElement: () => parentRef,
    get overscan() {
      return props.overscan;
    },
  });

  // Report the live mounted-row count without polling the DOM.
  createEffect(() => props.onVisibleItemsChange?.(rowVirtualizer.getVirtualItems().length));

  // Hand rows a measuring ref only when the caller opts in.
  const measureRef = (): ((el: Element) => void) | undefined => {
    if (props.measureElement !== true) {
      return undefined;
    }
    return (el) => rowVirtualizer.measureElement(el);
  };

  return (
    <div
      ref={parentRef}
      style={{ ...outerDebugStyle(props.debug), height: props.height, overflow: "auto" }}
    >
      <VirtualRows
        debug={props.debug}
        measureElement={measureRef()}
        renderItem={props.renderItem}
        totalSize={() => rowVirtualizer.getTotalSize()}
        virtualItems={() => rowVirtualizer.getVirtualItems()}
      />
    </div>
  );
};

// ─── Example — synchronous ─────────────────────────────────────────────────

const syncRenderItem = (index: number): JSX.Element => <>Row {index}</>;

// ─── Example — async (TanStack Query, paginated) ──────────────────────────
//
// Items are fetched in pages of PAGE_SIZE. Each visible row is its own Solid
// Component so createQuery runs in a proper reactive scope — the virtualizer
// Only mounts visible rows, so only the pages covering the current viewport
// Are ever requested.
//
// To preload the NEXT page before the user reaches it, call:
//   AsyncQueryClient.prefetchQuery({
//     QueryKey: ['async-page', nextPage],
//     QueryFn:  () => fetchPage(nextPage),
//   })
// From an onScroll handler or a createEffect watching the last visible index.
// This has INTENTIONALLY been ommitted to show the loading to motivate the idea

const PAGE_SIZE = 50;

interface MockItem {
  id: number;
  label: string;
}

interface MockPage {
  items: MockItem[];
  page: number;
}

const asyncQueryClient = new QueryClient();

const fetchPage = async (page: number): Promise<MockPage> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_FETCH_DELAY_MS);
  });
  const start = page * PAGE_SIZE;
  return {
    items: Array.from({ length: PAGE_SIZE }, (_item, offset) => ({
      id: start + offset,
      label: `Async Item ${start + offset}`,
    })),
    page,
  };
};

// Each row is a component so createQuery lives in its own reactive scope.
// Rows that scroll out of view are unmounted → their queries go idle.
const AsyncItem = (props: { index: number }): JSX.Element => {
  const page = (): number => Math.floor(props.index / PAGE_SIZE);
  const offset = (): number => props.index % PAGE_SIZE;

  const query = createQuery(() => ({
    queryFn: () => fetchPage(page()),
    queryKey: ["async-page", page()],
  }));

  return (
    <Show when={query.data} fallback={<>Loading…</>}>
      {(data) => <>{data().items[offset()]?.label ?? `Row ${props.index}`}</>}
    </Show>
  );
};

const asyncRenderItem = (index: number): JSX.Element => <AsyncItem index={index} />;

const AsyncVirtualizedList = (): JSX.Element => {
  const [count] = createSignal(ASYNC_ITEM_COUNT);
  return <VirtualizedList count={count} renderItem={asyncRenderItem} height="400px" />;
};

// ─── VirtualizedListExample ────────────────────────────────────────────────

export const VirtualizedListExample = (): JSX.Element => {
  const [itemCount, setItemCount] = createSignal(DEFAULT_ITEM_COUNT);
  const debouncedCount = createDebouncedSignal(itemCount, DEBOUNCE_MS);

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <section>
        <p>Synchronous — items available immediately.</p>
        <label>Items: {itemCount()}</label>
        <Slider count={itemCount} onCount={setItemCount} min={1} max={MAX_ITEM_COUNT} />
        <VirtualizedList count={debouncedCount} renderItem={syncRenderItem} height="400px" debug />
      </section>

      <section>
        <p>Asynchronous — data fetched via TanStack Query (800 ms simulated delay).</p>
        <QueryClientProvider client={asyncQueryClient}>
          <AsyncVirtualizedList />
        </QueryClientProvider>
      </section>
    </div>
  );
};

export default VirtualizedListExample;
