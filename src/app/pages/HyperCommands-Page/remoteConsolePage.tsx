import { useEffect, useState } from "react";
import { devicesVNC } from "../../data/hyperCommands";

import { DeviceRemoteConsoleType } from "../../types/devicesTypes";
import { ComputersListModal } from "../../components/modal/computersList";
import { ActionIcons } from "../../components/hyper-commands/action-icons";

const RemoteConsolePage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [devices, setDevices] = useState<any[]>(devicesVNC);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] =
    useState<DeviceRemoteConsoleType | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const devicesPerPage = 8;
  const totalDevices = devices.length;
  const totalPages = Math.ceil(totalDevices / devicesPerPage);

  const handleLaunchConsole = () => {
    if (sessionActive) {
      setAlertMessage("A session is already active!");
      setAlertVariant("warning");
      return;
    }
    setSessionActive(true);
    setAlertMessage("Console session started successfully!");
    setAlertVariant("success");
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setAlertMessage("Console session ended successfully.");
    setAlertVariant("success");
    //for vnc implementation
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDisconnectDevice = (deviceId: number) => {
    const updatedDevices = devices.map((device) =>
      device.id === deviceId ? { ...device, isConnected: false } : device
    );
    setDevices(updatedDevices);
    handleEndSession();
  };

  const currentDevices = devices.slice(
    (currentPage - 1) * devicesPerPage,
    currentPage * devicesPerPage
  );
  const vncUrl = "https://cobalt.pulsar.ao/ajax/vnc.php";

  return (
    <div
      className="container-fluid"
      style={{ paddingLeft: "30px", paddingRight: "30px" }}
    >
      {/* <VNCClient vncUrl={vncUrl} /> */}
      <div className="row justify-content-center">
        <div className="col-12">
          {!computerIdProp && (
            <div className="d-flex justify-content-between">
              <h2 className="text-center mb-4">🖥️ Remote Console</h2>
              <ActionIcons />
            </div>
          )}

          {alertMessage && (
            <div
              className={`alert alert-${alertVariant} alert-dismissible fade show`}
              role="alert"
            >
              {alertMessage}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setAlertMessage("")}
              ></button>
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary custom-btn hyper-connect-btn"
            onClick={openModal}
          >
            Start Remote Session
          </button>

          {sessionActive && (
            <div className="alert alert-success mt-3" role="alert">
              <strong>Console is active!</strong> You can now manage the remote
              server.
            </div>
          )}
          <div className="container">
            <div className="row mt-4">
              {currentDevices.map((device) => (
                <div
                  key={device.id}
                  className="col-10 col-sm-5 col-md-6 col-lg-4 col-xl-3 mb-5 mt-5"
                >
                  <div
                    className={`card  border-light ${
                      device.isActive
                        ? "hyper-console-card"
                        : "hyper-console-disabled-card"
                    } h-100 d-flex flex-column`}
                    style={{ height: "250px" }}
                  >
                    <div
                      className="card-header"
                      style={{ backgroundColor: " #F2F2F2" }}
                    >
                      <div
                        className="card-title mb-4 d-flex flex-column align-items-start justify-content-start"
                        style={{ width: "100%" }}
                      >
                        <h4 className="card-text w-100">{device.name}</h4>
                        <div className="w-100">
                          <span
                            className="badge bg-primary text-white"
                            style={{
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontWeight: "500",
                            }}
                          >
                            {device.hostname}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{ position: "absolute", top: 10, right: 10 }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={
                          device.isConnected && device.isActive
                            ? "Active and Connected"
                            : !device.isActive
                            ? "Inactive"
                            : "Active but Not Connected"
                        }
                      >
                        {device.isConnected && device.isActive ? (
                          <i
                            className="bi bi-stop-btn text-danger pulse-animation"
                            style={{
                              fontSize: "30px",
                            }}
                            title="Active and Connected"
                          ></i>
                        ) : !device.isActive ? (
                          <i
                            className="bi bi-circle-fill text-dark"
                            style={{ fontSize: "24px" }}
                            title="Inactive"
                          ></i>
                        ) : (
                          <i
                            className="bi bi-circle-fill text-success"
                            style={{ fontSize: "24px" }}
                            title="Active but Not Connected"
                          ></i>
                        )}
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                      <div>
                        <div className="text-center mb-2">
                          <i
                            className="bi bi-display"
                            style={{ color: "black", fontSize: "50px" }}
                          ></i>
                        </div>

                        {device.isConnected && device.isActive && (
                          <div className="text-center mb-4">
                            <button
                              className="btn btn-danger p-2"
                              onClick={() => handleDisconnectDevice(device.id)}
                            >
                              Disconnect
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!device.isConnected && (
                      <div
                        className="d-flex flex-column text-center pt-2"
                        style={{ backgroundColor: " #F2F2F2" }}
                      >
                        <h6>Last connected: </h6>
                        <p className="text-muted">{device.lastConnected}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ComputersListModal
          setSelectedDevice={setSelectedDevice}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export { RemoteConsolePage };
{
  /* {device.isConnected && device.isActive && (
                    <div className="text-center mb-4">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDisconnectDevice(device.id)}
                      >
                        Disconnect
                      </button>
                    </div>
                  )} */
}
