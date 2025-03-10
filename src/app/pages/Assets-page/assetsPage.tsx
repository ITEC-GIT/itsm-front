import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { SortOrder, TableColumn } from "react-data-table-component";
import { useAtom } from "jotai";
import { sidebarToggleAtom } from "../../atoms/sidebar-atom/sidebar";
import {
  AssetsHistoryType,
  GetAllAssetsRequestType as FilterType,
} from "../../types/assetsTypes";
import { customStyles, sortIcon } from "../../data/dataTable";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters";
import { ColumnVisibility } from "../../types/common";
import ColumnModal from "../../components/modal/columns";
import clsx from "clsx";
import { activeFilters, getColumns, mockData } from "../../data/assets";
import { useNavigate } from "react-router-dom";
import { showActionColumnAtom } from "../../atoms/table-atom/tableAtom";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const AssetsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
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
    entity: false,
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

  // const visibleColumns = columns.filter(
  //   (col) => columnVisibility[col.id as string]
  // );

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
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<AssetsHistoryType>[]
  >([]);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const memoizedColumns = useMemo(() => {
    return getColumns(hoveredRowId);
  }, [hoveredRowId]);

  useEffect(() => {
    const filteredColumns = memoizedColumns.filter(
      (col) => columnVisibility[col.id as string]
    );
    setVisibleColumns(filteredColumns);
  }, [columnVisibility, memoizedColumns]);

  useEffect(() => {
    const calculateWidths = () => {
      const columnsWithoutAction = visibleColumns.filter(
        (col) => col.id !== "action" && col.id !== "id"
      );
      const visibleCount = visibleColumns.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        columnsWithoutAction.forEach((col: TableColumn<AssetsHistoryType>) => {
          newWidths[col.id as string] = "50%";
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;

          columnsWithoutAction.forEach(
            (col: TableColumn<AssetsHistoryType>) => {
              if (col.width) {
                const pixelWidth = parseInt(col.width, 10);

                if (!isNaN(pixelWidth)) {
                  const columnPercentageWidth =
                    Math.round((pixelWidth / containerWidth) * 100) + 0.05;

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
          );
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
  }, [visibleColumns]);

  const handleMouseEnter = (rowId: number) => {
    setHoveredRowId(rowId);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
  };

  const columnsForModal = useMemo(
    () => memoizedColumns.filter((col) => col.id !== "action"),
    [memoizedColumns]
  );
  return (
    <AnimatedRouteWrapper>
      <div className="container-fluid d-flex mt-4" style={{ height: "100%" }}>
        <div
          className="content-container rounded p-3"
          style={{
            marginRight: isSidebarOpen ? "15%" : "0",
            width: isSidebarOpen ? "78%" : "100%",
          }}
        >
          {/* <div className="d-flex mb-3">
          <h2 className="mb-4">🛠️ Assets</h2>
        </div> */}

          <div
            className="row justify-content-around  bg-white"
            style={{ height: "15%" }}
          >
            <div className="col-sm-12 col-md-6 d-flex align-items-center gap-2">
              <button className="btn custom-btn">
                <i className="bi bi-cloud-download text-dark custom-btn-icon"></i>
                <span className="custom-btn-text">Download</span>
              </button>
              <button className="btn custom-btn" onClick={toggleColumnModal}>
                <i className="bi bi-layout-split text-dark custom-btn-icon"></i>
                <span className="custom-btn-text">Columns</span>
              </button>
              <button className="btn custom-btn" onClick={toggleAddAssetModal}>
                <i className="bi bi-plus-square text-dark custom-btn-icon"></i>
                <span className="custom-btn-text">Asset</span>
              </button>
              <ColumnModal
                isOpen={isColumnModalOpen}
                onClose={toggleColumnModal}
                columns={columnsForModal}
                initialVisibility={columnVisibility}
                onVisibilityChange={handleVisibilityChange}
              />
            </div>

            <div className="col-sm-12 col-md-6 d-flex justify-content-end align-items-center gap-2">
              <SearchComponent
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
              />

              <button
                className="btn custom-btn"
                onClick={toggleSidebar}
                title="Filters"
              >
                <i className="bi bi-funnel custom-btn-icon"></i>
                Filters
              </button>
            </div>
          </div>

          <div
            className="p-3"
            ref={tableContainerRef}
            style={{ backgroundColor: "white", height: "78%" }}
          >
            <DataTable
              columns={visibleColumns.map((col) => ({
                ...col,
                width: columnWidths[col.id as string],
              }))}
              data={mockData}
              persistTableHead={true}
              responsive
              highlightOnHover
              customStyles={customStyles}
              sortIcon={sortIcon}
              onRowMouseEnter={(row) => handleMouseEnter(row.id)}
              onRowMouseLeave={handleMouseLeave}
            />
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
    </AnimatedRouteWrapper>
  );
};

const AssetsPageWrapper = () => {
  return <AssetsPage />;
};

export { AssetsPageWrapper };
