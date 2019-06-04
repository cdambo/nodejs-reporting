/* eslint-disable no-console */
import Context from "../../context";
import StatsDMetricObjectFormat from "../formats/statsd-metric-object-format";
import Format from "../formats/format";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";

interface ConsoleReporterConfig extends MetricsReporterConfig {
  output?: (msg: string, ...args: unknown[]) => void;
  format?: Format;
}

export default class ConsoleReporter implements MetricsReporter {
  private readonly context: Context;

  public readonly output: (msg: string, ...args: unknown[]) => void;

  private readonly format: Format;

  public constructor({
    globalTags,
    output = console.log,
    format = StatsDMetricObjectFormat
  }: ConsoleReporterConfig = {}) {
    this.context = new Context(globalTags);
    this.output = output;
    this.format = format;
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.output(
      "TIME",
      this.format.format({
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    this.output(
      "INCREMENT",
      this.format.format({
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      "INCREMENT",
      this.format.format({ stat, value, tags: this.context.mergeTags(tags) })
    );
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    this.output(
      "DECREMENT",
      this.format.format({
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      "DECREMENT",
      this.format.format({ stat, value, tags: this.context.mergeTags(tags) })
    );
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.output(
      "GAUGE",
      this.format.format({
        stat,
        value,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.output(
      "HISTOGRAM",
      this.format.format({
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }
}
