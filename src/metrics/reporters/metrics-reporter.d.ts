export interface MetricsReporterConfig {
  globalTags?: object;
}

export default interface MetricsReporter {
  timing(stat: string, time: number, sampleRate?: number, tags?: object): void;

  increment(stat: string, sampleRate?: number, tags?: object): void;

  incrementBy(stat: string, value: number, tags?: object): void;

  decrement(stat: string, sampleRate?: number, tags?: object): void;

  decrementBy(stat: string, value: number, tags?: object): void;

  gauge(stat: string, value: number, sampleRate?: number, tags?: object): void;

  histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void;
}
