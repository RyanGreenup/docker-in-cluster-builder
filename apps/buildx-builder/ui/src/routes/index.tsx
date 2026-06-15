import { createFileRoute } from '@tanstack/solid-router'
import { Button } from '../components/Button'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div style={{ padding: '2rem', 'font-family': 'var(--font-sans)' }}>
      <h1>Welcome to TanStack Start</h1>
      <p>
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>

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
    </div>
  )
}
