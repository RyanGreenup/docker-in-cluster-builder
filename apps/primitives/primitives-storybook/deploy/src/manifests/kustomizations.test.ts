import assert from "node:assert/strict";
import { test } from "node:test";

import { rootKustomization } from "./kustomizations.js";

test("root kustomization lists app + flux resources, no namespace/postgres/secrets", () => {
  const k = rootKustomization.toJSON() as any;
  assert.deepEqual(k.resources, [
    "deployment.yaml",
    "service.yaml",
    "ingressroute.yaml",
    "networkpolicy.yaml",
    "imagerepository.yaml",
    "imagepolicy.yaml",
    "imageupdateautomation.yaml",
  ]);
});
