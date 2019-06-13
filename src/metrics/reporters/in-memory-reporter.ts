import Context from "../../context";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";
import Format, { FormatFunction } from "../formats/format";
import StatsDObjectFormat from "../formats/statsd-object-format";

interface InMemoryReporterConfig extends MetricsReporterConfig {
  format?: Format;
}

export default class InMemoryReporter implements MetricsReporter {
  public reports: (string | object)[];

  private readonly context: Context;

  private readonly format: FormatFunction;

  public constructor({
    globalTags,
    format = StatsDObjectFormat()
  }: InMemoryReporterConfig = {}) {
    this.context = new Context(globalTags);
    this.format = format.format;
    this.reports = [];
  }

  public flush(): void {
    this.reports = [];
  }

  public timing(
    stat: string,
    time: number,
    sampleRate = 1,
    tags?: object
  ): void {
    this.reports.push(
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
    this.reports.push(
      this.format({
        metric: "increment",
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.reports.push(
      this.format({
        metric: "increment",
        stat,
        value,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public decrement(stat: string, sampleRate = 1, tags?: object): void {
    this.reports.push(
      this.format({
        metric: "decrement",
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.reports.push(
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
    this.reports.push(
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
    this.reports.push(
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
