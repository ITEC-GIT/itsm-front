import React from "react";
import { chartSideBarItems } from "../../data/dashboard";

interface SidebarProps {
  toggleChart: (chartId: number, chartType: string) => void;
  selectedCharts: { id: number; type: string }[];
}

// const Sidebar: React.FC<SidebarProps> = ({ toggleChart, selectedCharts }) => {
//   return (
//     <div
//       style={{
//         height: "100%",
//         overflowY: "scroll",
//         padding: "10px",
//         background: "linear-gradient(180deg, #f3f4f6, #e9ecef)",
//         borderRight: "2px solid #ddd",
//         scrollbarWidth: "none",
//         msOverflowStyle: "none",
//       }}
//     >
//       <h4
//         style={{
//           textAlign: "center",
//           marginBottom: "20px",
//           color: "#1B84FF",
//           fontSize: "18px",
//           fontWeight: "bold",
//         }}
//       >
//         Insights
//       </h4>
//       {chartSideBarItems.map((category, index) => (
//         <div
//           key={index}
//           style={{
//             marginBottom: "20px",
//             border: "1px solid #ddd",
//             borderRadius: "10px",
//             background: "white",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             padding: "15px",
//             transition: "transform 0.3s, box-shadow 0.3s",
//             cursor: "pointer",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
//           }
//         >
//           <h5
//             style={{
//               marginBottom: "10px",
//               color: "#333",
//               fontSize: "16px",
//               fontWeight: "bold",
//               borderBottom: "1px solid #ccc",
//               paddingBottom: "5px",
//             }}
//           >
//             {category.title}
//           </h5>
//           <ul style={{ listStyleType: "none", padding: 0 }}>
//             {category.charts.map((chart) => (
//               <li key={chart.id}>
//                 <div
//                   style={{
//                     margin: "5px",
//                     display: "flex",
//                     alignItems: "center",
//                     border: "1px solid #eee",
//                     borderRadius: "6px",
//                     padding: "8px",
//                     background: "#f9f9f9",
//                     transition: "background 0.3s",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "#f0f4f8")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "#f9f9f9")
//                   }
//                 >
//                   <input
//                     type="checkbox"
//                     id={`${chart.id}`}
//                     checked={selectedCharts.some((c) => c.id === chart.id)}
//                     onChange={() => toggleChart(chart.id, chart.type)}
//                     style={{
//                       marginRight: "10px",
//                       transform: "scale(1.2)",
//                       cursor: "pointer",
//                     }}
//                   />
//                   <label
//                     htmlFor={`${chart.id}`}
//                     style={{
//                       cursor: "pointer",
//                       fontSize: "14px",
//                       color: "#555",
//                     }}
//                   >
//                     {chart.title}
//                   </label>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

const Sidebar: React.FC<SidebarProps> = ({ toggleChart, selectedCharts }) => {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll",
        padding: "10px",
        background: "linear-gradient(180deg, #f3f4f6, #e9ecef)",
        borderRight: "2px solid #ddd",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <h4
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "black",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Insights
      </h4>
      {chartSideBarItems.map((category, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
          }
        >
          <h5
            style={{
              marginBottom: "10px",
              color: "#333",
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
              paddingBottom: "5px",
            }}
          >
            {category.title}
          </h5>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {category.charts.map((chart) => {
              const isSelected = selectedCharts.some((c) => c.id === chart.id);
              return (
                <li key={chart.id}>
                  <div
                    style={{
                      margin: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: isSelected
                        ? "2px solid #1B84FF"
                        : "1px solid #eee",
                      borderRadius: "6px",
                      padding: "10px",
                      background: isSelected ? "#e8f5e9" : "#f9f9f9",
                      boxShadow: isSelected ? "0 0 3px #1B99AA" : "none",
                      transition: "all 0.3s",
                    }}
                    onClick={() => toggleChart(chart.id, chart.type)}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: isSelected ? "#1B84FF" : "#555",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {chart.title}
                    </span>
                    {/* {isSelected && (
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#1B84FF",
                          fontWeight: "bold",
                        }}
                      >
                        ✔
                      </span>
                    )} */}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

// const Sidebar: React.FC<SidebarProps> = ({ toggleChart, selectedCharts }) => {
//   return (
//     <div
//       style={{
//         height: "100%", //"88%",
//         overflowY: "scroll",
//         padding: "10px",
//         scrollbarWidth: "none",
//         msOverflowStyle: "none",
//       }}
//     >
//       <h4>Insights</h4>
//       {chartSideBarItems.map((category, index) => (
//         <div
//           key={index}
//           style={{
//             marginBottom: "20px",
//             borderColor: "red",
//             border: "1px solid #f0f0f0",
//             borderRadius: "10px",
//             boxShadow: "0 0 20px 0 black",
//             padding: "10px",
//           }}
//         >
//           <h5>{category.title}</h5>
//           <ul style={{ listStyleType: "none", padding: 0 }}>
//             {category.charts.map((chart) => (
//               <li key={chart.id}>
//                 <div
//                   style={{
//                     margin: "5px",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <input
//                     type="checkbox"
//                     id={`${chart.id}`}
//                     checked={selectedCharts.some((c) => c.id === chart.id)}
//                     onChange={() => toggleChart(chart.id, chart.type)}
//                     style={{ marginRight: "10px" }}
//                   />
//                   <label
//                     htmlFor={`${chart.id}`}
//                     style={{
//                       cursor: "pointer",
//                       fontSize: "14px",
//                       color: "#000",
//                     }}
//                   >
//                     {chart.title}
//                   </label>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

export default Sidebar;
