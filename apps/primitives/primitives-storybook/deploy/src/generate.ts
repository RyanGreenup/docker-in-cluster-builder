import { capacitySummary, writeManifests } from "@rs/k8s";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { APP, IMAGE } from "./config.js";
import { appManifests } from "./manifests/app.js";
import { fluxManifests } from "./manifests/flux.js";
import { rootKustomization } from "./manifests/kustomizations.js";
import { injectImagePolicyMarkers } from "./markers.js";

// apps/primitives-storybook/deploy/src -> repo root is four levels up.
const outDir = resolve(
  import.meta.dirname,
  "../../../../gitops/cluster/doks/apps/platform/primitives-storybook",
);

// 1. App + flux + root kustomization. Keys become <key>.yaml and must match
//    rootKustomization entries.
await writeManifests(outDir, {
  deployment: appManifests.deployment,
  service: appManifests.service,
  ingressroute: appManifests.ingressRoute,
  networkpolicy: appManifests.networkPolicy,
  imagerepository: fluxManifests.imageRepository,
  imagepolicy: fluxManifests.imagePolicy,
  imageupdateautomation: fluxManifests.imageUpdateAutomation,
  kustomization: rootKustomization,
});

// 2. Inject $imagepolicy marker comments js-yaml cannot emit.
const deploymentPath = join(outDir, "deployment.yaml");
const patched = injectImagePolicyMarkers(
  await readFile(deploymentPath, "utf8"),
  {
    image: IMAGE.repository,
    policy: `flux-system:${APP.name}`,
  },
);
await writeFile(deploymentPath, patched, "utf8");

console.log(`Rendered ${APP.name} manifests to ${outDir}`);
console.log(capacitySummary());
