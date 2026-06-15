import { raw } from "../crd.js";

const kustomization = (resources: readonly string[]) =>
  raw({
    apiVersion: "kustomize.config.k8s.io/v1beta1",
    kind: "Kustomization",
    resources: [...resources],
  });

// No namespace.yaml — the platform namespace is owned by the docs overlay; a
// second Namespace resource would collide in the parent kustomize build. No
// postgres/secrets subdirs — the storybook is static and uses the existing
// ghcr-auth pull secret.
export const rootKustomization = kustomization([
  "deployment.yaml",
  "service.yaml",
  "ingressroute.yaml",
  "networkpolicy.yaml",
  "imagerepository.yaml",
  "imagepolicy.yaml",
  "imageupdateautomation.yaml",
]);
