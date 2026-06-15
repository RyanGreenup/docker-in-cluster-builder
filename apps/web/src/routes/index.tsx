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

import { client } from '../orpc'
import type { Todo } from '@template/api'

export const Route = createFileRoute('/')({ component: Home })

function TodoForm(props: {
  onCreate: (title: string) => Promise<void>
  pending: boolean
}) {
  const [title, setTitle] = createSignal('')

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault()

    const nextTitle = title().trim()
    if (nextTitle.length === 0) {
      return
    }

    await props.onCreate(nextTitle)
    setTitle('')
  }

  return (
    <form class="todo-form" onSubmit={(event) => void submit(event)}>
      <input
        aria-label="New todo"
        placeholder="Add a todo"
        value={title()}
        onInput={(event) => setTitle(event.currentTarget.value)}
      />
      <button disabled={props.pending || title().trim().length === 0}>
        {props.pending ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

function TodoList(props: {
  todos: Accessor<Todo[] | undefined>
  onToggle: (id: number) => Promise<void>
}) {
  return (
    <ErrorBoundary
      fallback={(error: Error) => (
        <p role="alert">Failed to load todos: {error.message}</p>
      )}
    >
      <Suspense fallback={<p aria-busy="true">Loading todos...</p>}>
        <Show
          when={props.todos()?.length}
          fallback={<p class="empty-state">No todos yet.</p>}
        >
          <ul class="todo-list">
            <For each={props.todos()}>
              {(todo) => (
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => void props.onToggle(todo.id)}
                    />
                    <span class={todo.completed ? 'completed' : undefined}>
                      {todo.title}
                    </span>
                  </label>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </Suspense>
    </ErrorBoundary>
  )
}

function Home() {
  const [pending, setPending] = createSignal(false)
  const [todos, { refetch }] = createResource(() => client.todos.list())

  async function createTodo(title: string): Promise<void> {
    setPending(true)
    try {
      await client.todos.create({ title })
      await refetch()
    } finally {
      setPending(false)
    }
  }

  async function toggleTodo(id: number): Promise<void> {
    await client.todos.toggle({ id })
    await refetch()
  }

  return (
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">Solid + oRPC</p>
        <h1>Full-stack TypeScript template</h1>
        <p>
          The web app calls the API through oRPC over HTTP while importing the
          server router as a type only.
        </p>
      </section>

      <section class="panel" aria-labelledby="todos-title">
        <h2 id="todos-title">Todos</h2>
        <TodoForm pending={pending()} onCreate={createTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} />
      </section>
    </main>
  )
}
