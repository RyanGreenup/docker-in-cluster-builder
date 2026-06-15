import DialogPrimitive from "corvu/dialog";
import { type JSX, splitProps } from "solid-js";

import * as styles from "./style.css";

// Headless Dialog built on corvu. corvu supplies all the behaviour — focus
// Trapping, Escape / outside-pointer dismissal, scroll locking, and the full
// `role`/`aria-modal`/`aria-labelledby`/`aria-describedby` wiring. Our wrappers
// Add nothing but a stable `data-part="dialog-*"` hook (matching the repo
// Convention used by Accordion / VirtualizedDataTable) and the structural
// Positioning classes, so storybook skins have predictable targets to style.

// First-parameter helper: avoids `Parameters<…>[0]` (the numeric index trips
// The no-magic-numbers rule) while still capturing each corvu part's prop type.
type PropsOf<Fn> = Fn extends (props: infer Props, ...rest: never[]) => unknown ? Props : never;

export type DialogRootProps = PropsOf<typeof DialogPrimitive>;
export type DialogTriggerProps = PropsOf<typeof DialogPrimitive.Trigger>;
export type DialogPortalProps = PropsOf<typeof DialogPrimitive.Portal>;
export type DialogOverlayProps = PropsOf<typeof DialogPrimitive.Overlay>;
export type DialogContentProps = PropsOf<typeof DialogPrimitive.Content>;
export type DialogLabelProps = PropsOf<typeof DialogPrimitive.Label>;
export type DialogDescriptionProps = PropsOf<typeof DialogPrimitive.Description>;
export type DialogCloseProps = PropsOf<typeof DialogPrimitive.Close>;

// Accepts `unknown` because corvu's polymorphic prop types surface `class` as
// `any`; we narrow to strings here so callers never leak `any` into the merge.
export const joinClass = (...classes: unknown[]): string =>
  classes.filter((value): value is string => typeof value === "string" && value !== "").join(" ");

// Root only provides context (renders no element of its own), so it passes
// Straight through.
const Root = (props: DialogRootProps): JSX.Element => <DialogPrimitive {...props} />;

const Trigger = (props: DialogTriggerProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Trigger {...rest} class={joinClass(local.class)} data-part="dialog-trigger" />
  );
};

const Portal = (props: DialogPortalProps): JSX.Element => <DialogPrimitive.Portal {...props} />;

const Overlay = (props: DialogOverlayProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Overlay
      {...rest}
      class={joinClass(styles.overlay, local.class)}
      data-part="dialog-overlay"
    />
  );
};

const Content = (props: DialogContentProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Content
      {...rest}
      class={joinClass(styles.content, local.class)}
      data-part="dialog-content"
    />
  );
};

const Label = (props: DialogLabelProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Label {...rest} class={joinClass(local.class)} data-part="dialog-label" />
  );
};

const Description = (props: DialogDescriptionProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Description
      {...rest}
      class={joinClass(local.class)}
      data-part="dialog-description"
    />
  );
};

const Close = (props: DialogCloseProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogPrimitive.Close {...rest} class={joinClass(local.class)} data-part="dialog-close" />
  );
};

/** Headless modal dialog. Compose `Dialog.Root` with the named parts. */
export const Dialog = {
  Close,
  Content,
  Description,
  Label,
  Overlay,
  Portal,
  Root,
  Trigger,
} as const;
