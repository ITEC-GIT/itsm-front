import { useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import { useAtom } from "jotai";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";
import {
  AssetsHistoryType,
  GetAllAssetsRequestType as FilterType,
} from "../../types/assetsTypes";
import { customStyles } from "../../../_metronic/assets/sass/custom/dataTable";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters";
import { ColumnVisibility } from "../../types/common";
import ColumnModal from "../../components/modal/columns";
import clsx from "clsx";
import { activeFilters, columns, mockData } from "../../data/assets";
import { AddAssetModal } from "../../components/modal/addAsset";

const AssetsPage = () => {
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);

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
    inventory_number: true,
    alternate_username_number: false,
    action: true,
    status: true,
    public_ip: true,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toggleInstance] = useAtom(sidebarToggleAtom);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState<boolean>(false);

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
    setIsAddAssetOpen((prevState) => !prevState);
  };

  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.id as string]
  );

  const handleVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };

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
        <div className="d-flex justify-content-between mb-3">
          <h2 className="text-center mb-4">🛠️ Assets</h2>
        </div>
        <div className="d-flex justify-content-between p-3 rounded shadow-sm bg-white">
          <div className="asset-btn-group">
            <button className="btn asset-action-btn">
              <i className="bi bi-cloud-download me-1 text-dark"></i> Download
            </button>
            <button
              className={`btn asset-action-btn `}
              onClick={toggleColumnModal}
            >
              <i className={`bi bi-layout-split me-1 text-dark`}></i>
              Columns
            </button>
            <button
              className="btn add-asset-action-btn "
              onClick={toggleAddAssetModal}
            >
              <i
                className={`bi bi-plus-circle me-1 ${
                  isAddAssetOpen ? "text-white" : "text-dark"
                }`}
              ></i>
              Asset
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
          customStyles={customStyles}
          columns={visibleColumns}
          data={mockData}
          responsive
          highlightOnHover
          progressPending={isLoadingMore}
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
      {isAddAssetOpen && (
        <AddAssetModal isOpen={isAddAssetOpen} onClose={toggleAddAssetModal} />
      )}
    </div>
  );
};

const AssetsPageWrapper = () => {
  return <AssetsPage />;
};

export { AssetsPageWrapper };
