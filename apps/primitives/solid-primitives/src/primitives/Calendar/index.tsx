import CalendarPrimitive from "corvu/calendar";
import { type JSX, splitProps } from "solid-js";

import * as styles from "./style.css";

// Headless Calendar built on corvu. corvu owns all the behaviour — month/range
// State, keyboard grid navigation, and the `data-selected` / `data-in-range` /
// `data-today` / `data-range-start` / `data-range-end` state attributes on each
// Day trigger. Our wrappers only add stable `data-part="calendar-*"` hooks
// (repo convention) plus minimal structural CSS, leaving every visual decision
// To the storybook skins.
//
// `Calendar.Root` is a render-prop component: its child is a function receiving
// Corvu's calendar state (`month`, `months`, `weeks`, `weekdays`, `navigate`,
// `value`, `setValue`, …) used to lay out the grid. See the storybook stories.

// First-parameter helper: avoids `Parameters<…>[0]` (the numeric index trips
// The no-magic-numbers rule) while still capturing each corvu part's prop type.
type PropsOf<Fn> = Fn extends (props: infer Props, ...rest: never[]) => unknown ? Props : never;

export type CalendarRootProps = PropsOf<typeof CalendarPrimitive>;
export type CalendarNavProps = PropsOf<typeof CalendarPrimitive.Nav>;
export type CalendarLabelProps = PropsOf<typeof CalendarPrimitive.Label>;
export type CalendarTableProps = PropsOf<typeof CalendarPrimitive.Table>;
export type CalendarHeadCellProps = PropsOf<typeof CalendarPrimitive.HeadCell>;
export type CalendarCellProps = PropsOf<typeof CalendarPrimitive.Cell>;
export type CalendarCellTriggerProps = PropsOf<typeof CalendarPrimitive.CellTrigger>;

// Accepts `unknown` because corvu's polymorphic prop types surface `class` as
// `any`; we narrow to strings here so callers never leak `any` into the merge.
const joinClass = (...classes: unknown[]): string =>
  classes.filter((value): value is string => typeof value === "string" && value !== "").join(" ");

// Root only provides context (renders no element of its own), so it passes
// Straight through and keeps corvu's discriminated `mode` prop typing intact.
const Root = (props: CalendarRootProps): JSX.Element => <CalendarPrimitive {...props} />;

const Nav = (props: CalendarNavProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.Nav {...rest} class={joinClass(local.class)} data-part="calendar-nav" />
  );
};

const Label = (props: CalendarLabelProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.Label {...rest} class={joinClass(local.class)} data-part="calendar-label" />
  );
};

const Table = (props: CalendarTableProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.Table
      {...rest}
      class={joinClass(styles.table, local.class)}
      data-part="calendar-table"
    />
  );
};

const HeadCell = (props: CalendarHeadCellProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.HeadCell
      {...rest}
      class={joinClass(local.class)}
      data-part="calendar-head-cell"
    />
  );
};

const Cell = (props: CalendarCellProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.Cell {...rest} class={joinClass(local.class)} data-part="calendar-cell" />
  );
};

const CellTrigger = (props: CalendarCellTriggerProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CalendarPrimitive.CellTrigger
      {...rest}
      class={joinClass(styles.cellTrigger, local.class)}
      data-part="calendar-cell-trigger"
    />
  );
};

/** Headless date calendar (single / multiple / range). Compose `Calendar.Root`
 * with a render-prop child and the named parts. */
export const Calendar = {
  Cell,
  CellTrigger,
  HeadCell,
  Label,
  Nav,
  Root,
  Table,
} as const;
