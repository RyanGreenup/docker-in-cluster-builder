import AlignJustify from "lucide-solid/icons/align-justify";
import ChevronLeft from "lucide-solid/icons/chevron-left";
import Folder from "lucide-solid/icons/folder";
import Tag from "lucide-solid/icons/tag";
import XIcon from "lucide-solid/icons/x";
import { For, Show, type JSXElement } from "solid-js";

import {
  header,
  titleBlock,
  appName,
  modeTag,
  crumb,
  crumbPrefix,
  crumbSeg,
  crumbSegTail,
  crumbSep,
  viewsGroup,
  viewBtn,
  viewBtnActive,
  iconBtn,
} from "./RangerModal.css/header.css";

import type { ViewMode, VaultFolder } from "./rangerTypes";

interface RangerHeaderProps {
  path: VaultFolder[];
  view: ViewMode;
  onViewChange: (vm: ViewMode) => void;
  onNavigate: (id: string) => void;
  onClose: () => void;
  canBack: boolean;
}

const ICON_SM = 11;
const ICON_MD = 13;
const ICON_LG = 14;
const SECOND_FROM_END = 2;
const LAST_INDEX_OFFSET = 1;

const VIEWS: { id: ViewMode; label: string; Icon: () => JSXElement }[] = [
  { Icon: () => <Folder size={ICON_SM} />, id: "folders", label: "Folders" },
  { Icon: () => <AlignJustify size={ICON_SM} />, id: "all", label: "All" },
  { Icon: () => <Tag size={ICON_SM} />, id: "tags", label: "Tags" },
];

const getCrumbClass = (isTail: boolean): string => {
  if (isTail) {
    return crumbSegTail;
  }
  return crumbSeg;
};

const getViewButtonClass = (active: boolean): string => {
  if (active) {
    return `${viewBtn} ${viewBtnActive}`;
  }
  return viewBtn;
};

const BreadcrumbNav = (props: {
  path: VaultFolder[];
  onNavigate: (id: string) => void;
}): JSXElement => (
  <div class={crumb}>
    <span class={crumbPrefix}>~/</span>
    <For each={props.path}>
      {(seg, idx) => (
        <>
          <span
            class={getCrumbClass(idx() === props.path.length - LAST_INDEX_OFFSET)}
            onClick={() => props.onNavigate(seg.id)}
          >
            {seg.name}
          </span>
          <Show when={idx() < props.path.length - LAST_INDEX_OFFSET}>
            <span class={crumbSep}>/</span>
          </Show>
        </>
      )}
    </For>
  </div>
);

export const RangerHeader = (props: RangerHeaderProps): JSXElement => (
  <div class={header}>
    <div class={titleBlock}>
      <Folder size={ICON_MD} />
    </div>
    <span class={appName}>
      Browse<span class={modeTag}>⌘O</span>
    </span>

    <button
      class={iconBtn}
      disabled={!props.canBack}
      onClick={() => {
        const parent = props.path[props.path.length - SECOND_FROM_END];
        if (props.canBack && parent !== undefined) {
          props.onNavigate(parent.id);
        }
      }}
      title="Up one level (h)"
    >
      <ChevronLeft size={ICON_LG} />
    </button>

    <BreadcrumbNav path={props.path} onNavigate={props.onNavigate} />

    <div class={viewsGroup}>
      <For each={VIEWS}>
        {(vw) => (
          <button
            class={getViewButtonClass(props.view === vw.id)}
            onClick={() => props.onViewChange(vw.id)}
          >
            <vw.Icon />
            {vw.label}
          </button>
        )}
      </For>
    </div>

    <button class={iconBtn} onClick={() => props.onClose()} title="Close (Esc)">
      <XIcon size={ICON_LG} />
    </button>
  </div>
);
