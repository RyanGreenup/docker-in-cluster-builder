import { Accordion } from "@rs/solid-primitives";

import {
  brutalist,
  brHead,
  brH1,
  brH1Small,
  brMeta,
} from "./exemplars/brutalist.css";

import type { JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Primitives/Accordion/Exemplars/02 Brutalist",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// `--br-tag` must be a quoted CSS string so `content: var(--br-tag)` renders it.
const tag = (value: string): JSX.CSSProperties => ({
  "--br-tag": `"${value}"`,
});

export const SpecSheet: Story = {
  render: () => (
    <div class={brutalist}>
      <div class={brHead}>
        <span>DOC · API · v4.2.0</span>
        <span>2026-05-25</span>
      </div>
      <h2 class={brH1}>
        Operator FAQ
        <small class={brH1Small}>
          // Read before opening a support ticket.
        </small>
      </h2>

      <Accordion
        title={() => "How is the API versioned?"}
        defaultChecked={() => true}
        style={tag("VER-001")}
      >
        We pin a major version in the URL (<code>/v4/...</code>) and additive
        minor changes ship without warning. <b>Breaking</b> changes only ever
        land in a new major.
        <dl class={brMeta}>
          <dt>Channel</dt>
          <dd>stable</dd>
          <dt>SLA</dt>
          <dd>99.95% monthly</dd>
          <dt>Sunset</dt>
          <dd>v3 — 2026-12-31</dd>
        </dl>
      </Accordion>

      <Accordion
        title={() => "What are the rate limits?"}
        style={tag("LIM-002")}
      >
        Default: <code>600 req/min</code> per token, <code>50 concurrent</code>.
        Bursts up to 2× allowed for ten seconds. The response carries{" "}
        <code>X-RateLimit-Remaining</code>
        and <code>Retry-After</code>; clients SHOULD honour both.
      </Accordion>

      <Accordion
        title={() => "Which auth schemes are supported?"}
        style={tag("AUT-003")}
      >
        Bearer tokens (recommended), HMAC-signed requests, and short-lived OIDC
        exchange tokens for desktop clients. Basic auth was removed in v4.0.
      </Accordion>

      <Accordion
        title={() => "How do I report a regression?"}
        style={tag("OPS-004")}
      >
        File an issue with the failing <code>request-id</code> header value
        attached. We retain trace data for fourteen days at the{" "}
        <code>info</code> level and ninety days at <code>error</code>.
      </Accordion>

      <Accordion
        title={() => "Is there a sandbox environment?"}
        style={tag("ENV-005")}
      >
        Yes. <code>sandbox.api.example.com</code> mirrors production routing
        with synthetic data and unrestricted rate limits. Webhooks fire against
        any URL you register; we recommend <code>localhost</code> tunnels for
        development.
      </Accordion>
    </div>
  ),
};
