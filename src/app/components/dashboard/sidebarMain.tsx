import { useAtom } from "jotai";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import { useEffect, useState } from "react";
import { GetComputer } from "../../config/ApiCalls";

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="info-item">
    <span className="info-label">{label}:</span>
    <span className="info-value">{value || "N/A"}</span>
  </div>
);

const SidebarMain = () => {
  const [selectedComputerAtom] = useAtom(selectedComputerDashboardAtom);
  const [computer, setComputer] = useState<Computer | null>(null);
  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);

  interface Computer {
    name: string;
    serial: string;
    computermodels_id: string;
    last_inventory_update: string;
    entities_id: string;
    computertypes_id: string;
  }

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
    <div className="sidebar-main mt-3">
      {selectedComputerAtom ? (
        <div className="computer-info">
          <div className="computer-header">
            <h2 className="computer-name">{computer?.name}</h2>
            {/* <span className="computer-type">{computer.computertypes_id}</span> */}
            <span className="computer-type">
              {computer?.computertypes_id} - {computer?.computermodels_id}{" "}
            </span>
          </div>
          {/* <div className="d-flex flex-column gap-2">
            <InfoItem label="Serial" value={computer.serial} />
            <InfoItem label="Model" value={computer.computermodels_id} />
            <InfoItem
              label="Last Update"
              value={computer.last_inventory_update}
            />
            <InfoItem label="Entity" value={computer.entities_id} />
          </div> */}

          <h5 className="section-title-borderless">Tickets</h5>
          <div className="d-flex flex-column align-items-start">
            <button
              className="btn-command"
              onClick={() => setActiveView("ticket")}
            >
              <i className="bi bi-bug"></i>
              Tickets
            </button>
          </div>

          <h5 className="section-title">Hyper Commands</h5>
          <div className="d-flex flex-column align-items-start">
            <button
              className="btn-command"
              onClick={() => setActiveView("software-installation")}
            >
              <i className="bi bi-cloud-upload"></i>
              Software Installation
            </button>
            <button
              className="btn-command"
              onClick={() => setActiveView("remote-ssh")}
            >
              <i className="bi bi-terminal"></i>
              Remote SSH
            </button>
            <button
              className="btn-command"
              onClick={() => setActiveView("remote-console")}
            >
              <i className="bi bi-tv"></i>
              Remote Console
            </button>
            <button
              className="btn-command"
              onClick={() => setActiveView("performance")}
            >
              <i className="bi bi-speedometer2"></i>
              Performance
            </button>
          </div>
          <h5 className="section-title">Actions</h5>
          <div className="d-flex flex-column align-items-start">
            <button
              className="btn-command"
              onClick={() => setActiveView("screenshots")}
            >
              <i className="bi bi-card-image"></i>
              Screenshots
            </button>
            <button
              className="btn-command"
              onClick={() => setActiveView("camera-picture")}
            >
              <i className="bi bi-camera-fill"></i>
              Camera Picture
            </button>
            <button
              className="btn-command"
              onClick={() => setActiveView("voice-record")}
            >
              <i className="bi bi-mic"></i>
              Voice Records
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <i className="bi bi-laptop icon-computer"></i>
          <p>No Computer Selected</p>
        </div>
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
