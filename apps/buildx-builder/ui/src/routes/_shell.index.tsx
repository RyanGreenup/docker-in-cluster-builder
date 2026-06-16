import { createFileRoute } from '@tanstack/solid-router'
import { createResource, For, Show } from 'solid-js'

import { Button } from '../components/Button'
import { client } from '../orpc'

/** Fetch the list of planets from the API */
async function fetchPlanets() {
  return client.planet.list({ cursor: 0 })
}

export const Route = createFileRoute('/_shell/')({ component: Home })

function Home() {
  const [planets] = createResource(fetchPlanets)

  return (
    <>
      <h1>Welcome to TanStack Start</h1>
      <p>
        Edit <code>src/routes/_shell.index.tsx</code> to get started. This page
        renders inside the app shell (
        <code>src/components/DashboardShell.tsx</code>), the pathless{' '}
        <code>_shell</code> layout route built on <code>@rs/layout</code>.
      </p>

      <h2>oRPC Example: Planets</h2>
      <Show
        when={!planets.loading}
        fallback={<p aria-busy="true">Loading planets...</p>}
      >
        <Show
          when={!planets.error}
          fallback={
            <p role="alert">Error loading planets: {planets.error.message}</p>
          }
        >
          <ul>
            <For each={planets()}>
              {(planet) => (
                <li>
                  {planet.name} <small>(id: {planet.id})</small>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Show>

      <h2>Design system button</h2>
      <p>
        The buttons below are styled by the <code>button</code> recipe from{' '}
        <code>@rs/ryan-personal-website-design</code>. See{' '}
        <code>src/components/Button.tsx</code> for how the recipe is wrapped.
      </p>

      <div
        style={{
          display: 'flex',
          'flex-wrap': 'wrap',
          gap: '0.75rem',
          'align-items': 'center',
          'margin-block': '1rem',
        }}
      >
        <Button onClick={() => alert('Primary clicked')}>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </div>

      <div
        style={{
          display: 'flex',
          'flex-wrap': 'wrap',
          gap: '0.75rem',
          'align-items': 'center',
          'margin-block': '1rem',
        }}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </>
  )
}
