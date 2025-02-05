import { useAtom } from "jotai";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { useEffect, useState } from "react";
import { GetComputer } from "../../config/ApiCalls";

const SidebarMain = () => {
  const [selectedComputerAtom] = useAtom(selectedComputerDashboardAtom);
  interface Computer {
    name: string;
    serial: string;
    computermodels_id: string;
  }

  const [computer, setComputer] = useState<Computer | null>(null);

  const fetchComputer = async () => {
    if (selectedComputerAtom) {
      const computerInfo = await GetComputer(selectedComputerAtom);
      setComputer(computerInfo.data.data);
    }
  };

  useEffect(() => {
    fetchComputer();
  }, [selectedComputerAtom]);

  return (
    <div className="sidebar-main" style={{ msOverflowStyle: "none" }}>
      <h4 className="sidebar-main-title" style={{}}>
        Discover
      </h4>
      {computer ? (
        <div className="computer-info">
          <h5>{computer?.name ?? ""}</h5>
          <h6>Serial: {computer.serial || ""}</h6>
          <h6>Model: {computer.computermodels_id || ""}</h6>
          <button className="btn btn-primary">View Tickets</button>

          <h5>Hyper Commands</h5>
          <div className="hyper-commands">
            <button className="btn btn-secondary">Software Installation</button>
            <button className="btn btn-secondary">Remote SSH</button>
            <button className="btn btn-secondary">Remote Console</button>
            <button className="btn btn-secondary">Performance</button>
          </div>
        </div>
      ) : (
        <p>No Computer Selected</p>
      )}
    </div>
  );
};

export { SidebarMain };

/*
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
                    
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
*/
