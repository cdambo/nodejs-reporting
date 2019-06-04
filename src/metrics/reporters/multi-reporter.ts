import MetricsReporter from "./metrics-reporter";

interface MultiReporterConfig {
  reporters: MetricsReporter[];
}

export default class MultiReporter implements MetricsReporter {
  public readonly reporters: MetricsReporter[];

  public constructor({ reporters }: MultiReporterConfig) {
    this.reporters = reporters;
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.timing(stat, time, sampleRate, tags)
    );
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.increment(stat, sampleRate, tags)
    );
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.incrementBy(stat, value, tags)
    );
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.decrement(stat, sampleRate, tags)
    );
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.decrementBy(stat, value, tags)
    );
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.gauge(stat, value, sampleRate, tags)
    );
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.reporters.forEach(
      (reporter: MetricsReporter): void =>
        reporter.histogram(stat, time, sampleRate, tags)
    );
  }
}
