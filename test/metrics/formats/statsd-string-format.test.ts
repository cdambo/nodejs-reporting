import { StatsDStringFormat } from "../../../src";

describe("StatsDStringFormat", (): void => {
  describe("format", (): void => {
    it("Formats the metric to an object", (): void => {
      expect(
        StatsDStringFormat().format({
          metric: "increment",
          stat: "metric_name",
          tags: { a: 1, b: 2 }
        })
      ).toMatchSnapshot();
    });

    it("Formats the metric with options", (): void => {
      expect(
        StatsDStringFormat({
          capitalizeMetric: true,
          colors: true,
          compact: true,
          breakLength: 100,
          depth: 2
        }).format({
          metric: "increment",
          stat: "metric_name",
          tags: { a: 1, b: 2, c: { d: 5 } }
        })
      ).toMatchSnapshot();
    });

    it("Formats the tags to snake case keys", (): void => {
      expect(
        StatsDStringFormat().format({
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
        StatsDStringFormat().format({
          metric: "increment",
          stat: "123._-/*()#$@!a_real_metric"
        })
      ).toMatchSnapshot();
    });

    it("Replaces with an underscore characters that are not ASCII alphanumerics, underscores, or periods in metric name", (): void => {
      expect(
        StatsDStringFormat().format({
          metric: "increment",
          stat: "a-real_Metric.Name_with+bad#chars!@-#$%^&*()9"
        })
      ).toMatchSnapshot();
    });
  });
});
