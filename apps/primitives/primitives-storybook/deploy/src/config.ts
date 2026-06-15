export const NAMESPACE = "platform";

export const APP = {
  name: "primitives-storybook",
  // busybox httpd serves the static Storybook bundle on 8080 (>1024 so a
  // non-root user can bind it).
  port: 8080,
  servicePort: 80,
  host: "primitives-storybook.ryangreenup.com.au",
} as const;

export const IMAGE = {
  repository: "ghcr.io/ryangreenup/primitives-storybook",
  tag: "1780000000-00000000", // seed tag; Flux bumps it via $imagepolicy markers
} as const;

export const AUTHELIA = {
  middleware: "forwardauth-authelia",
  namespace: "authelia",
} as const;

export const FLUX_NAMESPACE = "flux-system";

/** GHCR pull secret name; already present in the platform namespace (created
 * out-of-band for docs). */
export const PULL_SECRET = "ghcr-auth";

export interface LabelOpts {
  readonly name: string;
  readonly component: string;
  readonly version?: string;
}

export const commonLabels = (opts: LabelOpts): Record<string, string> => {
  const labels: Record<string, string> = {
    "app.kubernetes.io/name": opts.name,
    "app.kubernetes.io/instance": `${opts.name}-main`,
    "app.kubernetes.io/component": opts.component,
    "app.kubernetes.io/part-of": "platform",
    "app.kubernetes.io/managed-by": "cli",
  };
  if (opts.version !== undefined) {
    labels["app.kubernetes.io/version"] = opts.version;
  }
  return labels;
};
