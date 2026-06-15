import type { Manifest } from "@rs/k8s";

/**
 * Wraps a plain object as a `Manifest` so it can go through `writeManifests`
 * alongside kubernetes-models objects. Used for CRDs not in kubernetes-models
 * (Traefik IngressRoute/Middleware, Flux ImageRepository/ImagePolicy/
 * ImageUpdateAutomation) and for Kustomization files. `validate()` is a no-op —
 * these have no local schema.
 */
export const raw = (body: Readonly<Record<string, unknown>>): Manifest => ({
  validate: () => {},
  toJSON: () => body,
});
