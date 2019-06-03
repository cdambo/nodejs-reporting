import ConsoleReporter from "../../src/reporters/console-reporter";

const getReporter = (): ConsoleReporter =>
  new ConsoleReporter({
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

describe("ConsoleReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates a ConsoleReporter", (): void => {
      const output = (): void => {};
      const format = (): string => "Format";
      const reporter = new ConsoleReporter({
        output,
        format,
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter with a default output value", (): void => {
      const format = (): string => "Format";
      const reporter = new ConsoleReporter({
        format,
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter with a default format value", (): void => {
      const output = (): void => {};
      const reporter = new ConsoleReporter({
        output,
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter without arguments", (): void => {
      const reporter = new ConsoleReporter();
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      const mockTiming = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockTiming);
      const reporter = getReporter();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      expect(mockTiming.mock.calls).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      const mockIncrement = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockIncrement);
      const reporter = getReporter();
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockIncrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const mockIncrementBy = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockIncrementBy);
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
      jest.spyOn(console, "log").mockImplementation(mockDecrement);
      const reporter = getReporter();
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      expect(mockDecrement.mock.calls).toMatchSnapshot();
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      const mockDecrementBy = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockDecrementBy);
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
      jest.spyOn(console, "log").mockImplementation(mockGauge);
      const reporter = getReporter();
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      expect(mockGauge.mock.calls).toMatchSnapshot();
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      const mockHistogram = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockHistogram);
      const reporter = getReporter();
      reporter.histogram("histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
      expect(mockHistogram.mock.calls).toMatchSnapshot();
    });
  });
});
