import { Accordion } from "@rs/solid-primitives";

import { stencil, stTag, stH1, stH1Em, stRow } from "./exemplars/stencil.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Primitives/Accordion/Exemplars/05 Stencil",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Studio: Story = {
  render: () => (
    <div class={stencil}>
      <p class={stTag}>Working with the studio</p>
      <h1 class={stH1}>
        Frequently <em class={stH1Em}>asked</em>, plainly answered.
      </h1>

      <Accordion
        title={() => "What does an engagement look like?"}
        defaultChecked={() => true}
        data-num="01"
      >
        Most engagements run six to twelve weeks across three phases: a week of
        discovery, a sprint of concept work, and the build. We staff small —
        usually one lead and one partner — and we don't subcontract.
        <dl class={stRow}>
          <dt>Phase 01</dt>
          <dd>Discovery — interviews, audit, brief.</dd>
          <dt>Phase 02</dt>
          <dd>Direction — three routes, one chosen.</dd>
          <dt>Phase 03</dt>
          <dd>Build — production, QA, handoff.</dd>
        </dl>
      </Accordion>

      <Accordion title={() => "How do you price the work?"} data-num="02">
        We quote a fixed fee per phase against an agreed scope. There are no
        hourly rates and no surprise invoices; if the scope changes mid-flight,
        we re-quote in writing before continuing.
      </Accordion>

      <Accordion title={() => "Who actually does the work?"} data-num="03">
        The partners. Every project is led by one of us end-to-end. We bring in
        a small bench of trusted collaborators for motion, copywriting, and
        engineering — never anonymous staffing.
      </Accordion>

      <Accordion
        title={() => "How many rounds of revision are included?"}
        data-num="04"
      >
        Two structured rounds per deliverable, plus a final polish pass. We've
        found that more rounds rarely yield better work — and that bringing the
        right people into the room early matters far more.
      </Accordion>

      <Accordion title={() => "Do you take on retainers?"} data-num="05">
        Yes, for a small number of partners at a time. A retainer buys a fixed
        share of our week — typically one day of direction and two of production
        — and is best suited to teams shipping a product on a steady cadence.
      </Accordion>
    </div>
  ),
};
