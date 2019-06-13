import { StatsD } from "node-dogstatsd";
import MetricsReporter, { MetricsReporterConfig } from "./metrics-reporter";
import { StatsDFormat } from "../formats";
import Context from "../../context";
import DogStatsDFormat from "../formats/dogstatsd-format";

interface StatsDReporterConfig extends MetricsReporterConfig {
  host?: string;
  port?: number;
  client?: StatsD;
  format?: StatsDFormat;
}

export default class StatsDReporter implements MetricsReporter {
  public readonly client: StatsD;

  private readonly context: Context;

  private readonly format: StatsDFormat;

  public constructor({
    host = "localhost",
    port = 8125,
    format = DogStatsDFormat,
    client,
    globalTags
  }: StatsDReporterConfig = {}) {
    this.client = client || new StatsD(host, port, null);
    this.format = format;
    this.context = new Context(globalTags);
  }

  public timing(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    const formatted = this.format.format({ stat, time, sampleRate, tags });

    this.client.timing(
      formatted.stat,
      formatted.time,
      formatted.sampleRate,
      formatted.tags
    );
  }

  public increment(stat: string, sampleRate?: number, tags?: object): void {
    const formatted = this.format.format({ stat, sampleRate, tags });

    this.client.increment(formatted.stat, formatted.sampleRate, formatted.tags);
  }

  public incrementBy(stat: string, value: number, tags?: object): void {
    const formatted = this.format.format({ stat, value, tags });

    this.client.incrementBy(formatted.stat, formatted.value, formatted.tags);
  }

  public decrement(stat: string, sampleRate?: number, tags?: object): void {
    const formatted = this.format.format({ stat, sampleRate, tags });

    this.client.decrement(formatted.stat, formatted.sampleRate, formatted.tags);
  }

  public decrementBy(stat: string, value: number, tags?: object): void {
    const formatted = this.format.format({ stat, value, tags });

    this.client.decrementBy(formatted.stat, formatted.value, formatted.tags);
  }

  public gauge(
    stat: string,
    value: number,
    sampleRate?: number,
    tags?: object
  ): void {
    const formatted = this.format.format({ stat, value, sampleRate, tags });

    this.client.gauge(
      formatted.stat,
      formatted.value,
      formatted.sampleRate,
      formatted.tags
    );
  }

  public histogram(
    stat: string,
    time: number,
    sampleRate?: number,
    tags?: object
  ): void {
    const formatted = this.format.format({ stat, time, sampleRate, tags });

    this.client.histogram(
      formatted.stat,
      formatted.time,
      formatted.sampleRate,
      formatted.tags
    );
  }

  public close(): void {
    this.client.close();
  }
}
