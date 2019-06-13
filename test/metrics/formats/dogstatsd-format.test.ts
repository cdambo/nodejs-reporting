import { DogStatsDFormat } from "../../../src";

describe("DogStatsDFormat", (): void => {
  describe("format", (): void => {
    it("Formats tags to a comma separated list of snake case tags", (): void => {
      expect(
        DogStatsDFormat.format({
          stat: "metric_name",
          value: 17,
          sampleRate: 0.8,
          tags: {
            camelCaseTag1: "tagOne",
            camelCaseTag2: "tag_two",
            anotherTag: 5
          }
        })
      ).toMatchSnapshot();
    });
  });
});
