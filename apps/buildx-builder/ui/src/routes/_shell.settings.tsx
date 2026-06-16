import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_shell/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <p>Placeholder page. Workspace and build settings would live here.</p>
    </>
  )
}
