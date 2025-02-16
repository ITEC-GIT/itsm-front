import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { loadFromIndexedDB } from "../../indexDB/Config";
import { Rnd } from "react-rnd";
import { SidebarAnalytic } from "../../components/dashboard/sidebarChartt";
import { ChartType } from "../../types/dashboard";
import { ChartDisplay } from "../../components/dashboard/chartDisplay";
import { chartConfig } from "../../data/dashboard";

const AnalyticsDashboard: React.FC = () => {
  const [selectedCharts, setSelectedCharts] = useState<
    {
      id: number;
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }[]
  >([]);

  const toggleChart = (chartId: number, chartType: string) => {
    setSelectedCharts((prev) => {
      const isSelected = prev.some((chart) => chart.id === chartId);
      if (isSelected) {
        return prev.filter((chart) => chart.id !== chartId);
      }

      // Get default dimensions from chartConfig
      const { width, height } = chartConfig[chartType as ChartType].options;

      let x = 0;
      let y = 0;

      if (prev.length > 0) {
        // Find the total width of all charts in the current row
        const lastChart = prev[prev.length - 1];

        // If the current row has less than 3 charts, calculate the next position
        const rowWidth = prev
          .filter((chart) => chart.y === lastChart.y)
          .reduce((acc, chart) => acc + chart.width + 20, 0); // Add 20 for spacing

        // Check if adding the new chart will fit in the current row
        if (rowWidth + width <= 3 * (lastChart.width + 20)) {
          // Position it next to the last chart in the same row
          x = rowWidth; // Add up the width of all the previous charts in the row
          y = lastChart.y; // Stay on the same row
        } else {
          // Move to the next row if it doesn't fit
          x = 0; // First chart in the new row
          y = lastChart.y + lastChart.height + 20; // Position it below the last chart
        }
      }

      const newChart = {
        id: chartId,
        type: chartType,
        x,
        y,
        width,
        height,
      };

      return [...prev, newChart];
    });
  };

  useEffect(() => {
    const userId = Number(Cookies.get("user"));
    if (userId) {
      loadFromIndexedDB(userId, "ChartsDB", "charts").then((data) => {
        const chartsWithPositions = data.map((chart: any, index: number) => {
          const { width, height } = chartConfig[chart as ChartType].options;
          return {
            ...chart,
            x: (index % 3) * (width + 20),
            y: Math.floor(index / 3) * (height + 20),
            width,
            height,
          };
        });
        setSelectedCharts(chartsWithPositions);
      });
    }
  }, []);

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
            className="parent d-flex flex-wrap gap-2 p-3 bg-light"
            style={{ position: "relative", height: "100%" }}
          >
            {selectedCharts.map(({ id, type, x, y, width, height }, index) => (
              <Rnd
                key={id}
                size={{ width, height }}
                position={{ x, y }}
                bounds="parent"
                onDragStop={(e, d) => handleDragStop(index, d.x, d.y)}
                onResizeStop={(e, direction, ref, delta, position) =>
                  handleResizeStop(index, direction, ref, delta, position)
                }
                minWidth={350}
                minHeight={300}
                maxWidth={window.innerWidth * 0.9}
                maxHeight={window.innerHeight * 0.9}
              >
                <div
                  className="chart-box"
                  style={{
                    alignContent: "center",
                    // width: "100%",
                    // height: "100%",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    cursor: "move",
                    border: "2px solid #007bff",
                    objectFit: "fill",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "auto",
                      maxWidth: "auto",
                      height: "auto",
                      maxHeight: "auto",
                    }}
                  >
                    <ChartDisplay chartType={type as ChartType} />
                  </div>
                </div>
              </Rnd>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// const AnalyticsDashboard: React.FC = () => {
//   const [selectedCharts, setSelectedCharts] = useState<
//     {
//       id: number;
//       type: string;
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     }[]
//   >([]);

//   const toggleChart = (chartId: number, chartType: string) => {
//     setSelectedCharts((prev) => {
//       const isSelected = prev.some((chart) => chart.id === chartId);
//       if (isSelected) {
//         return prev.filter((chart) => chart.id !== chartId);
//       }

//       const { x, y } = getNextAvailablePosition(prev);
//       const newChart = {
//         id: chartId,
//         type: chartType,
//         x,
//         y,
//         width: 300,
//         height: 200,
//       };
//       return [...prev, newChart];
//     });
//   };

//   useEffect(() => {
//     const userId = Number(Cookies.get("user"));
//     if (userId) {
//       loadFromIndexedDB(userId, "ChartsDB", "charts").then((data) => {
//         const chartsWithPositions = data.map((chart: any, index: number) => {
//           const { x, y } = getNextAvailablePosition(data.slice(0, index));
//           return {
//             ...chart,
//             x,
//             y,
//             width: 300,
//             height: 200,
//           };
//         });
//         setSelectedCharts(chartsWithPositions);
//       });
//     }
//   }, []);

//   const handleDragStop = (index: number, x: number, y: number) => {
//     if (
//       !checkCollision(
//         x,
//         y,
//         selectedCharts[index].width,
//         selectedCharts[index].height,
//         index
//       )
//     ) {
//       const updatedCharts = [...selectedCharts];
//       updatedCharts[index] = { ...updatedCharts[index], x, y };
//       setSelectedCharts(updatedCharts);
//     }
//   };

//   const handleResizeStop = (
//     index: number,
//     direction: any,
//     ref: HTMLElement,
//     delta: { width: number; height: number },
//     position: { x: number; y: number }
//   ) => {
//     const newWidth = parseInt(ref.style.width, 10);
//     const newHeight = parseInt(ref.style.height, 10);
//     if (!checkCollision(position.x, position.y, newWidth, newHeight, index)) {
//       const updatedCharts = [...selectedCharts];
//       updatedCharts[index] = {
//         ...updatedCharts[index],
//         x: position.x,
//         y: position.y,
//         width: newWidth,
//         height: newHeight,
//       };
//       setSelectedCharts(updatedCharts);
//     }
//   };

//   const checkCollision = (
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     currentIndex: number
//   ) => {
//     return selectedCharts.some((chart, index) => {
//       if (index === currentIndex) return false;
//       const isColliding =
//         x < chart.x + chart.width &&
//         x + width > chart.x &&
//         y < chart.y + chart.height &&
//         y + height > chart.y;
//       return isColliding;
//     });
//   };

//   const getNextAvailablePosition = (charts: typeof selectedCharts) => {
//     const parentWidth = 800;
//     const chartWidth = 300;
//     const chartHeight = 200;

//     let x = 0;
//     let y = 0;

//     while (true) {
//       const isOccupied = charts.some(
//         (chart) =>
//           x < chart.x + chart.width &&
//           x + chartWidth > chart.x &&
//           y < chart.y + chart.height &&
//           y + chartHeight > chart.y
//       );

//       if (!isOccupied) {
//         break;
//       }

//       x += chartWidth + 20;
//       if (x + chartWidth > parentWidth) {
//         x = 0;
//         y += chartHeight + 20;
//       }
//     }

//     return { x, y };
//   };

//   return (
//     <div
//       className="container-fluid"
//       style={{ paddingLeft: "20px", backgroundColor: "#DDE2E6" }}
//     >
//       <div className="row">
//         <div className="col-sm-3 col-md-3 col-lg-3 col-xl-2">
//           <SidebarAnalytic
//             selectedCharts={selectedCharts}
//             toggleChart={toggleChart}
//           />
//         </div>
//         <div
//           className="col-sm-9 col-md-9 col-lg-9 col-xl-10 mt-3"
//           style={{
//             backgroundColor: "#f7f9fc",
//             borderRadius: "10px",
//             padding: "1.5rem 1rem",
//             height: "79vh",
//             overflowY: "auto",
//             position: "relative",
//           }}
//         >
//           <div
//             className="parent d-flex flex-wrap gap-2 p-3 bg-light"
//             style={{ position: "relative", height: "100%" }}
//           >
//             {selectedCharts.map(({ id, type, x, y, width, height }, index) => (
//               <Rnd
//                 key={id}
//                 size={{ width, height }}
//                 position={{ x, y }}
//                 bounds="parent"
//                 onDragStop={(e, d) => handleDragStop(index, d.x, d.y)}
//                 onResizeStop={(e, direction, ref, delta, position) =>
//                   handleResizeStop(index, direction, ref, delta, position)
//                 }
//                 minWidth={150}
//                 minHeight={100}
//               >
//                 <div
//                   className="chart-box"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "white",
//                     borderRadius: "6px",
//                     cursor: "move",
//                   }}
//                 >
//                   <ChartDisplay chartType={type as ChartType} />
//                 </div>
//               </Rnd>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AnalyticsDashboard: React.FC = () => {
//   const [selectedCharts, setSelectedCharts] = useState<
//     {
//       id: number;
//       type: string;
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     }[]
//   >([]);

//   const toggleChart = (chartId: number, chartType: string) => {
//     setSelectedCharts((prev) => {
//       const isSelected = prev.some((chart) => chart.id === chartId);
//       if (isSelected) {
//         return prev.filter((chart) => chart.id !== chartId);
//       }

//       const { x, y } = getNextAvailablePosition(prev);
//       const newChart = {
//         id: chartId,
//         type: chartType,
//         x,
//         y,
//         width: 300,
//         height: 200,
//       };
//       return [...prev, newChart];
//     });
//   };

//   useEffect(() => {
//     const userId = Number(Cookies.get("user"));
//     if (userId) {
//       loadFromIndexedDB(userId, "ChartsDB", "charts").then((data) => {
//         const chartsWithPositions = data.map((chart: any, index: number) => {
//           const { x, y } = getNextAvailablePosition(data.slice(0, index));
//           return {
//             ...chart,
//             x,
//             y,
//             width: 300,
//             height: 200,
//           };
//         });
//         setSelectedCharts(chartsWithPositions);
//       });
//     }
//   }, []);

//   const handleDragStop = (index: number, x: number, y: number) => {
//     if (
//       !checkCollision(
//         x,
//         y,
//         selectedCharts[index].width,
//         selectedCharts[index].height,
//         index
//       )
//     ) {
//       const updatedCharts = [...selectedCharts];
//       updatedCharts[index] = { ...updatedCharts[index], x, y };
//       setSelectedCharts(updatedCharts);
//     }
//   };

//   const handleResizeStop = (
//     index: number,
//     direction: any,
//     ref: HTMLElement,
//     delta: { width: number; height: number },
//     position: { x: number; y: number }
//   ) => {
//     const newWidth = parseInt(ref.style.width, 10);
//     const newHeight = parseInt(ref.style.height, 10);
//     if (!checkCollision(position.x, position.y, newWidth, newHeight, index)) {
//       const updatedCharts = [...selectedCharts];
//       updatedCharts[index] = {
//         ...updatedCharts[index],
//         x: position.x,
//         y: position.y,
//         width: newWidth,
//         height: newHeight,
//       };
//       setSelectedCharts(updatedCharts);
//     }
//   };

//   const checkCollision = (
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     currentIndex: number
//   ) => {
//     return selectedCharts.some((chart, index) => {
//       if (index === currentIndex) return false;
//       const isColliding =
//         x < chart.x + chart.width &&
//         x + width > chart.x &&
//         y < chart.y + chart.height &&
//         y + height > chart.y;
//       return isColliding;
//     });
//   };

//   const getNextAvailablePosition = (charts: typeof selectedCharts) => {
//     const parentWidth = 800;
//     const chartWidth = 400;
//     const chartHeight = 300;

//     let x = 0;
//     let y = 0;

//     while (true) {
//       const isOccupied = charts.some(
//         (chart) =>
//           x < chart.x + chart.width &&
//           x + chartWidth > chart.x &&
//           y < chart.y + chart.height &&
//           y + chartHeight > chart.y
//       );

//       if (!isOccupied) {
//         break;
//       }

//       x += chartWidth + 20;
//       if (x + chartWidth > parentWidth) {
//         x = 0;
//         y += chartHeight + 20;
//       }
//     }

//     return { x, y };
//   };

//   return (
//     <div
//       className="container-fluid"
//       style={{ paddingLeft: "20px", backgroundColor: "#DDE2E6" }}
//     >
//       <div className="row">
//         <div className="col-sm-3 col-md-3 col-lg-3 col-xl-2">
//           <SidebarAnalytic
//             selectedCharts={selectedCharts}
//             toggleChart={toggleChart}
//           />
//         </div>
//         <div
//           className="col-sm-9 col-md-9 col-lg-9 col-xl-10 mt-3"
//           style={{
//             backgroundColor: "#f7f9fc",
//             borderRadius: "10px",
//             padding: "1.5rem 1rem",
//             height: "79vh",
//             overflowY: "auto",
//             position: "relative",
//           }}
//         >
//           <div
//             className="parent d-flex flex-wrap gap-5 p-3 bg-light"
//             style={{ position: "relative", height: "100%" }}
//           >
//             {selectedCharts.map(({ id, type, x, y, width, height }, index) => (
//               <Rnd
//                 key={id}
//                 size={{ width, height }}
//                 position={{ x, y }}
//                 bounds="parent"
//                 onDragStop={(e, d) => handleDragStop(index, d.x, d.y)}
//                 onResizeStop={(e, direction, ref, delta, position) =>
//                   handleResizeStop(index, direction, ref, delta, position)
//                 }
//                 minWidth={150}
//                 minHeight={100}
//               >
//                 <div
//                   className="chart-box"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     alignContent: "center",
//                     backgroundColor: "white",
//                     borderRadius: "6px",
//                     cursor: "move",
//                   }}
//                 >
//                   <ChartDisplay chartType={type as ChartType} />
//                 </div>
//               </Rnd>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default AnalyticsDashboard;
