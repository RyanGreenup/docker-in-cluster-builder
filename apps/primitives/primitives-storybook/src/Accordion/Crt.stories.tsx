import { Accordion } from "@rs/solid-primitives";

import { crt, crtBar, crtH1, crtSub, crtLine } from "./exemplars/crt.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const meta = {
  title: "Primitives/Accordion/Exemplars/04 CRT Terminal",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Phosphor: Story = {
  render: () => (
    <div class={crt}>
      <div class={crtBar}>
        <span>RUNBOOK ── ops.faq</span>
        <span>tty1 · 80x24</span>
      </div>
      <h1 class={crtH1}>faq.log</h1>
      <p class={crtSub}>// last reviewed: 2026-05-25 — uptime 412d 09h</p>

      <Accordion
        title={() => "why won't the daemon start?"}
        defaultChecked={() => true}
      >
        <span class={crtLine}>
          check the journal: <b>journalctl -xeu primitived</b>
        </span>
        <span class={crtLine}>
          nine times in ten it's a stale pidfile in{" "}
          <b>/var/run/primitived.pid</b>
        </span>
        <span class={crtLine}>
          remove it, then restart: <b>systemctl restart primitived</b>
        </span>
      </Accordion>

      <Accordion title={() => "how do I rotate credentials?"}>
        <span class={crtLine}>issue a new token from the operator console</span>
        <span class={crtLine}>
          push to the secret store:{" "}
          <b>vault kv put kv/primitive/api token=...</b>
        </span>
        <span class={crtLine}>
          trigger a rolling restart — old tokens grace out after 24h
        </span>
      </Accordion>

      <Accordion title={() => "which ports does it listen on?"}>
        <span class={crtLine}>
          <b>:443</b> tls api · <b>:8443</b> mtls admin · <b>:9100</b>{" "}
          prometheus
        </span>
        <span class={crtLine}>
          internal gossip on <b>:7946</b> tcp+udp — must be open between peers
        </span>
      </Accordion>

      <Accordion title={() => "where are the logs?"}>
        <span class={crtLine}>
          structured json at <b>/var/log/primitived/app.log</b>
        </span>
        <span class={crtLine}>
          audit trail at <b>/var/log/primitived/audit.log</b> — append-only
        </span>
        <span class={crtLine}>
          rotated daily, kept 30d, shipped to the SIEM at 02:00 UTC
        </span>
      </Accordion>

      <Accordion title={() => "how do I drain a node before maintenance?"}>
        <span class={crtLine}>
          <b>primitivectl drain --node $HOSTNAME --timeout 5m</b>
        </span>
        <span class={crtLine}>
          wait for connections to bleed off — watch <b>active_sessions</b>
        </span>
        <span class={crtLine}>
          then patch, reboot, <b>primitivectl uncordon</b>
        </span>
      </Accordion>
    </div>
  ),
};
