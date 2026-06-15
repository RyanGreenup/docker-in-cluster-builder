import { createComputed, createSignal, type Accessor, type Component } from "solid-js";
export { Button } from "./primitives/Button";
export { Carousel } from "./primitives/Carousel";
export * as carouselStyles from "./primitives/Carousel/style.css";
export type {
  AtLeastThree,
  AtLeastThreeImages,
  CarouselClassNames,
  CarouselDirection,
  CarouselImage,
  CarouselImagesProps,
  CarouselProps,
  CarouselSlidesProps,
} from "./primitives/Carousel";
export { Calendar } from "./primitives/Calendar";
export * as calendarStyles from "./primitives/Calendar/style.css";
export type {
  CalendarCellProps,
  CalendarCellTriggerProps,
  CalendarHeadCellProps,
  CalendarLabelProps,
  CalendarNavProps,
  CalendarRootProps,
  CalendarTableProps,
} from "./primitives/Calendar";
export { Dialog } from "./primitives/Dialog";
export * as dialogStyles from "./primitives/Dialog/style.css";
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogLabelProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTriggerProps,
} from "./primitives/Dialog";
export { Accordion, AccordionItem, Root } from "./primitives/Accordion";
export * as accordionStyles from "./primitives/Accordion/style.css";
export type {
  AccordionIcon,
  AccordionItemProps,
  AccordionSize,
  AccordionVariant,
} from "./primitives/Accordion";
export { CommandPalette } from "./primitives/CommandPalette";
export { createFuseFileSearchProvider } from "./primitives/CommandPalette/providers/fuse-file-search";
export * as commandPaletteStyles from "./primitives/CommandPalette/style.css";
export type { CommandPaletteProps } from "./primitives/CommandPalette";
export type { FileHit, FileSearchProvider } from "./primitives/CommandPalette/types";
export { VirtualizedDataTable } from "./primitives/DataTables/Virtualized/VirtualizedDataTable";
export type { VirtualizedDataTableProps } from "./primitives/DataTables/Virtualized/VirtualizedDataTable";
export {
  createFuseSearch,
  type FuseSearch,
} from "./primitives/DataTables/Virtualized/VirtualizedDataTable/create-fuse-search";
export * as virtualizedDataTableStyles from "./primitives/DataTables/Virtualized/VirtualizedDataTable/style.css";
export { TreeView, TreeNode, createTreeStore, createExemplar } from "./primitives/Tree";
export * as treeStyles from "./primitives/Tree/style.css";
export type {
  FlatStore,
  TreeNodeData,
  TreeNodeProps,
  TreeRecord,
  TreeStore,
  TreeViewProps,
} from "./primitives/Tree";
export {
  MdxRenderer,
  createMdxRenderer,
  type MdxModule,
  type MdxRendererProps,
} from "./primitives/MdxRenderer";
export { DashboardShell, useDashboardShell } from "./primitives/Layouts";
export { SidebarShell } from "./primitives/Layouts/SidebarShell";
export * as sidebarShellStyles from "./primitives/Layouts/SidebarShell/style.css";
export type {
  SidebarShellRootProps,
  SidebarShellSectionProps,
} from "./primitives/Layouts/SidebarShell";
export * as dashboardShellStyles from "./primitives/Layouts/DashboardShell/style.css";
export type {
  DashboardShellBottomBarProps,
  DashboardShellButtonProps,
  DashboardShellContextValue,
  DashboardShellMainProps,
  DashboardShellNavbarProps,
  DashboardShellNavItemProps,
  DashboardShellRootProps,
  DashboardShellScrimProps,
  DashboardShellSidebarProps,
  DashboardShellSlotProps,
  DrawerStateProps,
} from "./primitives/Layouts";
export { tokens, transition, vars } from "./styles/theme.css";
export { CodeMirrorEditor } from "./primitives/Editor/modes/CodeMirror/CodeMirrorEditor";
export { EditorContentProvider } from "./primitives/Editor/context/EditorContentContext";
export type { EditorContentContextValue } from "./primitives/Editor/context/EditorContentContext";
export {
  EditorSettingsProvider,
  useEditorSettings,
} from "./primitives/Editor/context/EditorSettingsContext";
export type {
  EditorMode,
  EditorSettingsContextValue,
} from "./primitives/Editor/context/EditorSettingsContext";
export { EditorShell } from "./primitives/Editor";
export type { EditorShellProps } from "./primitives/Editor";
export * as editorStyles from "./primitives/Editor/style.css";
export {
  RangerModal,
  rangerVars,
  rangerTheme,
  createRangerTheme,
  tagVars,
  tagColor,
  isFolder,
  isNote,
  DUMMY_VAULT_TREE,
  findPath,
  mapTree,
  removeFromTree,
  sortNodes,
} from "./primitives/RangerModal";
export type {
  RangerModalProps,
  RangerTag,
  RangerThemeValues,
  VaultNode,
  VaultNote,
  VaultFolder,
  SortKey,
  ViewMode,
  CreatingState,
} from "./primitives/RangerModal";

export const createHello = (): [Accessor<string>, (to: string) => void] => {
  const [hello, setHello] = createSignal("Hello World!");

  return [
    hello,
    (to: string) => {
      setHello(`Hello ${to}!`);
    },
  ];
};

export const Hello: Component<{ readonly to?: string }> = (props) => {
  const [hello, setHello] = createHello();

  // Console calls will be removed in production if `dropConsole` is enabled

  // eslint-disable-next-line no-console
  console.log("Hello World!");

  createComputed(() => {
    if (typeof props.to === "string") {
      setHello(props.to);
    }
  });

  return (
    <>
      <div>{hello()}</div>
    </>
  );
};
