import { For, type JSXElement } from 'solid-js'
import { Link, useRouterState } from '@tanstack/solid-router'
import { DashboardLayout } from '@rs/layout'
import { Button } from './Button'
import * as styles from './dashboard-shell.css'

// The app-wide shell, built on the headless `DashboardLayout` from @rs/layout and
// skinned with the design system (see dashboard-shell.css.ts).
//
// @rs/layout owns structure and behaviour: the desktop sidebar + navbar + main
// grid, the sidebar collapsing into a drawer below 1024px, the scrim, and the
// bottom tab bar. We supply only the slot content and a `classes` skin.
//
// This renders inside the pathless `_shell` layout route, so `children` is the
// router <Outlet/>. Nav is driven by the router: each row is a <Link>, and the
// active row gets `aria-current="page"` automatically (the skin styles that),
// so there is no local "active" state to keep in sync with the URL.

/** Sidebar destinations. `to` is a real route under the `_shell` layout. */
type ShellPath = '/' | '/builds' | '/artifacts' | '/pipelines' | '/settings'

interface NavItem {
  readonly label: string
  readonly to: ShellPath
  /** Match the path exactly (used for '/', so it is not active everywhere). */
  readonly exact?: boolean
}

const NAV: readonly NavItem[] = [
  { label: 'Overview', to: '/', exact: true },
  { label: 'Builds', to: '/builds' },
  { label: 'Artifacts', to: '/artifacts' },
  { label: 'Pipelines', to: '/pipelines' },
  { label: 'Settings', to: '/settings' },
]

// The mobile bottom bar surfaces the primary destinations.
const TABS: readonly NavItem[] = [NAV[0], NAV[1], NAV[2], NAV[4]]

export interface DashboardShellProps {
  /** Main-panel content; supplied by the layout route as the router <Outlet/>. */
  children: JSXElement
}

export function DashboardShell(props: DashboardShellProps): JSXElement {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  // Navbar title derived from the route, matching the active nav row.
  const title = (): string => {
    const path = pathname()
    const match = NAV.find((item) =>
      item.exact ? path === item.to : path.startsWith(item.to),
    )
    return match?.label ?? 'Buildx'
  }

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
            <Link
              to={item.to}
              class={styles.navItem}
              activeOptions={item.exact ? { exact: true } : undefined}
              onClick={() => ctx.closeDrawer()}
            >
              {item.label}
            </Link>
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
          <strong class={styles.navTitle}>{title()}</strong>
          <span class={styles.navSpacer} />
          <Button size="sm">New build</Button>
        </>
      )}
      bottomBar={(ctx) => (
        <For each={TABS}>
          {(item) => (
            <Link
              to={item.to}
              class={styles.tab}
              activeOptions={item.exact ? { exact: true } : undefined}
              onClick={() => ctx.closeDrawer()}
            >
              {item.label}
            </Link>
          )}
        </For>
      )}
    >
      {props.children}
    </DashboardLayout>
  )
}
