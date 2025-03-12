import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons.tsx";
import DataTable, { TableColumn } from "react-data-table-component";

import {
  CancelSoftwareInstallation,
  GetAllSoftwareInstallations,
} from "../../config/ApiCalls.ts";

import {
  GetAllSoftwareInstallationRequestType as filterType,
  SoftwareHistoryType,
} from "../../types/softwareInstallationTypes.ts";
import { CardsStat } from "../../components/softwareInstallation/cards-statistics.tsx";
import {
  getCircleColor,
  getGreatestId,
  getStatusClass,
} from "../../../utils/custom.ts";
import { SearchComponent } from "../../components/form/search.tsx";
import { useQuery } from "@tanstack/react-query";
import { FilterSidebar } from "../../components/form/filters.tsx";
import { useAtom, useAtomValue } from "jotai";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar.ts";
import { FilterButton } from "../../components/form/filterButton.tsx";

import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms.ts";
import { StaticDataType } from "../../types/filtersAtomType.ts";
import { Wizard } from "../../components/form/wizard.tsx";
import {
  activeFilters,
  getColumns,
  steps,
} from "../../data/softwareInstallation.tsx";
import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const SoftwareInstallationPage = ({
  computerIdProp,
}: {
  computerIdProp?: number;
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
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

  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<SoftwareHistoryType>[]
  >([]);

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

  const handleSearchChange = debounce((query: string) => {
    setCurrentHistoryPage(1);
    setSearchQuery(query);
  }, 100);

  const filteredHistory = useMemo(() => {
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
    if (page > totalFetchedPages && hasMore) {
      setIsLoadingMore(true);
      fetchData(filters).then((newData) => {
        setPaginatedHistory((prevHistory) => [...prevHistory, ...newData.data]);
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

  useEffect(() => {
    const calculateWidths = () => {
      const visibleCols = getColumns(handleCancelClick);
      setVisibleColumns(visibleCols);
      const visibleCount = visibleCols.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        visibleCols.forEach((col: TableColumn<SoftwareHistoryType>) => {
          if (col.id === "action") {
            newWidths[col.id as string] = col.width || "auto";
          } else if (col.id === "id") {
            newWidths[col.id as string] = col.width || "auto";
          } else {
            newWidths[col.id as string] = "50%";
          }
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;
          visibleCols.forEach((col: TableColumn<SoftwareHistoryType>) => {
            if (col.id === "action") {
              newWidths[col.id as string] = col.width || "auto";
            } else if (col.id === "id") {
              newWidths[col.id as string] = col.width || "auto";
            } else {
              if (col.width) {
                const pixelWidth = parseInt(col.width, 10);

                if (!isNaN(pixelWidth)) {
                  const columnPercentageWidth = Math.round(
                    (pixelWidth / containerWidth) * 100
                  );

                  if (columnPercentageWidth < baseWidthPercentage) {
                    newWidths[col.id as string] = `${baseWidthPercentage}%`;
                  } else {
                    newWidths[col.id as string] = col.width;
                  }
                } else {
                  newWidths[col.id as string] = `${baseWidthPercentage}%`;
                }
              } else {
                newWidths[col.id as string] = `${baseWidthPercentage}%`;
              }
            }
          });
        }
      }
      setColumnWidths(newWidths);
    };

    calculateWidths();

    const observer = new ResizeObserver(calculateWidths);
    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isSidebarOpen]);

  const [activeTab, setActiveTab] = useState("installation");
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const pagRef = useRef<HTMLDivElement>(null);
  const [pagHeight, setPagHeight] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
    if (pagRef.current) {
      const rect = pagRef.current.getBoundingClientRect();
      setPagHeight(Math.round(rect.height));
    }
  }, [divRef.current, pagRef.current]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div
          className="row d-flex custom-main-container custom-container-height"
          // style={{ overflowY: "auto" }}
        >
          <div
            className={`d-flex flex-column ${
              isSidebarOpen ? "col-9" : "col-12"
            }`}
          >
            <div ref={divRef}>
              <div className="d-flex justify-content-between">
                <h2>🚀 Software Installation</h2>
                <ActionIcons />
              </div>

              <ul className="nav nav-tabs border-0 gap-2 mt-3" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link custom-nav-link ${
                      activeTab === "installation" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("installation");
                      setIsSidebarOpen(false);
                    }}
                  >
                    Software Installation
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link custom-nav-link ${
                      activeTab === "history" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    Software History
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div
                className="tab-content"
                style={{
                  // backgroundColor: "red",
                  padding: "10px",
                  // height: `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px)`,
                  // height: "100px",
                  height:
                    activeTab === "installation"
                      ? `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px)`
                      : `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px - ${pagHeight}px)`,
                  overflow: "auto",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {activeTab === "installation" && (
                  <div
                    className="d-flex flex-column overflow-auto"
                    style={{ maxHeight: "100%", flexGrow: 1 }}
                  >
                    <Wizard
                      steps={steps}
                      add={setPaginatedHistory}
                      idgt={getGreatestId(paginatedHistory) ?? 0}
                    />
                    <div className="mt-5" ref={tableContainerRef}>
                      <DataTable
                        columns={visibleColumns.map((col) => ({
                          ...col,
                          width: columnWidths[col.id as string],
                        }))}
                        data={getCurrentPageRecords.slice(0, 4)}
                        persistTableHead={true}
                        responsive
                        highlightOnHover
                        customStyles={customStyles}
                        sortIcon={sortIcon}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div
                    className="d-flex flex-column overflow-auto"
                    style={{
                      maxHeight: "100%",
                      flexGrow: 1,
                      position: "relative",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        {showUpdateAlert && (
                          <div
                            className="alert alert-info alert-dismissible fade show"
                            role="alert"
                            onClick={() => refetch()}
                          >
                            <strong>Update Detected!</strong>{" "}
                            {alertUpdateMessage}
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleAlertClose}
                              aria-label="Close"
                            ></button>
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <SearchComponent
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSearchChange(e.target.value)
                          }
                        />
                        <FilterButton toggleSidebar={toggleSidebar} />
                      </div>
                    </div>

                    <div
                      className="mt-5"
                      // style={{ width: "100%", overflowX: "auto" }}
                      ref={tableContainerRef}
                    >
                      <DataTable
                        columns={visibleColumns.map((col) => ({
                          ...col,
                          width: columnWidths[col.id as string],
                        }))}
                        data={getCurrentPageRecords}
                        persistTableHead={true}
                        responsive
                        highlightOnHover
                        customStyles={customStyles}
                        sortIcon={sortIcon}
                      />
                    </div>
                  </div>
                )}
              </div>

              {activeTab === "history" && (
                <div
                  ref={pagRef}
                  className="d-flex justify-content-end align-items-center"
                  style={{
                    position: "sticky",
                    bottom: 0,
                    height: "40px",
                    // top: "100%",
                    // right: "0",
                    width: "100%",
                    zIndex: "2000",
                  }}
                >
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
              )}
            </div>
          </div>

          {isSidebarOpen && (
            <div
              className="col-3 custom-border"
              style={{
                height: `calc(100vh - var(--bs-app-header-height) - 40px)`,
                overflow: "auto",
              }}
            >
              <div>
                <FilterSidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  activeFilters={activeFilters}
                  saveFilters={setFilters}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { SoftwareInstallationPage };
