import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_shell/pipelines')({
  component: PipelinesPage,
})

function PipelinesPage() {
  return (
    <>
      <h1>Pipelines</h1>
      <p>Placeholder page. Pipeline definitions would be managed here.</p>
    </>
  )
}
