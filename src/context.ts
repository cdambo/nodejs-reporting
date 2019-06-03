export default class Context {
  private readonly globalTags: object;

  public constructor(globalTags: object = {}) {
    this.globalTags = globalTags;
  }

  public mergeTags(tags: object = {}): object {
    return Object.assign({}, this.globalTags, tags);
  }
}
