import { Calendar, Dialog } from "@rs/solid-primitives";
import { createSignal, For, Show } from "solid-js";

import {
  calCol,
  calMonths,
  calNavBar,
  calTables,
  hangarCal,
} from "../Calendar/exemplars/hangar.css";
import {
  action,
  actionDanger,
  body,
  calHost,
  callout,
  field,
  fieldRow,
  foot,
  footSpread,
  hangarDialog,
  head,
  headMeta,
  input,
  kicker,
  kickerDanger,
  lbl,
  log,
  logLine,
  metric,
  metrics,
  select,
  trigger,
  triggerDanger,
} from "./exemplars/hangar.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// SKIN · HANGAR — stark industrial deployment-console dialog.
// Four scenarios over the SAME headless Dialog primitive (destructive confirm,
// config form, scrollable run-log, embedded date-range picker). All visuals are
// layered through the [data-part] hooks; the portalled Overlay/Content carry the
// `hangarDialog` scope class directly (see exemplars/hangar.css.ts).

const meta = {
  title: "Primitives/Dialog/Hangar",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ----------------------------------------------------------------- 1 · CONFIRM
export const DestructiveConfirm: Story = {
  render: () => (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger class={`${trigger} ${triggerDanger}`}>‣ Terminate deployment</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={hangarDialog} />
        <Dialog.Content class={hangarDialog}>
          <div class={head}>
            <div class={headMeta}>
              <span class={kickerDanger}>DESTRUCTIVE · IRREVERSIBLE</span>
              <Dialog.Label>Terminate deployment?</Dialog.Label>
            </div>
            <Dialog.Close>ESC</Dialog.Close>
          </div>
          <div class={body}>
            <Dialog.Description>
              This stops all running replicas and tears down the active service. In-flight requests
              will be dropped. This action cannot be undone.
            </Dialog.Description>
            <div class={metrics}>
              <div class={metric}>
                <span>Target</span>
                <b>api-edge</b>
              </div>
              <div class={metric}>
                <span>Replicas</span>
                <b data-danger>12 → 0</b>
              </div>
              <div class={metric}>
                <span>Region</span>
                <b>iad-1</b>
              </div>
            </div>
            <div class={callout}>
              <span>⚠</span>
              <span>
                Type the service name to confirm in production. Cluster <code>prod-iad</code> has{" "}
                <code>42k</code> active connections.
              </span>
            </div>
          </div>
          <div class={foot}>
            <Dialog.Close>Cancel</Dialog.Close>
            <button class={`${action} ${actionDanger}`} type="button">
              Terminate
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// -------------------------------------------------------------------- 2 · FORM
export const ConfigForm: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger class={trigger}>‣ Configure job</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={hangarDialog} />
        <Dialog.Content class={hangarDialog}>
          <div class={head}>
            <div class={headMeta}>
              <span class={kicker}>SCHEDULER · NEW JOB</span>
              <Dialog.Label>Configure run window</Dialog.Label>
            </div>
            <Dialog.Close>ESC</Dialog.Close>
          </div>
          <div class={body}>
            <div class={field}>
              <label class={lbl} for="hg-name">
                Job identifier
              </label>
              <input id="hg-name" class={input} type="text" placeholder="nightly-rollup" />
            </div>
            <div class={fieldRow}>
              <div class={field}>
                <label class={lbl} for="hg-cluster">
                  Cluster
                </label>
                <select id="hg-cluster" class={select}>
                  <option>prod-iad</option>
                  <option>prod-sfo</option>
                  <option>staging-iad</option>
                </select>
              </div>
              <div class={field}>
                <label class={lbl} for="hg-prio">
                  Priority
                </label>
                <select id="hg-prio" class={select}>
                  <option>P0 · critical</option>
                  <option>P1 · high</option>
                  <option>P2 · normal</option>
                </select>
              </div>
            </div>
            <div class={fieldRow}>
              <div class={field}>
                <label class={lbl} for="hg-start">
                  Start (UTC)
                </label>
                <input id="hg-start" class={input} type="text" placeholder="02:00" />
              </div>
              <div class={field}>
                <label class={lbl} for="hg-budget">
                  Timeout (min)
                </label>
                <input id="hg-budget" class={input} type="text" placeholder="30" />
              </div>
            </div>
          </div>
          <div class={foot}>
            <Dialog.Close>Discard</Dialog.Close>
            <button class={action} type="button">
              Schedule
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// --------------------------------------------------------------- 3 · LONG LOG
interface Entry {
  readonly t: string;
  readonly lvl: "ok" | "warn" | "err";
  readonly tag: string;
  readonly msg: string;
}
const RUN_LOG: readonly Entry[] = [
  { t: "00:00.012", lvl: "ok", tag: "BOOT", msg: "scheduler online · 8 workers" },
  { t: "00:00.341", lvl: "ok", tag: "PULL", msg: "image ghcr.io/api-edge@sha256:9f3c…" },
  { t: "00:01.004", lvl: "ok", tag: "PLAN", msg: "rolling update · maxSurge=2" },
  { t: "00:02.118", lvl: "warn", tag: "NET", msg: "iad-1 latency 340ms (threshold 250)" },
  { t: "00:02.880", lvl: "ok", tag: "POD", msg: "api-edge-7f9 ready 1/12" },
  { t: "00:03.412", lvl: "ok", tag: "POD", msg: "api-edge-7fa ready 3/12" },
  { t: "00:04.090", lvl: "warn", tag: "DRAIN", msg: "connection drain 1.2k pending" },
  { t: "00:05.551", lvl: "err", tag: "HEALTH", msg: "probe /ready 503 · pod api-edge-7fc" },
  { t: "00:06.002", lvl: "ok", tag: "RETRY", msg: "rescheduling api-edge-7fc" },
  { t: "00:07.330", lvl: "ok", tag: "POD", msg: "api-edge-7fd ready 7/12" },
  { t: "00:08.911", lvl: "ok", tag: "POD", msg: "api-edge-7ff ready 12/12" },
  { t: "00:09.140", lvl: "ok", tag: "TRAFFIC", msg: "shifting 100% → new revision" },
  { t: "00:09.802", lvl: "warn", tag: "CACHE", msg: "edge cache cold · warming 14 PoPs" },
  { t: "00:11.006", lvl: "ok", tag: "VERIFY", msg: "synthetic checks 42/42 pass" },
  { t: "00:12.500", lvl: "ok", tag: "DONE", msg: "deployment converged · old revision retired" },
];

export const ScrollableRunLog: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger class={trigger}>‣ View run log</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={hangarDialog} />
        <Dialog.Content class={hangarDialog}>
          <div class={head}>
            <div class={headMeta}>
              <span class={kicker}>DEPLOY #4471 · STREAM</span>
              <Dialog.Label>Run log · api-edge</Dialog.Label>
            </div>
            <Dialog.Close>ESC</Dialog.Close>
          </div>
          <div class={body}>
            <Dialog.Description>
              Live stream from the rollout controller. Scroll for the full trace.
            </Dialog.Description>
            <div class={log}>
              <For each={RUN_LOG}>
                {(e) => (
                  <div class={logLine} data-lvl={e.lvl}>
                    <time>{e.t}</time>
                    <em>{e.tag}</em>
                    <span>{e.msg}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div class={`${foot} ${footSpread}`}>
            <Dialog.Close>Close</Dialog.Close>
            <button class={action} type="button">
              Export trace
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// --------------------------------------------------------- 4 · DATE-RANGE PICKER
const monthLabel = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(value).toUpperCase();
const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value).slice(0, 2);
const stamp = (value: Date | null): string =>
  value === null
    ? "————————"
    : new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(value);

export const MaintenanceWindow: Story = {
  render: () => {
    const [range, setRange] = createSignal<{ from: Date | null; to: Date | null }>({
      from: null,
      to: null,
    });
    return (
      <Dialog.Root>
        <Dialog.Trigger class={trigger}>‣ Schedule maintenance</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay class={hangarDialog} />
          <Dialog.Content class={hangarDialog} style={{ width: "min(94vw, 40rem)" }}>
            <div class={head}>
              <div class={headMeta}>
                <span class={kicker}>OPS · DOWNTIME WINDOW</span>
                <Dialog.Label>Schedule maintenance window</Dialog.Label>
              </div>
              <Dialog.Close>ESC</Dialog.Close>
            </div>
            <div class={body}>
              <Dialog.Description>
                Select a date range. Traffic will be drained at the window start and restored on
                completion.
              </Dialog.Description>
              <div class={`${hangarCal} ${calHost}`}>
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
                            {(m, i) => (
                              <Calendar.Label index={i()}>{monthLabel(m.month)}</Calendar.Label>
                            )}
                          </For>
                        </div>
                        <Calendar.Nav action="next-month" aria-label="Next month">
                          ›
                        </Calendar.Nav>
                      </div>
                      <div class={calTables}>
                        <For each={calendar.months}>
                          {(m, i) => (
                            <div class={calCol}>
                              <Calendar.Table index={i()}>
                                <thead>
                                  <tr>
                                    <For each={calendar.weekdays}>
                                      {(day) => (
                                        <Calendar.HeadCell>{weekday(day)}</Calendar.HeadCell>
                                      )}
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
                    </>
                  )}
                </Calendar.Root>
              </div>
              <div class={metrics}>
                <div class={metric}>
                  <span>From</span>
                  <b data-signal>{stamp(range().from)}</b>
                </div>
                <div class={metric}>
                  <span>To</span>
                  <b data-signal>{stamp(range().to)}</b>
                </div>
                <div class={metric}>
                  <span>Status</span>
                  <Show when={range().from && range().to} fallback={<b>PENDING</b>}>
                    <b data-signal>ARMED</b>
                  </Show>
                </div>
              </div>
            </div>
            <div class={foot}>
              <Dialog.Close>Cancel</Dialog.Close>
              <button class={action} type="button">
                Confirm window
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
};
