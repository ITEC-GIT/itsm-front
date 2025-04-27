import { useState, useCallback } from "react";
import { devicesVNC } from "../../data/hyperCommands";

import { DeviceRemoteConsoleType } from "../../types/devicesTypes";
import { ComputersListModal } from "../../components/modal/computersList";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { RemoteConsoleModal } from "../../components/modal/VNCModal";

type RemoteConsolePageProps = {
  computerIdProp?: number;
};

const RemoteConsolePage = ({ computerIdProp }: RemoteConsolePageProps) => {
  const [sessionActive, setSessionActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [devices, setDevices] = useState<any[]>(devicesVNC);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState<DeviceRemoteConsoleType | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLaunchConsole = () => {
    setSessionActive(true);
  };

  const handleEndSession = () => {
    setSessionActive(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleDeviceConnection = (deviceId: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.id === deviceId) {
          const newConnectionState = !device.isConnected;
          setSessionActive(newConnectionState);
          return { ...device, isConnected: newConnectionState };
        }
        return device;
      })
    );
  };

  const renderDeviceButton = (device: DeviceRemoteConsoleType) => {
    if (!device.isActive) return null;

    return (
      <div className="text-center mb-4">
        <button
          className={`btn p-2 ${
            device.isConnected ? "btn-danger" : "btn-primary"
          }`}
          onClick={() => toggleDeviceConnection(device.id)}
        >
          {device.isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    );
  };

  return (
    <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
      <div
        className="row d-flex custom-main-container custom-container-height"
        style={{ overflowY: "auto" }}
      >
        <div className="col-12">
          {!computerIdProp && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-center mb-0">🖥️ Remote Console</h2>
              <ActionIcons />
            </div>
          )}

          <button
            type="button"
            className="btn custom-action-btn"
            onClick={openModal}
          >
            <div className="custom-btn-text">Start Remote Session</div>
          </button>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 mt-4">
            {devices.map((device) => (
              <div key={device.id} className="col">
                <div
                  className={`card h-100 border-0 d-flex flex-column ${
                    device.isActive
                      ? "hyper-console-card"
                      : "hyper-console-disabled-card disconnect-bg"
                  }`}
                  style={{ minHeight: "100px" }}
                >
                  <div
                    className={`card-header ${
                      device.isActive ? "bg-light" : "disconnect-bg border-0"
                    }`}
                    style={{ height: "80px" }}
                  >
                    <div className="card-title mb-4 d-flex flex-column align-items-start w-100">
                      <h4 className="card-text w-100">{device.name}</h4>
                      <div className="w-100">
                        <span
                          className={`badge text-white rounded-pill fs-6 fw-medium 
                       bg-primary
                      `}
                        >
                          {device.hostname}
                        </span>
                      </div>
                    </div>

                    {device.isActive && !device.isConnected && (
                      <div className="position-absolute top-0 end-0 mt-2 me-2">
                        <i className="bi bi-circle-fill text-success fs-4"></i>
                      </div>
                    )}
                  </div>

                  <div
                    className="card-body d-flex flex-column justify-content-center align-items-center"
                    style={{ height: "100px" }}
                  >
                    <i className="bi bi-display text-black fs-1 mb-2"></i>
                    {renderDeviceButton(device)}
                  </div>

                  <div
                    className="d-flex flex-column text-center"
                    style={{
                      height: "50px",
                      visibility: device.isConnected ? "hidden" : "visible",
                    }}
                  >
                    <h6>Last connected</h6>
                    <p className="text-muted">{device.lastConnected}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RemoteConsoleModal
          onClose={closeModal}
          onConnect={handleLaunchConsole}
        />
      )}
    </div>
  );
};

export { RemoteConsolePage };
