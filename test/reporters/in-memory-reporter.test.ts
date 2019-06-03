import InMemoryReporter from "../../src/reporters/in-memory-reporter";

const getReporter = (): InMemoryReporter =>
  new InMemoryReporter({
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

describe("InMemoryReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates an InMemoryReporter", (): void => {
      const format = (): string => "Format";
      const reporter = new InMemoryReporter({
        format,
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates an InMemoryReporter with a default format value", (): void => {
      const reporter = new InMemoryReporter({
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates an InMemoryReporter without arguments", (): void => {
      const reporter = new InMemoryReporter();
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      const mockTiming = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockTiming);
      const reporter = getReporter();
      reporter.timing("timing_test", 20, 0.5, { tag1: "one", tag2: "two" });
      expect(reporter.reports).toMatchSnapshot();
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      const mockIncrement = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockIncrement);
      const reporter = getReporter();
      reporter.increment("increment_test", 0.5, { tag1: "one", tag2: "two" });
      expect(reporter.reports).toMatchSnapshot();
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
      expect(reporter.reports).toMatchSnapshot();
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      const mockDecrement = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockDecrement);
      const reporter = getReporter();
      reporter.decrement("decrement_test", 0.5, { tag1: "one", tag2: "two" });
      expect(reporter.reports).toMatchSnapshot();
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
      expect(reporter.reports).toMatchSnapshot();
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      const mockGauge = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockGauge);
      const reporter = getReporter();
      reporter.gauge("gauge_test", 10, 0.5, { tag1: "one", tag2: "two" });
      expect(reporter.reports).toMatchSnapshot();
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
      expect(reporter.reports).toMatchSnapshot();
    });
  });

  describe("flush", (): void => {
    it("Flushes all reports from memory", (): void => {
      const mockHistogram = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockHistogram);
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
      const mockHistogram = jest.fn();
      jest.spyOn(console, "log").mockImplementation(mockHistogram);
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
