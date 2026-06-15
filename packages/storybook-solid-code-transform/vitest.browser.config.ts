import { defineConfig } from "vitest/config";

// The browser smoke test boots a real Vite dev server + Chromium itself, so it
// runs in the Node environment and is kept out of the fast unit suite / coverage.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
