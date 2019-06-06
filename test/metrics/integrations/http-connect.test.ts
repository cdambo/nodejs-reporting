import { invoke, map, forEach, flatMap, constant } from "lodash";
import reporting, {
  requestTimeReporting,
  requestCountReporting,
  errorCountReporting,
  requestReporter,
  requestReporting,
  ReportingCreators,
  Handlers
} from "../../../src/metrics/integrations/http-connect";
import MetricsReporter from "../../../src/metrics/reporters/metrics-reporter";
import InMemoryReporter from "../../../src/metrics/reporters/in-memory-reporter";

const callsOfReporters = ({
  req = {},
  middlewareCreatorArgs = {},
  methods,
  handlerArgs = [{ thisIs: "a res" }, constant({})]
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
  const handlers = reporting({ reporter, ...middlewareCreatorArgs });
  forEach(
    handlers,
    (handler: (...args: unknown[]) => void): void =>
      handler(req, ...handlerArgs)
  );
  jest.runAllImmediates();
  return flatMap(
    mocks,
    (mock: ReturnType<typeof jest.spyOn>): ReturnType<typeof jest.spyOn> =>
      mock.mock.calls
  );
};

const callsOfReporter = ({
  creator,
  method,
  handlerArgs = [{ thisIs: "a req" }, { thisIs: "a res" }, constant({})]
}: {
  creator: (reporter: MetricsReporter) => (...args: unknown[]) => void;
  method: keyof MetricsReporter;
  handlerArgs?: unknown[];
}): ReturnType<typeof jest.spyOn> => {
  const reporter = new InMemoryReporter();
  const mockReporterMethod = jest.spyOn(reporter, method).mockImplementation();
  const handler = creator(reporter);
  handler(...handlerArgs);
  jest.runAllImmediates();
  return mockReporterMethod.mock.calls;
};

const reportsOf = ({
  middlewareCreator,
  middlewareCreatorArgs = {},
  method,
  handlerArgs = [{ thisIs: "a req" }, { thisIs: "a res" }, constant({})]
}: {
  middlewareCreator: (...args: unknown[]) => (...args: unknown[]) => void;
  middlewareCreatorArgs?: object;
  method: keyof MetricsReporter;
  handlerArgs?: unknown[];
}): ReturnType<typeof jest.spyOn> => {
  const creator = (reporter: MetricsReporter): ((...args: unknown[]) => void) =>
    middlewareCreator({ reporter, ...middlewareCreatorArgs });

  return callsOfReporter({ creator, method, handlerArgs });
};

describe("Http Connect", (): void => {
  it("Creates a list of reporting handlers", (): void => {
    const req = {};
    expect(
      callsOfReporters({ req, methods: ["increment", "timing"] })
    ).toMatchSnapshot();
    expect(req).toMatchSnapshot();
  });

  it("Overrides specific handler configuration", (): void => {
    expect(
      callsOfReporters({
        methods: ["increment", "timing"],
        middlewareCreatorArgs: {
          handlers: [Handlers.RequestCount, Handlers.RequestTime],
          getTags: constant({ thisIs: "a_tag" }),
          sampleRate: 0.6,
          timeReporting: {
            getTags: constant({ thisIsNot: "the_same_tag" }),
            sampleRate: 0.8,
            stat: "what_a_stat"
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
          method: "timing",
          handlerArgs: [{ thisIs: "a req" }, { thisIs: "a res" }, 18]
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a stat name", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { stat: "time_stat" },
          handlerArgs: [{ thisIs: "a req" }, { thisIs: "a res" }, 18]
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a sample rate", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { sampleRate: 0.5 },
          handlerArgs: [{ thisIs: "a req" }, { thisIs: "a res" }, 18]
        })
      ).toMatchSnapshot();
    });

    it("Reports a time metric with a getTags function", (): void => {
      expect(
        reportsOf({
          middlewareCreator: requestTimeReporting,
          method: "timing",
          middlewareCreatorArgs: { getTags: constant({ tag: "one" }) },
          handlerArgs: [{ thisIs: "a req" }, { thisIs: "a res" }, 18]
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
      { thisIs: "a req" },
      { thisIs: "a res" },
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
      const req = {};
      requestReporter({ reporter })(req, { thisIs: "a res" }, constant({}));
      expect(req).toMatchSnapshot();
    });
  });

  describe("requestReporting", (): void => {
    const reportsOfRequestReporting = ({
      creatorMethod,
      creatorArgs = {},
      method,
      handlerArgs = [{ thisIs: "a req" }, { thisIs: "a res" }, constant({})]
    }: {
      creatorMethod: keyof ReportingCreators;
      creatorArgs?: object;
      method: keyof MetricsReporter;
      handlerArgs?: unknown[];
    }): ReturnType<typeof jest.spyOn> => {
      const creator = (
        reporter: MetricsReporter
      ): ((...args: unknown[]) => void) =>
        invoke(requestReporting({ reporter }), creatorMethod, creatorArgs);

      return callsOfReporter({ creator, method, handlerArgs });
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
            method: "timing",
            handlerArgs: [{ thisIs: "a req" }, { thisIs: "a res" }, 18]
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
              { thisIs: "a req" },
              { thisIs: "a res" },
              (err: Error): Error => err
            ]
          })
        ).toMatchSnapshot();
      });
    });

    describe("reqReporter", (): void => {
      it("Adds the reporter to the req object", (): void => {
        const reporter = new InMemoryReporter();
        const req = {};
        requestReporting({ reporter }).reqReporter()(
          req,
          { thisIs: "a res" },
          constant({})
        );
        expect(req).toMatchSnapshot();
      });
    });
  });
});
