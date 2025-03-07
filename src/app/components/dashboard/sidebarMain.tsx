import { useAtom } from "jotai";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import { useEffect, useState } from "react";
import { GetComputer } from "../../config/ApiCalls";

const SidebarMain = () => {
  const [selectedComputerAtom] = useAtom(selectedComputerDashboardAtom);
  const [computer, setComputer] = useState<any>();
  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);

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
            <span className="computer-type">
              {computer?.computertypes_id} - {computer?.computermodels_id}
            </span>
          </div>

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
