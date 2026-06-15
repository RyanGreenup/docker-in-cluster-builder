import { createFileRoute } from '@tanstack/solid-router'
import type { Accessor } from 'solid-js'
import {
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Show,
  Suspense,
} from 'solid-js'

import { Button } from '../components/Button'
import { client } from '../orpc'
import type { Build } from '@rs/buildx-builder-api'

/**
 * Builds route. Calls the oRPC API over HTTP through the shared typed `client`
 * (`src/orpc.ts`); the `Build` type and the client's `router` type come from
 * `@rs/buildx-builder-api` imported as types only, so no server code is bundled
 * into the browser. See `docs/orpc-avoiding-cross-bundling.md`.
 *
 * `createResource` returns a promise-backed signal that Solid's `<Suspense>`
 * tracks automatically: reading `builds()` while it is still loading suspends
 * the subtree and shows the boundary's `fallback` instead.
 */
export const Route = createFileRoute('/builds')({ component: BuildsPage })

// Controls for triggering a new build by image tag.
function TriggerForm(props: {
  tag: string
  pending: boolean
  onTagInput: (value: string) => void
  onTrigger: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        'align-items': 'center',
        'margin-block': '1rem',
      }}
    >
      <input
        aria-label="Image tag"
        value={props.tag}
        onInput={(event) => props.onTagInput(event.currentTarget.value)}
        style={{ padding: '0.4rem 0.6rem', 'min-width': '14rem' }}
      />
      <Button
        loading={props.pending}
        disabled={props.tag.length === 0}
        onClick={() => props.onTrigger()}
      >
        Trigger build
      </Button>
    </div>
  )
}

// Renders the build list behind a suspense boundary. Reading `props.builds()`
// here is what suspends the subtree while the resource is loading.
function BuildList(props: { builds: Accessor<Build[] | undefined> }) {
  return (
    <ErrorBoundary
      fallback={(error: Error) => (
        <p role="alert">Failed to load builds: {error.message}</p>
      )}
    >
      <Suspense fallback={<p aria-busy="true">Loading builds...</p>}>
        <Show
          when={props.builds()?.length}
          fallback={<p>No builds yet. Trigger one above.</p>}
        >
          <ul>
            <For each={props.builds()}>
              {(build) => (
                <li>
                  <strong>{build.tag}</strong> <small>(id: {build.id})</small>{' '}
                  <em>{build.status}</em>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Suspense>
    </ErrorBoundary>
  )
}

function BuildsPage() {
  const [tag, setTag] = createSignal('app:latest')
  const [pending, setPending] = createSignal(false)

  const [builds, { refetch }] = createResource(() => client.builds.list())

  async function triggerBuild(): Promise<void> {
    setPending(true)
    try {
      await client.builds.trigger({ tag: tag() })
      await refetch()
    } finally {
      setPending(false)
    }
  }

  return (
    <div style={{ padding: '2rem', 'font-family': 'var(--font-sans)' }}>
      <h1>Builds</h1>
      <p>
        Backed by the oRPC API in <code>@rs/buildx-builder-api</code>, called
        over HTTP through the shared typed client in <code>src/orpc.ts</code>.
        Trigger a build and the list below refetches through a{' '}
        <code>&lt;Suspense&gt;</code> boundary.
      </p>

      <TriggerForm
        tag={tag()}
        pending={pending()}
        onTagInput={setTag}
        onTrigger={() => {
          void triggerBuild()
        }}
      />

      <BuildList builds={builds} />
    </div>
  )
}
