import { createSignal, For, Show, type JSXElement } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { DashboardLayout } from '@rs/layout'
import { Button } from './Button'
import * as styles from './dashboard-shell.css'

// Exemplar: a dashboard shell built on the headless `DashboardLayout` from
// @rs/layout, skinned with the design system (see dashboard-shell.css.ts).
//
// The layout owns structure and behaviour: the desktop sidebar + navbar + main
// grid, the sidebar collapsing into a drawer below 1024px, the scrim, and the
// bottom tab bar. We supply only the slot content and a `classes` skin. The
// active nav row and active tab are app state, held here as signals.

/** A sidebar destination. `to` makes the row navigate to a real route. */
interface NavItem {
  readonly label: string
  readonly to?: '/builds'
}

const NAV: readonly NavItem[] = [
  { label: 'Overview' },
  { label: 'Builds', to: '/builds' },
  { label: 'Artifacts' },
  { label: 'Pipelines' },
  { label: 'Settings' },
]
const TABS = ['Home', 'Builds', 'Artifacts', 'Activity'] as const

const SECTIONS = [
  {
    title: 'Headless by construction',
    body: 'The grid, the responsive reflow and the drawer mechanics all live in @rs/layout. This page supplies only slot content and a design-system skin.',
  },
  {
    title: 'One piece of shared state',
    body: 'Only the drawer open/close state lives in the layout. The active destination is app state, passed to navItemProps so the active row gets aria-current=page.',
  },
  {
    title: 'Themed for free',
    body: 'Every colour comes from the design theme contract, so the shell flips light/dark with the rest of the app and never hard-codes a value.',
  },
] as const

function DefaultContent(props: { active: string }): JSXElement {
  return (
    <>
      <h1 class={styles.pageTitle}>{props.active}</h1>
      <div class={styles.cardGrid}>
        <For each={SECTIONS}>
          {(section) => (
            <article class={styles.card}>
              <h2 class={styles.cardTitle}>{section.title}</h2>
              <p class={styles.cardBody}>{section.body}</p>
            </article>
          )}
        </For>
      </div>
    </>
  )
}

export interface DashboardShellProps {
  /** Optional content for the main panel; defaults to the exemplar copy. */
  children?: JSXElement
}

export function DashboardShell(props: DashboardShellProps): JSXElement {
  const [active, setActive] = createSignal<string>('Overview')
  const [tab, setTab] = createSignal<string>('Home')
  const navigate = useNavigate()

  return (
    <DashboardLayout
      classes={{
        sidebar: styles.sidebar,
        navbar: styles.navbar,
        main: styles.main,
        bottomBar: styles.bottomBar,
        navItem: styles.navItem,
      }}
      brand={() => <div class={styles.brand}>Buildx</div>}
      nav={(ctx) => (
        <For each={NAV}>
          {(item) => (
            <button
              {...ctx.navItemProps({
                active: active() === item.label,
                onSelect: () => {
                  setActive(item.label)
                  if (item.to) {
                    void navigate({ to: item.to })
                  }
                },
              })}
            >
              {item.label}
            </button>
          )}
        </For>
      )}
      search={(ctx) => (
        <button
          {...ctx.drawerTriggerProps({ label: 'Toggle menu' })}
          class={styles.drawerTrigger}
        >
          Menu
        </button>
      )}
      actions={() => (
        <>
          <strong class={styles.navTitle}>{active()}</strong>
          <span class={styles.navSpacer} />
          <Button size="sm">New build</Button>
        </>
      )}
      bottomBar={() => (
        <For each={TABS}>
          {(label) => (
            <button
              type="button"
              class={styles.tab}
              aria-current={tab() === label ? 'page' : undefined}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          )}
        </For>
      )}
    >
      <Show
        when={props.children}
        fallback={<DefaultContent active={active()} />}
      >
        {props.children}
      </Show>
    </DashboardLayout>
  )
}
