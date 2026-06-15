export interface MarkerOpts {
  /** The image repository (without tag), e.g. ghcr.io/ryangreenup/primitives-storybook. */
  readonly image: string;
  /** The ImagePolicy ref, e.g. flux-system:primitives-storybook. */
  readonly policy: string;
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Append Flux image-automation marker comments that `js-yaml` cannot emit:
 *   - `image: <repo>:<tag>`              -> ` # {"$imagepolicy": "<policy>"}`
 *   - `app.kubernetes.io/version: <tag>` -> ` # {"$imagepolicy": "<policy>:tag"}`
 * Idempotent: a line already carrying a `$imagepolicy` comment is left alone.
 */
export const injectImagePolicyMarkers = (
  yaml: string,
  opts: MarkerOpts,
): string => {
  const imageMarker = ` # {"$imagepolicy": "${opts.policy}"}`;
  const tagMarker = ` # {"$imagepolicy": "${opts.policy}:tag"}`;
  const imageRe = new RegExp(
    `^(\\s*image: ${escapeRegExp(opts.image)}:\\S+)\\s*$`,
  );
  const versionRe = /^(\s*app\.kubernetes\.io\/version: \S+)\s*$/;

  return yaml
    .split("\n")
    .map((line) => {
      if (line.includes("$imagepolicy")) return line;
      if (imageRe.test(line)) return line.replace(imageRe, `$1${imageMarker}`);
      if (versionRe.test(line))
        return line.replace(versionRe, `$1${tagMarker}`);
      return line;
    })
    .join("\n");
};
