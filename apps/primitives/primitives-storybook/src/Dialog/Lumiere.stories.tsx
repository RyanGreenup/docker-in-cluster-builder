import { Calendar, Dialog } from "@rs/solid-primitives";
import { createSignal, For } from "solid-js";

import {
  cal as calWrap,
  head as calHead,
  monthCol,
  monthHead,
  months as calMonths,
} from "../Calendar/exemplars/lumiere.css";
import {
  body,
  btnGhost,
  btnPrimary,
  calMount,
  dialog,
  dl,
  eyebrow,
  field,
  fieldRow,
  flourish,
  footer,
  header,
  overlay,
  prose,
  rule,
  trigger,
  triggerGhost,
} from "./exemplars/lumiere.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// LUMIÈRE · DIALOG — warm editorial luxury-print reservation experience.
// Four scenarios (confirm / form / long-scroll / date-range picker) all skinned
// purely through the headless Dialog data-part hooks. Because Dialog.Portal
// renders to <body>, the scope classes (overlay / dialog) sit DIRECTLY on
// Dialog.Overlay and Dialog.Content.

const meta = {
  title: "Primitives/Dialog/Lumière",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const weekday = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value);
const monthLabel = (value: Date): string =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(value);
const longDate = (value: Date | null): string =>
  value === null
    ? "Select"
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(value);
const nights = (from: Date | null, to: Date | null): number =>
  from === null || to === null ? 0 : Math.round((to.getTime() - from.getTime()) / 86_400_000);

interface Range {
  from: Date | null;
  to: Date | null;
}

// ----------------------------------------------------------------- confirm
export const Confirm: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger class={trigger}>Reserve a table</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={overlay} />
        <Dialog.Content class={dialog}>
          <Dialog.Close aria-label="Close">✕</Dialog.Close>
          <div class={header}>
            <span class={eyebrow}>Maison Lumière</span>
            <Dialog.Label>Confirm your reservation</Dialog.Label>
            <Dialog.Description>
              A table for two on the garden terrace, held under your name for fifteen minutes.
            </Dialog.Description>
          </div>
          <div class={body}>
            <div class={dl}>
              <span class="dlKey">Date</span>
              <span class="dlDot" />
              <span class="dlVal">Sat, 14 June</span>
            </div>
            <div class={dl}>
              <span class="dlKey">Time</span>
              <span class="dlDot" />
              <span class="dlVal">8:30 PM</span>
            </div>
            <div class={dl}>
              <span class="dlKey">Party</span>
              <span class="dlDot" />
              <span class="dlVal">Two guests</span>
            </div>
            <p class={flourish}>We look forward to receiving you.</p>
          </div>
          <div class={footer}>
            <Dialog.Close class={btnGhost}>Not yet</Dialog.Close>
            <Dialog.Close class={btnPrimary}>Confirm</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// ----------------------------------------------------------------- form
export const GuestDetails: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger class={triggerGhost}>Add guest details</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={overlay} />
        <Dialog.Content class={dialog}>
          <Dialog.Close aria-label="Close">✕</Dialog.Close>
          <div class={header}>
            <span class={eyebrow}>Your Particulars</span>
            <Dialog.Label>Tell us about your visit</Dialog.Label>
            <Dialog.Description>
              A few details so the evening is exactly to your liking.
            </Dialog.Description>
          </div>
          <div class={body}>
            <div class={fieldRow}>
              <div class={field}>
                <label for="lum-first">First name</label>
                <input id="lum-first" type="text" placeholder="Eleanor" />
              </div>
              <div class={field}>
                <label for="lum-last">Last name</label>
                <input id="lum-last" type="text" placeholder="Vance" />
              </div>
            </div>
            <div class={field}>
              <label for="lum-email">Email</label>
              <input id="lum-email" type="email" placeholder="eleanor@example.com" />
            </div>
            <div class={fieldRow}>
              <div class={field}>
                <label for="lum-party">Party size</label>
                <select id="lum-party">
                  <option>One guest</option>
                  <option selected>Two guests</option>
                  <option>Four guests</option>
                  <option>Six guests</option>
                </select>
              </div>
              <div class={field}>
                <label for="lum-seat">Seating</label>
                <select id="lum-seat">
                  <option>Garden terrace</option>
                  <option>Window banquette</option>
                  <option>Chef’s counter</option>
                </select>
              </div>
            </div>
            <div class={field}>
              <label for="lum-notes">Notes for the kitchen</label>
              <textarea id="lum-notes" rows={2} placeholder="Allergies, occasions, preferences…" />
            </div>
          </div>
          <div class={footer}>
            <Dialog.Close class={btnGhost}>Cancel</Dialog.Close>
            <Dialog.Close class={btnPrimary}>Save details</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// ----------------------------------------------------------------- long scroll
export const Itinerary: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger class={triggerGhost}>Read the house terms</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={overlay} />
        <Dialog.Content class={dialog}>
          <Dialog.Close aria-label="Close">✕</Dialog.Close>
          <div class={header}>
            <span class={eyebrow}>The Fine Print</span>
            <Dialog.Label>Terms of the house</Dialog.Label>
            <Dialog.Description>
              Please take a moment with the particulars before you confirm.
            </Dialog.Description>
          </div>
          <div class={body}>
            <div class={prose}>
              <p>
                Maison Lumière keeps but a handful of tables each evening, and so a confirmed
                reservation is a quiet promise between guest and house. We ask only that you honour
                it, or release it in good time, that another might take their place beneath the
                lanterns.
              </p>
              <h3>Arrival</h3>
              <p>
                Your table is held for fifteen minutes beyond the appointed hour. Should the evening
                conspire against you, a brief word by telephone allows us to keep your place warm
                and your aperitif chilled.
              </p>
              <h3>Cancellations</h3>
              <p>
                A reservation may be released without charge until noon on the day itself. Beyond
                that hour a nominal fee is retained, in deference to the produce already gathered
                and the seat held in your name.
              </p>
              <h3>The Table</h3>
              <p>
                We seat parties as one. Out of courtesy to the room and the rhythm of the kitchen,
                we kindly ask that the full party arrive together before service begins.
              </p>
              <hr class={rule} />
              <h3>Dress &amp; Decorum</h3>
              <p>
                Smart attire is appreciated though never insisted upon; we care far more for the
                company you keep than the cut of your cloth. Photography is welcome, flash is not.
              </p>
              <h3>Dietary Notes</h3>
              <p>
                Our kitchen delights in accommodation. Share your preferences when you reserve and
                the chef will compose accordingly — there is always a way.
              </p>
              <h3>Children &amp; Companions</h3>
              <p>
                Well-mannered guests of every age are welcome at the earlier sitting. Assistance
                animals are, of course, received with pleasure at any hour.
              </p>
            </div>
          </div>
          <div class={footer}>
            <Dialog.Close class={btnGhost}>Close</Dialog.Close>
            <Dialog.Close class={btnPrimary}>I understand</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// ----------------------------------------------------------------- date picker
export const SelectYourStay: Story = {
  render: () => {
    const [range, setRange] = createSignal<Range>({ from: null, to: null });
    return (
      <Dialog.Root>
        <Dialog.Trigger class={trigger}>Select your stay</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay class={overlay} />
          <Dialog.Content class={dialog} style={{ width: "min(94vw, 40rem)" }}>
            <Dialog.Close aria-label="Close">✕</Dialog.Close>
            <div class={header}>
              <span class={eyebrow}>Le Séjour</span>
              <Dialog.Label>Select your stay</Dialog.Label>
              <Dialog.Description>
                Choose your arrival and departure; the suite is yours between.
              </Dialog.Description>
            </div>
            <div class={body}>
              <div class={calMount}>
                <Calendar.Root
                  mode="range"
                  value={range()}
                  onValueChange={setRange}
                  numberOfMonths={2}
                  fixedWeeks
                  startOfWeek={1}
                >
                  {(calendar) => (
                    <div
                      class={calWrap}
                      style={{
                        border: "none",
                        "box-shadow": "none",
                        padding: 0,
                        background: "transparent",
                        "background-image": "none",
                      }}
                    >
                      <div class={calHead}>
                        <Calendar.Nav action="prev-month" aria-label="Previous month">
                          ‹
                        </Calendar.Nav>
                        <span style={{ flex: 1 }} />
                        <Calendar.Nav action="next-month" aria-label="Next month">
                          ›
                        </Calendar.Nav>
                      </div>
                      <div class={calMonths}>
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
                    </div>
                  )}
                </Calendar.Root>
              </div>
            </div>
            <div class={footer}>
              <div style={{ "margin-right": "auto" }}>
                <div
                  class={dl}
                  style={{
                    border: "none",
                    padding: 0,
                    gap: "1.2rem",
                    "grid-template-columns": "auto auto auto",
                  }}
                >
                  <span class="dlVal">{longDate(range().from)}</span>
                  <span class="dlKey" style={{ "align-self": "center" }}>
                    {nights(range().from, range().to) > 0
                      ? `${nights(range().from, range().to)} nights`
                      : "→"}
                  </span>
                  <span class="dlVal">{longDate(range().to)}</span>
                </div>
              </div>
              <Dialog.Close class={btnGhost}>Cancel</Dialog.Close>
              <Dialog.Close class={btnPrimary}>Reserve suite</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
};
