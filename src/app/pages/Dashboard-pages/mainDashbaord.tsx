import { useEffect, useRef, useState } from "react";
import { SidebarMain } from "../../components/dashboard/sidebarMain";
import { useAtom, useAtomValue } from "jotai";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import { TicketsPage } from "../tickets-pages/TicketsPage";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";
import { SoftwareInstallationDashboard } from "./softwareInstallationDashboard";
import { RemoteSSHDashboardComponent } from "./remoteSSHDashboard";
import { GetPrivateIPAddressAPI } from "../../config/ApiCalls";
import { useNavigate } from "react-router-dom";
import { OkButton } from "../../components/form/stepsButton";
import { SoftwareInstallationStaticPage } from "./softwareInstallationStaticDashboardPage";
import { PrivateIpSchema } from "../../types/common";

const RemoteConsoleView = () => {
  const [privateIps, setPrivateIps] = useState<PrivateIpSchema[]>([]);
  const [showModal, setShowModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const selectedComputerId = useAtomValue(selectedComputerDashboardAtom);

  useEffect(() => {
    const fetchPrivateIps = async () => {
      try {
        const response = await GetPrivateIPAddressAPI();
        setPrivateIps(response.data);
      } catch (error) {
        console.error("Failed to fetch private IP addresses:", error);
      }
    };

    fetchPrivateIps();
  }, []);

  useEffect(() => {
    if (!selectedComputerId || privateIps.length === 0) return;

    const matchingIp = privateIps.find((ip) => ip.mid === selectedComputerId);

    if (!matchingIp) {
      setShowModal(true);
    } else {
      navigate(
        `/dashboard/vnc/computer/${selectedComputerId}/${matchingIp.private_ip_address}`
      );
    }
  }, [privateIps, selectedComputerId, navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      setShowModal(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          onClick={handleBackdropClick}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" ref={dialogRef}>
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Remote Console Error</h5>
              </div>
              <div className="modal-body">
                <p>
                  You cannot connect to the remote console on this computer
                  because no private IP address is available.
                </p>
              </div>
              <div className="modal-footer border-0">
                <OkButton onClick={handleModalClose} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const renderActiveView = () => {
    if (!selctedDeviceAtom) {
      return <DashboardPlaceholder />;
    }
    switch (activeView) {
      case "software-installation":
        return (
          <SoftwareInstallationStaticPage computerIdProp={selctedDeviceAtom} />
        );
      case "remote-ssh":
        return <RemoteSSHDashboardComponent />;
      case "remote-console":
        return <RemoteConsoleView />;
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
              ? " col-1 col-sm-1 col-md-4 col-lg-5 col-xl-2"
              : " col-1 col-sm-1 col-md-3 col-lg-3 col-xl-2"
          }`}
        >
          <SidebarMain />
        </div>
        <div
          className={`pt-3 pb-3 height-100 transition-all${
            isSidebarOpen
              ? " col-11 col-sm-11 col-md-8 col-lg-7 col-xl-10"
              : " col-11 col-sm-11 col-md-9 col-lg-9 col-xl-10"
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
