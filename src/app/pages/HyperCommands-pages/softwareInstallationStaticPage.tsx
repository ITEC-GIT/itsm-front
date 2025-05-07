import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import clsx from "clsx";
import { ActionIcons } from "../../components/hyper-commands/action-icons.tsx";
import DataTable, { TableColumn } from "react-data-table-component";
import { CancelSoftwareInstallation } from "../../config/ApiCalls.ts";
import {
  GetAllSoftwareInstallationRequestType as filterType,
  SoftwareHistoryType,
} from "../../types/softwareInstallationTypes.ts";
import { getGreatestId } from "../../../utils/custom.ts";
import { SearchComponent } from "../../components/form/search.tsx";
import { FilterSidebar } from "../../components/form/filters.tsx";
import { useAtomValue } from "jotai";
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
import { WizardStatic } from "../../components/form/wizardStatic.tsx";

const staticSoftwareHistoryData: SoftwareHistoryType[] = [
  {
    id: 1,
    software: "Visual Studio Code",
    computer_name: "salameh-pc",
    url: "https://code.visualstudio.com/",
    destination: "C:\\Programs",
    arguments: "",
    status: "initialized",
    user_name: "admin",
    created_at: "2025-04-01T08:00:00Z",
  },
  {
    id: 2,
    software: "Node.js",
    computer_name: "salameh-pc",
    url: "https://nodejs.org/",
    destination: "C:\\Programs",
    arguments: "/S",
    status: "received",
    user_name: "tech",
    created_at: "2025-04-03T10:30:00Z",
  },
  {
    id: 3,
    software: "Google Chrome",
    computer_name: "salameh-pc",
    url: "https://www.google.com/chrome/",
    destination: "C:\\Apps",
    arguments: "--silent",
    status: "cancelled",
    user_name: "admin",
    created_at: "2025-04-05T12:00:00Z",
  },
  {
    id: 4,
    software: "Slack",
    computer_name: "salameh-pc",
    url: "https://slack.com/",
    destination: "C:\\Apps",
    arguments: "",
    status: "initialized",
    user_name: "jane",
    created_at: "2025-04-06T09:15:00Z",
  },
  {
    id: 5,
    software: "Zoom",
    computer_name: "salameh-pc",
    url: "https://zoom.us/",
    destination: "C:\\Conference",
    arguments: "",
    status: "received",
    user_name: "mark",
    created_at: "2025-04-06T10:45:00Z",
  },
  {
    id: 6,
    software: "Postman",
    computer_name: "QA-PC-001",
    url: "https://www.postman.com/",
    destination: "C:\\Tools",
    arguments: "/quiet",
    status: "initialized",
    user_name: "qa_user",
    created_at: "2025-04-07T13:30:00Z",
  },
  {
    id: 7,
    software: "Docker",
    computer_name: "salameh-pc",
    url: "https://www.docker.com/",
    destination: "C:\\DevTools",
    arguments: "/S",
    status: "initialized",
    user_name: "devops",
    created_at: "2025-04-07T14:45:00Z",
  },
  {
    id: 8,
    software: "Figma",
    computer_name: "salameh-pc",
    url: "https://www.figma.com/",
    destination: "C:\\Design",
    arguments: "",
    status: "initialized",
    user_name: "designer",
    created_at: "2025-04-08T08:00:00Z",
  },
  {
    id: 9,
    software: "Firefox",
    computer_name: "salameh-pc",
    url: "https://www.mozilla.org/firefox/",
    destination: "C:\\Programs",
    arguments: "",
    status: "cancelled",
    user_name: "admin",
    created_at: "2025-04-08T09:25:00Z",
  },
  {
    id: 10,
    software: "Notepad++",
    computer_name: "DESKTOP-GM7E7MK",
    url: "https://notepad-plus-plus.org/",
    destination: "C:\\Tools",
    arguments: "",
    status: "initialized",
    user_name: "jane",
    created_at: "2025-04-08T10:10:00Z",
  },
  {
    id: 11,
    software: "MySQL Workbench",
    computer_name: "srv-39.bishop.biz",
    url: "https://www.mysql.com/products/workbench/",
    destination: "C:\\DBTools",
    arguments: "",
    status: "received",
    user_name: "db_admin",
    created_at: "2025-04-09T08:00:00Z",
  },
  {
    id: 12,
    software: "Tableau",
    computer_name: "srv-39.bishop.biz",
    url: "https://www.tableau.com/",
    destination: "C:\\BI",
    arguments: "",
    status: "initialized",
    user_name: "data_analyst",
    created_at: "2025-04-09T09:30:00Z",
  },
  {
    id: 13,
    software: "Git",
    computer_name: "DESKTOP-GM7E7MK",
    url: "https://git-scm.com/",
    destination: "C:\\DevTools",
    arguments: "/S",
    status: "initialized",
    user_name: "admin",
    created_at: "2025-04-10T11:00:00Z",
  },
  {
    id: 14,
    software: "PyCharm",
    computer_name: "DESKTOP-GM7E7MK",
    url: "https://www.jetbrains.com/pycharm/",
    destination: "C:\\IDE",
    arguments: "",
    status: "initialized",
    user_name: "python_dev",
    created_at: "2025-04-10T12:15:00Z",
  },
  {
    id: 15,
    software: "Android Studio",
    computer_name: "srv-39.bishop.biz",
    url: "https://developer.android.com/studio",
    destination: "C:\\MobileDev",
    arguments: "/S",
    status: "received",
    user_name: "android_dev",
    created_at: "2025-04-10T14:45:00Z",
  },
  {
    id: 16,
    software: "Jira",
    computer_name: "DESKTOP-M3P39LF",
    url: "https://www.atlassian.com/software/jira",
    destination: "C:\\Management",
    arguments: "",
    status: "initialized",
    user_name: "pm",
    created_at: "2025-04-11T09:00:00Z",
  },
  {
    id: 17,
    software: "Confluence",
    computer_name: "DESKTOP-M3P39LF",
    url: "https://www.atlassian.com/software/confluence",
    destination: "C:\\Docs",
    arguments: "",
    status: "initialized",
    user_name: "pm",
    created_at: "2025-04-11T10:30:00Z",
  },
  {
    id: 18,
    software: "XAMPP",
    computer_name: "DESKTOP-GM7E7MK",
    url: "https://www.apachefriends.org/index.html",
    destination: "C:\\DevTools",
    arguments: "/quiet",
    status: "cancelled",
    user_name: "php_dev",
    created_at: "2025-04-12T08:15:00Z",
  },
  {
    id: 19,
    software: "VS 2019",
    computer_name: "DESKTOP-GM7E7MK",
    url: "https://visualstudio.microsoft.com/",
    destination: "C:\\IDE",
    arguments: "/quiet",
    status: "initialized",
    user_name: "dotnet_dev",
    created_at: "2025-04-12T09:45:00Z",
  },
  {
    id: 20,
    software: "OBS Studio",
    computer_name: "DESKTOP-M3P39LF",
    url: "https://obsproject.com/",
    destination: "C:\\Media",
    arguments: "",
    status: "initialized",
    user_name: "streamer",
    created_at: "2025-04-13T08:00:00Z",
  },
  {
    id: 21,
    software: "Discord",
    computer_name: "DESKTOP-M3P39LF",
    url: "https://discord.com/",
    destination: "C:\\Social",
    arguments: "",
    status: "received",
    user_name: "admin",
    created_at: "2025-04-13T09:30:00Z",
  },
  {
    id: 22,
    software: "Skype",
    computer_name: "DESKTOP-M3P39LF",
    url: "https://www.skype.com/",
    destination: "C:\\Comm",
    arguments: "",
    status: "cancelled",
    user_name: "support",
    created_at: "2025-04-13T10:45:00Z",
  },
  {
    id: 23,
    software: "VS Code Insiders",
    computer_name: "lt-23.short-barry.com",
    url: "https://code.visualstudio.com/insiders/",
    destination: "C:\\Programs",
    arguments: "--install",
    status: "initialized",
    user_name: "admin",
    created_at: "2025-04-14T08:00:00Z",
  },
  {
    id: 24,
    software: "WebStorm",
    computer_name: "lt-23.short-barry.com",
    url: "https://www.jetbrains.com/webstorm/",
    destination: "C:\\IDE",
    arguments: "",
    status: "initialized",
    user_name: "frontend",
    created_at: "2025-04-14T09:15:00Z",
  },
  {
    id: 25,
    software: "Bitbucket",
    computer_name: "lt-23.short-barry.com",
    url: "https://bitbucket.org/",
    destination: "C:\\Repos",
    arguments: "",
    status: "received",
    user_name: "pm",
    created_at: "2025-04-14T11:00:00Z",
  },
];

const SoftwareInstallationStaticPage = ({
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
  const SoftwarePerPage = 8;
  const minPagesToShow = 3;
  const [maxTotalSoftwares, setMaxTotalSoftwares] = useState<number>(0);

  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);

  const [paginatedHistory, setPaginatedHistory] = useState<
    SoftwareHistoryType[]
  >(staticSoftwareHistoryData);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<filterType>({
    range: "0-50",
    order: "desc",
  });

  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<SoftwareHistoryType>[]
  >([]);

  const [activeTab, setActiveTab] = useState("installation");
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const pagRef = useRef<HTMLDivElement>(null);
  const [pagHeight, setPagHeight] = useState(0);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersHeight, setFiltersHeight] = useState(0);

  const handleCancelClick = (entry: SoftwareHistoryType) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const memoizedColumns = useMemo(() => {
    return getColumns(handleCancelClick);
  }, []);

  const toggleSidebar = () => {
    setShowForm(false);
    setIsSidebarOpen((prevState) => !prevState);
  };

  const confirmCancellation = async () => {
    if (selectedEntry) {
      setPaginatedHistory((prev) =>
        prev.map((entry) =>
          entry.id === selectedEntry.id
            ? { ...entry, status: "cancelled" }
            : entry
        )
      );
      setIsModalOpen(false);
      setSelectedEntry(undefined);
    }
  };

  const handleSearchChange = debounce((query: string) => {
    setCurrentHistoryPage(1);
    setSearchQuery(query);
  }, 100);

  const filteredHistory = useMemo(() => {
    let history = paginatedHistory;

    if (filters?.status) {
      history = history.filter(
        (entry) => entry.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    if (filters?.computer_name) {
      history = history.filter(
        (entry) =>
          entry.computer_name.toLowerCase() ===
          filters.computer_name?.toLowerCase()
      );
    }

    if (filters?.date_from !== undefined) {
      history = history.filter(
        (entry) => new Date(entry.created_at) >= new Date(filters.date_from!)
      );
    }
    if (filters?.date_to !== undefined) {
      history = history.filter(
        (entry) => new Date(entry.created_at) <= new Date(filters.date_to!)
      );
    }

    if (searchQuery.trim()) {
      const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
      history = history.filter((entry: SoftwareHistoryType) =>
        keywords.every(
          (keyword) =>
            entry.software.toLowerCase().includes(keyword) ||
            entry.computer_name?.toLowerCase().includes(keyword) ||
            entry.url.toLowerCase().includes(keyword) ||
            entry.status.toLowerCase().includes(keyword) ||
            entry.destination.toLowerCase().includes(keyword) ||
            entry.user_name.toString().toLowerCase().includes(keyword)
        )
      );
    }

    return history;
  }, [searchQuery, paginatedHistory, filters]);

  const totalPages = Math.ceil(filteredHistory.length / SoftwarePerPage);
  const totalPagess2 = Math.ceil(maxTotalSoftwares / SoftwarePerPage);

  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);

    const totalFetchedPages = Math.ceil(
      filteredHistory.length / SoftwarePerPage
    );
    if (page > totalFetchedPages && hasMore) {
      setIsLoadingMore(true);
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
    if (staticData?.assignees) {
      const user = staticData.assignees.find(
        (assignee) => assignee?.id === loggedInUser
      );
      const isAdmin = user ? user.is_admin : 0;
      setIsAdmin(isAdmin);
    }
  }, [loggedInUser, staticData]);

  useEffect(() => {
    setVisibleColumns(memoizedColumns);
  }, [memoizedColumns]);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
    if (pagRef.current) {
      const rect = pagRef.current.getBoundingClientRect();
      setPagHeight(Math.round(rect.height));
    }
    if (filtersRef.current) {
      const rect = filtersRef.current.getBoundingClientRect();
      setFiltersHeight(Math.round(rect.height));
    }
  }, [divRef.current, pagRef.current, filtersRef.current]);

  useEffect(() => {
    const calculateWidths = () => {
      if (!tableContainerRef.current) return;

      const containerWidth = tableContainerRef.current.clientWidth;
      if (containerWidth === 0) return;

      const columnsWithoutAction = visibleColumns.filter(
        (col) => col.id !== "action" && col.id !== "id"
      );

      const visibleCount = visibleColumns.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        columnsWithoutAction.forEach((col) => {
          newWidths[col.id as string] = "50%";
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        columnsWithoutAction.forEach((col) => {
          let columnWidth = col.width;
          if (columnWidth) {
            let pixelWidth = parseFloat(columnWidth.replace("px", ""));
            if (!isNaN(pixelWidth)) {
              if (col.id === "settings") {
                newWidths[col.id] = columnWidth || `${baseWidthPercentage}%`;
              } else {
                const columnPercentageWidth =
                  (pixelWidth / containerWidth) * 100;
                newWidths[col.id as string] =
                  columnPercentageWidth < baseWidthPercentage
                    ? `${baseWidthPercentage}%`
                    : `${columnPercentageWidth}%`;
              }
            } else {
              newWidths[col.id as string] = columnWidth;
            }
          } else {
            newWidths[col.id as string] = `${baseWidthPercentage}%`;
          }
        });
      }

      setColumnWidths(newWidths);
    };

    const timeoutId = setTimeout(calculateWidths, 100);
    const observer = new ResizeObserver(calculateWidths);
    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [visibleColumns]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex custom-main-container custom-container-height">
          <div
            className={`cont-d-flex-column ${
              isSidebarOpen ? "cont-custom-hide col-9" : "col-12"
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
                className="tab-content d-flex flex-column flex-grow-1 overflow-auto"
                style={{
                  padding: "10px",
                  height:
                    activeTab === "installation"
                      ? `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px)`
                      : "",
                }}
              >
                {activeTab === "installation" && (
                  <div
                    className="d-flex flex-column flex-grow-1 overflow-auto none-scroll-width"
                    style={{
                      maxHeight: "100%",
                    }}
                  >
                    <WizardStatic
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
                        data={getCurrentPageRecords.slice(0, 5)}
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
                  <div className="d-flex flex-column flex-grow-1 position-relative overflow-auto none-scroll-width ">
                    <div ref={filtersRef}>
                      <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
                        <SearchComponent
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <FilterButton toggleSidebar={toggleSidebar} />
                      </div>
                    </div>
                    <div
                      style={{
                        height: `calc(100vh - var(--bs-app-header-height) - 50px - ${height}px - ${pagHeight}px - ${filtersHeight}px)`,
                        overflow: "auto",
                      }}
                    >
                      <div
                        ref={tableContainerRef}
                        style={{
                          flex: 1,
                        }}
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
                          fixedHeader
                          fixedHeaderScrollHeight={`calc(100vh - var(--bs-app-header-height) - 50px - ${height}px - ${pagHeight}px - ${filtersHeight}px)`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeTab === "history" && (
                <div
                  ref={pagRef}
                  className="sticky-pagination d-flex justify-content-end align-items-center"
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
              className="col-3 custom-border overflow-auto filter-sidebar-small p-0"
              style={{
                height: `calc(100vh - var(--bs-app-header-height) - 40px)`,
              }}
            >
              <div>
                <FilterSidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  activeFilters={activeFilters}
                  saveFilters={setFilters}
                  filtersStoreName={"softwareFilters"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          className={`modal w-100 fade ${isModalOpen ? "show d-block" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-hidden={!isModalOpen}
          style={{
            background: isModalOpen ? "rgba(0,0,0,0.5)" : "transparent",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-5">
              <div className="d-flex justify-content-start align-items-center mb-5">
                <div className="circle-div">
                  <i className="bi bi-exclamation text-white custom-modal-animated-icon"></i>
                </div>
                <div className="d-flex flex-column">
                  <p>
                    Are you sure you want to cancel the installation of{" "}
                    <strong>{selectedEntry?.software}</strong>?
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="custom-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  className="custom-modal-confirm-btn"
                  onClick={confirmCancellation}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedRouteWrapper>
  );
};

export { SoftwareInstallationStaticPage };
