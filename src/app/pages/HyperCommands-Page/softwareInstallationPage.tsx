import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";
import { Wizard } from "../../components/form/wizard";
import { steps } from "../../data/softwareInstallation";
import { FetchAllSoftwareInstallations } from "../../config/ApiCalls";
import { SoftwareHistoryType } from "../../types/softwareInstallationTypes";
import { CardsStat } from "../../components/hyper-commands/cards-statistics";
import {
  getCircleColor,
  getLowestId,
  getStatusClass,
} from "../../../utils/custom";
import { SearchComponent } from "../../components/form/search";

const SoftwareInstallationPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [softwareHistory, setSoftwareHistory] = useState<SoftwareHistoryType[]>(
    []
  );

  const [selectedEntry, setSelectedEntry] = useState<SoftwareHistoryType>();
  const historyCache: { [key: number]: SoftwareHistoryType[] } = useRef(
    {}
  ).current;

  const SoftwarePerPage = 5;
  const minPagesToShow = 3;
  const [maxTotalSoftwares, setMaxTotalSoftwares] = useState<number>(0);
  const totalPages = Math.ceil(maxTotalSoftwares / SoftwarePerPage);
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [paginatedHistory, setPaginatedHistory] = useState<
    SoftwareHistoryType[]
  >([]);
  const startPage =
    Math.floor((currentHistorysPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

  const handleFirstPage = () => setCurrentHistoryPage(1);
  const handlePreviousPage = () =>
    setCurrentHistoryPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentHistoryPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentHistoryPage(totalPages);

  const fetchData = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (historyCache[page]) {
        setPaginatedHistory([...historyCache[page]]);
        return;
      }

      let lowestId: number | null = null;

      if (softwareHistory.length > 0) {
        lowestId = getLowestId(paginatedHistory);
      }

      const response = await FetchAllSoftwareInstallations(
        "0-9",
        "desc",
        lowestId || undefined
      );

      setMaxTotalSoftwares(response.data.totalcount);
      const newData = response.data.data;
      const updatedSoftwares = [...softwareHistory, ...newData];
      setSoftwareHistory(updatedSoftwares);

      const filledPages = Math.ceil(newData.length / SoftwarePerPage);

      const currentPage =
        Object.keys(historyCache).length === 0
          ? 1
          : Object.keys(historyCache).length + 1;

      for (let i = 0; i < filledPages; i++) {
        const page = currentPage + i;
        const pageData = newData.slice(
          i * SoftwarePerPage,
          (i + 1) * SoftwarePerPage
        );
        historyCache[page] = pageData;
      }

      setPaginatedHistory([...historyCache[page]]);
    } catch (err) {
      setError("Failed to fetch software installations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);

    const targetBatchStartPage =
      Math.floor((page - 1) / minPagesToShow) * minPagesToShow + 1;
    if (!historyCache[targetBatchStartPage]) {
      fetchData(targetBatchStartPage);
    } else {
      setPaginatedHistory(historyCache[page] || []);
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

  const fetchDataDebounced = useCallback(
    debounce((query: string) => {
      if (query) {
        const filteredItems = softwareHistory.filter(
          (item) =>
            item.software.toLowerCase().includes(query.toLowerCase()) ||
            item.status.toLowerCase().includes(query.toLowerCase()) ||
            item.computers_id.toLowerCase().includes(query.toLowerCase()) ||
            item.users_id.toLowerCase().includes(query.toLowerCase()) ||
            item.url.toLowerCase().includes(query.toLowerCase())
        );
        setPaginatedHistory(filteredItems);
      } else {
        setPaginatedHistory(softwareHistory);
      }
    }, 300),
    [softwareHistory]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchDataDebounced(query);
  };

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
      selector: (row: SoftwareHistoryType) => row.arguments,
      sortable: true,
      cell: (row: SoftwareHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.arguments}
        >
          {row.arguments}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: SoftwareHistoryType) => row.status,
      sortable: true,
      cell: (row: SoftwareHistoryType) => {
        return (
          <div
            className={`status-cell ${getStatusClass(row.status)}`}
            title={row.status}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: getCircleColor(row.status),
                marginRight: "8px",
              }}
            ></span>
            {row.status}
          </div>
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
    fetchData(currentHistorysPage);
  }, [currentHistorysPage]);

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

            {showForm && <Wizard steps={steps} />}

            <div className="row mt-5 mb-5">
              <div className="col-12 col-md-6 d-flex align-items-center">
                <h3 className="mt-2">Installation History</h3>
              </div>

              <div className="col-12 col-md-6 d-flex justify-content-md-end">
                <SearchComponent
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={paginatedHistory}
              responsive
              highlightOnHover
              progressPending={isLoading}
              progressComponent={
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              }
            />
            {/* {isLoading && <div>Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>} */}

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
