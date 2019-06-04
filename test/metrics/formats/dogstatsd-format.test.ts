import DogStatsDFormat from "../../../src/metrics/formats/dogstatsd-format";

describe("DogStatsDFormat", (): void => {
  describe("format", (): void => {
    it("Formats tags to a comma separated list of snake case tags", (): void => {
      expect(
        DogStatsDFormat.format("metric_name", {
          camelCaseTag1: "tagOne",
          camelCaseTag2: "tag_two",
          anotherTag: 5
        })
      ).toMatchSnapshot();
    });
  });
});
