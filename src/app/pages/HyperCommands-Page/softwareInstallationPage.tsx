import { useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import Select from "react-select";

type HistoryType = {
  device: string;
  software: string;
  destination: string;
  variables: string;
  status: string;
  user: string;
};

const initialMockData: HistoryType[] = [
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "Completed",
    user: "Admin",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "Initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software3.tar.gz",
    device: "Device 3",
    destination: "/usr/local/bin/software3",
    variables: "",
    status: "Completed",
    user: "User2",
  },
];

const SoftwareInstallationPage = () => {
  const [showForm, setShowForm] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState("");

  const deviceOptions = ["Device 1", "Device 2", "Device 3"];
  const [softwareUrl, setSoftwareUrl] = useState("");
  const [destination, setDestination] = useState("");
  const [variables, setVariables] = useState("");
  const [history, setHistory] = useState<HistoryType[]>(initialMockData);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [disableInstallButton, setDisableInstallButton] = useState(false);
  const [deviceError, setDeviceError] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HistoryType>();

  const clearFields = () => {
    setSoftwareUrl("");
    setDestination("");
    setVariables("");
    setSelectedDevice("");
    setProgress(0);
  };

  const handleInstall = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDevice) {
      setDeviceError(true);
      return;
    }

    setDeviceError(false);

    if (!destination.startsWith("/")) {
      setAlertMessage("Destination must start with a forward slash (/)");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    const isAlreadyInstalled = history.some(
      (entry) =>
        entry.software === softwareUrl && entry.device === selectedDevice
    );
    if (isAlreadyInstalled) {
      setAlertMessage(
        `${softwareUrl} is already installed on ${selectedDevice}.`
      );
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setDisableInstallButton(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAlertMessage(`${softwareUrl} installed successfully!`);
          setAlertVariant("success");
          setShowAlert(true);
          setHistory((prevHistory) => [
            ...prevHistory,
            {
              software: softwareUrl,
              device: selectedDevice,
              variables: variables,
              destination: destination,
              status: "Initialized",
              user: "cobalt",
            },
          ]);
          setProgress(0);
          setDisableInstallButton(false);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    clearFields();
  };

  const handleCancelClick = (entry: HistoryType) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const confirmCancellation = () => {
    if (selectedEntry) {
      setSelectedEntry(undefined);
      setIsModalOpen(false);
    }
  };
  return (
    <Content>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-xl-12">
            <h2 className="text-center mb-4">🚀 Software Installation</h2>
            <ActionIcons />
            {/* cards */}
            <div className="row g-4 justify-content-center">
              <div className="col-3">
                <div
                  className="card shadow-sm p-3 mb-4"
                  style={{ borderRadius: "10px" }}
                >
                  <div className="row align-items-center">
                    <div className="col-auto text-center">
                      <div
                        className="d-flex justify-content-center align-items-center bg-primary text-white rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i
                          className="bi bi-arrow-90deg-up text-dark"
                          style={{ fontSize: "24px" }}
                        ></i>
                      </div>
                    </div>
                    <div className="col">
                      <h5 className="mb-1">Initialized Software</h5>
                      <h6 className="text-muted">150</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div
                  className="card shadow-sm p-3 mb-4"
                  style={{ borderRadius: "10px" }}
                >
                  <div className="row align-items-center">
                    <div className="col-auto text-center">
                      <div
                        className="d-flex justify-content-center align-items-center bg-primary text-white rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i
                          className="bi bi-download text-dark"
                          style={{ fontSize: "24px" }}
                        ></i>
                      </div>
                    </div>
                    <div className="col">
                      <h5 className="mb-1">Received Software</h5>
                      <h6 className="text-muted">15000</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary hyper-connect-btn"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? (
                <span style={{ display: "inline-block", marginRight: "8px" }}>
                  Install New Software
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  +
                </span>
              )}
            </button>

            {showForm && (
              <form
                className="p-4 shadow-sm bg-light rounded mt-5"
                onSubmit={handleInstall}
              >
                <div className="row d-flex justify-content-center">
                  <div className="col-5">
                    <div className="mb-4" style={{ height: "90px" }}>
                      <label
                        htmlFor="deviceSelect"
                        className="form-label required"
                      >
                        Select Device
                      </label>

                      <Select
                        id="deviceSelect"
                        className="custom-select"
                        classNamePrefix="react-select"
                        options={deviceOptions.map((device) => ({
                          value: device,
                          label: device,
                        }))}
                        value={
                          selectedDevice
                            ? { value: selectedDevice, label: selectedDevice }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setSelectedDevice(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                      />
                      <div
                        style={{
                          minHeight: "1.25rem",
                        }}
                      >
                        {deviceError && (
                          <small
                            className="text-danger"
                            style={{
                              fontSize: "0.875rem",
                            }}
                          >
                            Please select a device.
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="destinationInput"
                        className="form-label required"
                      >
                        Destination
                      </label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        id="destinationInput"
                        name="destination"
                        value={destination}
                        placeholder="e.g., /user/local/software"
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-5">
                    <div className="mb-4" style={{ height: "90px" }}>
                      <label
                        htmlFor="softwareUrl"
                        className="form-label required"
                      >
                        Software URL
                      </label>
                      <input
                        type="url"
                        className="form-control custom-input"
                        id="softwareUrlInput"
                        name="softwareUrl"
                        value={softwareUrl}
                        placeholder="e.g., http://example.com/software.tar.gz"
                        onChange={(e) => setSoftwareUrl(e.target.value)}
                        required
                      />
                      <div
                        style={{
                          minHeight: "1.25rem",
                        }}
                      ></div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="argumentsInput" className="form-label">
                        Variables
                      </label>
                      <input
                        type="text"
                        id="argumentsInput"
                        className="form-control custom-input"
                        placeholder="e.g., /a /b arg1=value1 arg2=value2"
                        value={variables}
                        onChange={(e) => setVariables(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-5 mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary hyper-connect-btn"
                    disabled={disableInstallButton}
                  >
                    Install
                  </button>
                </div>

                {progress > 0 && (
                  <div className="progress mt-3">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {progress}%
                    </div>
                  </div>
                )}
              </form>
            )}

            {showAlert && (
              <div
                className={`alert alert-${alertVariant} alert-dismissible fade show mt-4`}
                role="alert"
              >
                <div className="d-flex justify-content-between">
                  <span>{alertMessage}</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowAlert(false)}
                  ></button>
                </div>
              </div>
            )}

            <h3 className="mt-5">Installation History</h3>
            <div className="table-responsive mt-3">
              <table className="table table-hover table-bordered table-striped table-sm table-colored">
                <thead>
                  <tr className="table-dark">
                    <th>Software URL</th>
                    <th>Serial Number</th>
                    <th>Device Name</th>
                    <th>Destination</th>
                    <th>Arguments</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td className="status-initial">{entry.software}</td>
                      <td>{entry.device}</td>
                      <td>{entry.device}</td>
                      <td>{entry.destination}</td>
                      <td>{entry.variables}</td>
                      <td>{entry.status}</td>
                      <td>User</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm d-flex justify-content-center align-items-center"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                          }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Cancel Installation"
                          onClick={() => handleCancelClick(entry)}
                          disabled={entry.status !== "Initialized"}
                        >
                          <i
                            className="bi bi-ban text-center"
                            style={{ fontSize: "1rem", padding: 0 }}
                          ></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Modal */}
        {isModalOpen && (
          <div
            className="modal show"
            tabIndex={-1}
            role="dialog"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cancel Installation:</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      lineHeight: "1",
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to cancel the installation of{" "}
                    <strong>{selectedEntry?.software}</strong>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmCancellation}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export { SoftwareInstallationPage };
