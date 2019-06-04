import { map, snakeCase } from "lodash";
import { StatsDArgs, StatsDFormat } from "./format";

/*
 * Tags should be a comma separated list of tags. Use colons for key/value tags, i.e. env:prod.
 * See https://docs.datadoghq.com/developers/dogstatsd/datagram_shell/#datagram-format
 *
 * Tags are converted to lowercase. Therefore, CamelCase tags are not recommended
 * See https://docs.datadoghq.com/tagging/#defining-tags
 */
const formatTags = (tags: object): string[] =>
  map(tags, (v: string, k: string): string => `${snakeCase(k)}:${v}`);

const DogStatsDFormat: StatsDFormat = {
  format: (stat: string, tags: object): StatsDArgs => {
    return { stat, tags: formatTags(tags) };
  }
};

export default DogStatsDFormat;
