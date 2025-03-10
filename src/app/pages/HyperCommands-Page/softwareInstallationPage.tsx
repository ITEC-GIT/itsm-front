import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import DataTable, { TableColumn } from "react-data-table-component";

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
import { FilterButton } from "../../components/form/filterButton";

import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { Wizard } from "../../components/form/wizard";
import {
  activeFilters,
  getColumns,
  steps,
} from "../../data/softwareInstallation";
import { customStyles, sortIcon } from "../../data/dataTable";
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
          newWidths[col.id as string] = "50%";
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);
        console.log(baseWidthPercentage);
        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;
          visibleCols.forEach((col: TableColumn<SoftwareHistoryType>) => {
            if (col.width) {
              const pixelWidth = parseInt(col.width, 10);

              // if (col.id === "action" || col.id === "id") {
              //   newWidths[col.id as string] = col.width;
              // }
              // else
              if (!isNaN(pixelWidth)) {
                const columnPercentageWidth = Math.round(
                  (pixelWidth / containerWidth) * 100
                );

                if (columnPercentageWidth < baseWidthPercentage) {
                  newWidths[col.id as string] = `${baseWidthPercentage}%`;
                } else {
                  newWidths[col.id as string] = `${baseWidthPercentage}%`;
                  // col.width;
                }
              } else {
                newWidths[col.id as string] = `${baseWidthPercentage}%`;
              }
            } else {
              newWidths[col.id as string] = `${baseWidthPercentage}%`;
            }
          });
        }
      }
      console.log("newWidths ==>>>", newWidths);
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
  }, []);

  return (
    <AnimatedRouteWrapper>
      <div className="container-fluid d-flex " style={{ height: "100%" }}>
        <div
          className="content-container rounded bg-white p-5"
          style={{
            marginRight: isSidebarOpen ? "15%" : "0",
            width: isSidebarOpen ? "82%" : "100%",
          }}
        >
          <div
            className="row justify-content-around bg-white"
            style={{ height: "15%" }}
          >
            <div className="d-flex justify-content-between p-5">
              <h2 className="text-center mb-4">🚀 Software Installation</h2>
              <ActionIcons />
            </div>
            <ul className="nav nav-tabs mb-5 fs-6 border-0 gap-2 p-5">
              <li className="nav-item">
                <a
                  className="nav-link custom-nav-link active"
                  data-bs-toggle="tab"
                  href="#software_installation"
                >
                  Software Installation
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link custom-nav-link"
                  data-bs-toggle="tab"
                  href="#installation_history"
                >
                  Installation History
                </a>
              </li>
            </ul>
            <div className="tab-content p-0">
              <div
                className="tab-pane fade show active"
                id="software_installation"
                role="tabpanel"
              >
                <div className="col-12">
                  <Wizard
                    steps={steps}
                    add={setPaginatedHistory}
                    idgt={getGreatestId(paginatedHistory) ?? 0}
                  />
                  <div className="p-5" ref={tableContainerRef}>
                    <DataTable
                      columns={visibleColumns.map((col) => ({
                        ...col,
                        width: columnWidths[col.id as string],
                      }))}
                      data={getCurrentPageRecords.slice(0, 5)}
                      persistTableHead={true}
                      responsive
                      highlightOnHover
                      customStyles={customStyles}
                      sortIcon={sortIcon}
                    />
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="installation_history"
                role="tabpanel"
              >
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-end gap-2 p-5">
                    <SearchComponent
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSearchChange(e.target.value)
                      }
                    />
                    <FilterButton toggleSidebar={toggleSidebar} />
                  </div>

                  <div className="row mb-5 d-flex justify-content-between">
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

                  <div className="p-5" ref={tableContainerRef}>
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
                <div className="tickets-pagination-controls">
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
          </div>
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
    </AnimatedRouteWrapper>
  );
};

export { SoftwareInstallationPage };
