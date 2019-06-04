export interface StatsDArgs {
  stat: string;
  tags?: string[];
}

type FormatFunction = (...args: unknown[]) => object | string | StatsDArgs;
type StatsDFormatFunction = (...args: unknown[]) => StatsDArgs;

export interface StatsDFormat {
  format: StatsDFormatFunction;
}

export default interface Format {
  format: FormatFunction;
}
