import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_shell/artifacts')({
  component: ArtifactsPage,
})

function ArtifactsPage() {
  return (
    <>
      <h1>Artifacts</h1>
      <p>Placeholder page. Build outputs would be listed here.</p>
    </>
  )
}
