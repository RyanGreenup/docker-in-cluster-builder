import { createFileRoute, Outlet } from '@tanstack/solid-router'
import { DashboardShell } from '../components/DashboardShell'

// Pathless layout route: `_shell` adds no URL segment, it just wraps every child
// route in the app shell. Because it is a stable parent in the route tree, the
// shell (and its drawer state) persists across navigation; only the <Outlet/>
// content swaps.
export const Route = createFileRoute('/_shell')({ component: ShellLayout })

function ShellLayout() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
