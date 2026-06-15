import { APP, FLUX_NAMESPACE, IMAGE, PULL_SECRET } from "../config.js";
import { raw } from "../crd.js";

import type { NamedManifests } from "@rs/k8s";

const imageRepository = raw({
  apiVersion: "image.toolkit.fluxcd.io/v1",
  kind: "ImageRepository",
  metadata: { name: APP.name, namespace: FLUX_NAMESPACE },
  spec: {
    image: IMAGE.repository,
    interval: "5m",
    secretRef: { name: PULL_SECRET },
  },
});

const imagePolicy = raw({
  apiVersion: "image.toolkit.fluxcd.io/v1",
  kind: "ImagePolicy",
  metadata: { name: APP.name, namespace: FLUX_NAMESPACE },
  spec: {
    imageRepositoryRef: { name: APP.name },
    // Tags are <unix-timestamp>-<short-sha>, e.g. 1749225060-0e12a08f.
    // Extract the timestamp prefix for numerical ordering — higher = newer.
    filterTags: { pattern: "^(?P<ts>[0-9]+)-[a-f0-9]+$", extract: "$ts" },
    policy: { numerical: { order: "asc" } },
  },
});

const imageUpdateAutomation = raw({
  apiVersion: "image.toolkit.fluxcd.io/v1",
  kind: "ImageUpdateAutomation",
  metadata: { name: APP.name, namespace: FLUX_NAMESPACE },
  spec: {
    interval: "5m",
    sourceRef: { kind: "GitRepository", name: "flux-system" },
    git: {
      checkout: { ref: { branch: "main" } },
      commit: {
        author: { email: "flux@localhost", name: "Flux" },
        messageTemplate: `chore: update ${APP.name} image{{range .Changed.Changes}} to {{.NewValue}}{{end}}`,
      },
      push: { branch: "main" },
    },
    update: {
      path: `./gitops/cluster/doks/apps/platform/${APP.name}`,
      strategy: "Setters",
    },
  },
});

export const fluxManifests = {
  imageRepository,
  imagePolicy,
  imageUpdateAutomation,
} satisfies NamedManifests;
