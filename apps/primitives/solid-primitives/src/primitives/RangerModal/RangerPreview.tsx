import FileText from "lucide-solid/icons/file-text";
import Folder from "lucide-solid/icons/folder";
import Link from "lucide-solid/icons/link";
import { For, Show, type JSXElement } from "solid-js";

import { col, colHead, colCount, list } from "./RangerModal.css/body.css";
import {
  previewCard,
  previewEmpty,
  preTitle,
  preAbstract,
  preGrid,
  preGridKey,
  preGridVal,
  preSectionLabel,
  preSectionCount,
  preTags,
  preBacklink,
  preSnippet,
} from "./RangerModal.css/preview.css";
import { row, rowIcon, rowName, rowTagDot, rowMeta, chevron } from "./RangerModal.css/rows.css";
import { isFolder, type VaultNode, type VaultFolder, type VaultNote } from "./rangerTypes";
import { tagColor } from "./tags";
import { rangerVars } from "./theme.css";

interface RangerPreviewProps {
  node: VaultNode | undefined;
  folderItems: VaultNode[] | undefined;
}

const ICON_SIZE = 13;
const LINK_ICON_SIZE = 11;
const FOLDER_PREVIEW_LIMIT = 40;
const RELATED_LIMIT = 4;
const EMPTY_COUNT = 0;
const SLICE_START = 0;

const asFolder = (node: VaultNode): VaultFolder | undefined =>
  isFolder(node) ? node : undefined;

const asNote = (node: VaultNode): VaultNote | undefined =>
  isFolder(node) ? undefined : node;

// ── Folder preview ────────────────────────────────────────────

const FolderPreview = (props: { node: VaultFolder; items: VaultNode[] }): JSXElement => (
  <div class={col}>
    <div class={colHead}>
      <span>{props.node.name}</span>
      <span class={colCount}>{props.items.length}</span>
    </div>
    <div class={list}>
      <Show when={props.items.length === EMPTY_COUNT}>
        <div class={previewEmpty}>empty folder</div>
      </Show>
      <For each={props.items.slice(SLICE_START, FOLDER_PREVIEW_LIMIT)}>
        {(item) => <FolderPreviewRow item={item} />}
      </For>
    </div>
  </div>
);

const FolderPreviewRow = (props: { item: VaultNode }): JSXElement => (
  <div class={row}>
    <div style={{ width: "10px" }} />
    <div class={rowIcon}>
      <Show when={isFolder(props.item)} fallback={<FileText size={ICON_SIZE} />}>
        <Folder size={ICON_SIZE} />
      </Show>
    </div>
    <div class={rowName}>
      <Show
        when={!isFolder(props.item) && props.item.tag !== undefined && props.item.tag !== "neutral"}
      >
        <span
          class={rowTagDot}
          style={{
            background: tagColor(asNote(props.item)?.tag).fg,
          }}
        />
      </Show>
      <span>{props.item.name}</span>
    </div>
    <div class={rowMeta}>
      <Show
        when={asFolder(props.item)}
        fallback={
          <Show when={asNote(props.item)}>{(note) => <span>{note().size}</span>}</Show>
        }
      >
        {(folder) => (
          <>
            <span>{folder().children.length}</span>
            <span class={chevron}>›</span>
          </>
        )}
      </Show>
    </div>
  </div>
);

// ── Note metadata grid ────────────────────────────────────────

const NoteMetaGrid = (props: { note: VaultNote }): JSXElement => (
  <div class={preGrid}>
    <div class={preGridKey}>Updated</div>
    <div class={preGridVal}>{props.note.updated}</div>
    <div class={preGridKey}>Size</div>
    <div class={preGridVal}>
      {props.note.size} · {props.note.words?.toLocaleString()} words
    </div>
    <div class={preGridKey}>Syntax</div>
    <div class={preGridVal}>{props.note.syntax}</div>
    <div class={preGridKey}>Backlinks</div>
    <div class={preGridVal}>{props.note.backlinks}</div>
  </div>
);

// ── Note tags section ─────────────────────────────────────────

const NoteTagsSection = (props: { note: VaultNote }): JSXElement => (
  <Show when={props.note.tags !== undefined && props.note.tags.length > EMPTY_COUNT}>
    <div>
      <div class={preSectionLabel}>Tags</div>
      <div class={preTags}>
        <For each={props.note.tags}>
          {(tag) => (
            <span
              style={{
                background: tagColor(props.note.tag).bg,
                "border-radius": rangerVars.radius.sm,
                color: tagColor(props.note.tag).fg,
                display: "inline-block",
                "font-family": rangerVars.font.mono,
                "font-size": rangerVars.text["2xs"],
                padding: "1px 6px",
              }}
            >
              #{tag}
            </span>
          )}
        </For>
      </div>
    </div>
  </Show>
);

// ── Note related section ──────────────────────────────────────

const NoteRelatedSection = (props: { note: VaultNote }): JSXElement => (
  <Show when={props.note.related !== undefined && props.note.related.length > EMPTY_COUNT}>
    <div>
      <div class={preSectionLabel}>
        Related
        <span class={preSectionCount}>{props.note.related?.length}</span>
      </div>
      <For each={props.note.related?.slice(SLICE_START, RELATED_LIMIT)}>
        {(rel) => (
          <div class={preBacklink}>
            <Link size={LINK_ICON_SIZE} />
            <span>{rel}</span>
          </div>
        )}
      </For>
    </div>
  </Show>
);

// ── Note preview ──────────────────────────────────────────────

const NotePreview = (props: { note: VaultNote }): JSXElement => (
  <div class={col}>
    <div class={colHead}>
      <span>Preview</span>
      <span class={colCount}>{props.note.syntax}</span>
    </div>
    <div class={previewCard}>
      <div class={preTitle}>{props.note.name}</div>
      <Show when={props.note.abstract !== undefined && props.note.abstract !== ""}>
        <div class={preAbstract}>{props.note.abstract}</div>
      </Show>
      <NoteMetaGrid note={props.note} />
      <NoteTagsSection note={props.note} />
      <NoteRelatedSection note={props.note} />
      <Show when={props.note.abstract !== undefined && props.note.abstract !== ""}>
        <div>
          <div class={preSectionLabel}>Excerpt</div>
          <div class={preSnippet}>{props.note.abstract}</div>
        </div>
      </Show>
    </div>
  </div>
);

// ── Public export ─────────────────────────────────────────────

export const RangerPreview = (props: RangerPreviewProps): JSXElement => (
  <Show
    when={props.node}
    fallback={
      <div class={col}>
        <div class={colHead}>
          <span>Preview</span>
        </div>
        <div class={previewEmpty}>no selection</div>
      </div>
    }
  >
    {(node) => (
      <Show
        when={asFolder(node())}
        fallback={
          <Show when={asNote(node())}>{(note) => <NotePreview note={note()} />}</Show>
        }
      >
        {(folder) => <FolderPreview node={folder()} items={props.folderItems ?? []} />}
      </Show>
    )}
  </Show>
);
