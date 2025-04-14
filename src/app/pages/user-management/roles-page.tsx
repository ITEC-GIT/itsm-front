import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { debounce } from "lodash";
import { FilterSidebar } from "../../components/form/filters.tsx";
import {
  RolesActiveFilters,
  RolesColumnsTable,
  rolesMockData,
} from "../../data/user-management.tsx";
import { ColumnVisibility, FilterType } from "../../types/common.ts";
import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import { KTIcon } from "../../../_metronic/helpers/index.ts";
import { RoleCreationWizardModal } from "../../components/user-management/create-role-model.tsx";

const RolesPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<RolesType>[]
  >([]);
  const [filters, setFilters] = useState<FilterType>({
    order: "desc",
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    permissions: true,
    supervisedBy: true,
    users: true,
    action: true,
  });

  const handleSearchChange = debounce((query: string) => {
    setSearchQuery(query);
  }, 100);

  const handleMouseEnter = (rowId: number) => {
    setHoveredRowId(rowId);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
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
    setVisibleColumns(RolesColumnsTable(hoveredRowId));
  }, [hoveredRowId]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div
            className={`d-flex flex-column ${
              isSidebarOpen ? "col-9" : "col-12"
            }`}
          >
            <div ref={divRef} className="row">
              <div className="col-12 d-flex align-items-center justify-content-between mb-4 ms-2">
                <div className="d-flex justify-content-between gap-3">
                  <div className="symbol symbol-50px ">
                    <h2>🗝️ Role Management</h2>
                    <span className="text-muted fs-6">
                      Create and manage user roles and permissions
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
                  <span className="d-none d-sm-inline">Add New Role</span>
                </button>
              </div>

              <div className="col-12 d-flex justify-content-end align-items-center gap-2">
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
                  columns={visibleColumns}
                  data={rolesMockData}
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
                  activeFilters={RolesActiveFilters}
                  saveFilters={setFilters}
                  filtersStoreName={"assetsFilters"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <RoleCreationWizardModal
          show={isModalOpen}
          onClose={toggleModelCreation}
          onSave={(data) => {
            console.log("Created Role:", data);
            toggleModelCreation();
          }}
        />
      )}
    </AnimatedRouteWrapper>
  );
};

const RolesPageWrapper = () => {
  return <RolesPage />;
};

export { RolesPageWrapper };
