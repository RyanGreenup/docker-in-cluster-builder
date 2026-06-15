import { defineConfig, type UserConfig } from "tsdown";

// `exports` is hand-authored in package.json (a node/browser condition map tsdown
// can't express), so tsdown must not own that field here.
const shared = {
  dts: { tsgo: true },
  exports: false,
} satisfies Partial<UserConfig>;

export default defineConfig([
  // Shared core: pure transform logic over an injected toolkit. Only type-only babel
  // imports, so it's platform-neutral and carries no runtime/`process` access. Built
  // standalone for the `./core` export; also inlined into each adapter below.
  {
    ...shared,
    clean: true,
    entry: ["src/core.ts"],
    platform: "neutral",
  },
  // Node adapter: wires the real `@babel/*` packages, kept external (Node resolves
  // them at runtime; Node has `process`, so no shimming).
  {
    ...shared,
    clean: false,
    entry: ["src/node.ts"],
    platform: "node",
  },
  // Browser adapter: bundles `@babel/standalone` in (a devDependency, so tsdown bundles
  // it by default). It's the vendor's browser build (no naked `process` access), so this
  // needs none of the old `define`/`platform` shimming.
  {
    ...shared,
    clean: false,
    entry: ["src/browser.ts"],
    platform: "browser",
  },
]);
