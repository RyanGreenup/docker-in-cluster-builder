import { Calendar } from "@rs/solid-primitives";
import { createSignal, For } from "solid-js";

import { cal, eyebrow, footnote, head, monthCol, monthHead, months } from "./exemplars/lumiere.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// LUMIÈRE · CALENDAR — warm editorial luxury-print skin layered purely through
// the headless Calendar's data-part / state hooks (see lumiere.css.ts).

const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value);

const monthLabel = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(value);

const longDate = (value: Date | null): string =>
  value === null
    ? "—"
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(value);

const nights = (from: Date | null, to: Date | null): number =>
  from === null || to === null ? 0 : Math.round((to.getTime() - from.getTime()) / 86_400_000);

const meta = {
  title: "Primitives/Calendar/Lumière",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface Range {
  from: Date | null;
  to: Date | null;
}

// ----------------------------------------------------------------- single
export const SingleDate: Story = {
  render: () => (
    <Calendar.Root mode="single" fixedWeeks startOfWeek={1}>
      {(calendar) => (
        <div class={cal}>
          <div class={eyebrow}>La Réservation</div>
          <div class={head}>
            <Calendar.Nav action="prev-month" aria-label="Previous month">
              ‹
            </Calendar.Nav>
            <Calendar.Label index={0}>{monthLabel(calendar.month)}</Calendar.Label>
            <Calendar.Nav action="next-month" aria-label="Next month">
              ›
            </Calendar.Nav>
          </div>
          <Calendar.Table index={0}>
            <thead>
              <tr>
                <For each={calendar.weekdays}>
                  {(day) => <Calendar.HeadCell>{weekday(day)}</Calendar.HeadCell>}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={calendar.weeks}>
                {(week) => (
                  <tr>
                    <For each={week}>
                      {(day) => (
                        <Calendar.Cell>
                          <Calendar.CellTrigger day={day} month={calendar.month}>
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
          <p class={footnote}>
            Choose a single day for your <b>table for two</b>.
          </p>
        </div>
      )}
    </Calendar.Root>
  ),
};

// ----------------------------------------------------------------- range
export const StayRange: Story = {
  render: () => {
    const [range, setRange] = createSignal<Range>({ from: null, to: null });
    return (
      <Calendar.Root
        mode="range"
        value={range()}
        onValueChange={setRange}
        numberOfMonths={2}
        fixedWeeks
        startOfWeek={1}
      >
        {(calendar) => (
          <div class={cal}>
            <div class={eyebrow}>Select Your Stay</div>
            <div class={head}>
              <Calendar.Nav action="prev-month" aria-label="Previous month">
                ‹
              </Calendar.Nav>
              <span style={{ flex: 1 }} />
              <Calendar.Nav action="next-month" aria-label="Next month">
                ›
              </Calendar.Nav>
            </div>
            <div class={months}>
              <For each={calendar.months}>
                {(m, i) => (
                  <div class={monthCol}>
                    <div class={monthHead}>
                      <Calendar.Label index={i()}>{monthLabel(m.month)}</Calendar.Label>
                    </div>
                    <Calendar.Table index={i()}>
                      <thead>
                        <tr>
                          <For each={calendar.weekdays}>
                            {(day) => <Calendar.HeadCell>{weekday(day)}</Calendar.HeadCell>}
                          </For>
                        </tr>
                      </thead>
                      <tbody>
                        <For each={m.weeks}>
                          {(week) => (
                            <tr>
                              <For each={week}>
                                {(day) => (
                                  <Calendar.Cell>
                                    <Calendar.CellTrigger day={day} month={m.month}>
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
                )}
              </For>
            </div>
            <p class={footnote}>
              {nights(range().from, range().to) > 0 ? (
                <>
                  {longDate(range().from)} – {longDate(range().to)} ·{" "}
                  <b>{nights(range().from, range().to)} nights</b>
                </>
              ) : (
                <>Tap your arrival, then your departure.</>
              )}
            </p>
          </div>
        )}
      </Calendar.Root>
    );
  },
};
