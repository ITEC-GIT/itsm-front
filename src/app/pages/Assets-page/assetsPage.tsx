import { useMemo, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { SortOrder } from "react-data-table-component";
import { useAtom } from "jotai";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";
import { GetAllAssetsRequestType as FilterType } from "../../types/assetsTypes";
import {
  customStyles,
  sortIcon,
} from "../../../_metronic/assets/sass/custom/dataTable";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters";
import { ColumnVisibility } from "../../types/common";
import ColumnModal from "../../components/modal/columns";
import clsx from "clsx";
import {
  activeFilters,
  columns,
  getColumns,
  mockData,
} from "../../data/assets";
import { useNavigate } from "react-router-dom";
import { showActionColumnAtom } from "../../atoms/table-atom/tableAtom";

const AssetsPage = () => {
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [ShowActionColumn, setShowActionColumn] = useAtom(showActionColumnAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    range: "0-50",
    order: "desc",
  });

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    name: true,
    entity: true,
    serial_number: true,
    model: true,
    location: true,
    component_processor: false,
    last_update: true,
    type: true,
    project: false,
    address: false,
    inventory_number: false,
    alternate_username_number: false,
    status: true,
    public_ip: true,
    action: true,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toggleInstance] = useAtom(sidebarToggleAtom);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const toggleColumnModal = () => {
    setIsColumnModalOpen((prevState) => !prevState);
  };

  const handleToggle = () => {
    if (toggleInstance) {
      toggleInstance.toggle();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
    handleToggle();
  };

  const toggleAddAssetModal = () => {
    setIsColumnModalOpen(false);
    navigate("/assets/new");
  };

  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.id as string]
  );

  const handleSearchChange = debounce((query: string) => {
    //  setCurrentHistoryPage(1);
    setSearchQuery(query);
  }, 100);

  const RecordsPerPage = 10;
  const minPagesToShow = 3;
  const [maxTotalData, setMaxTotalData] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handlePageChange = (page: number) => {
    setCurrentHistoryPage(page);
    const totalFetchedPages = Math.ceil(mockData.length / RecordsPerPage);
    // filteredHistory.length / RecordsPerPage

    if (page > totalFetchedPages && hasMore) {
      setIsLoadingMore(true);
      // fetchData(filters).then((newData) => {
      //   setPaginatedHistory((prevHistory) => [...prevHistory, ...newData.data]);
      //   console.log();
      //   setHasMore(newData.totalCount > paginatedHistory.length);
      //   setIsLoadingMore(false);
      // });
    }
  };
  const totalPages = Math.ceil(mockData.length / RecordsPerPage);

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

  const handleVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };

  const handleMouseEnter = () => {
    setShowActionColumn(true);
  };

  const handleMouseLeave = () => {
    setShowActionColumn(false);
  };

  return (
    <div className="container-fluid d-flex mt-4">
      <div
        className="content-container"
        style={{
          transition: "margin 0.3s ease-in-out",
          marginRight: isSidebarOpen ? "15%" : "0",
          width: isSidebarOpen ? "78%" : "100%",
        }}
      >
        <div className="d-flex mb-3">
          <h2 className="mb-4">🛠️ Assets</h2>
        </div>
        <div className="d-flex justify-content-between p-3 rounded shadow-sm bg-white">
          <div className="custom-btn-group">
            <button className="btn custom-btn mb-3">
              <i className="bi bi-cloud-download text-dark custom-btn-icon"></i>
              <span className="custom-btn-text">Download</span>
            </button>
            <button
              className={`btn custom-btn mb-3`}
              onClick={toggleColumnModal}
            >
              <i className={`bi bi-layout-split text-dark custom-btn-icon`}></i>
              <span className="custom-btn-text">Columns</span>
            </button>
            <button
              className="btn custom-btn mb-3"
              onClick={toggleAddAssetModal}
            >
              <i className={`bi bi-plus-square text-dark custom-btn-icon`}></i>
              <span className="custom-btn-text">Asset</span>
            </button>
            <ColumnModal
              isOpen={isColumnModalOpen}
              onClose={toggleColumnModal}
              columns={columns}
              initialVisibility={columnVisibility}
              onVisibilityChange={handleVisibilityChange}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <SearchComponent
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
              />
              {searchQuery && (
                <button
                  className="btn position-absolute top-50 end-0 translate-middle-y"
                  onClick={() => handleSearchChange("")}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
            <button className="filter-button" onClick={toggleSidebar}>
              <i className="bi bi-funnel me-1 filter-button-icon"></i>
              Filters
            </button>
          </div>
        </div>
        <DataTable
          columns={getColumns(ShowActionColumn).filter(
            (col) => columnVisibility[col.id as string]
          )}
          data={mockData}
          persistTableHead={true}
          responsive
          highlightOnHover
          customStyles={customStyles}
          sortIcon={sortIcon}
          onRowMouseEnter={handleMouseEnter}
          onRowMouseLeave={handleMouseLeave}
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

const AssetsPageWrapper = () => {
  return <AssetsPage />;
};

export { AssetsPageWrapper };
