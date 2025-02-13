import React, { useEffect, useState } from "react";
import { ChartDisplay } from "../../components/dashboard/chartDisplay";
import { ChartType } from "../../types/dashboard";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/Config";
import Cookies from "js-cookie";
import { SidebarAnalytic } from "../../components/dashboard/sidebarChartt";
import Sidebar from "../../components/dashboard/sidebarCharts";

const AnalyticsDashboard = () => {
  const [selectedCharts, setSelectedCharts] = useState<
    { id: number; type: string }[]
  >([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = Number(Cookies.get("user"));

  const toggleChart = (chartId: number, chartType: string) => {
    setSelectedCharts((prev) => {
      const isSelected = prev.some((chart) => chart.id === chartId);
      if (isSelected) {
        const updatedCharts = prev.filter((chart) => chart.id !== chartId);
        if (userId) {
          removeFromIndexedDB(userId, "ChartsDB", "charts", chartId);
        }
        return updatedCharts;
      } else {
        const updatedCharts = [...prev, { id: chartId, type: chartType }];
        if (userId) {
          saveToIndexedDB(userId, "ChartsDB", "charts", updatedCharts);
        }
        return updatedCharts;
      }
    });
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (userId) {
      loadFromIndexedDB(userId, "ChartsDB", "charts").then((data) => {
        setSelectedCharts(data);
      });
    }
  }, [userId]);

  return (
    <div
      className="container-fluid"
      style={{ paddingLeft: "20px", backgroundColor: "#DDE2E6" }}
    >
      <div className="row">
        <div className="col-sm-3 col-md-3 col-lg-3 col-xl-2">
          <SidebarAnalytic
            selectedCharts={selectedCharts}
            toggleChart={toggleChart}
          />
        </div>
        <div
          className="col-sm-9 col-md-9 col-lg-9 col-xl-10 mt-3"
          style={{
            backgroundColor: "#f7f9fc",
            borderRadius: "10px",
            padding: "1.5rem 1rem",
            flexGrow: "1",
            overflowY: "auto",
            height: "79vh",
            maxHeight: "79vh",
          }}
        >
          <div className="parent d-flex flex-wrap justify-content-start gap-2 p-3 bg-light">
            {selectedCharts.map(({ id, type }) => (
              <div
                className="mb-4"
                key={id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                }}
              >
                <ChartDisplay chartType={type as ChartType} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
