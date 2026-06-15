import { Calendar } from "@rs/solid-primitives";
import { For } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The headless Calendar ships only behaviour (month/range state, keyboard grid
// navigation) and the `data-part` + `data-selected` / `data-in-range` /
// `data-today` state hooks. This Raw story lays the grid out with native table
// markup and almost no styling; the Skins stories do the visual work.

const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value);

const monthLabel = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(value);

const meta = {
  title: "Primitives/Calendar",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Raw: Story = {
  render: () => (
    <Calendar.Root mode="single">
      {(calendar) => (
        <div style={{ display: "inline-flex", "flex-direction": "column", gap: "0.5rem" }}>
          <div
            style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}
          >
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
        </div>
      )}
    </Calendar.Root>
  ),
};
