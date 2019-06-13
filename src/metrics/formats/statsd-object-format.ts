import {
  curryRight,
  flow,
  mapKeys,
  replace,
  snakeCase,
  identity,
  merge
} from "lodash";
import Format from "./format";

export interface StatsDObjectFormatOpts {
  transformations?: {
    metric?: (metric: string) => string;
    stat?: (stat: string) => string;
    args?: (args: object) => object;
    tags?: (tags: object) => object;
  };
}

export type StatsDObjectFormatFunction = ({
  metric,
  stat,
  tags,
  ...args
}: {
  metric: string;
  stat: string;
  tags?: object;
  [key: string]: unknown;
}) => object;

export interface StatsDObjectFormat extends Format {
  format: StatsDObjectFormatFunction;
}

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
const normalizeStat = (name: string): string => {
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

const defaultOpts: StatsDObjectFormatOpts = {
  transformations: {
    metric: identity,
    stat: identity,
    args: identity,
    tags: identity
  }
};
export default ({
  ...opts
}: StatsDObjectFormatOpts = {}): StatsDObjectFormat => {
  const { transformations } = merge({}, defaultOpts, opts);
  return {
    format: ({ metric, stat, tags, ...args }): object => {
      return {
        [transformations.metric(metric)]: {
          stat: transformations.stat(normalizeStat(stat)),
          ...transformations.args(args),
          tags: transformations.tags(formatTags(tags))
        }
      };
    }
  };
};
