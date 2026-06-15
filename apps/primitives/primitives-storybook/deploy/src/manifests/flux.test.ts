import assert from "node:assert/strict";
import { test } from "node:test";

import { fluxManifests } from "./flux.js";

test("flux set has imageRepository, imagePolicy, imageUpdateAutomation", () => {
  assert.deepEqual(Object.keys(fluxManifests).sort(), [
    "imagePolicy",
    "imageRepository",
    "imageUpdateAutomation",
  ]);
});

test("imageRepository points at the GHCR image in flux-system with the pull secret", () => {
  const ir = fluxManifests.imageRepository.toJSON() as any;
  assert.equal(ir.metadata.namespace, "flux-system");
  assert.equal(
    ir.spec.image,
    "ghcr.io/ryangreenup/primitives-storybook",
  );
  assert.equal(ir.spec.secretRef.name, "ghcr-auth");
});

test("imagePolicy orders numerically (asc) on the timestamp prefix", () => {
  const ip = fluxManifests.imagePolicy.toJSON() as any;
  assert.equal(ip.spec.filterTags.extract, "$ts");
  assert.equal(ip.spec.policy.numerical.order, "asc");
});

test("imageUpdateAutomation updates the primitives-storybook overlay with Setters", () => {
  const iua = fluxManifests.imageUpdateAutomation.toJSON() as any;
  assert.equal(
    iua.spec.update.path,
    "./gitops/cluster/doks/apps/platform/primitives-storybook",
  );
  assert.equal(iua.spec.update.strategy, "Setters");
});
