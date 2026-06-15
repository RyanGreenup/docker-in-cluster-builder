import { For, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Calendar } from "./index";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value);

// A minimal single-month grid driven by corvu's render-prop state. Mirrors how
// The storybook stories lay out the calendar.
const CalendarFixture = (): JSX.Element => (
  <Calendar.Root mode="single">
    {(calendar) => (
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
    )}
  </Calendar.Root>
);

const triggers = (): HTMLElement[] => [
  ...document.querySelectorAll<HTMLElement>('[data-part="calendar-cell-trigger"]'),
];

test("renders a seven-column month grid with part hooks", async () => {
  disposers.push(render(() => <CalendarFixture />, document.body));

  await expect.poll(() => document.querySelector('[data-part="calendar-table"]')).not.toBeNull();
  expect(document.querySelectorAll('[data-part="calendar-head-cell"]')).toHaveLength(7);
  expect(triggers().length).toBeGreaterThan(0);
});

test("selecting a day marks it as selected", async () => {
  disposers.push(render(() => <CalendarFixture />, document.body));
  await expect.poll(() => triggers().length).toBeGreaterThan(0);

  const target = triggers().find((trigger) => trigger.textContent.trim() === "15");
  if (target === undefined) {
    throw new Error("expected a day labelled 15 in the month grid");
  }
  await userEvent.click(target);

  expect(target).toHaveAttribute("data-selected");
  expect(target.getAttribute("aria-selected")).toBe("true");
});
