import { ORPCError, os } from "@orpc/server";
import * as zod from "zod";

const FIRST_TODO_ID = 1;
const TITLE_MIN_LENGTH = 1;

const TodoSchema = zod.object({
  completed: zod.boolean(),
  id: zod.number().int().min(FIRST_TODO_ID),
  title: zod.string().min(TITLE_MIN_LENGTH),
});

export type Todo = zod.infer<typeof TodoSchema>;

const todos: Todo[] = [{ completed: false, id: FIRST_TODO_ID, title: "Wire the web app to oRPC" }];

export const listTodos = os.handler(() => [...todos]);

export const createTodo = os.input(TodoSchema.pick({ title: true })).handler(({ input }) => {
  const todo: Todo = {
    completed: false,
    id: todos.length + FIRST_TODO_ID,
    title: input.title,
  };

  todos.push(todo);
  return todo;
});

export const toggleTodo = os.input(TodoSchema.pick({ id: true })).handler(({ input }) => {
  const todo = todos.find((candidate) => candidate.id === input.id);

  if (!todo) {
    throw new ORPCError("NOT_FOUND", {
      message: `No todo with id ${input.id}`,
    });
  }

  todo.completed = !todo.completed;
  return todo;
});

export const router = {
  todos: {
    create: createTodo,
    list: listTodos,
    toggle: toggleTodo,
  },
};
