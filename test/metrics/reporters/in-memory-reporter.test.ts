import { invoke } from "lodash";
import InMemoryReporter from "../../../src/metrics/reporters/in-memory-reporter";

const getReporter = (): InMemoryReporter =>
  new InMemoryReporter({
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

const expectReportToBeInMemory = (
  method: keyof InMemoryReporter,
  ...args: unknown[]
): void => {
  const reporter = getReporter();
  invoke(reporter, method, ...args);
  expect(reporter.reports).toMatchSnapshot();
};

describe("InMemoryReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates an InMemoryReporter", (): void => {
      const reporter = new InMemoryReporter();
      expect(reporter).toMatchSnapshot();
    });

    it("Creates an InMemoryReporter with global tags", (): void => {
      const reporter = new InMemoryReporter({
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates an InMemoryReporter with a format", (): void => {
      const format = { format: (): string => "Format" };
      const reporter = new InMemoryReporter({ format });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      expectReportToBeInMemory("timing", "timing_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      expectReportToBeInMemory("increment", "increment_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectReportToBeInMemory("incrementBy", "increment_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      expectReportToBeInMemory("decrement", "decrement_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectReportToBeInMemory("decrementBy", "decrement_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      expectReportToBeInMemory("gauge", "gauge_test", 10, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      expectReportToBeInMemory("histogram", "histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("flush", (): void => {
    it("Flushes all reports from memory", (): void => {
      const reporter = getReporter();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      reporter.histogram("histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
      reporter.flush();
      expect(reporter.reports).toMatchSnapshot();
    });
  });

  describe("reports", (): void => {
    it("Saves all reports in memory", (): void => {
      const reporter = getReporter();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      reporter.histogram("histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
      expect(reporter.reports).toMatchSnapshot();
    });
  });
});
