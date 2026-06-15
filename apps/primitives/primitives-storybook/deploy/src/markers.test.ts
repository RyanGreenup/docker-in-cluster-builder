import assert from "node:assert/strict";
import { test } from "node:test";

import { injectImagePolicyMarkers } from "./markers.js";

const opts = {
  image: "ghcr.io/ryangreenup/primitives-storybook",
  policy: "flux-system:primitives-storybook",
};

test("appends image policy marker to the image line", () => {
  const yaml =
    "        image: ghcr.io/ryangreenup/primitives-storybook:1780000000-00000000";
  const out = injectImagePolicyMarkers(yaml, opts);
  assert.equal(
    out,
    `        image: ghcr.io/ryangreenup/primitives-storybook:1780000000-00000000 # {"$imagepolicy": "flux-system:primitives-storybook"}`,
  );
});

test("appends tag marker to the version label", () => {
  const yaml = "    app.kubernetes.io/version: 1780000000-00000000";
  const out = injectImagePolicyMarkers(yaml, opts);
  assert.equal(
    out,
    `    app.kubernetes.io/version: 1780000000-00000000 # {"$imagepolicy": "flux-system:primitives-storybook:tag"}`,
  );
});

test("is idempotent — does not double-append", () => {
  const yaml =
    "        image: ghcr.io/ryangreenup/primitives-storybook:1780000000-00000000";
  const once = injectImagePolicyMarkers(yaml, opts);
  const twice = injectImagePolicyMarkers(once, opts);
  assert.equal(once, twice);
});
