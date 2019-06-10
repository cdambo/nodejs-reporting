import { StatsD } from "node-dogstatsd";
import { StatsDReporter, StatsDArgs, StatsDFormat } from "../../../src";

const getReporter = (): StatsDReporter =>
  new StatsDReporter({
    host: "host",
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

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
      const format: StatsDFormat = {
        format: (): StatsDArgs => ({ stat: "stat" })
      };
      const reporter = new StatsDReporter({ format });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      const reporter = getReporter();
      const mockTiming = jest
        .spyOn(reporter.client, "timing")
        .mockImplementation();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      expect(mockTiming.mock.calls).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      const reporter = getReporter();
      const mockIncrement = jest
        .spyOn(reporter.client, "increment")
        .mockImplementation();
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockIncrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const reporter = getReporter();
      const mockIncrementBy = jest
        .spyOn(reporter.client, "incrementBy")
        .mockImplementation();
      reporter.incrementBy("increment_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockIncrementBy.mock.calls).toMatchSnapshot();
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      const reporter = getReporter();
      const mockDecrement = jest
        .spyOn(reporter.client, "decrement")
        .mockImplementation();
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockDecrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const reporter = getReporter();
      const mockDecrementBy = jest
        .spyOn(reporter.client, "decrementBy")
        .mockImplementation();
      reporter.decrementBy("decrement_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockDecrementBy.mock.calls).toMatchSnapshot();
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      const reporter = getReporter();
      const mockGauge = jest
        .spyOn(reporter.client, "gauge")
        .mockImplementation();
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      expect(mockGauge.mock.calls).toMatchSnapshot();
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      const reporter = getReporter();
      const mockHistogram = jest
        .spyOn(reporter.client, "histogram")
        .mockImplementation();
      reporter.histogram("histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockHistogram.mock.calls).toMatchSnapshot();
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
