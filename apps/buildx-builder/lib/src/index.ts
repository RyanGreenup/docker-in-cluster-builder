export { buildImage } from "./buildx/build";

export interface FormatMessageInput {
  name: string;
  punctuation?: string;
}

/**
 * Build a friendly greeting for the given name.
 * @param root0 - The message fields.
 * @param root0.name - Name to greet.
 * @param root0.punctuation - Trailing punctuation (defaults to "!").
 * @returns The formatted greeting.
 */
export const formatMessage = ({ name, punctuation = "!" }: FormatMessageInput): string =>
  `Hello, ${name}${punctuation}`;

/**
 * Add two numbers.
 * @param left - The left operand.
 * @param right - The right operand.
 * @returns The sum of the operands.
 */
export const add = (left: number, right: number): number => left + right;
