import { useEffect, useState } from "react";
import { SidebarMain } from "../../components/dashboard/sidebarMain";
import { useAtom } from "jotai";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import { TicketsPage } from "../tickets-pages/TicketsPage";
import { SoftwareInstallationPage } from "../HyperCommands-Page/softwareInstallationPage";
import { RemoteSSHPage } from "../HyperCommands-Page/remoteSSHPage";

const RemoteConsoleiew = () => (
  <div className="remote-ssh-view">
    <h2>Remote Console</h2>
    {/* Add SSH UI here */}
  </div>
);

const PerformanceView = () => (
  <div className="remote-ssh-view">
    <h2>Performance</h2>
  </div>
);

const ScreenshotsView = () => (
  <div className="remote-ssh-view">
    <h2>Screenshots</h2>
  </div>
);

const CameraPicrureView = () => (
  <div className="remote-ssh-view">
    <h2>Camera Picture</h2>
  </div>
);

const VoiceRecordView = () => (
  <div className="remote-ssh-view">
    <h2>Voice Record</h2>
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
  const [selctedDeviceAtom, setSelectedDeviceAtom] = useAtom<
    number | undefined
  >(selectedComputerDashboardAtom);

  const renderActiveView = () => {
    if (!selctedDeviceAtom) {
      return <DashboardPlaceholder />;
    }
    switch (activeView) {
      case "software-installation":
        return <SoftwareInstallationPage computerIdProp={selctedDeviceAtom} />;
      case "remote-ssh":
        return <RemoteSSHPage computerIdProp={selctedDeviceAtom} />;
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

  useEffect(() => {
    setSelectedDeviceAtom(undefined);
  }, []);

  return (
    <div className="container-fluid dashboard-container-fluid">
      <div className="row flex-grow-1" style={{ overflow: "hidden" }}>
        <div
          className="col-sm-3 col-md-3 col-lg-4 col-xl-2 pe-0"
          style={{
            height: "100%",
          }}
        >
          <SidebarMain />
        </div>
        <div
          className="col-sm-9 col-md-9 col-lg-9 col-xl-10 pt-3 pb-3"
          style={{
            height: "100%",
          }}
        >
          <div className="dashboard-display-container p-3">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
