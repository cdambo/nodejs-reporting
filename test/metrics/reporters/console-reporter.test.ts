import { invoke } from "lodash";
import ConsoleReporter from "../../../src/metrics/reporters/console-reporter";

const getReporter = (): ConsoleReporter =>
  new ConsoleReporter({
    globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
  });

const expectOutputToBeCalled = (
  method: keyof ConsoleReporter,
  ...args: unknown[]
): void => {
  const reporter = getReporter();
  const mockOutput = jest.spyOn(reporter, "output").mockImplementation();

  invoke(reporter, method, ...args);
  expect(mockOutput.mock.calls).toMatchSnapshot();
};

describe("ConsoleReporter", (): void => {
  describe("Constructor", (): void => {
    it("Creates a ConsoleReporter", (): void => {
      const reporter = new ConsoleReporter();
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter with global tags", (): void => {
      const reporter = new ConsoleReporter({
        globalTags: { globalTag1: "global_one", globalTag2: "global_two" }
      });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter with a format", (): void => {
      const format = { format: (): string => "Format" };
      const reporter = new ConsoleReporter({ format });
      expect(reporter).toMatchSnapshot();
    });

    it("Creates a ConsoleReporter with an output", (): void => {
      const output = (): void => {};
      const reporter = new ConsoleReporter({ output });
      expect(reporter).toMatchSnapshot();
    });
  });

  describe("timing", (): void => {
    it("Reports timing metric", (): void => {
      expectOutputToBeCalled("timing", "timing_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("increment", (): void => {
    it("Reports counter metric", (): void => {
      expectOutputToBeCalled("increment", "increment_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("incrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectOutputToBeCalled("incrementBy", "increment_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrement", (): void => {
    it("Reports counter metric", (): void => {
      expectOutputToBeCalled("decrement", "decrement_test", 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("decrementBy", (): void => {
    it("Reports counter metric", (): void => {
      expectOutputToBeCalled("decrementBy", "decrement_by_test", 10, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("gauge", (): void => {
    it("Reports gauge metric", (): void => {
      expectOutputToBeCalled("gauge", "gauge_test", 10, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });

  describe("histogram", (): void => {
    it("Reports histogram metric", (): void => {
      expectOutputToBeCalled("histogram", "histogram_test", 20, 0.5, {
        tag1: "one",
        tag2: "two"
      });
    });
  });
});
