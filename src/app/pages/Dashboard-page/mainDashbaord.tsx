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
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";

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
  const [toggleInstance] = useAtom(sidebarToggleAtom);
  console.log(toggleInstance);
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
              ? " col-md-4 col-lg-5 col-xl-2 col-auto"
              : " col-md-3 col-lg-3 col-xl-2 col-auto"
          }`}
        >
          <SidebarMain />
        </div>
        <div
          className={`pt-3 pb-3 height-100 transition-all${
            isSidebarOpen
              ? "col-md-8 col-lg-7 col-xl-10"
              : "col-md-9 col-lg-9 col-xl-10"
          }`}
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
