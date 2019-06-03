/* eslint-disable no-console */
import Context from "../context";
import Reporter, { ReporterConfig } from "./reporter";
import StatsDMetricObjectFormat from "../formats/statsd-metric-object-format";
import Format from "../formats/format";

interface ConsoleReporterConfig extends ReporterConfig {
  output?: (msg: string, ...args: unknown[]) => void;
  format?: Format.FormatFunction;
}

export default class ConsoleReporter implements Reporter {
  private readonly context: Context;

  private readonly output: (msg: string, ...args: unknown[]) => void;

  private readonly format: Format.FormatFunction;

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
      this.format({
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
      this.format({ stat, sampleRate, tags: this.context.mergeTags(tags) })
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      "INCREMENT",
      this.format({ stat, value, tags: this.context.mergeTags(tags) })
    );
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    this.output(
      "DECREMENT",
      this.format({ stat, sampleRate, tags: this.context.mergeTags(tags) })
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      "DECREMENT",
      this.format({ stat, value, tags: this.context.mergeTags(tags) })
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
      this.format({
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
      this.format({
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }
}
