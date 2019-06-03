import { StatsD } from "node-dogstatsd";
import { map, snakeCase } from "lodash";
import Reporter, { ReporterConfig } from "./reporter";

interface StatsDReporterConfig extends ReporterConfig {
  host: string;
  port?: number;
}

const formatTags = (tags: object): string[] =>
  map(tags, (v: string, k: string): string => `${snakeCase(k)}:${v}`);

export default class StatsDReporter implements Reporter {
  private client: StatsD;

  public constructor({ host, port = 8125, globalTags }: StatsDReporterConfig) {
    this.client = new StatsD(host, port, null, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      global_tags: formatTags(globalTags)
    });
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    return this.client.timing(stat, time, sampleRate, formatTags(tags));
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    this.client.increment(stat, sampleRate, formatTags(tags));
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    this.client.incrementBy(stat, value, formatTags(tags));
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    this.client.decrement(stat, sampleRate, formatTags(tags));
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    this.client.decrementBy(stat, value, formatTags(tags));
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.client.gauge(stat, value, sampleRate, formatTags(tags));
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    this.client.histogram(stat, time, sampleRate, formatTags(tags));
  }

  public close(): void {
    this.client.close();
  }
}
