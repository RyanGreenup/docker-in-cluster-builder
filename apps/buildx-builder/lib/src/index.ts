export { buildImage } from "./buildx/build";

export interface FormatMessageInput {
  name: string;
  punctuation?: string;
}

/**
 * @param root0
 * @param root0.name
 * @param root0.punctuation
 */
export const formatMessage = ({ name, punctuation = "!" }: FormatMessageInput): string =>
  `Hello, ${name}${punctuation}`;

/**
 * @param left
 * @param right
 */
export const add = (left: number, right: number): number => left + right;
