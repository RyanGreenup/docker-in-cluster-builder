#!/usr/bin/env node

import { formatMessage } from "@rs/buildx-builder-lib";
import { defineCommand, runMain } from "citty";

const ARG_START_INDEX = 2;
const ENTRYPOINT_ARG_INDEX = 1;

export const messageFromArgs = (args: string[]): string => {
  const [name = "World"] = args;

  return formatMessage({ name });
};

export const mainCommand = defineCommand({
  args: {
    name: {
      description: "Name to include in the placeholder greeting",
      required: false,
      type: "positional",
    },
  },
  meta: {
    description: "Logic to build a docker image in-cluster",
    name: "buildx-builder-cli",
    version: "0.0.1",
  },
  run({ args }) {
    console.log(formatMessage({ name: args.name ?? "World" }));
  },
});

export const main = (args = process.argv.slice(ARG_START_INDEX)): Promise<void> =>
  runMain(mainCommand, { rawArgs: args });

if (import.meta.url === `file://${process.argv[ENTRYPOINT_ARG_INDEX]}`) {
  await main();
}
