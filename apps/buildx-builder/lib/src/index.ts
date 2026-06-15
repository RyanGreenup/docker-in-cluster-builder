export interface FormatMessageInput {
  name: string;
  punctuation?: string;
}

export const formatMessage = ({ name, punctuation = "!" }: FormatMessageInput): string =>
  `Hello, ${name}${punctuation}`;

export const add = (left: number, right: number): number => left + right;
