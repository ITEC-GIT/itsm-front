import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/sidebarCharts";
import { Content } from "../../../_metronic/layout/components/content";
import { ChartDisplay } from "../../components/dashboard/chartDisplay";
import { ChartType } from "../../types/dashboard";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/Config";
import Cookies from "js-cookie";

const MainDashboard = () => {
  const [selectedCharts, setSelectedCharts] = useState<
    { id: number; type: string }[]
  >([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = Number(Cookies.get("user"));
  console.log("userId ==>>", userId);

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
    console.log("userId ==>>", userId);
    if (userId) {
      loadFromIndexedDB(userId, "ChartsDB", "charts").then((data) => {
        setSelectedCharts(data);
      });
    }
  }, [userId]);

  return (
    <Content>
      <div className="container-fluid">
        <div className="row">
          <div
            className={`col-md-4 bg-primary text-white position-fixed ${
              isSidebarOpen ? "d-block" : "d-none d-md-block"
            }`}
            style={{
              width: isSidebarOpen ? "80%" : "250px",
              height: "100%",
              maxHeight: "70%",
              borderRadius: isSidebarOpen ? "0" : "10px",
              boxShadow: "0 0 10px 0 rgba(100,100,100,0.1)",
              overflowY: "auto",
              zIndex: 99,
            }}
          >
            <Sidebar
              selectedCharts={selectedCharts}
              toggleChart={toggleChart}
            />
          </div>

          <button
            className="btn btn-primary position-fixed d-md-none"
            style={{
              width: "40px",
              height: "100px",
              borderRadius: " 0 50%  50% 0",
              fontWeight: "bold",
              top: "50%",
              left: isSidebarOpen ? "84%" : "0",
              transform: "translateY(-50%)",
              writingMode: "vertical-rl",
              textOrientation: "upright",

              zIndex: 100,
            }}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "Back" : "Menu"}
          </button>

          <div
            className={`col-md-8 offset-md-3 p-4 `}
            style={{
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
            }}
          >
            <div className="row">
              {selectedCharts.map(({ id, type }) => (
                <div className="col-md-6 col-lg-6 mb-4" key={id}>
                  <ChartDisplay chartType={type as ChartType} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
    @media (min-width: 768px) and (max-width: 1246px) {
      .container-fluid {
        padding: 0;
      }
      .col-md-8 {
        margin-left: 30% !important;
      }
    }
  `}
      </style>
    </Content>
  );
};

export default MainDashboard;
