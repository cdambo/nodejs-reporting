import { StatsD } from "node-dogstatsd";
import { invoke } from "lodash";
import { StatsDReporter, StatsDArgs } from "../../../src";

const getReporter = (): StatsDReporter =>
  new StatsDReporter({
    host: "host",
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

const reportsOf = (
  method: keyof StatsDReporter & keyof StatsD,
  ...args: unknown[]
): unknown[] => {
  const reporter = getReporter();
  const mock = jest.spyOn(reporter.client, method).mockImplementation();
  invoke(reporter, method, ...args);
  return mock.mock.calls;
};

describe("StatsDReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates a StatsDReporter", (): void => {
      const reporter = new StatsDReporter();
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with global tags", (): void => {
      const reporter = new StatsDReporter({
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with a client", (): void => {
      const reporter = new StatsDReporter({
        client: new StatsD("host", 8888, null)
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with a host", (): void => {
      const reporter = new StatsDReporter({ host: "host" });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with a port", (): void => {
      const reporter = new StatsDReporter({ port: 5555 });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with a format", (): void => {
      const format = {
        format: (): StatsDArgs => ({ stat: "stat", tags: [] })
      };
      const reporter = new StatsDReporter({ format });
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

  describe("close", (): void => {
    it("Closes the socket", (): void => {
      const reporter = getReporter();
      const mockClose = jest
        .spyOn(reporter.client, "close")
        .mockImplementation();
      reporter.close();
      expect(mockClose.mock.calls).toMatchSnapshot();
    });
  });
});
