import Context from "../../context";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";
import Format from "../formats/format";
import StatsDMetricObjectFormat from "../formats/statsd-metric-object-format";

interface InMemoryReporterConfig extends MetricsReporterConfig {
  format?: Format;
}

export default class InMemoryReporter implements MetricsReporter {
  public reports: object[];

  private readonly context: Context;

  private readonly format: Format;

  public constructor({
    globalTags,
    format = StatsDMetricObjectFormat
  }: InMemoryReporterConfig = {}) {
    this.context = new Context(globalTags);
    this.format = format;
    this.reports = [];
  }

  public flush(): void {
    this.reports = [];
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reports.push({
      time: this.format.format({
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    this.reports.push({
      increment: this.format.format({
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.reports.push({
      increment: this.format.format({
        stat,
        value,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    this.reports.push({
      decrement: this.format.format({
        stat,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.reports.push({
      decrement: this.format.format({
        stat,
        value,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reports.push({
      gauge: this.format.format({
        stat,
        value,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    });
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reports.push({
      histogram: this.format.format({
        stat,
        time,
        sampleRate,
        tags: this.context.mergeTags(tags)
      })
    });
  }
}
