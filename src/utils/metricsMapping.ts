type MetricItem = {
  metric: string;
  value: string;
  created_at: string;
};

type MappedMetrics = Record<string, string>;

export const mapMetricsToObject = (data: MetricItem[]): MappedMetrics => {
  const result: MappedMetrics = {};

  data.forEach((item) => {
    const key = item.metric
      .trim()
      .replace(/:$/, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    result[key] = item.value;
  });

  return result;
};
