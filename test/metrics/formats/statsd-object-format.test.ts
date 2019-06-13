import { StatsDObjectFormat } from "../../../src";

describe("StatsDObjectFormat", (): void => {
  describe("format", (): void => {
    it("Formats the metric to an object", (): void => {
      expect(
        StatsDObjectFormat().format({
          metric: "increment",
          stat: "metric_name",
          tags: { a: 1, b: 2 }
        })
      ).toMatchSnapshot();
    });

    it("Formats the metric with options", (): void => {
      expect(
        StatsDObjectFormat({
          transformations: {
            metric: (m: string): string => `${m}_FORMATTED`,
            stat: (s: string): string => `${s}_FORMATTED`,
            tags: (t: object): object => ({ ...t, thisIs: "FORMATTED" }),
            args: (a: object): object => ({ ...a, thisIs: "FORMATTED" })
          }
        }).format({
          metric: "increment",
          stat: "metric_name",
          tags: { a: 1, b: 2 },
          arg1: "123",
          arg2: 456
        })
      ).toMatchSnapshot();
    });

    it("Formats the tags to snake case keys", (): void => {
      expect(
        StatsDObjectFormat().format({
          metric: "increment",
          stat: "metric_name",
          tags: {
            camelCaseTag1: "tagOne",
            camelCaseTag2: "tag_two",
            anotherTag: 5
          }
        })
      ).toMatchSnapshot();
    });

    it("Removes leading non-letters from metric name", (): void => {
      expect(
        StatsDObjectFormat().format({
          metric: "increment",
          stat: "123._-/*()#$@!a_real_metric"
        })
      ).toMatchSnapshot();
    });

    it("Replaces with an underscore characters that are not ASCII alphanumerics, underscores, or periods in metric name", (): void => {
      expect(
        StatsDObjectFormat().format({
          metric: "increment",
          stat: "a-real_Metric.Name_with+bad#chars!@-#$%^&*()9"
        })
      ).toMatchSnapshot();
    });
  });
});
