import { invoke, map } from "lodash";
import {
  StatsDReporter,
  MultiReporter,
  InMemoryReporter,
  ConsoleReporter,
  MetricsReporter
} from "../../../src";

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

    it("Creates a MultiReporter with global tags", (): void => {
      const reporter = new MultiReporter({
        reporters: [
          new StatsDReporter(),
          new InMemoryReporter(),
          new ConsoleReporter()
        ],
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
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
});
