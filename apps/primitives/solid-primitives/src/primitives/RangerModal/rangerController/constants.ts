import type { CreatingState } from "../rangerTypes";

export const INITIAL_FOLDER = "transformers";

export const INITIAL_SEL: Record<string, string> = {
  [INITIAL_FOLDER]: "n1",
  ml: INITIAL_FOLDER,
  research: "ml",
  root: "research",
};

export const PATH_DEPTH_MIN = 1;
export const PARENT_OFFSET = 2;
export const DIRECTION_UP = -1;
export const ID_SLICE_START = 2;
export const ID_SLICE_END = 8;
export const RADIX_36 = 36;
export const SINGLE_ITEM = 1;
export const FIRST_INDEX = 0;
export const EMPTY_COUNT = 0;

export const noId = (): string | undefined => undefined;

export const noCreating = (): CreatingState | undefined => undefined;

export const getItemPluralSuffix = (count: number): string => {
  if (count === SINGLE_ITEM) {
    return "";
  }
  return "s";
};
