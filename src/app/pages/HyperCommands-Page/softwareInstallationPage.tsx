import { FC, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
const SoftwareInstallationPage: FC = () => {
  const [progress, setProgress] = useState(0);
  const [selectedSoftware, setSelectedSoftware] = useState("Software A");
  const [selectedDevice, setSelectedDevice] = useState("Device 1");
  const [version, setVersion] = useState("");
  const [history, setHistory] = useState<
    { software: string; device: string; version: string }[]
  >([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [selectedDeviceHistory, setSelectedDeviceHistory] = useState<
    { software: string; version: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateVersion = (version: string) => {
    const regex = /^\d+\.\d+\.\d+$/;
    return regex.test(version);
  };

  const handleInstall = () => {
    if (!version) {
      setAlertMessage("Please enter a version.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    if (!validateVersion(version)) {
      setAlertMessage("Invalid version format. Please use X.X.X.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    const isAlreadyInstalled = history.some(
      (entry) =>
        entry.software === selectedSoftware &&
        entry.device === selectedDevice &&
        entry.version === version
    );

    if (isAlreadyInstalled) {
      setAlertMessage(
        `${selectedSoftware} v${version} is already installed on ${selectedDevice}.`
      );
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }

    setProgress(10);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAlertMessage(
            `${selectedSoftware} v${version} installed successfully!`
          );
          setAlertVariant("success");
          setShowAlert(true);
          setHistory((prevHistory) => [
            ...prevHistory,
            { software: selectedSoftware, device: selectedDevice, version },
          ]);
          setProgress(0);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
  };

  const viewDeviceDetails = (device: string) => {
    const deviceHistory = history.filter((entry) => entry.device === device);
    setSelectedDeviceHistory(deviceHistory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-10">
          <h2 className="text-center mb-4">🚀 Software Installation</h2>
          <ActionIcons />
          <form className="p-4 shadow-sm bg-light rounded">
            <div className="mb-3">
              <label htmlFor="softwareSelect" className="form-label">
                Select Software
              </label>
              <select
                id="softwareSelect"
                className="form-select"
                value={selectedSoftware}
                onChange={(e) => setSelectedSoftware(e.target.value)}
              >
                <option>Software A</option>
                <option>Software B</option>
                <option>Software C</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="deviceSelect" className="form-label">
                Select Device
              </label>
              <select
                id="deviceSelect"
                className="form-select"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                <option>Device 1</option>
                <option>Device 2</option>
                <option>Device 3</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="versionInput" className="form-label">
                Version
              </label>
              <input
                type="text"
                id="versionInput"
                className="form-control"
                placeholder="e.g., 1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100 hyper-connect-btn"
              onClick={handleInstall}
            >
              Install
            </button>

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
            <table className="table table-hover table-bordered table-striped table-sm">
              <thead>
                <tr className="table-dark">
                  <th>Software</th>
                  <th>Device</th>
                  <th>Version</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.software}</td>
                    <td>{entry.device}</td>
                    <td>{entry.version}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="View Details"
                        onClick={() => viewDeviceDetails(entry.device)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal fade show"
          id="deviceDetailsModal"
          tabIndex={-1}
          aria-labelledby="deviceDetailsModalLabel"
          aria-hidden="false"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deviceDetailsModalLabel">
                  Installation History for {selectedDevice}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-sm">
                    <thead>
                      <tr className="table-dark">
                        <th>Software</th>
                        <th>Version</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDeviceHistory.length === 0 ? (
                        <tr>
                          <td colSpan={2}>No software installed yet.</td>
                        </tr>
                      ) : (
                        selectedDeviceHistory.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry.software}</td>
                            <td>{entry.version}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SoftwareInstallationPage };
