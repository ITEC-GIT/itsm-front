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

const AssetsPage = () => {
  const [currentHistorysPage, setCurrentHistoryPage] = useState<number>(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    range: "0-50",
    order: "desc",
  });

  const mockData = [
    {
      id: 1,
      name: "Device 1",
      entity: "Entity A",
      serial_number: "SN123456",
      model: "Model X",
      location: "New York",
      last_update: "2023-10-01",
      component_processor: "Intel i7",
      type: "Laptop",
      project: "Project Alpha",
      address: "123 Main St",
      inventory_number: "INV001",
      alternate_username_number: "AU001",
      action: "Active",
      status: "Online", // New property
      public_ip: "225.225.225.225", // New property
    },
    {
      id: 2,
      name: "Device 2",
      entity: "Entity B",
      serial_number: "SN654321",
      model: "Model Y",
      location: "San Francisco",
      last_update: "2023-09-25",
      component_processor: "AMD Ryzen 5",
      type: "Desktop",
      project: "Project Beta",
      address: "456 Elm St",
      inventory_number: "INV002",
      alternate_username_number: "AU002",
      action: "Inactive",
      status: "Offline", // New property
      public_ip: "192.168.1.2", // New property
    },
    {
      id: 3,
      name: "Device 3",
      entity: "Entity C",
      serial_number: "SN789012",
      model: "Model Z",
      location: "Chicago",
      last_update: "2023-10-05",
      component_processor: "Intel i5",
      type: "Tablet",
      project: "Project Gamma",
      address: "789 Oak St",
      inventory_number: "INV003",
      alternate_username_number: "AU003",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.3", // New property
    },
    {
      id: 4,
      name: "Device 4",
      entity: "Entity D",
      serial_number: "SN345678",
      model: "Model A",
      location: "Los Angeles",
      last_update: "2023-09-30",
      component_processor: "AMD Ryzen 7",
      type: "Server",
      project: "Project Delta",
      address: "101 Pine St",
      inventory_number: "INV004",
      alternate_username_number: "AU004",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.4", // New property
    },
    {
      id: 5,
      name: "Device 5",
      entity: "Entity E",
      serial_number: "SN901234",
      model: "Model B",
      location: "Houston",
      last_update: "2023-10-02",
      component_processor: "Intel i9",
      type: "Workstation",
      project: "Project Epsilon",
      address: "202 Maple St",
      inventory_number: "INV005",
      alternate_username_number: "AU005",
      action: "Inactive",
      status: "Offline", // New property
      public_ip: "192.168.1.5", // New property
    },
    {
      id: 6,
      name: "Device 6",
      entity: "Entity F",
      serial_number: "SN567890",
      model: "Model C",
      location: "Miami",
      last_update: "2023-09-28",
      component_processor: "AMD Ryzen 9",
      type: "Laptop",
      project: "Project Zeta",
      address: "303 Cedar St",
      inventory_number: "INV006",
      alternate_username_number: "AU006",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.6", // New property
    },
    {
      id: 7,
      name: "Device 7",
      entity: "Entity G",
      serial_number: "SN234567",
      model: "Model D",
      location: "Seattle",
      last_update: "2023-10-03",
      component_processor: "Intel i3",
      type: "Desktop",
      project: "Project Eta",
      address: "404 Birch St",
      inventory_number: "INV007",
      alternate_username_number: "AU007",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.7", // New property
    },
    {
      id: 8,
      name: "Device 8",
      entity: "Entity H",
      serial_number: "SN890123",
      model: "Model E",
      location: "Boston",
      last_update: "2023-09-27",
      component_processor: "AMD Ryzen 3",
      type: "Tablet",
      project: "Project Theta",
      address: "505 Walnut St",
      inventory_number: "INV008",
      alternate_username_number: "AU008",
      action: "Inactive",
      status: "Offline", // New property
      public_ip: "192.168.1.8", // New property
    },
    {
      id: 9,
      name: "Device 9",
      entity: "Entity I",
      serial_number: "SN456789",
      model: "Model F",
      location: "Dallas",
      last_update: "2023-10-04",
      component_processor: "Intel i7",
      type: "Server",
      project: "Project Iota",
      address: "606 Spruce St",
      inventory_number: "INV009",
      alternate_username_number: "AU009",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.9", // New property
    },
    {
      id: 10,
      name: "Device 10",
      entity: "Entity J",
      serial_number: "SN012345",
      model: "Model G",
      location: "Atlanta",
      last_update: "2023-09-29",
      component_processor: "AMD Ryzen 5",
      type: "Workstation",
      project: "Project Kappa",
      address: "707 Fir St",
      inventory_number: "INV010",
      alternate_username_number: "AU010",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.10", // New property
    },
    {
      id: 11,
      name: "Device 11",
      entity: "Entity K",
      serial_number: "SN678901",
      model: "Model H",
      location: "Denver",
      last_update: "2023-10-06",
      component_processor: "Intel i5",
      type: "Laptop",
      project: "Project Lambda",
      address: "808 Pine St",
      inventory_number: "INV011",
      alternate_username_number: "AU011",
      action: "Inactive",
      status: "Offline", // New property
      public_ip: "192.168.1.11", // New property
    },
    {
      id: 12,
      name: "Device 12",
      entity: "Entity L",
      serial_number: "SN345678",
      model: "Model I",
      location: "Phoenix",
      last_update: "2023-09-26",
      component_processor: "AMD Ryzen 7",
      type: "Desktop",
      project: "Project Mu",
      address: "909 Oak St",
      inventory_number: "INV012",
      alternate_username_number: "AU012",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.12", // New property
    },
    {
      id: 13,
      name: "Device 13",
      entity: "Entity M",
      serial_number: "SN901234",
      model: "Model J",
      location: "Philadelphia",
      last_update: "2023-10-07",
      component_processor: "AMD Ryzen 7",
      type: "Desktop",
      project: "Project Mu",
      address: "909 Oak St",
      inventory_number: "INV012",
      alternate_username_number: "AU012",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.13", // New property
    },
    {
      id: 14,
      name: "Device 13",
      entity: "Entity M",
      serial_number: "SN901234",
      model: "Model J",
      location: "Philadelphia",
      last_update: "2023-10-07",
      component_processor: "AMD Ryzen 7",
      type: "Desktop",
      project: "Project Mu",
      address: "909 Oak St",
      inventory_number: "INV012",
      alternate_username_number: "AU012",
      action: "Active",
      status: "Online", // New property
      public_ip: "192.168.1.14", // New property
    },
  ];

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

  const activeFilters = [
    "softwareStatusFilter",
    "userFilter",
    "computersFilter",
    "dateFilter",
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toggleInstance] = useAtom(sidebarToggleAtom);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const toggleColumnModal = () => {
    setIsColumnModalOpen(!isColumnModalOpen);
    toggleColumnModal();
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
  const columnXLargeWidth = "150px";
  const columnLargeWidth = "120px";
  const columnMediumWidth = "100px";
  const columnSmallWidth = "50px";
  const columns: TableColumn<AssetsHistoryType>[] = [
    {
      name: "#",
      sortable: false,
      width: columnSmallWidth,
      cell: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.id.toString()}
        >
          {row.id}
        </span>
      ),
      id: "id",
    },
    {
      name: "Device",
      selector: (row) => row.name,
      sortable: true,
      width: columnLargeWidth,
      cell: (row) => (
        <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.name}>
          {row.name}
        </span>
      ),
      id: "name",
    },
    {
      name: "Status",
      width: columnMediumWidth,
      selector: (row) => row.status,
      sortable: true,
      id: "status",
      cell: (row) => {
        const isOnline = row.status.toLowerCase() === "online";
        // const lightGreen = "#98FB98";
        const lightBlue = "#bbdefb";
        // const lightRed = "#f08080";
        const lightGray = "#e0e0e0";
        const backgroundColor = isOnline ? lightBlue : lightGray;
        const textColor = "#333";
        const fontWeight = "bold";
        return (
          <span
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              fontWeight: fontWeight,
              padding: "5px",
              borderRadius: "3px",
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Public IP",
      width: columnLargeWidth,
      selector: (row) => row.public_ip,
      sortable: true,
      id: "public_ip",
    },
    {
      name: "Entity",
      selector: (row) => row.entity,
      width: columnMediumWidth,
      cell: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.entity}
        >
          {row.entity}
        </span>
      ),
      sortable: true,
      id: "entity",
    },
    {
      name: "serial number",
      width: columnXLargeWidth,
      selector: (row) => row.serial_number,
      sortable: true,
      cell: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.serial_number}
          className="url-cell"
        >
          {row.serial_number}
        </span>
      ),
      id: "serial_number",
    },
    {
      name: "model",
      width: columnLargeWidth,
      selector: (row) => row.model,
      sortable: true,
      cell: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.model}
        >
          {row.model}
        </span>
      ),
      id: "model",
    },
    {
      name: "location",
      width: columnLargeWidth,
      selector: (row) => row.location,
      sortable: true,
      cell: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.location}
        >
          {row.location}
        </span>
      ),
      id: "location",
    },
    {
      name: "component processor",
      width: columnXLargeWidth,
      selector: (row) => row.component_processor,
      sortable: true,
      id: "component_processor",
    },
    {
      name: "last update",
      width: columnXLargeWidth,
      selector: (row) => {
        const date = new Date(row.last_update);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
      },
      sortable: true,
      id: "last_update",
    },
    {
      name: "type",
      width: columnLargeWidth,
      selector: (row) => row.type,
      sortable: true,
      id: "type",
    },
    {
      name: "project",
      width: columnXLargeWidth,
      selector: (row) => row.project,
      sortable: true,
      id: "project",
    },
    {
      name: "Address",
      width: columnXLargeWidth,
      selector: (row) => row.address,
      sortable: true,
      id: "address",
    },
    {
      name: "Inventory NB",
      width: columnXLargeWidth,
      selector: (row) => row.inventory_number,
      sortable: true,
      id: "inventory_number",
    },
    {
      name: "alternate username_number",
      width: columnXLargeWidth,
      selector: (row) => row.alternate_username_number,
      sortable: true,
      id: "alternate_username_number",
    },
    {
      name: "Action",
      width: columnMediumWidth,
      selector: (row) => row.action,
      sortable: true,
      id: "action",
    },
  ];

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
        <div className="d-flex justify-content-between gap-3 p-3 rounded shadow-sm bg-white">
          <div className="btn-group">
            <button className="action-btn btn btn-outline-primary rounded-pill hover-scale">
              <i className="bi bi-cloud-download me-1"></i> Download
            </button>
            <button
              className={`action-btn btn rounded-pill hover-scale ${
                isColumnModalOpen
                  ? "bg-primary text-white"
                  : "btn-outline-primary"
              }`}
              onClick={toggleColumnModal}
            >
              <i
                className={`bi bi-layout-split me-1 ${
                  isColumnModalOpen ? "text-white" : "text-dark"
                }`}
              ></i>
              Columns
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
        {/* <div className="pagination-controls d-flex justify-content-end mt-3 mb-3">
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
