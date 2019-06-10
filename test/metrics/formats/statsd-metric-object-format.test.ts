import { StatsDMetricObjectFormat } from "../../../src";

describe("StatsDMetricObjectFormat", (): void => {
  describe("format", (): void => {
    it("Formats the metric to an object", (): void => {
      expect(
        StatsDMetricObjectFormat.format({
          stat: "metric_name",
          a: 1,
          b: 2
        })
      ).toMatchSnapshot();
    });

    it("Formats the tags to snake case keys", (): void => {
      expect(
        StatsDMetricObjectFormat.format({
          stat: "metric_name",
          a: 1,
          b: 2,
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
        StatsDMetricObjectFormat.format({ stat: "123._-/*()#$@!a_real_metric" })
      ).toMatchSnapshot();
    });

    it("Replaces with an underscore characters that are not ASCII alphanumerics, underscores, or periods in metric name", (): void => {
      expect(
        StatsDMetricObjectFormat.format({
          stat: "a-real_Metric.Name_with+bad#chars!@-#$%^&*()9"
        })
      ).toMatchSnapshot();
    });
  });
});
