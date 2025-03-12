import React from "react";
import { chartSideBarItems } from "../../data/dashboard";

interface SidebarProps {
  toggleChart: (chartId: number, chartType: string, chartTitle: string) => void;
  selectedCharts: { id: number; type: string }[];
}

const SidebarAnalytic: React.FC<SidebarProps> = ({
  toggleChart,
  selectedCharts,
}) => {
  return (
    <div className="sidebar-analytics p-3">
      <div className="chart-list p-3">
        {chartSideBarItems.map((category, index) => (
          <div key={index}>
            <h5 className="section-title-up-down">{category.title}</h5>

            <div
              className="d-flex flex-column align-items-start mb-2"
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
                    onClick={() =>
                      toggleChart(
                        chart.id,
                        chart.type,
                        `${category.title} : ${chart.title}`
                      )
                    }
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
