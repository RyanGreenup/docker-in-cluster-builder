import { splitProps, type Accessor, type Component, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import * as styles from "./style.css";

export type AccordionIcon = Component<{ readonly class?: string }>;
import type {
  AccordionRecipeSize as AccordionSize,
  AccordionStyleVariants,
  AccordionRecipeVariant as AccordionVariant,
} from "./style.css";

export type { AccordionSize, AccordionVariant };

// NOTE favour Accessor so we can get reactivity later without pain
// Typically just SSR but reactivity is free with solid-js
export interface AccordionItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "title"> {
  readonly collapseIcon?: AccordionIcon;
  readonly defaultChecked?: Accessor<boolean>;
  readonly expandIcon?: AccordionIcon;
  readonly id?: string;
  readonly size?: Accessor<AccordionSize>;
  readonly title: Accessor<string>;
  readonly variant?: Accessor<AccordionVariant>;
}

export const joinClass = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(" ");

interface AccordionTriggerProps {
  collapseIcon?: AccordionIcon;
  defaultChecked?: Accessor<boolean>;
  expandIcon?: AccordionIcon;
  id?: string;
  styleOptions: Accessor<Required<AccordionStyleVariants>>;
  title: Accessor<string>;
}

interface AccordionContentProps {
  children: JSX.Element;
  styleOptions: Accessor<Required<AccordionStyleVariants>>;
}

const PlusIcon: Component<{ readonly class?: string }> = (props) => (
  <svg
    aria-hidden="true"
    class={props.class}
    data-icon="plus"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const MinusIcon: Component<{ readonly class?: string }> = (props) => (
  <svg
    aria-hidden="true"
    class={props.class}
    data-icon="minus"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14" />
  </svg>
);

const AccordionTrigger: Component<AccordionTriggerProps> = (props) => (
  <label class={styles.header(props.styleOptions())} data-part="trigger">
    <input
      checked={props.defaultChecked?.()}
      class={styles.input()}
      id={props.id}
      type="checkbox"
    />
    <span class={styles.title(props.styleOptions())} data-part="title">
      {props.title()}
    </span>
    <span class={styles.iconWrapper(props.styleOptions())} data-part="icon">
      <Dynamic
        component={props.expandIcon ?? PlusIcon}
        class={styles.plusIcon(props.styleOptions())}
      />
      <Dynamic
        component={props.collapseIcon ?? MinusIcon}
        class={styles.minusIcon(props.styleOptions())}
      />
    </span>
  </label>
);

const AccordionContent: Component<AccordionContentProps> = (props) => (
  <div class={styles.content(props.styleOptions())} data-part="content">
    <div class={styles.contentClip(props.styleOptions())}>
      <div class={styles.contentInner(props.styleOptions())} data-content-inner>
        {props.children}
      </div>
    </div>
  </div>
);

export const AccordionItem: Component<AccordionItemProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "collapseIcon",
    "defaultChecked",
    "expandIcon",
    "id",
    "size",
    "title",
    "variant",
  ]);

  const size = (): AccordionSize => local.size?.() ?? "md";
  const variant = (): AccordionVariant => local.variant?.() ?? "default";
  const styleOptions = (): Required<AccordionStyleVariants> => ({
    size: size(),
    variant: variant(),
  });

  return (
    <div
      {...rest}
      class={joinClass(styles.wrapper(styleOptions()), local.class)}
      data-part="root"
      data-size={size()}
      data-variant={variant()}
    >
      {/* The checkbox is nested inside the label so toggling is scoped to this
          instance. An id/for pair would collide across Astro islands, where each
          server-rendered component restarts id generation and emits the same id.
          Nesting also gives the checkbox its accessible name from the title. */}
      <AccordionTrigger
        collapseIcon={local.collapseIcon}
        defaultChecked={local.defaultChecked}
        expandIcon={local.expandIcon}
        id={local.id}
        styleOptions={styleOptions}
        title={local.title}
      />
      <AccordionContent styleOptions={styleOptions}>{local.children}</AccordionContent>
    </div>
  );
};

export const Accordion = AccordionItem;
export const Root = AccordionItem;
export default AccordionItem;
