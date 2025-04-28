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
    computer_name: "DEV-PC-001",
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
    computer_name: "DEV-PC-002",
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
    computer_name: "DEV-PC-003",
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
    computer_name: "DEV-PC-004",
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
    computer_name: "DEV-PC-005",
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
    computer_name: "DEV-PC-006",
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
    computer_name: "DESIGN-PC-001",
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
    computer_name: "DEV-PC-007",
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
    computer_name: "DEV-PC-008",
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
    computer_name: "DB-PC-001",
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
    computer_name: "BI-PC-001",
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
    computer_name: "DEV-PC-009",
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
    computer_name: "DEV-PC-010",
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
    computer_name: "MOBILE-PC-001",
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
    computer_name: "MGMT-PC-001",
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
    computer_name: "MGMT-PC-002",
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
    computer_name: "DEV-PC-011",
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
    computer_name: "DEV-PC-012",
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
    computer_name: "MEDIA-PC-001",
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
    computer_name: "SOCIAL-PC-001",
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
    computer_name: "COMM-PC-001",
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
    computer_name: "DEV-PC-013",
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
    computer_name: "JS-PC-001",
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
    computer_name: "MGMT-PC-003",
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
    if (!searchQuery.trim()) return paginatedHistory;
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
    return paginatedHistory.filter((entry: SoftwareHistoryType) =>
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
  }, [searchQuery, paginatedHistory]);

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

  return (
    <AnimatedRouteWrapper>
      <div className="row d-flex custom-main-container custom-container-height">
        <div className="d-flex flex-column col-12">
          <h2>🚀 Software Installation</h2>
          <div>
            <div
              style={{
                padding: "10px",
                overflow: "auto",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="d-flex flex-column overflow-auto"
                style={{ maxHeight: "100%", flexGrow: 1 }}
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
            </div>
          </div>
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
