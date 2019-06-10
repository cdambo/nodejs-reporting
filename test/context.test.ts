import { Context } from "../src";

describe("Context", (): void => {
  describe("mergeTags", (): void => {
    it("Returns a merged object of tags", (): void => {
      const context = new Context({ a: 1 });
      expect(context.mergeTags({ b: 2 })).toMatchSnapshot();
    });

    describe("Empty globalTags", (): void => {
      it("Returns a merged object of tags", (): void => {
        const context = new Context();
        expect(context.mergeTags({ b: 2 })).toMatchSnapshot();
      });
    });

    describe("Empty tags", (): void => {
      it("Returns a merged object of tags", (): void => {
        const context = new Context({ a: 1 });
        expect(context.mergeTags()).toMatchSnapshot();
      });
    });

    describe("Undefined tags", (): void => {
      it("Returns a merged object of tags", (): void => {
        const context = new Context({ a: 1 });
        expect(context.mergeTags(undefined)).toMatchSnapshot();
      });
    });
  });
});
