import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/Config";
import { Rnd } from "react-rnd";
import { SidebarAnalytic } from "../../components/dashboard/sidebarChartt";
import { ChartType } from "../../types/dashboard";
import { ChartDisplay } from "../../components/dashboard/chartDisplay";
import { chartConfig } from "../../data/dashboard";

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

      // If the chart is already selected, remove it
      if (isSelected) {
        // Remove from state
        const updatedCharts = prev.filter((chart) => chart.id !== chartId);

        // Also remove from IndexedDB
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
      const chartWidth = parseInt(config.options.chart.width, 10);
      const chartHeight = parseInt(config.options.chart.height, 10);

      const parentWidth = parentRef.current ? parentRef.current.offsetWidth : 0;
      const gap = 20;

      let currentX = 0;
      let currentY = 0;
      let rowHeight = 0;

      if (prev.length > 0) {
        const lastChart = prev[prev.length - 1];
        currentX = lastChart.x + lastChart.width + gap;
        currentY = lastChart.y;
        rowHeight = lastChart.height;

        // Move to the next row if the new chart doesn't fit
        if (currentX + chartWidth > parentWidth) {
          currentX = 0;
          currentY = currentY + rowHeight + gap;
        }
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

      // Save to IndexedDB
      saveToIndexedDB(userId, "analyticsDashboard", "charts", newChart)
        .then(() => console.log("Chart saved to IndexedDB"))
        .catch((error) => console.error("Error saving to IndexedDB:", error));

      return [...prev, newChart];
    });
  };

  const handleDragStop = (index: number, x: number, y: number) => {
    if (
      !checkCollision(
        x,
        y,
        selectedCharts[index].width,
        selectedCharts[index].height,
        index
      )
    ) {
      const updatedCharts = [...selectedCharts];
      updatedCharts[index] = { ...updatedCharts[index], x, y };
      setSelectedCharts(updatedCharts);

      // Save updated chart dimensions to IndexedDB
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
      window.innerHeight * 0.79 - position.y
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

      // Save updated chart dimensions to IndexedDB
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
            height: "79vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <div
            ref={parentRef}
            className="parent d-flex flex-wrap gap-2 p-3 bg-light"
            style={{ position: "relative", height: "100%" }}
          >
            {selectedCharts.map(
              ({ id, type, x, y, width, height, title }, index) => (
                <Rnd
                  key={id}
                  size={{ width, height }}
                  position={{ x, y }}
                  bounds="parent"
                  onDragStop={(e, d) => handleDragStop(index, d.x, d.y)}
                  onResizeStop={(e, direction, ref, delta, position) =>
                    handleResizeStop(index, direction, ref, delta, position)
                  }
                  minWidth={350} //should be dynamic
                  minHeight={350}
                  maxWidth={window.innerWidth * 0.75}
                  maxHeight={window.innerHeight * 0.7}
                >
                  <ChartDisplay
                    chartType={type as ChartType}
                    chartTitle={title}
                  />
                </Rnd>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
