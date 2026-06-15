import { Accordion } from "@rs/solid-primitives";

import { editorial, edEyebrow, edH1, edRule } from "./exemplars/editorial.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Primitives/Accordion/Exemplars/01 Editorial",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ReadingRoom: Story = {
  render: () => (
    <div class={editorial}>
      <p class={edEyebrow}>Visitor information · MMXXVI</p>
      <h1 class={edH1}>Notes for readers.</h1>
      <p class={edEyebrow} style={{ "margin-top": "6px" }}>
        Frequently asked, kindly answered.
      </p>
      <hr class={edRule} />

      <Accordion
        title={() => "What may I bring into the reading room?"}
        defaultChecked={() => true}
        data-num="i."
      >
        Pencils, loose paper, and a laptop without a case. We provide weighted
        snake supports, cotton gloves where requested, and book pillows at every
        desk. Pens, bound notebooks, food, and bags must be left in the
        cloakroom — a small ritual that has preserved a great many margins.
      </Accordion>

      <Accordion
        title={() => "May I photograph the collection?"}
        data-num="ii."
      >
        Yes, for personal study, without flash and without a tripod. Items
        shelved in the Restricted Cases require a separate consultation form,
        countersigned by the curator on duty.
      </Accordion>

      <Accordion
        title={() => "How do I page material from the stacks?"}
        data-num="iii."
      >
        Submit call slips at the desk by 3 p.m. for same-day retrieval, or in
        advance through the online catalogue. Material from the Annex arrives
        the following weekday morning.
      </Accordion>

      <Accordion
        title={() => "Is reference assistance available?"}
        data-num="iv."
      >
        A librarian is at the desk continuously during opening hours. Longer
        research consultations may be arranged by appointment, including with
        subject specialists in early printing, maps, and the institutional
        archive.
      </Accordion>

      <Accordion
        title={() => "What are the room's hours of opening?"}
        data-num="v."
      >
        Tuesday through Saturday, half past nine until half past five. The room
        is closed on Mondays, on the last Friday of each month for collection
        care, and on the public holidays observed by the university.
      </Accordion>
    </div>
  ),
};
