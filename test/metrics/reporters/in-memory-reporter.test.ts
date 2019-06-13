import { invoke } from "lodash";
import { InMemoryReporter } from "../../../src";

const getReporter = (): InMemoryReporter =>
  new InMemoryReporter({
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

const reportsOf = (
  method: keyof InMemoryReporter,
  ...args: unknown[]
): unknown[] => {
  const reporter = getReporter();
  invoke(reporter, method, ...args);
  return reporter.reports;
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
      const format = { format: (): object => ({ format: "Format" }) };
      const reporter = new InMemoryReporter({ format });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports a timing metric", (): void => {
      expect(reportsOf("timing", "timing_test", 20)).toMatchSnapshot();
    });

    it("Reports a timing metric with a sample rate", (): void => {
      expect(reportsOf("timing", "timing_test", 20, 0.5)).toMatchSnapshot();
    });

    it("Reports a timing metric with tags", (): void => {
      expect(
        reportsOf("timing", "timing_test", 20, undefined, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports a counter metric", (): void => {
      expect(reportsOf("increment", "increment_test")).toMatchSnapshot();
    });

    it("Reports a counter metric with a sample rate", (): void => {
      expect(reportsOf("increment", "increment_test", 0.5)).toMatchSnapshot();
    });

    it("Reports a counter metric with tags", (): void => {
      expect(
        reportsOf("increment", "increment_test", undefined, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("incrementBy", (): void => {
    it("Reports a counter metric", (): void => {
      expect(
        reportsOf("incrementBy", "increment_by_test", 10)
      ).toMatchSnapshot();
    });

    it("Reports a counter metric with tags", (): void => {
      expect(
        reportsOf("incrementBy", "increment_by_test", 10, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("decrement", (): void => {
    it("Reports a counter metric", (): void => {
      expect(reportsOf("decrement", "decrement_test")).toMatchSnapshot();
    });

    it("Reports a counter metric with a sample rate", (): void => {
      expect(reportsOf("decrement", "decrement_test", 0.5)).toMatchSnapshot();
    });

    it("Reports a counter metric with tags", (): void => {
      expect(
        reportsOf("decrement", "decrement_test", undefined, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("decrementBy", (): void => {
    it("Reports a counter metric", (): void => {
      expect(
        reportsOf("decrementBy", "decrement_by_test", 10)
      ).toMatchSnapshot();
    });

    it("Reports a counter metric with tags", (): void => {
      expect(
        reportsOf("decrementBy", "decrement_by_test", 10, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("gauge", (): void => {
    it("Reports a gauge metric", (): void => {
      expect(reportsOf("gauge", "gauge_test", 10)).toMatchSnapshot();
    });

    it("Reports a gauge metric with a sample rate", (): void => {
      expect(reportsOf("gauge", "gauge_test", 10, 0.5)).toMatchSnapshot();
    });

    it("Reports a gauge metric with tags", (): void => {
      expect(
        reportsOf("gauge", "gauge_test", 10, undefined, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
    });
  });

  describe("histogram", (): void => {
    it("Reports a histogram metric", (): void => {
      expect(reportsOf("histogram", "histogram_test", 20)).toMatchSnapshot();
    });

    it("Reports a histogram metric with a sample rate", (): void => {
      expect(
        reportsOf("histogram", "histogram_test", 20, 0.5)
      ).toMatchSnapshot();
    });

    it("Reports a histogram metric with tags", (): void => {
      expect(
        reportsOf("histogram", "histogram_test", 20, undefined, {
          tag1: "one",
          tag2: "two"
        })
      ).toMatchSnapshot();
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
