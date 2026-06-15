import { Calendar } from "@rs/solid-primitives";
import { createSignal, For, Show } from "solid-js";

import {
  calChrome,
  calCol,
  calFoot,
  calLive,
  calMonths,
  calNavBar,
  calReadout,
  calTables,
  calTag,
  hangarCal,
} from "./exemplars/hangar.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// SKIN · HANGAR — stark industrial ops-console calendar.
// Same headless Calendar primitive as the Raw story; all colour, grid and
// state feedback is layered purely through the data-part / corvu state hooks
// (see exemplars/hangar.css.ts). Scoped under the `.hangarCal` wrapper.

const meta = {
  title: "Primitives/Calendar/Hangar",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value).slice(0, 2);

const monthLabel = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(value).toUpperCase();

const stamp = (value: Date | null): string =>
  value === null
    ? "————————"
    : new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(value);

interface GridProps {
  readonly weekdays: readonly Date[];
  readonly weeks: readonly (readonly Date[])[];
  readonly month: Date;
  readonly index: number;
}

const MonthGrid = (props: GridProps) => (
  <div class={calCol}>
    <Calendar.Table index={props.index}>
      <thead>
        <tr>
          <For each={props.weekdays}>
            {(day) => <Calendar.HeadCell>{weekday(day)}</Calendar.HeadCell>}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.weeks}>
          {(week) => (
            <tr>
              <For each={week}>
                {(day) => (
                  <Calendar.Cell>
                    <Calendar.CellTrigger day={day} month={props.month}>
                      {day.getDate()}
                    </Calendar.CellTrigger>
                  </Calendar.Cell>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </Calendar.Table>
  </div>
);

export const SingleDate: Story = {
  render: () => {
    const [value, setValue] = createSignal<Date | null>(null);
    return (
      <div class={hangarCal}>
        <div class={calChrome}>
          <span class={calTag}>SCHED-01</span>
          <span>SELECT TARGET DATE</span>
          <span class={calLive}>ONLINE</span>
        </div>
        <Calendar.Root mode="single" value={value()} onValueChange={setValue} startOfWeek={1}>
          {(calendar) => (
            <>
              <div class={calNavBar}>
                <Calendar.Nav action="prev-month" aria-label="Previous month">
                  ‹
                </Calendar.Nav>
                <div class={calMonths}>
                  <Calendar.Label index={0}>{monthLabel(calendar.month)}</Calendar.Label>
                </div>
                <Calendar.Nav action="next-month" aria-label="Next month">
                  ›
                </Calendar.Nav>
              </div>
              <div class={calTables}>
                <MonthGrid
                  weekdays={calendar.weekdays}
                  weeks={calendar.weeks}
                  month={calendar.month}
                  index={0}
                />
              </div>
              <div class={calFoot}>
                <span>TARGET</span>
                <span class={calReadout}>{stamp(value())}</span>
              </div>
            </>
          )}
        </Calendar.Root>
      </div>
    );
  },
};

export const TwoMonthRange: Story = {
  render: () => {
    const [range, setRange] = createSignal<{ from: Date | null; to: Date | null }>({
      from: null,
      to: null,
    });
    return (
      <div class={hangarCal}>
        <div class={calChrome}>
          <span class={calTag}>WINDOW</span>
          <span>MAINTENANCE RANGE · 2 CYCLES</span>
          <span class={calLive}>ARMED</span>
        </div>
        <Calendar.Root
          mode="range"
          value={range()}
          onValueChange={setRange}
          numberOfMonths={2}
          fixedWeeks
          startOfWeek={1}
        >
          {(calendar) => (
            <>
              <div class={calNavBar}>
                <Calendar.Nav action="prev-month" aria-label="Previous month">
                  ‹
                </Calendar.Nav>
                <div class={calMonths}>
                  <For each={calendar.months}>
                    {(m, i) => <Calendar.Label index={i()}>{monthLabel(m.month)}</Calendar.Label>}
                  </For>
                </div>
                <Calendar.Nav action="next-month" aria-label="Next month">
                  ›
                </Calendar.Nav>
              </div>
              <div class={calTables}>
                <For each={calendar.months}>
                  {(m, i) => (
                    <MonthGrid
                      weekdays={calendar.weekdays}
                      weeks={m.weeks}
                      month={m.month}
                      index={i()}
                    />
                  )}
                </For>
              </div>
              <div class={calFoot}>
                <span>
                  FROM <b>{stamp(range().from)}</b>
                </span>
                <Show when={range().from && range().to} fallback={<span>AWAITING SPAN…</span>}>
                  <span>
                    TO <b>{stamp(range().to)}</b>
                  </span>
                </Show>
              </div>
            </>
          )}
        </Calendar.Root>
      </div>
    );
  },
};
