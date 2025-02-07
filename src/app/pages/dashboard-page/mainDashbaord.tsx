import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SidebarMain } from "../../components/dashboard/sidebarMain";
import { useAtom } from "jotai";
import { activeDashboardViewAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { TicketsPage } from "../tickets-pages/TicketsPage";

const SoftwareInstallationView = () => (
  <div className="software-installation-view">
    <h2>Software Installation</h2>
    {/* Add your software installation UI here */}
  </div>
);

const RemoteSSHView = () => (
  <div className="remote-ssh-view">
    <h2>Remote SSH</h2>
    {/* Add SSH UI here */}
  </div>
);

const RemoteConsoleiew = () => (
  <div className="remote-ssh-view">
    <h2>Remote Console</h2>
    {/* Add SSH UI here */}
  </div>
);

const PerformanceView = () => (
  <div className="remote-ssh-view">
    <h2>Performance</h2>
    {/* Add SSH UI here */}
  </div>
);

const ScreenshotsView = () => (
  <div className="remote-ssh-view">
    <h2>Screenshots</h2>
    {/* Add SSH UI here */}
  </div>
);

const CameraPicrureView = () => (
  <div className="remote-ssh-view">
    <h2>Camera Picture</h2>
    {/* Add SSH UI here */}
  </div>
);
const VoiceRecordView = () => (
  <div className="remote-ssh-view">
    <h2>Voice Record</h2>
    {/* Add SSH UI here */}
  </div>
);

const DashboardPlaceholder = () => (
  <div className="dashboard-placeholder">
    <i className="bi bi-columns-gap fs-1"></i>
    <p>Select a command from the sidebar to get started</p>
  </div>
);

const MainDashboard = () => {
  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);

  // const userId = Number(Cookies.get("user"));

  const renderActiveView = () => {
    switch (activeView) {
      case "software-installation":
        return <SoftwareInstallationView />;
      case "remote-ssh":
        return <RemoteSSHView />;
      case "remote-console":
        return <RemoteConsoleiew />;
      case "performance":
        return <PerformanceView />;
      case "screenshots":
        return <ScreenshotsView />;
      case "camera-picture":
        return <CameraPicrureView />;
      case "voice-record":
        return <VoiceRecordView />;
      case "ticket":
        return <TicketsPage />;
      default:
        return <DashboardPlaceholder />;
    }
  };

  return (
    <div className="container-fluid" style={{ paddingLeft: "10px" }}>
      <div className="row">
        <div
          className="col-sm-3 col-md-3 col-lg-2"
          style={{
            // height: "100%",
            // maxHeight: "60%",
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(100,100,100,0.1)",
          }}
        >
          <SidebarMain />
        </div>
        <div
          className="col-sm-9 col-md-9 col-lg-10"
          style={{
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(100,100,100,0.1)",
            overflowY: "auto",
          }}
        >
          <div>{renderActiveView()}</div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
