import React, { useState, useEffect } from "react";
import { StatisticsWidget5 } from "../../../_metronic/partials/widgets/statistics/StatisticsWidget5";
import { DashboardAnalyticsType, WidgetMapping } from "../../types/dashboard";
import { ChartDisplay } from "./chartDisplay";

// main design
export const StatisticsList = ({ data }: { data: any }) => {
  const svgIconMapping: Record<keyof DashboardAnalyticsType, WidgetMapping> = {
    total_tickets_today: {
      icon: "pin",
      title: "Today's Tickets",
      color: "#fff",
    },
    total_tickets_month: {
      icon: "calendar",
      title: "Tickets This Month",
      color: "#fff",
    },
    users_count: { icon: "people", title: "Users Count", color: "#fff" },
    total_tickets_count: {
      icon: "folder",
      title: "Total Tickets",
      color: "#fff",
    },
    total_tickets_delayed: {
      icon: "timer",
      title: "Overdue Tickets",
      color: "#fff",
    },
    total_assets: {
      icon: "devices",
      title: "Total Assets",
      color: "#fff",
    },
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row g-4 align-items-stretch justify-content-center">
        {/* left side */}
        <div className="col-12 col-sm-4 col-md-4 col-xl-3 d-flex flex-column gap-4 flex-no-wrap">
          {(Object.keys(data) as (keyof typeof svgIconMapping)[])
            .slice(0, 2)
            .map((key, index) => {
              const widgetConfig = svgIconMapping[key];
              if (!widgetConfig) return null;

              return (
                <div className="stat-widget" key={index}>
                  <StatisticsWidget5
                    className="card-xl-stretch stat-widget-card"
                    svgIcon={widgetConfig.icon}
                    color={widgetConfig.color}
                    iconColor="white"
                    title={widgetConfig.title}
                    titleColor="white"
                    description={data[key]?.toString() || "0"}
                    descriptionColor="white"
                    progress={80}
                    progressColor="primary"
                  />
                </div>
              );
            })}
        </div>

        {/* middle */}
        <div className="col-12 col-sm-4 col-md-4 col-xl-6 text-center chart-container d-flex justify-content-center">
          <ChartDisplay chartType={"Pie Chart"} />
          <ChartDisplay chartType={"Bar Chart"} />
        </div>

        {/* right side */}
        <div className="col-12 col-sm-4 col-md-4 col-xl-3 d-flex flex-column gap-4">
          {(Object.keys(data) as (keyof typeof svgIconMapping)[])
            .slice(2)
            .map((key, index) => {
              const widgetConfig = svgIconMapping[key];
              if (!widgetConfig) return null;

              return (
                <div className="stat-widget" key={index}>
                  <StatisticsWidget5
                    className="card-xl-stretch stat-widget-card"
                    svgIcon={widgetConfig.icon}
                    color={widgetConfig.color}
                    iconColor="white"
                    title={widgetConfig.title}
                    titleColor="white"
                    description={data[key]?.toString() || "0"}
                    descriptionColor="white"
                    // progress={80}
                    // progressColor="black"
                  />
                </div>
              );
            })}
        </div>
      </div>

      <style>{`

        .stat-widget {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-widget:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-widget-card {
          background: linear-gradient(120deg, #2196f3, #64b5f6);

          border-radius: 10px;
          padding: 15px;
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .stat-widget-card {
            padding: 10px;
          }

          .chart-container {
            padding: 10px;
          }
        }

        @media (max-width: 576px) {
          .stat-widget {
            margin-bottom: 20px;
          }

          .chart-container {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
};

// first design
// export const StatisticsList = ({ data }: { data: any }) => {
//   const svgIconMapping: Record<keyof DashboardAnalyticsType, WidgetMapping> = {
//     total_tickets_today: {
//       icon: "pin",
//       title: "Today's Tickets",
//       color: "primary",
//     },

//     total_tickets_month: {
//       icon: "calendar",
//       title: "Tickets This Month",
//       color: "primary",
//     },

//     users_count: { icon: "people", title: "Users Count", color: "primary" },
//     total_tickets_count: {
//       icon: "cheque",
//       title: "Total Tickets",
//       color: "primary",
//     },

//     total_tickets_delayed: {
//       icon: "timer",
//       title: "Overdue Tickets",
//       color: "danger",
//     },

//     total_assets: {
//       icon: "devices",
//       title: "Total Assets",
//       color: "primary",
//     },
//   };

//   return (
//     <div className="container mt-5">
//       <div
//         className="row g-4 align-items-center justify-content-center"
//         // style={{ maxHeight: "calc(100vh - 850px)" }}
//       >
//         {/* left side  */}
//         <div className="col-12 col-sm-5 col-xl-3 d-flex flex-column gap-4">
//           {(Object.keys(data) as (keyof typeof svgIconMapping)[])
//             .slice(0, 2)
//             .map((key, index) => {
//               const widgetConfig = svgIconMapping[key];
//               if (!widgetConfig) return null;

//               return (
//                 <StatisticsWidget5
//                   key={index}
//                   className="card-xl-stretch"
//                   svgIcon={widgetConfig.icon}
//                   color={widgetConfig.color}
//                   iconColor="white"
//                   title={widgetConfig.title}
//                   titleColor="white"
//                   description={data[key]?.toString() || "0"}
//                   descriptionColor="white"
//                 />
//               );
//             })}
//         </div>

//         {/* center */}
//         <div className="col-12 col-sm-8 col-md-6 col-xl-4 text-center">
//           <ChartDisplay chartType={"Pie Chart"} />
//           <ChartDisplay chartType={"Bar Chart"} />
//         </div>

//         {/* right side*/}
//         <div className="col-12 col-sm-5 col-xl-3 d-flex flex-column gap-4">
//           {(Object.keys(data) as (keyof typeof svgIconMapping)[])
//             .slice(2)
//             .map((key, index) => {
//               const widgetConfig = svgIconMapping[key];
//               if (!widgetConfig) return null;

//               return (
//                 <StatisticsWidget5
//                   key={index}
//                   className="card-xl-stretch"
//                   svgIcon={widgetConfig.icon}
//                   color={widgetConfig.color}
//                   iconColor="white"
//                   title={widgetConfig.title}
//                   titleColor="white"
//                   description={data[key]?.toString() || "0"}
//                   descriptionColor="white"
//                 />
//               );
//             })}
//         </div>
//       </div>
//     </div>
//   );
// };

// return (
//   <div className="row g-5 g-xl-8 mt-5">
//     {(Object.keys(data) as (keyof DashboardAnalyticsType)[]).map((key) => {
//       const widgetConfig = svgIconMapping[key];
//       if (!widgetConfig) return null;
//       return (
//         <div className="col-12 col-sm-6 col-xl-3" key={key}>
//           <StatisticsWidget5
//             className="card-xl-stretch mb-xl-8"
//             svgIcon={widgetConfig.icon}
//             color={widgetConfig.color}
//             iconColor="white"
//             title={widgetConfig.title}
//             titleColor="white"
//             description={data[key]?.toString() || "0"}
//             descriptionColor="white"
//           />
//         </div>
//       );
//     })}
//   </div>
// );
// };
