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
    <div
      style={{
        width: config.options.chart.width,
        height: config.options.chart.height,
        backgroundColor: "white",
        borderRadius: "6px",
        cursor: "move",
        border: "2px solid #DDE2E6",
        boxShadow: "1px 1px 10px #DDE2E6",
        overflow: "hidden",
      }}
    >
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
