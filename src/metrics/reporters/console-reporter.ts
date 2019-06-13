/* eslint-disable no-console */
import Context from "../../context";
import Format, { FormatFunction } from "../formats/format";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";
import StatsDStringFormat from "../formats/statsd-string-format";

interface ConsoleReporterConfig extends MetricsReporterConfig {
  output?: (...args: unknown[]) => void;
  format?: Format;
}

export default class ConsoleReporter implements MetricsReporter {
  private readonly context: Context;

  public readonly output: (...args: unknown[]) => void;

  private readonly format: FormatFunction;

  public constructor({
    globalTags,
    output = console.log,
    format = StatsDStringFormat({
      colors: true,
      capitalizeMetric: true,
      breakLength: 150,
      compact: true
    })
  }: ConsoleReporterConfig = {}) {
    this.context = new Context(globalTags);
    this.output = output;
    this.format = format.format;
  }

  public timing(
    stat: string,
    time: number,
    sampleRate = 1,
    tags?: object
  ): void {
    this.output(
      this.format({
        metric: "time",
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public increment(stat: string, sampleRate = 1, tags?: object): void {
    this.output(
      this.format({
        metric: "increment",
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      this.format({
        metric: "increment",
        stat,
        value,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public decrement(stat: string, sampleRate = 1, tags?: object): void {
    this.output(
      this.format({
        metric: "decrement",
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.output(
      this.format({
        metric: "decrement",
        stat,
        value,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate = 1,
    tags?: object
  ): void {
    this.output(
      this.format({
        metric: "gauge",
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
    sampleRate = 1,
    tags?: object
  ): void {
    this.output(
      this.format({
        metric: "histogram",
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }
}
