import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/IndexDBConfig";
import { Rnd } from "react-rnd";
import { SidebarAnalytic } from "../../components/dashboard/sidebarChartt";
import { ChartType } from "../../types/dashboard";
import { ChartDisplay } from "../../components/dashboard/chartDisplay";
import { chartConfig } from "../../data/dashboard";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";
import { useAtom } from "jotai";

const AnalyticsDashboard: React.FC = () => {
  const userId = Number(Cookies.get("user"));
  const parentRef = useRef<HTMLDivElement>(null);

  const [selectedCharts, setSelectedCharts] = useState<
    {
      id: number;
      type: string;
      x: number;
      y: number;
      title: string;
      width: number;
      height: number;
    }[]
  >([]);

  const toggleChart = (
    chartId: number,
    chartType: string,
    chartTitle: string
  ) => {
    setSelectedCharts((prev) => {
      const isSelected = prev.some((chart) => chart.id === chartId);
      if (isSelected) {
        const updatedCharts = prev.filter((chart) => chart.id !== chartId);

        removeFromIndexedDB(userId, "analyticsDashboard", "charts", chartId)
          .then(() =>
            console.log(`Chart with ID ${chartId} removed from IndexedDB`)
          )
          .catch((error) =>
            console.error("Error removing from IndexedDB:", error)
          );

        return updatedCharts;
      }

      const config = chartConfig[chartType as ChartType];

      if (!config) {
        console.error(`Invalid chart type: ${chartType}`);
        return prev;
      }

      const chartWidth = parseInt(config.options.chart.width, 10);
      const chartHeight = parseInt(config.options.chart.height, 10);
      const parentWidth = parentRef.current ? parentRef.current.offsetWidth : 0;
      const gap = 20;

      const maxY = Math.max(...prev.map((chart) => chart.y), 0);
      const maxYCharts = prev.filter((chart) => chart.y === maxY);

      const maxXChart =
        maxYCharts.length > 0
          ? maxYCharts.reduce((maxChart, chart) =>
              chart.x > maxChart.x ? chart : maxChart
            )
          : null;

      let currentX = maxXChart ? maxXChart.x + maxXChart.width + gap : 0;
      let currentY = maxXChart ? maxXChart.y : 0;

      if (currentX + chartWidth > parentWidth) {
        currentX = 0;
        currentY += chartHeight + gap;
      }

      const newChart = {
        id: chartId,
        type: chartType,
        x: currentX,
        y: currentY,
        width: chartWidth,
        height: chartHeight,
        title: chartTitle,
      };

      saveToIndexedDB(userId, "analyticsDashboard", "charts", newChart)
        .then(() => console.log("Chart saved to IndexedDB"))
        .catch((error) => console.error("Error saving to IndexedDB:", error));

      return [...prev, newChart];
    });
  };

  const handleDragStop = (index: number, x: number, y: number) => {
    const parentWidth = parentRef.current ? parentRef.current.offsetWidth : 0;
    const chart = selectedCharts[index];

    if (x > parentWidth - chart.width || x < 0 || y < 0) {
      console.log("Invalid drop position, reverting to previous location");
      setSelectedCharts((prev) => prev);
      return;
    }

    if (!checkCollision(x, y, chart.width, chart.height, index)) {
      const updatedCharts = [...selectedCharts];
      updatedCharts[index] = { ...chart, x, y };
      setSelectedCharts(updatedCharts);

      saveToIndexedDB(
        userId,
        "analyticsDashboard",
        "charts",
        updatedCharts[index]
      )
        .then(() => console.log("Updated chart saved to IndexedDB"))
        .catch((error) => console.error("Error saving updated chart:", error));
    }
  };

  const handleResizeStop = (
    index: number,
    direction: any,
    ref: HTMLElement,
    delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    const newWidth = Math.min(
      parseInt(ref.style.width, 10),
      window.innerWidth * 0.75 - position.x
    );
    const newHeight = Math.min(
      parseInt(ref.style.height, 10),
      window.innerHeight * 0.9 - position.y
    );

    if (!checkCollision(position.x, position.y, newWidth, newHeight, index)) {
      const updatedCharts = [...selectedCharts];
      updatedCharts[index] = {
        ...updatedCharts[index],
        x: position.x,
        y: position.y,
        width: newWidth,
        height: newHeight,
      };
      setSelectedCharts(updatedCharts);

      saveToIndexedDB(
        userId,
        "analyticsDashboard",
        "charts",
        updatedCharts[index]
      )
        .then(() => console.log("Updated chart saved to IndexedDB"))
        .catch((error) => console.error("Error saving updated chart:", error));
    }
  };

  const checkCollision = (
    x: number,
    y: number,
    width: number,
    height: number,
    currentIndex: number
  ) => {
    return selectedCharts.some((chart, index) => {
      if (index === currentIndex) return false;
      const isColliding =
        x < chart.x + chart.width &&
        x + width > chart.x &&
        y < chart.y + chart.height &&
        y + height > chart.y;
      return isColliding;
    });
  };

  useEffect(() => {
    if (userId) {
      loadFromIndexedDB(userId, "analyticsDashboard", "charts")
        .then((storedCharts) => {
          setSelectedCharts(storedCharts);
        })
        .catch((error) =>
          console.error("Error loading from IndexedDB:", error)
        );
    }
  }, [userId]);

  const [toggleInstance] = useAtom(sidebarToggleAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Default to open

  useEffect(() => {
    if (!toggleInstance || !toggleInstance.target) return;

    const sidebarTarget = toggleInstance.target;
    const updateSidebarState = () => {
      const isMinimized = sidebarTarget.hasAttribute(
        "data-kt-app-sidebar-minimize"
      );
      setIsSidebarOpen(!isMinimized);
    };

    const observer = new MutationObserver(() => {
      updateSidebarState();
    });

    observer.observe(sidebarTarget, { attributes: true });

    updateSidebarState();

    return () => observer.disconnect();
  }, [toggleInstance]);

  return (
    <div className="container-fluid dashboard-container-fluid">
      <div className="row flex-grow-1" style={{ overflow: "hidden" }}>
        <div
          className={`pe-0 transition-all height-100 ${
            isSidebarOpen
              ? "col-sm-4 col-md-4 col-lg-4 col-xl-3"
              : "col-sm-3 col-md-3 col-lg-3 col-xl-2"
          }`}
        >
          <SidebarAnalytic
            selectedCharts={selectedCharts}
            toggleChart={toggleChart}
          />
        </div>

        <div
          className={`pt-3 pb-3 height-100 transition-all${
            isSidebarOpen
              ? "col-sm-8 col-md-8 col-lg-8 col-xl-9"
              : "col-sm-9 col-md-9 col-lg-9 col-xl-10"
          }`}
        >
          <div className="dashboard-display-container p-3">
            <div
              ref={parentRef}
              className="parent d-flex flex-wrap gap-2 p-3 dashboard-parent-chart-container"
            >
              {selectedCharts.map(
                ({ id, type, x, y, width, height, title }, index) => {
                  const config = chartConfig[type as ChartType];

                  const chartWidth = parseInt(config.options.chart.width, 10);
                  const chartHeight = parseInt(config.options.chart.height, 10);
                  return (
                    <Rnd
                      key={id}
                      size={{ width, height }}
                      position={{ x, y }}
                      onDragStop={(e: any, d: { x: number; y: number }) =>
                        handleDragStop(index, d.x, d.y)
                      }
                      onResizeStop={(
                        e: any,
                        direction: any,
                        ref: HTMLElement,
                        delta: { width: number; height: number },
                        position: { x: number; y: number }
                      ) =>
                        handleResizeStop(index, direction, ref, delta, position)
                      }
                      minWidth={chartWidth}
                      minHeight={chartHeight}
                      maxWidth={window.innerWidth * 0.75}
                      enableResizing={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                      }}
                    >
                      <ChartDisplay
                        chartType={type as ChartType}
                        chartTitle={title}
                      />
                    </Rnd>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
