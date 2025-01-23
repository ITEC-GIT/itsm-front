import { useEffect, useState } from "react";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";
import { Wizard } from "../../components/form/wizard";
import { steps } from "../../data/softwareInstallation";
import { GetAllSoftwareInstallations } from "../../config/ApiCalls";
import { SoftwareHistoryType } from "../../types/softwareInstallationTypes";
import { CardsStat } from "../../components/hyper-commands/cards-statistics";

const SoftwareInstallationPage = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [softwareHistory, setSoftwareHistory] = useState<SoftwareHistoryType[]>(
    []
  );

  const [selectedEntry, setSelectedEntry] = useState<SoftwareHistoryType>();

  const SoftwarePerPage = 6;
  const totalPages = Math.ceil(history.length / SoftwarePerPage);
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [paginatedHistory, setPaginatedTickets] = useState<any[]>([]);
  const minPagesToShow = 8;
  const startPage =
    Math.floor((currentHistorysPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

  //pagination
  const handleFirstPage = () => setCurrentHistoryPage(1);
  const handlePreviousPage = () =>
    setCurrentHistoryPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentHistoryPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentHistoryPage(totalPages);
  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await GetAllSoftwareInstallations("0-4", "desc");
      console.log(response.data);
      setSoftwareHistory(response.data);
    } catch (err) {
      setError("Failed to fetch software installations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (entry: SoftwareHistoryType) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const confirmCancellation = () => {
    if (selectedEntry) {
      setSelectedEntry(undefined);
      setIsModalOpen(false);
    }
  };

  const handleNewInstallation = (record: SoftwareHistoryType) => {
    setSoftwareHistory((prevHistory) => [...prevHistory, record]);
  };

  //table
  const columns = [
    {
      name: "Software",
      selector: (row: SoftwareHistoryType) => row.software,
      sortable: true,
      $grow: 1,
      cell: (row: SoftwareHistoryType) => (
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
      name: "Device",
      selector: (row: SoftwareHistoryType) => row.computers_id,
      cell: (row: SoftwareHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.computers_id}
        >
          {row.computers_id}
        </span>
      ),
      sortable: true,
    },
    // {
    //   name: "Serial Number",
    //   selector: (row: SoftwareHistoryType) => row.mid,
    //   sortable: true,
    //   $grow: 1,
    //   cell: (row: SoftwareHistoryType) => (
    //     <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.mid}>
    //       {row.mid}
    //     </span>
    //   ),
    // },
    {
      name: "URL",
      selector: (row: SoftwareHistoryType) => row.url,
      sortable: true,
      $grow: 1,
      cell: (row: SoftwareHistoryType) => (
        <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.url}>
          {row.url}
        </span>
      ),
    },
    {
      name: "Destination",
      selector: (row: SoftwareHistoryType) => row.destination,
      sortable: true,
      cell: (row: SoftwareHistoryType) => (
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
      selector: (row: SoftwareHistoryType) => row.variables,
      sortable: true,
      cell: (row: SoftwareHistoryType) => (
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
      selector: (row: SoftwareHistoryType) => row.status,
      sortable: true,
      cell: (row: SoftwareHistoryType) => {
        const getStatusStyle = (status: string) => {
          switch (status.toLowerCase()) {
            case "initialized":
              return {
                color: "orange",
                fontWeight: "bold",
                backgroundColor: "#ffe5b4", // Light orange on hover
                ":hover": { backgroundColor: "#ffd699" }, // Hover effect
              };
            case "received":
              return {
                color: "green",
                fontWeight: "bold",
                backgroundColor: "#d3ffd3", // Light green on hover
                ":hover": { backgroundColor: "#aaffaa" }, // Hover effect
              };
            case "canceled":
              return {
                color: "red",
                padding: "15px",
                fontWeight: "bold",
                backgroundColor: "#ffcccc", // Light red on hover
                ":hover": { backgroundColor: "#ffb3b3" }, // Hover effect
              };
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
      $grow: 0.5,
    },
    {
      name: "User",
      selector: (row: SoftwareHistoryType) => row.users_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: SoftwareHistoryType) => {
        const date = new Date(row.created_at);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: SoftwareHistoryType) => (
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
      $grow: 0.5,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const paginatedTickets = softwareHistory.slice(
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
            <CardsStat />

            <button
              type="button"
              className="btn btn-primary hyper-connect-btn mb-3"
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

            {showForm && <Wizard steps={steps} add={handleNewInstallation} />}

            <h3 className="mt-5">Installation History</h3>
            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={paginatedHistory}
              responsive
              highlightOnHover
            />
            {isLoading && <div>Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

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
