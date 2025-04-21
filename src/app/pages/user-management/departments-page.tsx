import { useEffect, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search";
import DataTable, { TableColumn } from "react-data-table-component";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { debounce } from "lodash";

import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import { DepartmentsType } from "../../types/user-management.ts";
import {
  DepartmentsColumnsTable,
  depsMockData,
} from "../../data/user-management.tsx";

const DepartmentsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<DepartmentsType>[]
  >([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const [tableData, setTableData] = useState<DepartmentsType[]>([
    {
      id: -1,
      name: "",
      location: "",
      members: 0,
      isInputRow: true,
    },
    ...depsMockData,
  ]);

  const [newRowInput, setNewRowInput] = useState<Partial<DepartmentsType>>({});
  const [isHoveringInputRow, setIsHoveringInputRow] = useState(false);

  const handleNewRowInputChange = (
    field: "name" | "location",
    value: string
  ) => {
    setNewRowInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewRow = () => {
    if (!newRowInput.name) return;

    const newdep: DepartmentsType = {
      id: Date.now(),
      name: newRowInput.name,
      location: newRowInput.location || "",
      members: 0,
    };

    const updatedData = [
      {
        id: -1,
        name: "",
        location: "",
        members: 0,
        isInputRow: true,
      },
      ...tableData.filter((row) => !row.isInputRow),
      newdep,
    ];

    setTableData(updatedData);
    setNewRowInput({});
  };

  const handleCancelAddRow = () => {
    setNewRowInput({});
  };

  const handleSearchChange = debounce((query: string) => {
    setSearchQuery(query);
  }, 100);

  const handleMouseEnter = (rowId: number) => {
    setHoveredRowId(rowId);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  useEffect(() => {
    setVisibleColumns(
      DepartmentsColumnsTable(
        hoveredRowId,
        newRowInput,
        handleNewRowInputChange,
        handleSaveNewRow,
        handleCancelAddRow,
        editingRowId !== null,
        isHoveringInputRow
      )
    );
  }, [hoveredRowId]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div className="d-flex flex-column col-12">
            <div ref={divRef} className="row">
              <div className="col-12 d-flex align-items-center justify-content-between mb-4 ms-2">
                <div className="d-flex justify-content-between gap-3">
                  <div className="symbol symbol-50px ">
                    <h2> 🏛️ Departments</h2>
                    <span className="text-muted fs-6">
                      Manage organizational departments
                    </span>
                  </div>
                </div>
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
                }}
              >
                <DataTable
                  columns={DepartmentsColumnsTable(
                    hoveredRowId,
                    newRowInput,
                    handleNewRowInputChange,
                    handleSaveNewRow,
                    handleCancelAddRow,
                    editingRowId !== null,
                    isHoveringInputRow
                  )}
                  data={tableData}
                  persistTableHead
                  responsive
                  highlightOnHover
                  conditionalRowStyles={[
                    {
                      when: (row: any) => row.isInputRow,
                      style: {
                        backgroundColor: "#eeeeee",
                        border: "none !important",
                      },
                    },
                  ]}
                  customStyles={customStyles}
                  sortIcon={sortIcon}
                  onRowMouseEnter={(row) => {
                    handleMouseEnter(row.id);
                    if (row.id === -1) setIsHoveringInputRow(true);
                  }}
                  onRowMouseLeave={(row) => {
                    handleMouseLeave();
                    if (row.id === -1) setIsHoveringInputRow(false);
                  }}
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
    </AnimatedRouteWrapper>
  );
};

const DepartmentsPageWrapper = () => {
  return <DepartmentsPage />;
};

export { DepartmentsPageWrapper };
