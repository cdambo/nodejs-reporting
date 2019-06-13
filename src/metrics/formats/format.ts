export type FormatFunction = (...args: unknown[]) => string | object;

export default interface Format {
  format: FormatFunction;
}
