import { map, snakeCase } from "lodash";
import Format from "./format";
import { StatsDArgs } from "./index";

export type DogStatsDFormatFunction = (...args: unknown[]) => StatsDArgs;

export interface DogStatsDFormat extends Format {
  format: DogStatsDFormatFunction;
}

/*
 * Tags should be a comma separated list of tags. Use colons for key/value tags, i.e. env:prod.
 * See https://docs.datadoghq.com/developers/dogstatsd/datagram_shell/#datagram-format
 *
 * Tags are converted to lowercase. Therefore, CamelCase tags are not recommended
 * See https://docs.datadoghq.com/tagging/#defining-tags
 */
const formatTags = (tags: object): string[] =>
  map(tags, (v: string, k: string): string => `${snakeCase(k)}:${v}`);

export default (): DogStatsDFormat => ({
  format: ({ tags, ...args }): StatsDArgs => {
    return { tags: formatTags(tags), ...args };
  }
});
