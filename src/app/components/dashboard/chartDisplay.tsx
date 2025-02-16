import React from "react";
import Chart from "react-apexcharts";
import { chartConfig } from "../../data/dashboard";
import { ChartType } from "../../types/dashboard";

export const ChartDisplay: React.FC<{ chartType: ChartType }> = ({
  chartType,
}) => {
  const config = chartConfig[chartType];
  return (
    <>
      <Chart
        options={{
          ...config.options,
          chart: {
            ...config.options.chart,
            width: "100%",
            height: "100%",
          },
        }}
        series={config.series}
        type={config.options.chart.type}
      />
      <style>{`
        .apexcharts-legend.apx-legend-position-right {
          overflow: unset;
          size: auto;
        }
      `}</style>
    </>
  );
};
