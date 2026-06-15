import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { NetworkPolicy } from "kubernetes-models/networking.k8s.io/v1/NetworkPolicy";
import { Service } from "kubernetes-models/v1/Service";

import {
  APP,
  AUTHELIA,
  commonLabels,
  IMAGE,
  NAMESPACE,
  PULL_SECRET,
} from "../config.js";
import { raw } from "../crd.js";

import { replicasFor, resourcesFor, type NamedManifests } from "@rs/k8s";

const labels = commonLabels({
  name: APP.name,
  component: "storybook",
  version: IMAGE.tag,
});
const selector = { "app.kubernetes.io/name": APP.name };

const deployment = new Deployment({
  metadata: {
    name: APP.name,
    namespace: NAMESPACE,
    annotations: {
      // If the GHCR pull Secret is rotated, give the Deployment a fresh rollout
      // with the new credentials.
      // https://github.com/stakater/Reloader#2--named-resource-reload-specific-resource-annotations
      "secret.reloader.stakater.com/reload": PULL_SECRET,
    },
    labels,
  },
  spec: {
    replicas: replicasFor("primitives-storybook"),
    selector: { matchLabels: selector },
    template: {
      metadata: { labels: selector },
      spec: {
        restartPolicy: "Always",
        imagePullSecrets: [{ name: PULL_SECRET }],
        containers: [
          {
            // `name` is listed first so js-yaml renders `image:` on its own
            // indented line (not as the `- image:` list head), which the Flux
            // $imagepolicy marker injection in markers.ts matches.
            // The container serves the static Storybook bundle via busybox
            // httpd (see apps/primitives-storybook/Containerfile); the image's
            // CMD already runs it, so no command override here.
            name: APP.name,
            image: `${IMAGE.repository}:${IMAGE.tag}`,
            ports: [{ name: "http", containerPort: APP.port, protocol: "TCP" }],
            resources: resourcesFor("primitives-storybook"),
            readinessProbe: {
              httpGet: { path: "/", port: APP.port },
              periodSeconds: 5,
              failureThreshold: 3,
            },
            livenessProbe: { httpGet: { path: "/", port: APP.port } },
            securityContext: {
              allowPrivilegeEscalation: false,
              readOnlyRootFilesystem: true,
              capabilities: { drop: ["ALL"] },
            },
          },
        ],
        securityContext: {
          runAsNonRoot: true,
          runAsUser: 10001,
          runAsGroup: 10001,
          seccompProfile: { type: "RuntimeDefault" },
        },
      },
    },
  },
});

const service = new Service({
  metadata: {
    name: APP.name,
    namespace: NAMESPACE,
    labels: commonLabels({ name: APP.name, component: "storybook" }),
  },
  spec: {
    type: "ClusterIP",
    selector,
    ports: [
      {
        name: "http",
        protocol: "TCP",
        port: APP.servicePort,
        targetPort: APP.port,
      },
    ],
  },
});

const ingressRoute = raw({
  apiVersion: "traefik.io/v1alpha1",
  kind: "IngressRoute",
  metadata: { name: APP.name, namespace: NAMESPACE },
  spec: {
    entryPoints: ["websecure"],
    routes: [
      {
        kind: "Rule",
        match: `Host(\`${APP.host}\`)`,
        middlewares: [
          { name: AUTHELIA.middleware, namespace: AUTHELIA.namespace },
        ],
        services: [{ name: APP.name, port: APP.servicePort }],
      },
    ],
    tls: { certResolver: "letsencrypt" },
  },
});

const networkPolicy = new NetworkPolicy({
  metadata: {
    name: `${APP.name}-allow-ingress`,
    namespace: NAMESPACE,
    labels: commonLabels({ name: APP.name, component: "storybook" }),
  },
  spec: {
    podSelector: { matchLabels: selector },
    policyTypes: ["Ingress", "Egress"],
    ingress: [
      {
        from: [
          {
            namespaceSelector: {
              matchLabels: { "kubernetes.io/metadata.name": "traefik" },
            },
          },
        ],
        ports: [{ protocol: "TCP", port: APP.port }],
      },
    ],
    egress: [
      {
        to: [
          {
            namespaceSelector: {
              matchLabels: { "kubernetes.io/metadata.name": "kube-system" },
            },
          },
        ],
        ports: [
          { protocol: "UDP", port: 53 },
          { protocol: "TCP", port: 53 },
        ],
      },
    ],
  },
});

export const appManifests = {
  deployment,
  service,
  ingressRoute,
  networkPolicy,
} satisfies NamedManifests;
