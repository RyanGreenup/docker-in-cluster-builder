import { tagVars, type RangerTag } from "./theme.css";

const KNOWN_TAGS: ReadonlySet<RangerTag> = new Set<RangerTag>([
  "amber",
  "cyan",
  "emerald",
  "neutral",
  "rose",
  "violet",
]);

const isKnownTag = (name: string): name is RangerTag =>
  (KNOWN_TAGS as ReadonlySet<string>).has(name);

const asTag = (name: string | undefined): RangerTag =>
  name !== undefined && isKnownTag(name) ? name : "neutral";

/** Resolve a tag colour pair from a tag name, falling back to `neutral`. */
export const tagColor = (name: string | undefined): { fg: string; bg: string } =>
  tagVars[asTag(name)];
