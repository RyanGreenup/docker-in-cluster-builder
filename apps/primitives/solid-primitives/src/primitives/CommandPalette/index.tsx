import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  type Accessor,
  type Component,
} from "solid-js";

import { Dialog, joinClass } from "../Dialog";
import * as styles from "./style.css";

import type { FileHit, FileSearchProvider } from "./types";

export type { FileHit, FileSearchProvider } from "./types";

const DEFAULT_MAX_RESULTS = 50;
const FIRST_INDEX = 0;
const INDEX_STEP = 1;

/** Props for {@link CommandPalette}. */
export interface CommandPaletteProps {
  readonly open: Accessor<boolean>;
  readonly onOpenChange: (open: boolean) => void;
  /** Search backend; see {@link FileSearchProvider}. */
  readonly provider: FileSearchProvider;
  /** Called with the chosen hit; the caller decides whether to close. */
  readonly onSelect: (hit: FileHit) => void;
  readonly placeholder?: string;
  /** Cap on rendered results. Defaults to 50. */
  readonly maxResults?: number;
  /** Shown when a query yields no hits. */
  readonly emptyMessage?: string;
  readonly class?: string;
}

interface PaletteState {
  readonly query: Accessor<string>;
  readonly setQuery: (value: string) => void;
  readonly activeIndex: Accessor<number>;
  readonly setActiveIndex: (index: number) => void;
  readonly visible: Accessor<FileHit[]>;
  readonly moveActive: (delta: number) => void;
  readonly selectActive: () => void;
}

const createPaletteState = (
  provider: Accessor<FileSearchProvider>,
  maxResults: Accessor<number>,
  onSelect: (hit: FileHit) => void,
): PaletteState => {
  const [query, setQuery] = createSignal("");
  const [activeIndex, setActiveIndex] = createSignal(FIRST_INDEX);

  // The source carries the query inside an object because a bare "" (the
  // Initial query) is falsy and would suppress the first fetch entirely.
  const [hits] = createResource(
    () => ({ search: provider().search.bind(provider()), text: query() }),
    ({ search, text }) => search(text),
    { initialValue: [] },
  );
  const visible = (): FileHit[] => hits.latest.slice(FIRST_INDEX, maxResults());
  const lastIndex = (): number => Math.max(FIRST_INDEX, visible().length - INDEX_STEP);

  // Keep the highlighted row inside the result window as results change.
  createEffect(() => {
    if (activeIndex() > lastIndex()) {
      setActiveIndex(lastIndex());
    }
  });

  return {
    activeIndex,
    moveActive: (delta) => {
      setActiveIndex(Math.min(Math.max(activeIndex() + delta, FIRST_INDEX), lastIndex()));
    },
    query,
    selectActive: () => {
      const hit = visible()[activeIndex()];
      if (hit !== undefined) {
        onSelect(hit);
      }
    },
    setActiveIndex,
    setQuery,
    visible,
  };
};

const PaletteInput: Component<{
  readonly state: PaletteState;
  readonly placeholder?: string;
}> = (props) => {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      props.state.moveActive(INDEX_STEP);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      props.state.moveActive(-INDEX_STEP);
    } else if (event.key === "Enter") {
      event.preventDefault();
      props.state.selectActive();
    }
  };

  return (
    <input
      aria-activedescendant={`palette-item-${props.state.activeIndex()}`}
      aria-autocomplete="list"
      aria-controls="palette-list"
      aria-expanded="true"
      aria-label="Search files"
      autocomplete="off"
      class={styles.input}
      data-part="palette-input"
      onInput={(event) => {
        props.state.setQuery(event.currentTarget.value);
        props.state.setActiveIndex(FIRST_INDEX);
      }}
      onKeyDown={onKeyDown}
      placeholder={props.placeholder ?? "Search files by name"}
      role="combobox"
      spellcheck={false}
      type="text"
      value={props.state.query()}
    />
  );
};

const PaletteResults: Component<{
  readonly state: PaletteState;
  readonly emptyMessage: string;
}> = (props) => (
  <Show
    when={props.state.visible().length > FIRST_INDEX}
    fallback={
      <div data-part="palette-empty" role="status">
        {props.emptyMessage}
      </div>
    }
  >
    <ul class={styles.list} data-part="palette-list" id="palette-list" role="listbox">
      <For each={props.state.visible()}>
        {(hit, index) => (
          <li
            aria-selected={index() === props.state.activeIndex()}
            class={styles.item}
            data-active={index() === props.state.activeIndex() ? "" : undefined}
            data-part="palette-item"
            id={`palette-item-${index()}`}
            onClick={() => {
              props.state.setActiveIndex(index());
              props.state.selectActive();
            }}
            onMouseMove={() => props.state.setActiveIndex(index())}
            role="option"
          >
            <span data-part="palette-item-name">{hit.name}</span>
            <span data-part="palette-item-path">{hit.path}</span>
          </li>
        )}
      </For>
    </ul>
  </Show>
);

const PaletteBody: Component<{
  readonly provider: FileSearchProvider;
  readonly onSelect: (hit: FileHit) => void;
  readonly placeholder?: string;
  readonly maxResults: number;
  readonly emptyMessage: string;
}> = (props) => {
  const state = createPaletteState(
    () => props.provider,
    () => props.maxResults,
    (hit) => props.onSelect(hit),
  );

  return (
    <>
      <PaletteInput placeholder={props.placeholder} state={state} />
      <PaletteResults emptyMessage={props.emptyMessage} state={state} />
    </>
  );
};

/**
 * Modal fuzzy-find palette (the Cmd/Ctrl+P pattern). Composes {@link Dialog}
 * for the modal behaviour (focus trap, Escape and outside-click dismissal) and
 * renders an input plus a ranked result list fed by a {@link FileSearchProvider}.
 * ArrowUp/ArrowDown move the highlight, Enter selects, Escape closes.
 *
 * The palette is search-backend agnostic: pair it with
 * {@link createFuseFileSearchProvider} or any custom provider.
 */
export const CommandPalette: Component<CommandPaletteProps> = (props) => (
  <Dialog.Root open={props.open()} onOpenChange={props.onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content
        aria-label="Command palette"
        class={joinClass(styles.root, props.class)}
        data-part="palette-root"
      >
        <PaletteBody
          emptyMessage={props.emptyMessage ?? "No matching files"}
          maxResults={props.maxResults ?? DEFAULT_MAX_RESULTS}
          onSelect={props.onSelect}
          placeholder={props.placeholder}
          provider={props.provider}
        />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
