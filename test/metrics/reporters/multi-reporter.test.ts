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

const expectReportersToBeCalled = (
  method: keyof MetricsReporter,
  ...args: unknown[]
): void => {
  const multiReporter = getReporter();
  const mocks = map(
    multiReporter.reporters,
    (reporter: MetricsReporter): ReturnType<typeof jest.spyOn> =>
      jest.spyOn(reporter, method).mockImplementation()
  );
  invoke(multiReporter, method, ...args);
  mocks.forEach(
    (mock): ReturnType<typeof jest.spyOn> =>
      expect(mock.mock.calls).toMatchSnapshot()
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
      expectReportersToBeCalled("timing", "timing_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      expectReportersToBeCalled("increment", "increment_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectReportersToBeCalled("incrementBy", "increment_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      expectReportersToBeCalled("decrement", "decrement_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectReportersToBeCalled("decrementBy", "decrement_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      expectReportersToBeCalled("gauge", "gauge_test", 10, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      expectReportersToBeCalled("histogram", "histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });
});
