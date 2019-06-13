import { inspect } from "util";
import { merge } from "lodash";
import Format from "./format";
import { StatsDStringFormat, StatsDObjectFormat } from "../../index";

interface StatsDStringFormatOpts {
  colors?: boolean;
  capitalizeMetric?: boolean;
  depth?: number;
  compact?: number | boolean;
  breakLength?: number;
}
type StatsDStringFormatFunction = ({
  metric,
  stat,
  tags,
  ...args
}: {
  metric: string;
  stat: string;
  tags?: object;
  args?: object;
}) => string;

export interface StatsDStringFormat extends Format {
  format: StatsDStringFormatFunction;
}

const defaultOpts: StatsDStringFormatOpts = {
  colors: false,
  capitalizeMetric: false,
  depth: null,
  compact: false
};

export default ({
  ...opts
}: StatsDStringFormatOpts = {}): StatsDStringFormat => {
  const { depth, colors, compact, capitalizeMetric, breakLength } = merge(
    {},
    defaultOpts,
    opts
  );
  const objectFormat = StatsDObjectFormat({
    transformations: {
      metric: (m: string): string => (capitalizeMetric ? m.toUpperCase() : m)
    }
  });

  return {
    format: ({ metric, stat, tags, ...args }): string => {
      const objectMetric = objectFormat.format({ metric, stat, tags, ...args });
      return inspect(objectMetric, {
        colors,
        depth,
        compact,
        breakLength
      });
    }
  };
};
