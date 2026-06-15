// Intentionally empty. vite-plugin-solid auto-injects
// "@testing-library/jest-dom/vitest" as a setupFile, resolving it from its own
// pnpm location — but vitest then fails to resolve that bare specifier from this
// package root (jest-dom is not a dependency here). The plugin skips its
// injection when an existing setupFile path matches /jest-dom/, so registering
// this no-op file (note the "jest-dom" in its name) suppresses the broken
// injection. The existing tests use plain vitest matchers, not jest-dom.
export {};
