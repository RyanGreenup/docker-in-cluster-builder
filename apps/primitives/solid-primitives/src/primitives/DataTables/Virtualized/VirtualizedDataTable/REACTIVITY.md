# VirtualizedDataTable — Reactivity Rules

Fine-grained SolidJS reactivity makes this table cheap to keep live. These rules
exist because TanStack Table owns its **own** reactive store; our job is to feed
it accessors correctly and never fight it. Each rule lists the symptom it prevents.

| #   | Rule                                                                                                                                                                                                | If you break it                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Pass props as **accessors**, thread them into TanStack via getters (`get data() { return props.data() }`). Never destructure props.                                                                 | The table never updates when inputs change (reactivity lost at the destructure).                           |
| 2   | `data` is a **plain array** exposed through a signal/memo accessor. **Never** pass a Solid `createStore` proxy as `data`.                                                                           | Two reactive systems fight over the same objects → stale rows, missed updates, or runaway invalidation.    |
| 3   | `data`/`columns` accessors MUST return a **stable reference**. Build the array once; for derived data use `createMemo`. Never `() => rows.map(...)` inline.                                         | Infinite render loop — TanStack compares by reference, so a fresh array on every read re-triggers forever. |
| 4   | TanStack state (sorting / filters / globalFilter / selection) lives in **signals via getters**, mutated through `on*Change`. Read it back with `table.getState()`. Never mutate TanStack internals. | Sort/filter clicks do nothing (frozen), or state desyncs from the view.                                    |
| 5   | Each virtual row is its **own component** rendered with `flexRender`.                                                                                                                               | Per-row reactive scope is wrong; cell updates leak or miss.                                                |

## Fuse.js search

Fuse runs **upstream** of TanStack — it ranks the whole collection and returns
ordered results. Use `createFuseSearch(rows, options)`; its `results` accessor is
a `createMemo` (stable reference per query, honouring rule 3) and feeds straight
into `data`. Do **not** implement search as a TanStack `globalFilterFn` (a per-row
boolean throws Fuse's ranking away). TanStack then owns sorting + structured
column filters + virtualization on the matched subset.

```tsx
const search = createFuseSearch(() => allRows(), () => ({ keys: ["name"], threshold: 0.4 }))
// search.results() is a stable-per-query accessor — safe as `data`.
<VirtualizedDataTable data={() => search.results()} columns={() => columnDefs} />
```

## Bounded height

The scroll ancestor MUST have a bounded height. Without it the scroll element
grows to content height, every row renders, and virtualization is defeated (the
page hangs on large data). The primitive's `root` fills `100%` — give an ancestor
a real height.

---

> A reader-facing copy of these rules also lives in the docs site under
> `frontend/virtualized-list/reactivity`. Keep the two in sync when either changes.
