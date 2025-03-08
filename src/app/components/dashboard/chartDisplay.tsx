import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { chartConfig } from "../../data/dashboard";
import { ChartType } from "../../types/dashboard";

export const ChartDisplay: React.FC<{
  chartType: ChartType;
  chartTitle: string;
}> = ({ chartType, chartTitle }) => {
  const config = chartConfig[chartType];
  const [categoryTitle, chartTitleText] = chartTitle.split(" : ");

  return (
    <div className="chart-box" style={{ width: "100%", height: "100%" }}>
      {chartTitle && (
        <div className="chart-title">
          <span className="category-title">{categoryTitle}</span>
          <span> : </span>
          <span className="chart-title-text">{chartTitleText}</span>
        </div>
      )}
      <Chart
        options={config.options}
        series={config.series}
        type={config.options.chart.type}
      />
      <style>{`
        .apexcharts-legend.apx-legend-position-right {
          overflow: unset;
          size: auto;
        }
      `}</style>
    </div>
  );
};
