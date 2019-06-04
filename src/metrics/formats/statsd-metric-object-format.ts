import { mapKeys, snakeCase, curryRight, flow, replace } from "lodash";
import Format from "./format";

const formatTags = (tags: object): object =>
  mapKeys(tags, (v: string, k: string): string => snakeCase(k));

/*
 * Must start with a letter.
 * Must only contain ASCII alphanumerics, underscores, and periods.
 * Other characters, including spaces, are converted to underscores.
 * Unicode is not supported.
 * Must not exceed 200 characters. Fewer than 100 is preferred from a UI perspective
 * See https://docs.datadoghq.com/developers/metrics/#naming-metrics
 */
const normalizeMetricName = (name: string): string => {
  const sanitizeNonASCII = (curryRight(replace, 3)(
    new RegExp("[^\\w.]", "g"),
    "_"
  ) as unknown) as (s: string) => string;
  const sanitizeLeadingNonLetters = (curryRight(replace, 3)(
    new RegExp("^[^a-zA-Z]*", "g"),
    ""
  ) as unknown) as (s: string) => string;
  return flow(
    sanitizeLeadingNonLetters,
    sanitizeNonASCII
  )(name);
};

const StatsDMetricObjectFormat: Format = {
  format: ({ stat, tags, ...args }): object => {
    return { stat: normalizeMetricName(stat), ...args, tags: formatTags(tags) };
  }
};

export default StatsDMetricObjectFormat;
