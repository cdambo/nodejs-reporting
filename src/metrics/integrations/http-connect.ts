import {
  constant,
  merge,
  flatMap,
  flow,
  uniq,
  intersection,
  keys,
  attempt,
  partial,
  partialRight
} from "lodash";
import MetricsReporter from "../reporters/metrics-reporter";

/**
 * **********************************
 * Type Declarations
 * **********************************
 */
/*
 * Arguments Types
 */
interface RequestReportingArgs {
  reporter: MetricsReporter;
}
interface MetricReportingArgs {
  stat?: string;
  sampleRate?: number;
  getTags?: (req: object, res: object) => object;
}
export type ResponseTimeFn = (
  fn: (req: object, res: object, time: number) => void
) => RequestHandler;
interface TimeMetricReportingArgs extends MetricReportingArgs {
  responseTimeFn: ResponseTimeFn;
}
type ErrorMetricReportingArgs = MetricReportingArgs & {
  getTags?: (err: Error, req: object, res: object) => object;
};
interface HttpRequestReportingArgs extends RequestReportingArgs {
  sampleRate?: number;
  getTags?: (req: object, res: object) => object;
  responseTimeFn?: ResponseTimeFn;
  timeReporting?: TimeMetricReportingArgs;
  countReporting?: MetricReportingArgs;
  reqReporter?: RequestReportingArgs;
  handlers?: Handlers[];
}

/*
 * Middleware Types
 */
export type RequestHandler = (
  req: object,
  res: object,
  next: () => void
) => void;
type ErrorHandler = (
  err: Error,
  req: object,
  res: object,
  next: (err: Error) => void
) => void;

/*
 * Middleware Creator Names
 */
export enum Handlers {
  RequestTime = "RequestTime",
  RequestCount = "RequestCount",
  RequestReporter = "RequestReporter",
  All = "All"
}

/*
 * Middleware Creator Types
 */
type RequestTimeReportingCreator = ({
  stat,
  sampleRate,
  getTags,
  responseTimeFn
}: TimeMetricReportingArgs) => RequestHandler;
type RequestCountReportingCreator = ({
  stat,
  sampleRate,
  getTags
}: MetricReportingArgs) => RequestHandler;
type ErrorCountReportingCreator = ({
  stat,
  sampleRate,
  getTags
}: ErrorMetricReportingArgs) => ErrorHandler;
type RequestReporterCreator = () => RequestHandler;
export interface ReportingCreators {
  timing: RequestTimeReportingCreator;
  count: RequestCountReportingCreator;
  errors: ErrorCountReportingCreator;
  reqReporter: RequestReporterCreator;
}
type RequestReporting = ({
  reporter
}: RequestReportingArgs) => ReportingCreators;

/**
 * **********************************
 * Http-Connect Middleware
 * **********************************
 */

/*
 * Connect Middleware Creators
 */
export const requestTimeReporting = ({
  reporter,
  stat = "http_request_duration_seconds",
  sampleRate = 1,
  getTags = constant({}),
  responseTimeFn
}: RequestReportingArgs & TimeMetricReportingArgs): RequestHandler =>
  responseTimeFn(
    (req, res, time): void => {
      setImmediate(
        (): void => {
          const tags = getTags(req, res);
          reporter.timing(stat, time, sampleRate, tags);
        }
      );
    }
  );

export const requestCountReporting = ({
  reporter,
  stat = "http_requests_total",
  sampleRate = 1,
  getTags = constant({})
}: RequestReportingArgs & MetricReportingArgs): RequestHandler => (
  req: object,
  res: object,
  next: () => void
): void => {
  setImmediate(
    (): void => {
      const tags = getTags(req, res);
      reporter.increment(stat, sampleRate, tags);
    }
  );
  next();
};

export const errorCountReporting = ({
  reporter,
  stat = "http_requests_errors_total",
  sampleRate = 1,
  getTags = constant({})
}: RequestReportingArgs & ErrorMetricReportingArgs): ErrorHandler => (
  err: Error,
  req: object,
  res: object,
  next: (err: Error) => void
): void => {
  setImmediate(
    (): void => {
      const tags = getTags(err, req, res);
      reporter.increment(stat, sampleRate, tags);
    }
  );
  next(err);
};

export const requestReporter = ({
  reporter
}: RequestReportingArgs): RequestHandler => (
  req: RequestReportingArgs,
  res: object,
  next: () => void
): void => {
  req.reporter = reporter;
  next();
};

export const requestReporters: RequestReporting = ({
  reporter
}): ReportingCreators => ({
  timing: ({ stat, sampleRate, getTags, responseTimeFn }): RequestHandler =>
    requestTimeReporting({
      reporter,
      stat,
      sampleRate,
      getTags,
      responseTimeFn
    }),
  count: ({ stat, sampleRate, getTags }): RequestHandler =>
    requestCountReporting({ reporter, stat, sampleRate, getTags }),
  errors: ({ stat, sampleRate, getTags }): ErrorHandler =>
    errorCountReporting({ reporter, stat, sampleRate, getTags }),
  reqReporter: (): RequestHandler => requestReporter({ reporter })
});

export default ({
  reporter,
  sampleRate,
  getTags,
  responseTimeFn,
  timeReporting,
  countReporting,
  reqReporter,
  handlers = [Handlers.All]
}: HttpRequestReportingArgs): RequestHandler[] => {
  const requestTime = (): RequestHandler =>
    requestTimeReporting(
      merge({ reporter, sampleRate, getTags, responseTimeFn }, timeReporting)
    );
  const requestCount = (): RequestHandler =>
    requestCountReporting(
      merge({ reporter, sampleRate, getTags }, countReporting)
    );
  const reqReporterMiddleware = (): RequestHandler =>
    requestReporter(merge({ reporter }, reqReporter));

  const all = [reqReporterMiddleware, requestTime, requestCount];

  const handlerMap = {
    [Handlers.RequestTime]: [requestTime],
    [Handlers.RequestCount]: [requestCount],
    [Handlers.RequestReporter]: [reqReporterMiddleware],
    [Handlers.All]: all
  };

  return flow([
    partial(intersection, keys(handlerMap)),
    partialRight(
      flatMap,
      (h: Handlers): (() => RequestHandler)[] => handlerMap[h]
    ),
    uniq,
    partialRight(flatMap, attempt)
  ])(handlers);
};
