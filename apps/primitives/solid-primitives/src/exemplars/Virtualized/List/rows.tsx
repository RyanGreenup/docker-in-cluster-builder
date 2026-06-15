import { type VirtualItem } from "@tanstack/solid-virtual";
import { createMemo, For, splitProps, type JSX } from "solid-js";

const NO_OFFSET = 0;

const DEBUG_INNER: JSX.CSSProperties = {
  background: "rgba(239, 68, 68, 0.15)",
  border: "2px solid rgba(185, 28, 28, 0.8)",
};

const innerDebugStyle = (debug?: boolean): JSX.CSSProperties => {
  if (debug !== true) {
    return {};
  }
  return DEBUG_INNER;
};

// ─── ListItem ──────────────────────────────────────────────────────────────

interface ListItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> {
  readonly style?: JSX.CSSProperties;
}

const ListItem = (props: ListItemProps): JSX.Element => {
  const [local, divProps] = splitProps(props, ["style"]);
  return <div {...divProps} style={{ ...local.style, overflow: "hidden", width: "100%" }} />;
};

// ─── ListRow ───────────────────────────────────────────────────────────────

const rowHeight = (item: VirtualItem | undefined, measured: boolean): string | undefined => {
  if (measured) {
    return undefined;
  }
  return `${item?.size ?? NO_OFFSET}px`;
};

const rowRef = (
  measureElement: ((el: Element) => void) | undefined,
): ((el: HTMLDivElement) => void) | undefined => {
  if (measureElement === undefined) {
    return undefined;
  }
  return (el) => measureElement(el);
};

interface ListRowProps {
  index: number;
  item: () => VirtualItem | undefined;
  measureElement?: (el: Element) => void;
  renderItem: (index: number) => JSX.Element;
}

const ListRow = (props: ListRowProps): JSX.Element => (
  <ListItem
    ref={rowRef(props.measureElement)}
    data-index={props.index}
    style={{
      // Measured rows size to their own content.
      // Fixed-height rows keep the estimate so they never reflow.
      height: rowHeight(props.item(), props.measureElement !== undefined),
      left: 0,
      position: "absolute",
      top: 0,
      transform: `translateY(${props.item()?.start ?? NO_OFFSET}px)`,
    }}
  >
    {props.renderItem(props.index)}
  </ListItem>
);

// ─── VirtualRows ───────────────────────────────────────────────────────────

export interface VirtualRowsProps {
  debug?: boolean;
  /** When set, rows attach this ref so the virtualizer measures real heights. */
  measureElement?: (el: Element) => void;
  renderItem: (index: number) => JSX.Element;
  totalSize: () => number;
  virtualItems: () => VirtualItem[];
}

export const VirtualRows = (props: VirtualRowsProps): JSX.Element => {
  /*
   * Each scroll frame getVirtualItems() returns fresh objects; Solid's <For>
   * keys by reference, so iterating them directly would remount every visible
   * row (and its per-row createQuery scope) every frame. Keying by the numeric
   * index — which <For> compares by value — keeps rows mounted while visible,
   * so only rows entering or leaving the viewport actually mount or unmount.
   */
  const itemByIndex = createMemo(() => {
    const map = new Map<number, VirtualItem>();
    for (const item of props.virtualItems()) {
      map.set(item.index, item);
    }
    return map;
  });
  const visibleIndexes = (): number[] => props.virtualItems().map((item) => item.index);

  return (
    <div
      style={{
        ...innerDebugStyle(props.debug),
        height: `${props.totalSize()}px`,
        overflow: "hidden",
        position: "relative",
        transition: "height 0.4s ease-out",
        width: "100%",
      }}
    >
      <For each={visibleIndexes()}>
        {(index) => (
          <ListRow
            index={index}
            item={() => itemByIndex().get(index)}
            measureElement={props.measureElement}
            renderItem={props.renderItem}
          />
        )}
      </For>
    </div>
  );
};
