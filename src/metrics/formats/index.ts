import Format from "./format";
import StatsDObjectFormat from "./statsd-object-format";
import StatsDStringFormat from "./statsd-string-format";
import DogStatsDFormat from "./dogstatsd-format";

export interface StatsDArgs {
  stat?: string;
  time?: number;
  value?: number;
  sampleRate?: number;
  tags: string[];
}

export * from "./format";
export * from "./statsd-object-format";
export * from "./statsd-string-format";
export * from "./dogstatsd-format";
export { Format, StatsDObjectFormat, DogStatsDFormat, StatsDStringFormat };
