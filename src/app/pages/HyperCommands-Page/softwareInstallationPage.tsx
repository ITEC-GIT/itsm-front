import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";
import { Wizard } from "../../components/form/wizard";
import { steps } from "../../data/softwareInstallation";
import { FetchAllSoftwareInstallations } from "../../config/ApiCalls";
import {
  SoftwareHistoryType,
  SoftwareInstallationResponseType,
} from "../../types/softwareInstallationTypes";
import { CardsStat } from "../../components/hyper-commands/cards-statistics";
import {
  getCircleColor,
  getLowestId,
  getStatusClass,
} from "../../../utils/custom";
import { SearchComponent } from "../../components/form/search";
import { useQuery } from "@tanstack/react-query";

const SoftwareInstallationPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedEntry, setSelectedEntry] = useState<SoftwareHistoryType>();

  const SoftwarePerPage = 10;
  const minPagesToShow = 3;
  const [maxTotalSoftwares, setMaxTotalSoftwares] = useState<number>(0);
  const totalPages = Math.ceil(maxTotalSoftwares / SoftwarePerPage);

  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [paginatedHistory, setPaginatedHistory] = useState<
    SoftwareHistoryType[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const startPage =
    Math.floor((currentHistorysPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

  const handleFirstPage = () => setCurrentHistoryPage(1);
  const handlePreviousPage = () =>
    setCurrentHistoryPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => {
    setCurrentHistoryPage((prev) => Math.min(prev + 1, totalPages));
    handlePageChange(currentHistorysPage + 1);
  };

  const handleLastPage = () => setCurrentHistoryPage(totalPages);

  const fetchData = async () => {
    const response = await FetchAllSoftwareInstallations(
      "0-29",
      "desc",
      getLowestId(paginatedHistory) ?? undefined
    );
    return response.data;
  };

  const {
    data: softwareHistory,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["softwareHistory"],
    queryFn: () => fetchData(),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
    enabled: true,
    retry: true,
    staleTime: 500,
  });

  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);

    const totalFetchedPages = Math.ceil(
      paginatedHistory.length / SoftwarePerPage
    );

    if (page > totalFetchedPages && hasMore) {
      setIsLoadingMore(true);
      fetchData().then((newData) => {
        setPaginatedHistory((prevHistory) => [...prevHistory, ...newData.data]);
        setHasMore(newData.count < newData.totalcount);
        setIsLoadingMore(false);
      });
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

  const columns: TableColumn<SoftwareHistoryType>[] = [
    {
      name: "#",
      sortable: false,
      width: "50px",
      cell: (row: SoftwareHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.id.toString()}
        >
          {row.id}
        </span>
      ),
    },
    {
      name: "Software",
      selector: (row: SoftwareHistoryType) => row.software,
      sortable: true,
      width: "150px",

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
      width: "150px",
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
      width: "150px",
      selector: (row: SoftwareHistoryType) => row.url,
      sortable: true,

      cell: (row: SoftwareHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.url}
          className="url-cell"
        >
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
    },
    {
      name: "User",
      //  width: "100px",
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
      width: "70px",
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
    },
  ];

  const handleSearchChange = debounce((query: string) => {
    const searchQry = query.trim();
    setCurrentHistoryPage(1);
    setSearchQuery(searchQry);
  }, 100);

  const filteredHistory = useMemo(() => {
    if (!softwareHistory || !searchQuery.trim())
      return softwareHistory?.data || [];

    const lowerCaseQuery = searchQuery.toLowerCase();
    return softwareHistory.data.filter((entry: SoftwareHistoryType) => {
      return (
        entry.software.toLowerCase().includes(lowerCaseQuery) ||
        entry.computers_id.toLowerCase().includes(lowerCaseQuery) ||
        entry.url.toLowerCase().includes(lowerCaseQuery) ||
        entry.users_id.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [softwareHistory, searchQuery]);

  const getCurrentPageRecords = useMemo(() => {
    const startIndex = (currentHistorysPage - 1) * SoftwarePerPage;
    const endIndex = startIndex + SoftwarePerPage;
    return filteredHistory.slice(startIndex, endIndex);
  }, [filteredHistory, currentHistorysPage, SoftwarePerPage]);

  useEffect(() => {
    if (softwareHistory) {
      setMaxTotalSoftwares(softwareHistory.totalcount);
      setPaginatedHistory((prevHistory) => [
        ...prevHistory,
        ...softwareHistory.data,
      ]);
      setHasMore(softwareHistory.count < softwareHistory.totalcount);
    }
    if (error) {
      console.error("Error fetching software installation data:", error);
    }
  }, [softwareHistory, error]);

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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearchChange(e.target.value)
                  }
                />
              </div>
            </div>

            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={getCurrentPageRecords}
              responsive
              highlightOnHover
              progressPending={isLoading || isLoadingMore}
              progressComponent={
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              }
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
