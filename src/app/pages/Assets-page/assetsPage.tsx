import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  AssetsHistoryType,
  GetAllAssetsRequestType as FilterType,
} from "../../types/assetsTypes";
import { customStyles, sortIcon } from "../../data/dataTable";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters";
import { ColumnVisibility } from "../../types/common";
import ColumnsModal from "../../components/modal/columns";
import { activeFilters, getColumns } from "../../data/assets";
import { useNavigate } from "react-router-dom";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { GetAssets } from "../../config/ApiCalls.ts";

const AssetsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const btnRef = useRef<HTMLButtonElement>(null);

  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    order: "desc",
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    settings: true,
    icon: true,
    name: true,
    serial_number: true,
    category: true,
    manufacturer: true,
    model: true,
    type: true,
    action: true,
    description: false,
    caption: false,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);

  const [assetsData, setAssetsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleColumnModal = () => {
    setIsColumnModalOpen((prevState) => !prevState);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleAddAssetModal = () => {
    setIsColumnModalOpen(false);
    navigate("/assets/new");
  };

  const handleSearchChange = debounce((query: string) => {
    //  setCurrentHistoryPage(1);
    setSearchQuery(query);
  }, 100);

  const handleVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<AssetsHistoryType>[]
  >([]);

  const memoizedColumns = useMemo(() => {
    return getColumns();
  }, []);

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

  const columnsForModal = useMemo(
    () => memoizedColumns.filter((col) => col.id !== "action"),
    [memoizedColumns]
  );

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await GetAssets(filters);
        setAssetsData(data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load assets data");
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [filters, searchQuery]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div
            className={`d-flex flex-column ${
              isSidebarOpen ? "col-9" : "col-12"
            }`}
          >
            <div ref={divRef}>
              <div className="d-flex mb-3 ms-2">
                <h2>🛠️ Assets</h2>
              </div>

              <div className="row justify-content-between p-3">
                <div className="col-sm-12 col-md-6 d-flex align-items-center gap-2">
                  <button className="btn custom-btn">
                    <i className="bi bi-cloud-download text-dark custom-btn-icon"></i>
                    <span className="custom-btn-text">Download</span>
                  </button>
                  <button
                    ref={btnRef}
                    className="btn custom-btn"
                    onClick={toggleColumnModal}
                  >
                    <i className="bi bi-layout-split text-dark custom-btn-icon"></i>
                    <span className="custom-btn-text">Columns</span>
                  </button>
                  <ColumnsModal
                    isOpen={isColumnModalOpen}
                    onClose={toggleColumnModal}
                    columns={columnsForModal}
                    initialVisibility={columnVisibility}
                    onVisibilityChange={handleVisibilityChange}
                    buttonRef={btnRef}
                  />
                  <button
                    className="btn custom-btn"
                    onClick={toggleAddAssetModal}
                  >
                    <i className="bi bi-plus-square text-dark custom-btn-icon"></i>
                    <span className="custom-btn-text">Asset</span>
                  </button>
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
            </div>

            <div
              style={{
                height: `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px - 40px)`,
                overflow: "hidden",
              }}
            >
              <div
                className="p-3"
                ref={tableContainerRef}
                style={{
                  flex: 1,
                  // overflow: "auto",
                }}
              >
                {/* <DataTable
                  columns={visibleColumns.map((col) => ({
                    ...col,
                    width: columnWidths[col.id as string],
                  }))}
                  data={assetsData}
                  persistTableHead={true}
                  responsive
                  highlightOnHover
                  customStyles={customStyles}
                  sortIcon={sortIcon}
                  fixedHeader
                  fixedHeaderScrollHeight={`calc(100vh - var(--bs-app-header-height) - ${height}px - 100px)`}
                /> */}
              </div>
            </div>

            <div className="sticky-pagination d-flex justify-content-end align-items-center">
              <button
                className="btn btn-sm btn-light me-2"
                // onClick={handleFirstPage}
                disabled={currentHistorysPage === 1}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-light me-2"
                // onClick={handlePreviousPage}
                disabled={currentHistorysPage === 1}
              >
                Previous
              </button>
              {/* {Array.from(
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
              ))} */}
              <button
                className="btn btn-sm btn-light me-2"
                // onClick={handleNextPage}
                // disabled={currentHistorysPage === totalPages}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-light"
                // onClick={handleLastPage}
                // disabled={currentHistorysPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>

          {isSidebarOpen && (
            <div
              className="col-3 custom-border p-0"
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
                  filtersStoreName={"assetsFilters"}
                  initialFilters={{}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

const AssetsPageWrapper = () => {
  return <AssetsPage />;
};

export { AssetsPageWrapper };
