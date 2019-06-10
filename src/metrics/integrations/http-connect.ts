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
export type ResponseTimeFn = (
  fn: (req: object, res: object, time: number) => void
) => RequestHandler;
type GetTagsFn = (req: object, res: object) => object;
type GetErrorTagsFn = (err: Error, req: object, res: object) => object;
interface ReporterArgs {
  reporter: MetricsReporter;
}
interface MetricArgs {
  stat?: string;
  sampleRate?: number;
}
interface RequestMetricArgs extends MetricArgs {
  getTags?: GetTagsFn;
}
interface TimeMetricArgs extends RequestMetricArgs {
  responseTimeFn: ResponseTimeFn;
}
interface ErrorMetricArgs extends MetricArgs {
  getTags?: GetErrorTagsFn;
}
interface RequestReportingArgs extends ReporterArgs {
  sampleRate?: number;
  getTags?: GetTagsFn;
  responseTimeFn?: ResponseTimeFn;
  timeReporting?: TimeMetricArgs;
  countReporting?: RequestMetricArgs;
  reqReporter?: ReporterArgs;
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
}: TimeMetricArgs) => RequestHandler;
type RequestCountReportingCreator = ({
  stat,
  sampleRate,
  getTags
}: RequestMetricArgs) => RequestHandler;
type ErrorCountReportingCreator = ({
  stat,
  sampleRate,
  getTags
}: ErrorMetricArgs) => ErrorHandler;
type RequestReporterCreator = () => RequestHandler;
export interface ReportingCreators {
  timing: RequestTimeReportingCreator;
  count: RequestCountReportingCreator;
  errors: ErrorCountReportingCreator;
  reqReporter: RequestReporterCreator;
}
type RequestReporting = ({ reporter }: ReporterArgs) => ReportingCreators;

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
}: ReporterArgs & TimeMetricArgs): RequestHandler =>
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
}: ReporterArgs & RequestMetricArgs): RequestHandler => (
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
}: ReporterArgs & ErrorMetricArgs): ErrorHandler => (
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

export const requestReporter = ({ reporter }: ReporterArgs): RequestHandler => (
  req: ReporterArgs,
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
}: RequestReportingArgs): RequestHandler[] => {
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
