import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles, sortIcon } from "../../data/dataTable";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters";
import { ColumnVisibility } from "../../types/common";
import clsx from "clsx";
import { activeFilters, getAssetSoftwaresColumns } from "../../data/assets";
import {
  AssetSoftwaresType,
  GetAssetSoftwaresType,
} from "../../types/assetsTypes.ts";
import { GetAssetSoftwares } from "../../config/ApiCalls.ts";

const AssetSoftwaresComponent = ({ computerId }: { computerId: number }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [assetSoftwaresData, setAssetSoftwaresData] = useState<any[]>([]);
  const [assetSoftwaresDataPro, setAssetSoftwaresDataPro] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    const processedAssetsData = assetSoftwaresData.map((item) => ({
      ...item,
      uniqueKey: item.hash ? `${item.hash}-${item.id}` : `id-${item.id}`,
    }));
    setAssetSoftwaresDataPro(processedAssetsData);
  }, [assetSoftwaresData]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return assetSoftwaresDataPro || [];
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
    return assetSoftwaresDataPro.filter((entry: AssetSoftwaresType) => {
      return keywords.every(
        (keyword) =>
          entry.name?.toLowerCase().includes(keyword) ||
          entry.version?.toLowerCase().includes(keyword) ||
          entry.architecture?.toLowerCase().includes(keyword) ||
          entry.category?.toLowerCase().includes(keyword)
      );
    });
  }, [assetSoftwaresDataPro, searchQuery]);

  const minPagesToShow = 3;
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<GetAssetSoftwaresType>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    category: true,
    version: true,
    arch: true,
    install_date: true,
    action: true,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<AssetSoftwaresType>[]
  >([]);

  const startPage =
    Math.floor((currentHistorysPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

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

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleSearchChange = debounce((query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  }, 100);

  const [hoveredHash, setHoveredHash] = useState<string | null>(null);
  const memoizedColumns = useMemo(() => {
    return getAssetSoftwaresColumns(hoveredHash);
  }, [hoveredHash]);

  useEffect(() => {
    const filteredColumns = memoizedColumns.filter(
      (col) => columnVisibility[col.id as string]
    );
    setVisibleColumns(filteredColumns);
  }, [columnVisibility, memoizedColumns]);

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
        (col) => col.id !== "action"
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
  }, [visibleColumns, tableContainerRef.current, isSidebarOpen]);

  const handleMouseEnter = (rowHash: string) => {
    setHoveredHash(rowHash);
  };

  const handleMouseLeave = () => {
    setHoveredHash(null);
  };

  useEffect(() => {
    const mapFilters = (currentFilters: any) => {
      const mappedFilters: any = {};
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

        const data = await GetAssetSoftwares(computerId);
        if (data.status === 200) {
          setAssetSoftwaresData(data.data.data);
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

  const parentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const [serachHeight, setSerachHeight] = useState(0);

  useEffect(() => {
    if (!parentRef.current || !searchRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === parentRef.current) {
          setHeight(Math.round(entry.contentRect.height));
        }
        if (entry.target === searchRef.current) {
          setSerachHeight(Math.round(entry.contentRect.height));
        }
      }
    });

    observer.observe(parentRef.current);
    observer.observe(searchRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className="row none-scroll-width h-100"
      style={{ paddingTop: "5px" }}
    >
      <div
        ref={searchRef}
        className="col-12 d-flex justify-content-end align-items-center gap-2"
      >
        <SearchComponent value={searchQuery} onChange={handleSearchChange} />

        <button
          className="btn custom-btn"
          onClick={toggleSidebar}
          title="Filters"
        >
          <i className="bi bi-funnel custom-btn-icon"></i>
          Filters
        </button>
      </div>

      <div
        style={{
          height: `calc(${height}px - 40px - ${serachHeight}px)`,
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
          <DataTable
            columns={visibleColumns.map((col) => ({
              ...col,
              width: columnWidths[col.id as string],
            }))}
            data={currentItems}
            persistTableHead={true}
            responsive
            keyField="uniqueKey"
            highlightOnHover
            customStyles={customStyles}
            sortIcon={sortIcon}
            onRowMouseEnter={(row) => handleMouseEnter(row.hash)}
            onRowMouseLeave={handleMouseLeave}
            fixedHeader
            fixedHeaderScrollHeight={`calc(${height}px - ${serachHeight}px - 40px)`}
          />
        </div>
      </div>

      <div className="sticky-pagination d-flex justify-content-end align-items-center">
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { AssetSoftwaresComponent };
