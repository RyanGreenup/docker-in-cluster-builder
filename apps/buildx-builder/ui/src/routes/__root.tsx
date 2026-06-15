import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'

// Design system side-effects from the @rs/ryan-personal-website-design dependency:
// global.css provides fonts, base tokens and keyframes; theme.css registers the
// typed light/dark colour contract (the `vars.roles.*` the recipes read from).
import '@rs/ryan-personal-website-design/global.css'
import '@rs/ryan-personal-website-design/theme.css'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
