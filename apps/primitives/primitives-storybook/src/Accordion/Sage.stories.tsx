import { Accordion } from "@rs/solid-primitives";

import { sage, sgEyebrow, sgH1, sgH1Bold, sgTag } from "./exemplars/sage.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Primitives/Accordion/Exemplars/03 Sage",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Wellness: Story = {
  render: () => (
    <div class={sage}>
      <p class={sgEyebrow}>Help & care · for the curious</p>
      <h1 class={sgH1}>
        A few <em>thoughtful</em>
        <br />
        <b class={sgH1Bold}>answers.</b>
      </h1>

      <Accordion
        title={() => "When will my order arrive?"}
        defaultChecked={() => true}
      >
        Most orders leave the studio within two working days, sent
        carbon-neutral by ground from our home in the Cotswolds. UK addresses
        typically receive a parcel within three to five days; the EU and US
        within seven to ten.
        <div>
          <span class={sgTag}>Tracked</span>
          <span class={sgTag}>Carbon-neutral</span>
          <span class={sgTag}>Plastic-free</span>
        </div>
      </Accordion>

      <Accordion title={() => "How does the refill subscription work?"}>
        Choose a cadence — every four, eight, or twelve weeks — and a refill of
        your chosen formula will arrive in a glassine pouch sized to your
        decanted bottle. Pause or reschedule any time.{" "}
        <em>You only purchase the glass once.</em>
      </Accordion>

      <Accordion title={() => "What goes into each formula?"}>
        Every formula is built from a short list of named ingredients — never a
        vague proprietary blend. Each carton lists the percentage of every
        active and the harvest season of botanicals grown in season.
      </Accordion>

      <Accordion title={() => "Are samples available?"}>
        Yes. The Discovery Set includes 5 ml of any three formulas in glass
        vials, with a credit toward a full-size purchase made in the following
        ninety days.
      </Accordion>

      <Accordion title={() => "Can I return something I've opened?"}>
        Always. We'd rather you stop using a formula that doesn't suit you than
        persevere through it — write to us within ninety days for a refund or
        exchange, opened or not.
      </Accordion>
    </div>
  ),
};
