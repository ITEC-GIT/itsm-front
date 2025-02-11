import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";

import {
  CancelSoftwareInstallation,
  GetAllSoftwareInstallations,
} from "../../config/ApiCalls";

import {
  GetAllSoftwareInstallationRequestType as filterType,
  SoftwareHistoryType,
} from "../../types/softwareInstallationTypes";
import { CardsStat } from "../../components/softwareInstallation/cards-statistics";
import {
  getCircleColor,
  getGreatestId,
  getStatusClass,
} from "../../../utils/custom";
import { SearchComponent } from "../../components/form/search";
import { useQuery } from "@tanstack/react-query";
import { FilterSidebar } from "../../components/form/filters";
import { useAtom, useAtomValue } from "jotai";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";

import { staticDataAtom } from "../../atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../types/filtersAtomType";
import { Wizard } from "../../components/form/wizard";
import { steps } from "../../data/softwareInstallation";

const SoftwareInstallationPage = ({
  computerIdProp,
}: {
  computerIdProp?: number;
}) => {
  const loggedInUser = Number(Cookies.get("user"));
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [isAdmin, setIsAdmin] = useState<1 | 0>(0);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<SoftwareHistoryType>();
  const SoftwarePerPage = 10;
  const minPagesToShow = 3;
  const [maxTotalSoftwares, setMaxTotalSoftwares] = useState<number>(0);

  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [paginatedHistory, setPaginatedHistory] = useState<
    SoftwareHistoryType[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [showUpdateAlert, setShowUpdateAlert] = useState<boolean>(false);
  const [alertUpdateMessage, setAlertUpdateMessage] = useState<string>("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<filterType>({
    range: "0-50",
    order: "desc",
  });

  const [toggleInstance] = useAtom(sidebarToggleAtom);
  const handleToggle = () => {
    if (toggleInstance) {
      toggleInstance.toggle();
    }
  };
  const toggleSidebar = () => {
    setShowForm(false);
    setIsSidebarOpen((prevState) => !prevState);
    handleToggle();
  };

  const fetchData = async (filters: filterType) => {
    const queryFilters = computerIdProp
      ? { ...filters, computer: computerIdProp }
      : filters;
    const response = await GetAllSoftwareInstallations(queryFilters);
    return response.data;
  };

  const initialFetch = async () => {
    const initialFilters = computerIdProp
      ? { range: "0-50", order: "desc", computer: computerIdProp }
      : { range: "0-50", order: "desc" };

    const response = await GetAllSoftwareInstallations(initialFilters);
    return response.data;
  };

  const {
    data: softwareHistory,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["softwareHistory"],
    queryFn: () => initialFetch(),
    refetchOnWindowFocus: true,
    refetchInterval: 180000,
    enabled: true,
    retry: true,
    staleTime: 500,
  });

  const handleCancelClick = (entry: SoftwareHistoryType) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (selectedEntry) {
      const response = await CancelSoftwareInstallation(selectedEntry.id);
      if (response.status === 200) {
        paginatedHistory.forEach((entry) => {
          if (entry.id === selectedEntry.id) {
            entry.status = "cancelled";
          }
        });
      }
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
      selector: (row: SoftwareHistoryType) => row.computer_name,
      width: "150px",
      cell: (row: SoftwareHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.computer_name}
        >
          {row.computer_name}
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
      width: "100px",
      selector: (row: SoftwareHistoryType) => row.user_name,
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
          disabled={row.status === "cancelled" || row.status === "received"}
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
    setCurrentHistoryPage(1);
    setSearchQuery(query);
  }, 100);

  const filteredHistory = useMemo(() => {
    console.log("came to here");
    if (!paginatedHistory || !searchQuery.trim()) return paginatedHistory || [];
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
    return softwareHistory.data.filter((entry: SoftwareHistoryType) => {
      return keywords.every(
        (keyword) =>
          entry.software.toLowerCase().includes(keyword) ||
          entry.computer_name?.toLowerCase().includes(keyword) ||
          entry.url.toLowerCase().includes(keyword) ||
          entry.status.toLowerCase().includes(keyword) ||
          entry.destination.toLowerCase().includes(keyword) ||
          entry.user_name.toString().toLowerCase().includes(keyword)
      );
    });
  }, [softwareHistory, searchQuery, paginatedHistory]);

  const totalPages = Math.ceil(filteredHistory.length / SoftwarePerPage);
  const totalPagess2 = Math.ceil(maxTotalSoftwares / SoftwarePerPage);

  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);

    const totalFetchedPages = Math.ceil(
      filteredHistory.length / SoftwarePerPage
    );
    console.log("totalFetchedPages", totalFetchedPages);
    console.log("page", page);
    console.log("hasMore", hasMore);

    if (page > totalFetchedPages && hasMore) {
      setIsLoadingMore(true);
      fetchData(filters).then((newData) => {
        setPaginatedHistory((prevHistory) => [...prevHistory, ...newData.data]);
        console.log();
        setHasMore(newData.totalCount > paginatedHistory.length);
        setIsLoadingMore(false);
      });
    }
  };

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

  const getCurrentPageRecords = useMemo(() => {
    const startIndex = (currentHistorysPage - 1) * SoftwarePerPage;
    const endIndex = startIndex + SoftwarePerPage;
    return filteredHistory.slice(startIndex, endIndex);
  }, [filteredHistory, currentHistorysPage, SoftwarePerPage]);

  useEffect(() => {
    if (softwareHistory) {
      const { totalcount, data: newData } = softwareHistory;

      setMaxTotalSoftwares(totalcount);

      setPaginatedHistory((prevHistory) => {
        const newSize = newData.length;

        const updatedHistory = [...newData, ...prevHistory.slice(newSize)];

        return updatedHistory;
      });
      const diff = totalcount - (paginatedHistory.length ?? 0);
      if (paginatedHistory.length !== 0 && diff !== 0) {
        setShowUpdateAlert(true);
        setAlertUpdateMessage(
          `Installation history updated. ${diff} software items are being initialized.`
        );
      }
      console.log("paginatedHistory =>>", paginatedHistory);
      setHasMore(softwareHistory.count < totalcount);
    }

    if (error) {
      console.error("Error fetching software installation data:", error);
    }
  }, [softwareHistory, error]);

  useEffect(() => {
    if (filters || computerIdProp) {
      setCurrentHistoryPage(1);
      setPaginatedHistory([]);
      setMaxTotalSoftwares(0);

      fetchData(filters).then((newData) => {
        setPaginatedHistory(newData.data);
        setMaxTotalSoftwares(newData.totalCount);
        setHasMore(newData.totalCount > newData.data.length);
      });
    }
  }, [filters, computerIdProp]);

  // useEffect(() => {
  //   if (filters) {
  //     setCurrentHistoryPage(1);
  //     fetchData(filters).then((newData) => {
  //       setPaginatedHistory(newData.data);
  //       setHasMore(newData.totalCount > paginatedHistory.length);
  //     });
  //   }
  // }, [filters, computerIdProp]);

  useEffect(() => {
    if (staticData?.assignees) {
      const user = staticData.assignees.find(
        (assignee) => assignee?.id === loggedInUser
      );
      const isAdmin = user ? user.is_admin : 0;
      setIsAdmin(isAdmin);
    }
  }, [loggedInUser, staticData]);

  const handleAlertClose = () => setShowUpdateAlert(false);

  const activeFilters = [
    "softwareStatusFilter",
    "userFilter",
    "computersFilter",
    "dateFilter",
  ];

  return (
    //<Content>
    <div
      className="container-fluid d-flex"
      style={{ paddingLeft: "30px", paddingRight: "30px" }}
    >
      <div
        className="content-container"
        style={{
          transition: "margin 0.3s ease-in-out",
          marginRight: isSidebarOpen ? "15%" : "0",
          width: isSidebarOpen ? "78%" : "100%",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10 col-xl-12">
            {!computerIdProp && (
              <>
                <div className="d-flex justify-content-between">
                  <h2 className="text-center mb-4">🚀 Software Installation</h2>
                  <ActionIcons />
                </div>
                <CardsStat />
              </>
            )}

            <button
              type="button"
              className="btn btn-primary hyper-connect-btn mb-3 mt-2"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? (
                <span style={{ display: "inline-block", marginRight: "8px" }}>
                  Installation Steps
                </span>
              ) : (
                <i className="bi bi-plus-lg hyper-btn-icon"></i>
              )}
            </button>
            {showForm && (
              <Wizard
                steps={steps}
                add={setPaginatedHistory}
                idgt={getGreatestId(paginatedHistory) ?? 0}
              />
            )}
            <div className="row mt-5 mb-5 d-flex justify-content-between align-items-center">
              <div className="col-12 col-md-4 d-flex align-items-center">
                <h3>Installation History</h3>
              </div>

              <div className="col-12 col-md-8 d-flex justify-content-md-end gap-2">
                <SearchComponent
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearchChange(e.target.value)
                  }
                />
                <button
                  className="btn btn-primary hyper-connect-btn mb-4"
                  onClick={toggleSidebar}
                >
                  Add Filters
                </button>
              </div>
            </div>
            <div className="row mt-5 mb-5 d-flex justify-content-between">
              {showUpdateAlert && (
                <div className="col-12 col-md-12 d-flex align-items-center">
                  <div
                    className="alert alert-info alert-dismissible fade show"
                    role="alert"
                    onClick={() => refetch()}
                  >
                    <strong>Update Detected!</strong> {alertUpdateMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleAlertClose}
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              )}
            </div>

            {isAdmin === 1 && (
              <>
                <DataTable
                  customStyles={customStyles}
                  columns={columns}
                  data={getCurrentPageRecords}
                  responsive
                  highlightOnHover
                  progressPending={isLoading || isLoadingMore}
                  progressComponent={
                    <div className="d-flex justify-content-center my-3">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
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
              </>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div
            className="modal show"
            tabIndex={-1}
            role="dialog"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
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

      <div
        className={`sidebar-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <FilterSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          activeFilters={activeFilters}
          saveFilters={setFilters}
        />
      </div>
    </div>
  );
};

export { SoftwareInstallationPage };
