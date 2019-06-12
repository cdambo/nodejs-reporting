import { invoke, map, forEach, flatMap, constant } from "lodash";
import {
  requestReporting,
  requestTimeReporting,
  requestCountReporting,
  errorCountReporting,
  requestReporter,
  requestReporters,
  ReportingCreators,
  Handlers,
  MetricsReporter,
  InMemoryReporter,
  ResponseTimeFn,
  RequestHandler
} from "../../../src";

const mockReq = constant({ thisIs: "a request" });
const mockRes = constant({
  thisIs: "a response",
  once: jest.fn((event: string, method: () => void): void => method()),
  removeListener: jest.fn()
});

const responseTimeFnCreator: (time?: number) => ResponseTimeFn = (
  time = 18
): ResponseTimeFn => (fn): RequestHandler => (req, res, next): void => {
  fn(req, res, time);
  next();
};

const multipleReports = ({
  req = mockReq(),
  middlewareCreatorArgs = {},
  methods,
  handlerArgs = [mockRes(), constant({})]
}: {
  req?: object;
  middlewareCreatorArgs?: object;
  methods: (keyof MetricsReporter)[];
  handlerArgs?: unknown[];
}): ReturnType<typeof jest.spyOn> => {
  const reporter = new InMemoryReporter();
  const mocks = map(
    methods,
    (method: keyof MetricsReporter): ReturnType<typeof jest.spyOn> =>
      jest.spyOn(reporter, method).mockImplementation()
  );
  const handlers = requestReporting({ reporter, ...middlewareCreatorArgs });
  forEach(
    handlers,
    (handler: (...args: unknown[]) => void): void =>
      handler(req, ...handlerArgs)
  );
  return flatMap(
    mocks,
    (mock: ReturnType<typeof jest.spyOn>): ReturnType<typeof jest.spyOn> =>
      mock.mock.calls
  );
};

const reports = ({
  creator,
  method,
  handlerArgs
}: {
  creator: (reporter: MetricsReporter) => (...args: unknown[]) => void;
  method: keyof MetricsReporter;
  handlerArgs: unknown[];
}): ReturnType<typeof jest.spyOn> => {
  const reporter = new InMemoryReporter();
  const mockReporterMethod = jest.spyOn(reporter, method).mockImplementation();
  const handler = creator(reporter);
  handler(...handlerArgs);
  return mockReporterMethod.mock.calls;
};

const reportsOf = ({
  middlewareCreator,
  middlewareCreatorArgs = {},
  method,
  handlerArgs = [mockReq(), mockRes(), constant({})]
}: {
  middlewareCreator: (...args: unknown[]) => (...args: unknown[]) => void;
  middlewareCreatorArgs?: object;
  method: keyof MetricsReporter;
  handlerArgs?: unknown[];
}): ReturnType<typeof jest.spyOn> => {
  const creator = (reporter: MetricsReporter): ((...args: unknown[]) => void) =>
    middlewareCreator({ reporter, ...middlewareCreatorArgs });

  return reports({ creator, method, handlerArgs });
};

describe("Http Connect", (): void => {
  beforeEach(
    (): void => {
      jest
        .spyOn(Date, "now")
        .mockImplementationOnce(constant(0))
        .mockImplementationOnce(constant(18));
    }
  );

  it("Creates a list of reporting handlers", (): void => {
    const req = mockReq();
    expect(
      multipleReports({
        req,
        methods: ["increment", "timing"]
      })
    ).toMatchSnapshot();
    expect(req).toMatchSnapshot();
  });

  it("Overrides specific handler configuration", (): void => {
    expect(
      multipleReports({
        methods: ["increment", "timing"],
        middlewareCreatorArgs: {
          handlers: [Handlers.RequestCount, Handlers.RequestTime],
          getTags: constant({ thisIs: "a_tag" }),
          sampleRate: 0.6,
          responseTimeFn: responseTimeFnCreator(17),
          timeReporting: {
            getTags: constant({ thisIsNot: "the_same_tag" }),
            sampleRate: 0.8,
            stat: "what_a_stat",
            responseTimeFn: responseTimeFnCreator(20)
          },
          countReporting: {
            stat: "what_another_stat"
          }
        }
      })
    ).toMatchSnapshot();
  });

  describe("requestTimeReporting", (): void => {
    it("Reports a time metric", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing"
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a stat name", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { stat: "time_stat" }
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a sample rate", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { sampleRate: 0.5 }
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a getTags function", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { getTags: constant({ tag: "one" }) }
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a responseTimeFn", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { responseTimeFn: responseTimeFnCreator(23) }
        })
      ).toMatchSnapshot();
    });
  });

  describe("requestCountReporting", (): void => {
    it("Reports a count metric", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestCountReporting,
          method: "increment"
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a stat name", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestCountReporting,
          method: "increment",
          middlewareCreatorArgs: { stat: "count_stat" }
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a sample rate", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestCountReporting,
          method: "increment",
          middlewareCreatorArgs: { sampleRate: 0.5 }
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a getTags function", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestCountReporting,
          method: "increment",
          middlewareCreatorArgs: { getTags: constant({ tag: "one" }) }
        })
      ).toMatchSnapshot();
    });
  });

  describe("errorCountReporting", (): void => {
    const handlerArgs = [
      new Error(),
      mockReq(),
      mockRes(),
      (err: Error): Error => err
    ];

    it("Reports a count metric", (): void => {
      expect(
        reportsOf({
          middlewareCreator: errorCountReporting,
          method: "increment",
          handlerArgs
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a stat name", (): void => {
      expect(
        reportsOf({
          middlewareCreator: errorCountReporting,
          method: "increment",
          middlewareCreatorArgs: { stat: "error_count_stat" },
          handlerArgs
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a sample rate", (): void => {
      expect(
        reportsOf({
          middlewareCreator: errorCountReporting,
          method: "increment",
          middlewareCreatorArgs: { sampleRate: 0.5 },
          handlerArgs
        })
      ).toMatchSnapshot();
    });

    it("Reports a count metric with a getTags function", (): void => {
      expect(
        reportsOf({
          middlewareCreator: errorCountReporting,
          method: "increment",
          middlewareCreatorArgs: { getTags: constant({ tag: "one" }) },
          handlerArgs
        })
      ).toMatchSnapshot();
    });
  });

  describe("requestReporter", (): void => {
    it("Adds the reporter to the req object", (): void => {
      const reporter = new InMemoryReporter();
      const req = mockReq();
      requestReporter({ reporter })(req, mockRes(), constant({}));
      expect(req).toMatchSnapshot();
    });
  });

  describe("requestReporters", (): void => {
    const reportsOfRequestReporting = ({
      creatorMethod,
      creatorArgs = {},
      method,
      handlerArgs = [mockReq(), mockRes(), constant({})]
    }: {
      creatorMethod: keyof ReportingCreators;
      creatorArgs?: object;
      method: keyof MetricsReporter;
      handlerArgs?: unknown[];
    }): ReturnType<typeof jest.spyOn> => {
      const creator = (
        reporter: MetricsReporter
      ): ((...args: unknown[]) => void) =>
        invoke(requestReporters({ reporter }), creatorMethod, creatorArgs);

      return reports({ creator, method, handlerArgs });
    };

    describe("timing", (): void => {
      it("Returns a ResponseTimeHandler", (): void => {
        expect(
          reportsOfRequestReporting({
            creatorMethod: "timing",
            creatorArgs: {
              stat: "request-time-reporting",
              sampleRate: 0.5,
              getTags: constant({ one: "tag" })
            },
            method: "timing"
          })
        ).toMatchSnapshot();
      });
    });

    describe("count", (): void => {
      it("Returns a RequestHandler", (): void => {
        expect(
          reportsOfRequestReporting({
            creatorMethod: "count",
            creatorArgs: {
              stat: "request-count-reporting",
              sampleRate: 0.5,
              getTags: constant({ one: "tag" })
            },
            method: "increment"
          })
        ).toMatchSnapshot();
      });
    });

    describe("errors", (): void => {
      it("Returns an ErrorHandler", (): void => {
        expect(
          reportsOfRequestReporting({
            creatorMethod: "errors",
            creatorArgs: {
              stat: "request-time-reporting",
              sampleRate: 0.5,
              getTags: constant({ one: "tag" })
            },
            method: "increment",
            handlerArgs: [
              new Error(),
              mockReq(),
              mockRes(),
              (err: Error): Error => err
            ]
          })
        ).toMatchSnapshot();
      });
    });

    describe("reqReporter", (): void => {
      it("Adds the reporter to the req object", (): void => {
        const reporter = new InMemoryReporter();
        const req = mockReq();
        requestReporters({ reporter }).reqReporter()(
          req,
          mockRes(),
          constant({})
        );
        expect(req).toMatchSnapshot();
      });
    });
  });
});
