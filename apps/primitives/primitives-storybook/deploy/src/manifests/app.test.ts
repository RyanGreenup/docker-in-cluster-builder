import assert from "node:assert/strict";
import { test } from "node:test";

import { appManifests } from "./app.js";

test("app set has deployment, service, ingressRoute, networkPolicy", () => {
  assert.deepEqual(Object.keys(appManifests).sort(), [
    "deployment",
    "ingressRoute",
    "networkPolicy",
    "service",
  ]);
});

test("app deployment: image, port 8080, pull secret, read-only root, no command/env", () => {
  const d = appManifests.deployment.toJSON() as any;
  const c = d.spec.template.spec.containers[0];
  assert.equal(
    c.image,
    "ghcr.io/ryangreenup/primitives-storybook:1780000000-00000000",
  );
  assert.equal(c.command, undefined);
  assert.equal(c.env, undefined);
  assert.equal(c.ports[0].containerPort, 8080);
  assert.equal(d.spec.template.spec.imagePullSecrets[0].name, "ghcr-auth");
  assert.equal(
    d.metadata.annotations["secret.reloader.stakater.com/reload"],
    "ghcr-auth",
  );
  assert.equal(c.securityContext.readOnlyRootFilesystem, true);
});

test("app deployment probes hit / over HTTP on the container port", () => {
  const d = appManifests.deployment.toJSON() as any;
  const c = d.spec.template.spec.containers[0];
  assert.equal(c.readinessProbe.httpGet.path, "/");
  assert.equal(c.readinessProbe.httpGet.port, 8080);
  assert.equal(c.livenessProbe.httpGet.port, 8080);
});

test("pod template carries only the name selector label", () => {
  const d = appManifests.deployment.toJSON() as any;
  assert.deepEqual(d.spec.template.metadata.labels, {
    "app.kubernetes.io/name": "primitives-storybook",
  });
});

test("service maps port 80 -> targetPort 8080", () => {
  const s = appManifests.service.toJSON() as any;
  assert.equal(s.spec.ports[0].port, 80);
  assert.equal(s.spec.ports[0].targetPort, 8080);
});

test("ingressRoute matches host, websecure, letsencrypt, authelia middleware, service port 80", () => {
  const ir = appManifests.ingressRoute.toJSON() as any;
  assert.equal(ir.apiVersion, "traefik.io/v1alpha1");
  assert.equal(ir.spec.entryPoints[0], "websecure");
  assert.equal(ir.spec.tls.certResolver, "letsencrypt");
  const route = ir.spec.routes[0];
  assert.match(route.match, /primitives-storybook\.ryangreenup\.com\.au/);
  assert.deepEqual(route.middlewares[0], {
    name: "forwardauth-authelia",
    namespace: "authelia",
  });
  assert.equal(route.services[0].port, 80);
});

test("networkPolicy allows ingress from traefik on 8080 and egress to DNS only", () => {
  const np = appManifests.networkPolicy.toJSON() as any;
  assert.equal(np.spec.ingress[0].ports[0].port, 8080);
  assert.deepEqual(np.spec.ingress[0].from[0], {
    namespaceSelector: {
      matchLabels: { "kubernetes.io/metadata.name": "traefik" },
    },
  });
  const egressPorts = np.spec.egress.flatMap((e: any) =>
    (e.ports ?? []).map((p: any) => p.port),
  );
  assert.ok(egressPorts.includes(53));
  assert.ok(!egressPorts.includes(5432), "static site has no postgres egress");
});

test("kubernetes-models app manifests validate", () => {
  assert.doesNotThrow(() => {
    appManifests.deployment.validate();
  });
  assert.doesNotThrow(() => {
    appManifests.service.validate();
  });
  assert.doesNotThrow(() => {
    appManifests.networkPolicy.validate();
  });
});
