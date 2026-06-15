import { DashboardLayout, type DashboardLayoutSlotContext } from "@rs/layout";
import { createMemo, createSignal, For } from "solid-js";

import {
  actionGroup,
  amount,
  bottomBar,
  brand,
  brandMeta,
  brandName,
  brandText,
  code,
  content,
  drawerButton,
  headerRow,
  kicker,
  main,
  mark,
  metric,
  metricDetail,
  metricLabel,
  metrics,
  metricValue,
  navbar,
  navItem,
  panel,
  panelGrid,
  panelHeader,
  panelTitle,
  pill,
  queue,
  queueItem,
  queueMeta,
  queueTitle,
  scrim,
  search,
  searchInput,
  shell,
  sidebar,
  stage,
  status,
  statusClear,
  statusReview,
  table,
  tableRow,
  title,
} from "./operations.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const nav = [
  { id: "overview", label: "Overview", icon: "OV" },
  { id: "transfers", label: "Transfers", icon: "TR" },
  { id: "recipients", label: "Recipients", icon: "RC" },
  { id: "risk", label: "Risk", icon: "RK" },
  { id: "reports", label: "Reports", icon: "RP" },
] as const;

const rows = [
  {
    id: "TX-2931",
    recipient: "Hana Okafor",
    route: "AUD to GBP",
    value: "4,820.00",
    status: "Review",
  },
  {
    id: "TX-2930",
    recipient: "Makena Ndlovu",
    route: "USD to KES",
    value: "1,460.00",
    status: "Clear",
  },
  {
    id: "TX-2928",
    recipient: "Tomas Valdez",
    route: "EUR to MXN",
    value: "7,240.00",
    status: "Clear",
  },
  {
    id: "TX-2927",
    recipient: "Priya Shah",
    route: "AUD to INR",
    value: "3,110.00",
    status: "Review",
  },
] as const;

const queueItems = [
  { title: "Manual KYC match", meta: "2 recipients need operator review" },
  { title: "Liquidity sweep", meta: "GBP corridor refresh due in 14 min" },
  { title: "Compliance export", meta: "Daily AUSTRAC package queued" },
] as const;

const meta = {
  title: "Primitives/DashboardLayout/Styled Operations",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const Brand = () => (
  <div class={brand}>
    <span class={mark}>AC</span>
    <span class={brandText}>
      <span class={brandName}>Acme</span>
      <span class={brandMeta}>Operations</span>
    </span>
  </div>
);

const NavItems = (props: {
  ctx: DashboardLayoutSlotContext;
  active: () => string;
  setActive: (id: string) => void;
}) => (
  <For each={nav}>
    {(item) => (
      <button
        {...props.ctx.navItemProps({
          active: props.active() === item.id,
          onSelect: () => props.setActive(item.id),
        })}
      >
        <span class={code}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    )}
  </For>
);

export const StyledOperations: Story = {
  render: () => {
    const [active, setActive] = createSignal("overview");
    const activeLabel = createMemo(
      () => nav.find((item) => item.id === active())?.label ?? "Overview",
    );

    return (
      <div class={stage}>
        <DashboardLayout
          classes={{
            root: shell,
            sidebar,
            navbar,
            main,
            scrim,
            bottomBar,
            navItem,
          }}
          geometry={{
            navHeight: "64px",
            bottomBarHeight: "68px",
            sidebarWidth: "264px",
            drawerWidth: "300px",
            desktopBreakpoint: "980px",
          }}
          brand={() => <Brand />}
          nav={(ctx) => <NavItems ctx={ctx} active={active} setActive={setActive} />}
          search={() => (
            <label class={search}>
              <input
                class={searchInput}
                value="transfer, recipient, corridor"
                aria-label="Search operations"
              />
            </label>
          )}
          actions={(ctx) => (
            <div class={actionGroup}>
              <button
                class={drawerButton}
                {...ctx.drawerTriggerProps({ label: "Open navigation" })}
              >
                Menu
              </button>
              <span class={pill}>LIVE 18:42 UTC</span>
            </div>
          )}
          bottomBar={(ctx) => <NavItems ctx={ctx} active={active} setActive={setActive} />}
        >
          <section class={content}>
            <div class={headerRow}>
              <div>
                <p class={kicker}>Dashboard layout primitive</p>
                <h1 class={title}>{activeLabel()} workspace</h1>
              </div>
              <span class={pill}>6 corridors active</span>
            </div>

            <div class={metrics}>
              <article class={metric}>
                <div class={metricLabel}>Queued value</div>
                <div class={metricValue}>$1.42M</div>
                <div class={metricDetail}>Across 38 pending transfers</div>
              </article>
              <article class={metric}>
                <div class={metricLabel}>Risk reviews</div>
                <div class={metricValue}>7</div>
                <div class={metricDetail}>Median age 11 minutes</div>
              </article>
              <article class={metric}>
                <div class={metricLabel}>SLA health</div>
                <div class={metricValue}>98.6%</div>
                <div class={metricDetail}>Last 24 hours</div>
              </article>
              <article class={metric}>
                <div class={metricLabel}>Treasury buffer</div>
                <div class={metricValue}>4.8x</div>
                <div class={metricDetail}>Above corridor floor</div>
              </article>
            </div>

            <div class={panelGrid}>
              <section class={panel}>
                <header class={panelHeader}>
                  <span class={panelTitle}>Transfer desk</span>
                  <span class={code}>Batch 26-A</span>
                </header>
                <div class={table}>
                  <For each={rows}>
                    {(row) => (
                      <div class={tableRow}>
                        <span class={code}>{row.id}</span>
                        <span>
                          <strong>{row.recipient}</strong>
                          <br />
                          <span class={code}>{row.route}</span>
                        </span>
                        <span class={amount}>{row.value}</span>
                        <span
                          class={`${status} ${row.status === "Clear" ? statusClear : statusReview}`}
                        >
                          {row.status}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </section>

              <aside class={panel}>
                <header class={panelHeader}>
                  <span class={panelTitle}>Operator queue</span>
                  <span class={code}>3 tasks</span>
                </header>
                <div class={queue}>
                  <For each={queueItems}>
                    {(item) => (
                      <div class={queueItem}>
                        <span class={queueTitle}>{item.title}</span>
                        <span class={queueMeta}>{item.meta}</span>
                      </div>
                    )}
                  </For>
                </div>
              </aside>
            </div>
          </section>
        </DashboardLayout>
      </div>
    );
  },
};
