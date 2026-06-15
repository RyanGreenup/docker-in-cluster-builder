import { createFileRoute } from '@tanstack/solid-router'
import { DashboardShell } from '../components/DashboardShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardShell,
})
