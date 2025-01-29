import { useState } from "react";
import { Pagination } from "react-bootstrap";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import { devicesVNC } from "../../data/hyperCommands";

import { SelectAssetsModal } from "../../components/modal/selectAsset";
import { DeviceRemoteConsoleType } from "../../types/devicesTypes";

const RemoteConsolePage = () => {
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

  return (
    <Content>
      <div className="container mt-5">
        <div className="row justify-content-center mb-4">
          <div className="col-md-10 col-lg-10 col-xl-12">
            <h2 className="text-center mb-4 ">🖥️ Remote Console</h2>

            <ActionIcons />
            <button
              type="button"
              className="btn btn-primary custom-btn hyper-connect-btn"
              onClick={openModal}
            >
              Start Remote Session
            </button>
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

            {sessionActive && (
              <div className="alert alert-success mt-3" role="alert">
                <strong>Console is active!</strong> You can now manage the
                remote server.
              </div>
            )}

            <div className="row mt-4">
              {currentDevices.map((device) => (
                <div
                  key={device.id}
                  className="col-10 col-sm-5 col-md-6 col-lg-4 col-xl-3 mb-4"
                  style={{ height: "270px" }}
                >
                  <div
                    className={`card shadow-lg border-light ${
                      device.isActive
                        ? "hyper-console-card"
                        : "hyper-console-disabled-card"
                    } h-100 d-flex flex-column`}
                  >
                    <div className="card-header">
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

                    <div className="card-body d-flex flex-column align-items-center">
                      <div>
                        <div className="text-center mb-2">
                          <i
                            className="bi bi-display fs-1"
                            style={{ color: "black" }}
                          ></i>
                        </div>

                        <h3
                          className="card-title mb-4 text-truncate"
                          style={{
                            margin: 0,
                            width: "90%",
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            fontWeight: "bold",
                          }}
                          title={device.name}
                        >
                          {device.name}
                        </h3>
                        <h4 className="card-text">{device.hostname}</h4>
                      </div>
                    </div>

                    {!device.isConnected && (
                      <div className="d-flex flex-column text-center pt-2 hyper-last-date">
                        <h6>Last connected: </h6>
                        <p className="text-muted">{device.lastConnected}</p>
                      </div>
                    )}

                    {device.isConnected && device.isActive && (
                      <div className="text-center mb-4">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDisconnectDevice(device.id)}
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
        {isModalOpen && (
          <SelectAssetsModal
            setSelectedDevice={setSelectedDevice}
            closeModal={closeModal}
          />
        )}
      </div>
    </Content>
  );
};

export { RemoteConsolePage };
