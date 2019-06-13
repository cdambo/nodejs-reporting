export interface StatsDArgs {
  stat?: string;
  time?: number;
  value?: number;
  sampleRate?: number;
  tags: string[];
}

type FormatFunction = (...args: unknown[]) => object;
type StatsDFormatFunction = (...args: unknown[]) => StatsDArgs;

export interface StatsDFormat {
  format: StatsDFormatFunction;
}

export default interface Format {
  format: FormatFunction;
}
