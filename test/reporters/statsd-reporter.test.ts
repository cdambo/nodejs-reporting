import { StatsD } from "node-dogstatsd";
import StatsDReporter from "../../src/reporters/statsd-reporter";

const getReporter = (): StatsDReporter =>
  new StatsDReporter({
    host: "host",
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

describe("StatsDReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates a StatsDReporter", (): void => {
      const reporter = new StatsDReporter({
        host: "host",
        port: 5678,
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a StatsDReporter with a default port value", (): void => {
      const reporter = new StatsDReporter({
        host: "host",
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      const mockTiming = jest.fn();
      jest.spyOn(StatsD.prototype, "timing").mockImplementation(mockTiming);
      const reporter = getReporter();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      expect(mockTiming.mock.calls).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      const mockIncrement = jest.fn();
      jest
        .spyOn(StatsD.prototype, "increment")
        .mockImplementation(mockIncrement);
      const reporter = getReporter();
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockIncrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const mockIncrementBy = jest.fn();
      jest
        .spyOn(StatsD.prototype, "incrementBy")
        .mockImplementation(mockIncrementBy);
      const reporter = getReporter();
      reporter.incrementBy("increment_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockIncrementBy.mock.calls).toMatchSnapshot();
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      const mockDecrement = jest.fn();
      jest
        .spyOn(StatsD.prototype, "decrement")
        .mockImplementation(mockDecrement);
      const reporter = getReporter();
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockDecrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const mockDecrementBy = jest.fn();
      jest
        .spyOn(StatsD.prototype, "decrementBy")
        .mockImplementation(mockDecrementBy);
      const reporter = getReporter();
      reporter.decrementBy("decrement_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockDecrementBy.mock.calls).toMatchSnapshot();
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      const mockGauge = jest.fn();
      jest.spyOn(StatsD.prototype, "gauge").mockImplementation(mockGauge);
      const reporter = getReporter();
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      expect(mockGauge.mock.calls).toMatchSnapshot();
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      const mockHistogram = jest.fn();
      jest
        .spyOn(StatsD.prototype, "histogram")
        .mockImplementation(mockHistogram);
      const reporter = getReporter();
      reporter.histogram("histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockHistogram.mock.calls).toMatchSnapshot();
    });
  });

  describe("close", (): void => {
    it("Closes the socket", (): void => {
      const mockClose = jest.fn();
      jest.spyOn(StatsD.prototype, "close").mockImplementation(mockClose);
      const reporter = getReporter();
      reporter.close();
      expect(mockClose.mock.calls).toMatchSnapshot();
    });
  });
});
