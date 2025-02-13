import React from "react";
import { chartSideBarItems } from "../../data/dashboard";

interface SidebarProps {
  toggleChart: (chartId: number, chartType: string) => void;
  selectedCharts: { id: number; type: string }[];
}

const SidebarAnalytic: React.FC<SidebarProps> = ({
  toggleChart,
  selectedCharts,
}) => {
  return (
    <div className="sidebar-analytics mt-3">
      <div className="chart-list">
        {chartSideBarItems.map((category, index) => (
          <div key={index}>
            <h5 className="section-title-up-down">{category.title}</h5>

            <div
              className="d-flex flex-column align-items-start"
              style={{ gap: "0.5rem" }}
            >
              {category.charts.map((chart) => {
                const isSelected = selectedCharts.some(
                  (c) => c.id === chart.id
                );
                const btnClassName = isSelected
                  ? "sidebar-analytics-selected-btn"
                  : "sidebar-analytics-btn";
                return (
                  <button
                    key={chart.id}
                    className={`${btnClassName}`}
                    onClick={() => toggleChart(chart.id, chart.type)}
                  >
                    {/* <i className="bi bi-pie-chart"></i> */}
                    <span>{chart.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SidebarAnalytic };
