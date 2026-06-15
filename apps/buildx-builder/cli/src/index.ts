#!/usr/bin/env node

import { buildImage } from "@rs/buildx-builder-lib";
import { type ArgsDef, defineCommand, runMain } from "citty";

const ARG_START_INDEX = 2;
const ENTRYPOINT_ARG_INDEX = 1;

const parseTimeout = (raw: string | undefined): number | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  return Number(raw);
};

const cmdArgs = {
  contextDir: {
    description: "Path to the build context",
    required: true,
    type: "positional",
  },
  dockerfile: {
    alias: "f",
    description: "Path to Dockerfile (defaults to <contextDir>/Dockerfile)",
    required: false,
    type: "string",
  },
  push: {
    description: "Push to registry instead of loading into local daemon",
    required: false,
    type: "boolean",
  },
  tag: {
    alias: "t",
    description: "Image tag (e.g. registry.example.com/app:abc123)",
    required: true,
    type: "string",
  },
  timeout: {
    description: "Build timeout in milliseconds (default: 5 minutes)",
    required: false,
    type: "string",
  },
} as const satisfies ArgsDef;

export const mainCommand = defineCommand({
  args: cmdArgs,
  meta: {
    description: [
      "Build a docker image in-cluster with buildx.",
      "",
      "Example (simple alpine build):",
      "  Dockerfile:",
      "    FROM alpine:3.20",
      '    CMD ["echo", "hello from alpine"]',
      "",
      "  buildx-builder-cli ./ --tag registry.example.com/alpine-demo:latest --push",
    ].join("\n"),
    name: "buildx-builder-cli",
    version: "0.0.1",
  },
  async run({ args }) {
    const timeout = parseTimeout(args.timeout);
    console.log("Starting build");
    await buildImage({
      contextDir: args.contextDir,
      dockerfile: args.dockerfile,
      onLog: (chunk) => process.stdout.write(chunk),
      push: args.push,
      tag: args.tag,
      timeout,
    });
  },
});

/**
 * Run the CLI against the given arguments, resolving when the command settles.
 * @param args - Raw CLI arguments (defaults to argv without node and the script path).
 * @returns A promise that resolves once the command finishes.
 */
export const main = (args = process.argv.slice(ARG_START_INDEX)): Promise<void> =>
  runMain(mainCommand, { rawArgs: args });

if (import.meta.url === `file://${process.argv[ENTRYPOINT_ARG_INDEX]}`) {
  await main();
}
