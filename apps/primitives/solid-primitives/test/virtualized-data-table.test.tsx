import { render } from "solid-js/web";
import { describe, expect, it } from "vitest";

import { VirtualizedDataTable } from "../src";

import type { ColumnDef, RowSelectionState, SortingState } from "@tanstack/solid-table";

interface Row {
  id: number;
  name: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

const sizedColumns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID", size: 72 },
  { accessorKey: "name", header: "Name", size: 224 },
];

// Memoised so repeated reads return the same array reference. TanStack Table
// requires a stable data reference; a fresh array per read causes an infinite
// re-render loop.
const dataCache = new Map<number, Row[]>();
const makeData = (n: number): Row[] => {
  const cached = dataCache.get(n);
  if (cached) {
    return cached;
  }
  const rows = Array.from({ length: n }, (_, i) => ({ id: i, name: `Row ${i}` }));
  dataCache.set(n, rows);
  return rows;
};

const withLayout = (height: number, rowHeight: number): (() => void) => {
  const origRect = HTMLElement.prototype.getBoundingClientRect;
  const origOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
  HTMLElement.prototype.getBoundingClientRect = function (): DOMRect {
    return {
      height,
      width: 600,
      top: 0,
      left: 0,
      right: 600,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;
  };
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => rowHeight,
  });
  return () => {
    HTMLElement.prototype.getBoundingClientRect = origRect;
    if (origOffset) Object.defineProperty(HTMLElement.prototype, "offsetHeight", origOffset);
  };
};

describe("VirtualizedDataTable", () => {
  it("renders one header cell per column", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(5)} columns={() => columns} />,
      host,
    );
    const headers = host.querySelectorAll('[data-part="header-cell"]');
    expect(headers.length).toBe(2);
    expect(headers[0]?.textContent).toBe("ID");
    expect(headers[1]?.textContent).toBe("Name");
    dispose();
    host.remove();
  });

  it("applies the same column sizes to headers and body cells", () => {
    const restore = withLayout(400, 35);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(5)} columns={() => sizedColumns} />,
      host,
    );
    const headers = host.querySelectorAll<HTMLElement>('[data-part="header-cell"]');
    const firstRowCells = host.querySelectorAll<HTMLElement>(
      '[data-part="row"]:first-of-type [data-part="cell"]',
    );
    expect(headers[0]?.dataset.columnId).toBe("id");
    expect(firstRowCells[0]?.dataset.columnId).toBe("id");
    expect(headers[0]?.style.width).toBe("72px");
    expect(firstRowCells[0]?.style.width).toBe("72px");
    expect(headers[1]?.dataset.columnId).toBe("name");
    expect(firstRowCells[1]?.dataset.columnId).toBe("name");
    expect(headers[1]?.style.width).toBe("224px");
    expect(firstRowCells[1]?.style.width).toBe("224px");
    dispose();
    host.remove();
    restore();
  });

  it("renders virtual rows for the data", () => {
    const restore = withLayout(400, 35);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(1000)} columns={() => columns} />,
      host,
    );
    const renderedRows = host.querySelectorAll('[data-part="row"]');
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(1000);
    dispose();
    host.remove();
    restore();
  });

  it("fires onSortingChange with the resolved value when a sortable header is clicked", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const seen: SortingState[] = [];
    const dispose = render(
      () => (
        <VirtualizedDataTable
          data={() => makeData(5)}
          columns={() => columns}
          onSortingChange={(s) => seen.push(s)}
        />
      ),
      host,
    );
    const idHeader = host.querySelector('[data-part="header-cell"]') as HTMLElement;
    idHeader.click();
    expect(seen.length).toBe(1);
    expect(seen[0]).toEqual([{ id: "id", desc: false }]);
    dispose();
    host.remove();
  });

  it("respects a controlled sorting accessor (sorts ascending by name)", () => {
    const restore = withLayout(400, 35);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const data: Row[] = [
      { id: 2, name: "Beta" },
      { id: 1, name: "Alpha" },
    ];
    const dispose = render(
      () => (
        <VirtualizedDataTable
          data={() => data}
          columns={() => columns}
          sorting={() => [{ id: "name", desc: false }]}
        />
      ),
      host,
    );
    const firstCellOfFirstRow = host.querySelector(
      '[data-part="row"] [data-part="cell"]:nth-child(2)',
    );
    expect(firstCellOfFirstRow?.textContent).toBe("Alpha");
    dispose();
    host.remove();
    restore();
  });

  it("fires onRowClick with the clicked row", () => {
    const restore = withLayout(400, 35);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const clicked: number[] = [];
    const dispose = render(
      () => (
        <VirtualizedDataTable
          data={() => makeData(50)}
          columns={() => columns}
          onRowClick={(row) => clicked.push(row.original.id)}
        />
      ),
      host,
    );
    const firstRow = host.querySelector('[data-part="row"]') as HTMLElement;
    firstRow.click();
    expect(clicked).toEqual([0]);
    dispose();
    host.remove();
    restore();
  });

  it("fires onRowSelectionChange with the resolved selection", () => {
    const restore = withLayout(400, 35);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const selections: RowSelectionState[] = [];
    const selCol: ColumnDef<Row> = {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
        />
      ),
    };
    const dispose = render(
      () => (
        <VirtualizedDataTable
          data={() => makeData(10)}
          columns={() => [selCol, ...columns]}
          onRowSelectionChange={(s) => selections.push(s)}
        />
      ),
      host,
    );
    const firstCheckbox = host.querySelector(
      '[data-part="row"] input[type="checkbox"]',
    ) as HTMLInputElement;
    firstCheckbox.click();
    expect(selections.length).toBe(1);
    expect(selections[0]).toEqual({ "0": true });
    dispose();
    host.remove();
    restore();
  });

  it("exposes ARIA grid roles", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(5)} columns={() => columns} />,
      host,
    );
    expect(host.querySelector('[role="grid"]')).toBeTruthy();
    expect(host.querySelectorAll('[role="columnheader"]').length).toBe(2);
    expect(host.querySelectorAll('[role="rowgroup"]').length).toBe(2);
    dispose();
    host.remove();
  });

  it("reflects the full row/column count via aria-rowcount/aria-colcount", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(5)} columns={() => columns} />,
      host,
    );
    const grid = host.querySelector('[role="grid"]');
    // header row (1) + body rows (5)
    expect(grid?.getAttribute("aria-rowcount")).toBe("6");
    expect(grid?.getAttribute("aria-colcount")).toBe("2");
    dispose();
    host.remove();
  });

  it("sets aria-sort on a column header (none → sorted after activation)", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const dispose = render(
      () => <VirtualizedDataTable data={() => makeData(5)} columns={() => columns} />,
      host,
    );
    const idHeader = host.querySelector('[role="columnheader"]') as HTMLElement;
    expect(idHeader.getAttribute("aria-sort")).toBe("none");
    idHeader.click();
    expect(["ascending", "descending"]).toContain(idHeader.getAttribute("aria-sort"));
    dispose();
    host.remove();
  });

  it("activates sort via the Enter key on a focusable header", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const seen: number[] = [];
    const dispose = render(
      () => (
        <VirtualizedDataTable
          data={() => makeData(5)}
          columns={() => columns}
          onSortingChange={() => seen.push(1)}
        />
      ),
      host,
    );
    const idHeader = host.querySelector('[role="columnheader"]') as HTMLElement;
    expect(idHeader.getAttribute("tabindex")).toBe("0");
    idHeader.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(seen.length).toBe(1);
    dispose();
    host.remove();
  });
});
