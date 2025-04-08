import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  AssetsHistoryType,
  GetAllAssetsRequestType as FilterType,
} from "../../types/assetsTypes";
import { customStyles, sortIcon } from "../../data/dataTable";
import { debounce } from "lodash";
import { ColumnVisibility } from "../../types/common";
import ColumnsModal from "../../components/modal/columns";
import { activeFilters, getColumns } from "../../data/assets";
import { useNavigate } from "react-router-dom";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { GetAssets } from "../../config/ApiCalls.ts";
import { CircularSpinner } from "../../components/spinners/circularSpinner.tsx";
import { FilterSidebarMulti } from "../../components/form/filtersWithMulti.tsx";
import { FilterButton } from "../../components/form/filterButton.tsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { capitalize } from "../../../utils/custom.ts";
import { exportToExcel } from "../../../utils/excel.ts";

interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
}
const AssetsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const btnRef = useRef<HTMLButtonElement>(null);

  const [assetsData, setAssetsData] = useState<any[]>([]);
  const [assetsDataPro, setAssetsDataPro] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    const processedAssetsData = assetsData.map((item) => ({
      ...item,
      uniqueKey: item.hash ? `${item.hash}-${item.id}` : `id-${item.id}`,
    }));
    setAssetsDataPro(processedAssetsData);
  }, [assetsData]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return assetsDataPro || [];
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
    return assetsDataPro.filter((entry: AssetsHistoryType) => {
      return keywords.every(
        (keyword) =>
          entry.category?.name.toLowerCase().includes(keyword) ||
          entry.name?.toLowerCase().includes(keyword) ||
          entry.type?.toLowerCase().includes(keyword) ||
          entry.model?.toLowerCase().includes(keyword) ||
          entry.manufacturer?.toLowerCase().includes(keyword) ||
          entry.serial_number?.toString().toLowerCase().includes(keyword)
      );
    });
  }, [assetsDataPro, searchQuery]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    settings: true,
    name: true,
    serial_number: true,
    category: true,
    manufacturer: true,
    model: true,
    type: true,
    computer: true,
    date_mod: true,
  });

  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<AssetsHistoryType>[]
  >([]);

  const [widthsCalculated, setWidthsCalculated] = useState(false);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      visiblePages.push(1);
      if (startPage > 2) {
        visiblePages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        visiblePages.push("...");
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

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
    setCurrentPage(1);
    setSearchQuery(query);
  }, 100);

  const handleVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };

  const handleDownload = () => {
    const transformedData = filteredData.map((item) => ({
      ...item,
      categoryName: item.category?.name ? capitalize(item.category.name) : "",
      computerName: item.computer?.name || "",
      formattedDate: item.date_mode
        ? new Date(item.date_mode).toLocaleDateString("en-GB")
        : "",
    }));

    const exportColumns: ExcelColumn[] = [
      { key: "name", header: "Asset Name", width: 40 },
      { key: "serial_number", header: "Serial Number", width: 30 },
      { key: "categoryName", header: "Category", width: 40 },
      { key: "manufacturer", header: "Manufacturer", width: 40 },
      { key: "model", header: "Model", width: 30 },
      { key: "type", header: "Type", width: 30 },
      { key: "formattedDate", header: "Modified Date", width: 20 },
      { key: "computerName", header: "Parent Asset", width: 40 },
    ];

    exportToExcel(transformedData, exportColumns, "Assets");
  };

  const memoizedColumns = useMemo(() => {
    return getColumns(setFilters);
  }, []);

  useEffect(() => {
    const filteredColumns = memoizedColumns.filter(
      (col) => columnVisibility[col.id as string]
    );
    setVisibleColumns(filteredColumns);
  }, [columnVisibility, memoizedColumns]);

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
      setWidthsCalculated(true);
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
  }, [visibleColumns, tableContainerRef.current, isSidebarOpen]);

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
    const mapFilters = (currentFilters: any) => {
      const mappedFilters: any = {};
      console.log("currentFilters ==>>", currentFilters);
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "category") {
          mappedFilters["asset_type"] = Array.isArray(value)
            ? value.map((item) => item)
            : [value];
        } else if (key === "computer") {
          mappedFilters["computer_id"] = Array.isArray(value)
            ? value.map((item) => item)
            : [value];
        } else {
          mappedFilters[key] = value;
        }
      });

      return mappedFilters;
    };

    const fetchAssets = async () => {
      try {
        setLoading(true);

        const mappedFilters = mapFilters(filters);

        const data = await GetAssets(mappedFilters);
        if (data.status === 200) {
          setAssetsData(data.data.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load assets data");
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [filters]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div
            className={`cont-d-flex-column ${
              isSidebarOpen ? "cont-custom-hide col-9" : "col-12"
            }`}
          >
            <div ref={divRef}>
              <div className="d-flex mb-3 ms-2">
                <h2>🛠️ Assets</h2>
              </div>

              <div className="row justify-content-between p-3">
                <div className="col-sm-12 col-md-6 d-flex align-items-center gap-2">
                  <button className="btn custom-btn" onClick={handleDownload}>
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
                  {/* <button
                    className="btn custom-btn"
                    onClick={toggleAddAssetModal}
                  >
                    <i className="bi bi-plus-square text-dark custom-btn-icon"></i>
                    <span className="custom-btn-text">Asset</span>
                  </button> */}
                </div>

                <div className="col-sm-12 col-md-6 d-flex justify-content-end align-items-center gap-2">
                  <SearchComponent
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />

                  <FilterButton toggleSidebar={toggleSidebar} />
                </div>
              </div>
            </div>
            <div
              style={{
                height: `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px - 40px)`,
                overflow: "hidden",
              }}
            >
              {loading ? (
                <div className="h-100 d-flex align-items-center justify-content-center my-4">
                  <CircularSpinner />
                </div>
              ) : (
                <div
                  className="p-3"
                  ref={tableContainerRef}
                  style={{
                    flex: 1,
                    // overflow: "auto",
                  }}
                >
                  <DataTable
                    columns={visibleColumns.map((col) => ({
                      ...col,
                      width: columnWidths[col.id as string],
                    }))}
                    data={currentItems}
                    keyField="uniqueKey"
                    persistTableHead
                    responsive
                    highlightOnHover
                    customStyles={customStyles}
                    sortIcon={sortIcon}
                    fixedHeader
                    fixedHeaderScrollHeight={`calc(100vh - var(--bs-app-header-height) - ${height}px - 100px)`}
                  />
                </div>
              )}
            </div>

            <div className="sticky-pagination d-flex justify-content-end align-items-center">
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleFirstPage}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getVisiblePages().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={page}
                    className={`btn btn-sm me-2 ${
                      currentPage === page ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="mx-1">
                    ...
                  </span>
                )
              )}

              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={handleLastPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Last
              </button>
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
                <FilterSidebarMulti
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  activeFilters={activeFilters}
                  filters={filters}
                  saveFilters={setFilters}
                  filtersStoreName={"assetsFilters"}
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
