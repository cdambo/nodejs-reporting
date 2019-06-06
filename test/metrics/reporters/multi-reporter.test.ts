import { invoke, map } from "lodash";
import StatsDReporter from "../../../src/metrics/reporters/statsd-reporter";
import MultiReporter from "../../../src/metrics/reporters/multi-reporter";
import InMemoryReporter from "../../../src/metrics/reporters/in-memory-reporter";
import ConsoleReporter from "../../../src/metrics/reporters/console-reporter";
import MetricsReporter from "../../../src/metrics/reporters/metrics-reporter";

const getReporter = (): MultiReporter =>
  new MultiReporter({
    reporters: [
      new StatsDReporter(),
      new InMemoryReporter(),
      new ConsoleReporter()
    ]
  });

const reportsOf = (
  method: keyof MetricsReporter,
  ...args: unknown[]
): ReturnType<typeof jest.spyOn>[] => {
  const multiReporter = getReporter();
  const mocks = map(
    multiReporter.reporters,
    (reporter: MetricsReporter): ReturnType<typeof jest.spyOn> =>
      jest.spyOn(reporter, method).mockImplementation()
  );
  invoke(multiReporter, method, ...args);
  return map(
    mocks,
    (mock: ReturnType<typeof jest.spyOn>): ReturnType<typeof jest.spyOn> =>
      mock.mock.calls
  );
};

describe("MultiReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates a MultiReporter", (): void => {
      const reporter = new MultiReporter({
        reporters: [
          new StatsDReporter(),
          new InMemoryReporter(),
          new ConsoleReporter()
        ]
      });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      expect(
        reportsOf("timing", "timing_test", 20, 0.5, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      expect(
        reportsOf("increment", "increment_test", 0.5, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expect(
        reportsOf("incrementBy", "increment_by_test", 10, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      expect(
        reportsOf("decrement", "decrement_test", 0.5, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expect(
        reportsOf("decrementBy", "decrement_by_test", 10, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      expect(
        reportsOf("gauge", "gauge_test", 10, 0.5, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      expect(
        reportsOf("histogram", "histogram_test", 20, 0.5, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });
});
