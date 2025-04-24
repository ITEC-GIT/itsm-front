import { useEffect, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search.tsx";
import DataTable, { TableColumn } from "react-data-table-component";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { debounce } from "lodash";
import {
  UsersColumnsTable,
  usersMockData,
} from "../../data/user-management.tsx";
import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import { UsersType } from "../../types/user-management.ts";
import { UserCreationModal } from "../../components/user-management/create-user-model.tsx";

const UsersPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<UsersType>[]
  >([]);

  const handleSearchChange = debounce((query: string) => {
    setSearchQuery(query);
  }, 100);

  const handleMouseEnter = (rowId: number) => {
    setHoveredRowId(rowId);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
  };

  const toggleModelCreation = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  useEffect(() => {
    setVisibleColumns(UsersColumnsTable(hoveredRowId));
  }, [hoveredRowId]);

  useEffect(() => {
    const calculateWidths = () => {
      const columnsWithoutAction = visibleColumns.filter(
        (col) => col.id !== "action" && col.id !== "id"
      );
      const visibleCount = visibleColumns.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        columnsWithoutAction.forEach((col: TableColumn<UsersType>) => {
          newWidths[col.id as string] = "50%";
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;

          columnsWithoutAction.forEach((col: TableColumn<UsersType>) => {
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
  }, [visibleColumns]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div className="d-flex flex-column col-12">
            <div ref={divRef} className="row">
              <div className="col-12 d-flex align-items-center justify-content-between mb-4 ms-2">
                <div className="d-flex justify-content-between gap-3">
                  <div className="symbol symbol-50px ">
                    <h2>👥 Users</h2>
                    <span className="text-muted fs-6">
                      Create and manage users
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end mb-3">
                <button
                  onClick={toggleModelCreation}
                  className="btn btn-gradient-add d-flex align-items-center gap-2 px-4 py-2"
                >
                  <i className="bi bi-plus fs-1 text-white"></i>
                  <span className="d-none d-sm-inline">Add New User</span>
                </button>
              </div>

              <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                <SearchComponent
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSearchChange(e.target.value)
                  }
                />
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
                <DataTable
                  columns={visibleColumns.map((col) => ({
                    ...col,
                    width: columnWidths[col.id as string],
                  }))}
                  data={usersMockData}
                  persistTableHead={true}
                  responsive
                  highlightOnHover
                  customStyles={customStyles}
                  sortIcon={sortIcon}
                  onRowMouseEnter={(row) => handleMouseEnter(row.id)}
                  onRowMouseLeave={handleMouseLeave}
                  fixedHeader
                  fixedHeaderScrollHeight={`calc(100vh - var(--bs-app-header-height) - ${height}px - 100px)`}
                />
              </div>
            </div>

            {/* <div className="sticky-pagination d-flex justify-content-end align-items-center">
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
            </div> */}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UserCreationModal
          show={isModalOpen}
          onClose={toggleModelCreation}
          onSave={toggleModelCreation}
        />
      )}
    </AnimatedRouteWrapper>
  );
};

const UsersPageWrapper = () => {
  return <UsersPage />;
};

export { UsersPageWrapper };
