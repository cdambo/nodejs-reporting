import { forEach } from "lodash";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";
import Context from "../../context";

interface MultiReporterConfig extends MetricsReporterConfig {
  reporters: MetricsReporter[];
}

export default class MultiReporter implements MetricsReporter {
  public readonly reporters: MetricsReporter[];

  private readonly context: Context;

  public constructor({ globalTags, reporters }: MultiReporterConfig) {
    this.reporters = reporters;
    this.context = new Context(globalTags);
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.timing(stat, time, sampleRate, this.context.mergeTags(tags))
    );
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.increment(stat, sampleRate, this.context.mergeTags(tags))
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.incrementBy(stat, value, this.context.mergeTags(tags))
    );
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.decrement(stat, sampleRate, this.context.mergeTags(tags))
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.decrementBy(stat, value, this.context.mergeTags(tags))
    );
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.gauge(stat, value, sampleRate, this.context.mergeTags(tags))
    );
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    forEach(this.reporters, (reporter: MetricsReporter): void =>
      reporter.histogram(stat, time, sampleRate, this.context.mergeTags(tags))
    );
  }
}
