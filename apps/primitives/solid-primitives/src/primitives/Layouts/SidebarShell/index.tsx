import { type Accessor, type Component, type JSX } from "solid-js";

import { AccordionItem, joinClass } from "../../Accordion";
import * as styles from "./style.css";

/**
 * Props for {@link SidebarShell.Root}: a plain container so consumers can
 * attach classes, aria attributes, and extra chrome around the sections.
 */
export type SidebarShellRootProps = JSX.HTMLAttributes<HTMLDivElement>;

/** Props for one collapsible {@link SidebarShell.Section}. */
export interface SidebarShellSectionProps {
  readonly title: Accessor<string>;
  /** Render the section expanded on first mount. Defaults to collapsed. */
  readonly defaultOpen?: boolean;
  readonly class?: string;
  readonly children: JSX.Element;
}

const SidebarShellRoot: Component<SidebarShellRootProps> = (props) => (
  <div {...props} class={joinClass(styles.root, props.class)} data-part="sidebar-shell">
    {props.children}
  </div>
);

const SidebarShellSection: Component<SidebarShellSectionProps> = (props) => (
  // AccordionItem stamps its own data-part="root", so the section hook lives
  // On a dedicated wrapper element.
  <div class={joinClass(styles.section, props.class)} data-part="sidebar-section">
    <AccordionItem defaultChecked={() => props.defaultOpen ?? false} title={props.title}>
      <div class={styles.body} data-part="sidebar-section-body">
        {props.children}
      </div>
    </AccordionItem>
  </div>
);

/**
 * VS Code style sidebar: a vertical stack of independently collapsible
 * sections. Each section is an {@link AccordionItem} (checkbox-driven, so
 * sections expand and collapse without affecting each other). Style through
 * the data-part hooks plus the underlying accordion parts (trigger, title,
 * icon, content).
 *
 * ```tsx
 * <SidebarShell.Root>
 *   <SidebarShell.Section title={() => "Explorer"} defaultOpen>
 *     <FileTree />
 *   </SidebarShell.Section>
 *   <SidebarShell.Section title={() => "Settings"}>...</SidebarShell.Section>
 * </SidebarShell.Root>
 * ```
 */
export const SidebarShell = {
  Root: SidebarShellRoot,
  Section: SidebarShellSection,
};
