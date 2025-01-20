import { useEffect, useState } from "react";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";

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
    status: "initialized",
    user: "Admin",
  },
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "canceled",
    user: "Admin",
  },
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "received",
    user: "Admin",
  },
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "canceled",
    user: "Admin",
  },
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "initialized",
    user: "Admin",
  },
  {
    software: "http://example.com/software1.tar.gz",
    device: "Device 1",
    destination: "/usr/local/bin/software1",
    variables: "/a /b arg1=value1",
    status: "canceled",
    user: "Admin",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software2.tar.gz",
    device: "Device 2",
    destination: "/usr/local/bin/software2",
    variables: "/x /y arg2=value2",
    status: "initialized",
    user: "User1",
  },
  {
    software: "http://example.com/software3.tar.gz",
    device: "Device 3",
    destination: "/usr/local/bin/software3",
    variables: "",
    status: "initialized",
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

  const SoftwarePerPage = 6;
  const totalPages = Math.ceil(history.length / SoftwarePerPage);
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [paginatedHistory, setPaginatedTickets] = useState<any[]>([]);
  const handleFirstPage = () => setCurrentHistoryPage(1);

  const handlePreviousPage = () =>
    setCurrentHistoryPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentHistoryPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentHistoryPage(totalPages);
  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);
  };
  const minPagesToShow = 8;
  const startPage =
    Math.floor((currentHistorysPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

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
              status: "initialized",
              user: "cobalt",
            },
          ]);

          setProgress(0);
          setDisableInstallButton(false);

          setTimeout(() => {
            setProgress(0);
          }, 1000);

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

  const columns = [
    {
      name: "Software URL",
      selector: (row: HistoryType) => row.software,
      sortable: true,
      grow: 2,
      cell: (row: HistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.software}
        >
          {row.software}
        </span>
      ),
    },
    {
      name: "Serial Number",
      selector: (row: HistoryType) => row.device,
      sortable: true,
      grow: 1.2,
      cell: (row: HistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.device}
        >
          {row.device}
        </span>
      ),
    },
    {
      name: "Device Name",
      selector: (row: HistoryType) => row.device,
      cell: (row: HistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.device}
        >
          {row.device}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row: HistoryType) => row.destination,
      sortable: true,
      cell: (row: HistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.destination}
        >
          {row.destination}
        </span>
      ),
    },
    {
      name: "Arguments",
      selector: (row: HistoryType) => row.variables,
      sortable: true,
      cell: (row: HistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.variables}
        >
          {row.variables}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: HistoryType) => row.status,
      sortable: true,
      cell: (row: HistoryType) => {
        // Conditional styling based on status
        const getStatusStyle = (status: string) => {
          switch (status.toLowerCase()) {
            case "initialized":
              return { color: "orange", fontWeight: "bold" };
            case "received":
              return { color: "green", fontWeight: "bold" };
            case "canceled":
              return { color: "red", fontWeight: "bold" };
            default:
              return { color: "black" };
          }
        };

        return (
          <span
            style={getStatusStyle(row.status)}
            className="status-cell"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={row.status}
          >
            {row.status}
          </span>
        );
      },
      grow: 0.5,
    },
    {
      name: "User",
      selector: (row: HistoryType) => row.user,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: HistoryType) => (
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
          onClick={() => handleCancelClick(row)}
          disabled={row.status === "canceled" || row.status === "received"}
        >
          <i
            className="bi bi-ban text-center"
            style={{ fontSize: "1rem", padding: 0 }}
          ></i>
        </button>
      ),
      sortable: false,
      grow: 0.5,
    },
  ];

  useEffect(() => {
    const paginatedTickets = history.slice(
      (currentHistorysPage - 1) * SoftwarePerPage,
      currentHistorysPage * SoftwarePerPage
    );
    setPaginatedTickets(paginatedTickets);
  }, [currentHistorysPage, history]);

  return (
    <Content>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-xl-12">
            <h2 className="text-center mb-4">🚀 Software Installation</h2>

            <ActionIcons />

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
                      <h5 className="mb-1">initialized Software</h5>
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
            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={paginatedHistory}
              responsive
              highlightOnHover
            />

            <div className="pagination-controls d-flex justify-content-end mt-3 mb-3">
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleFirstPage}
                disabled={currentHistorysPage === 1}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handlePreviousPage}
                disabled={currentHistorysPage === 1}
              >
                Previous
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, index) => startPage + index
              ).map((page) => (
                <button
                  key={page}
                  className={clsx("btn btn-sm me-2", {
                    "btn-primary": currentHistorysPage === page,
                    "btn-light": currentHistorysPage !== page,
                  })}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleNextPage}
                disabled={currentHistorysPage === totalPages}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={handleLastPage}
                disabled={currentHistorysPage === totalPages}
              >
                Last
              </button>
            </div>

            {/* <div className="table-responsive mt-3">
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
                          disabled={entry.status !== "initialized"}
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
            </div> */}
          </div>
        </div>

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
