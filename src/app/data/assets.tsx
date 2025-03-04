import { useState } from "react";
import { AssetsHistoryType } from "../types/assetsTypes";
import { TableColumn } from "react-data-table-component";
import { Link } from "react-router-dom";

const columnXLargeWidth = "150px";
const columnLargeWidth = "120px";
const columnMediumWidth = "100px";
const columnSmallWidth = "50px";

export const columns: TableColumn<AssetsHistoryType>[] = [
  {
    name: "#",
    sortable: false,
    width: columnSmallWidth,
    cell: (row: AssetsHistoryType) => (
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
    selector: (row: AssetsHistoryType) => row.name,
    sortable: true,
    width: columnLargeWidth,
    cell: (row: AssetsHistoryType) => (
      <Link
        to={`/assets/${row.id}`}
        title={row.name}
        style={{ color: "blue", textDecoration: "none" }}
      >
        {row.name}
      </Link>
    ),
    id: "name",
  },
  {
    name: "Status",
    width: columnMediumWidth,
    selector: (row: AssetsHistoryType) => row.status,
    sortable: true,
    id: "status",
    cell: (row: AssetsHistoryType) => {
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
    selector: (row: AssetsHistoryType) => row.public_ip,
    sortable: true,
    id: "public_ip",
  },
  {
    name: "Entity",
    selector: (row: AssetsHistoryType) => row.entity,
    width: columnMediumWidth,
    cell: (row: AssetsHistoryType) => (
      <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.entity}>
        {row.entity}
      </span>
    ),
    sortable: true,
    id: "entity",
  },
  {
    name: "serial number",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.serial_number,
    sortable: true,
    cell: (row: AssetsHistoryType) => (
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
    selector: (row: AssetsHistoryType) => row.model,
    sortable: true,
    cell: (row: AssetsHistoryType) => (
      <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.model}>
        {row.model}
      </span>
    ),
    id: "model",
  },
  {
    name: "location",
    width: columnLargeWidth,
    selector: (row: AssetsHistoryType) => row.location,
    sortable: true,
    cell: (row: AssetsHistoryType) => (
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
    selector: (row: AssetsHistoryType) => row.component_processor,
    sortable: true,
    id: "component_processor",
  },
  {
    name: "last update",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => {
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
    selector: (row: AssetsHistoryType) => row.type,
    sortable: true,
    id: "type",
  },
  {
    name: "project",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.project,
    sortable: true,
    id: "project",
  },
  {
    name: "Address",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.address,
    sortable: true,
    id: "address",
  },
  {
    name: "Inventory NB",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.inventory_number,
    sortable: true,
    id: "inventory_number",
  },
  {
    name: "alternate username_number",
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.alternate_username_number,
    sortable: true,
    id: "alternate_username_number",
  },
  {
    name: "Action",
    width: columnMediumWidth,
    cell: (row: AssetsHistoryType) => {
      const [showDeleteModal, setShowDeleteModal] = useState(false);

      const handleDeleteClick = () => {
        setShowDeleteModal(true);
      };

      const confirmDelete = () => {
        console.log("Deleting row:", row);
        setShowDeleteModal(false);
      };

      const cancelDelete = () => {
        setShowDeleteModal(false);
      };

      return (
        <div className="d-flex align-items-start">
          <button
            className="table-btn-action"
            onClick={() => {
              console.log("Edit clicked for row:", row);
            }}
          >
            <i
              className="bi bi-pencil-square fs-2"
              style={{ color: "blue" }}
            ></i>
          </button>
          <button className="table-btn-action" onClick={handleDeleteClick}>
            <i className="bi bi-trash fs-2 text-danger"></i>
          </button>

          {showDeleteModal && (
            <div
              className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
              tabIndex={-1}
              role="dialog"
              aria-hidden={!showDeleteModal}
              style={{
                background: showDeleteModal ? "rgba(0,0,0,0.5)" : "transparent",
                width: "100%",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-5">
                  <div className="d-flex justify-content-start align-items-center mb-5">
                    <div
                      style={{
                        backgroundColor: "#FF9800",
                        borderRadius: "50%",
                        padding: "10px",
                        marginRight: "15px",
                      }}
                    >
                      <i
                        className="bi bi-exclamation"
                        style={{ color: "white", fontSize: "3rem" }}
                      ></i>
                    </div>
                    <div className="d-flex flex-column">
                      <h3>Delete assets</h3>
                      <p>
                        Are you sure you want to delete the selected assets?
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-5">
                    <button
                      onClick={cancelDelete}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        padding: "8px 15px",
                        cursor: "pointer",
                        marginRight: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        fontSize: "1rem",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    },

    sortable: false,
    id: "action",
  },
];

export const activeFilters = [
  "softwareStatusFilter",
  "userFilter",
  "computersFilter",
  "dateFilter",
];

export const mockData = [
  // {
  //   id: 6,
  //   name: "Device 6",
  //   entity: "Entity F",
  //   serial_number: "SN567890",
  //   model: "Model C",
  //   location: "Miami",
  //   last_update: "2023-09-28",
  //   component_processor: "AMD Ryzen 9",
  //   type: "Laptop",
  //   project: "Project Zeta",
  //   address: "303 Cedar St",
  //   inventory_number: "INV006",
  //   alternate_username_number: "AU006",
  //   action: "Active",
  //   status: "Online", // New property
  //   public_ip: "192.168.1.6", // New property
  // },
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

export const AppButtons = [
  { id: 1, text: "Windows Service", icon: "bi-gear" },
  { id: 2, text: "All Processes", icon: "bi-list" },
  { id: 3, text: "Software", icon: "bi-window" },
  { id: 4, text: "Managed Software", icon: "bi-code-slash" },
  { id: 5, text: "Registry Editor", icon: "bi-box" },
  { id: 6, text: "File Explorer", icon: "bi-folder" },
];

export const PoliciesButtons = [
  { id: 1, text: "Antivirus", icon: "bi-shield-x" },
  { id: 2, text: "Software Management", icon: "bi-folder" },
  { id: 3, text: "Remote Desktop", icon: "bi-window" },
];

export const DetailsButtons = [
  { id: 1, text: "CPU", icon: "bi bi-cpu" },
  { id: 2, text: "Memory", icon: "bi bi-memory" },
  { id: 3, text: "Disk volume", icon: "bi bi-hdd-stack" },
  { id: 4, text: "Open ports", icon: "bi bi-box-seam" },
  { id: 5, text: "User log", icon: "bi bi-person-lines-fill" },
  { id: 6, text: "Event log", icon: "bi bi-calendar-event" },
  { id: 7, text: "Network adapters", icon: "bi bi-ethernet" },
  { id: 8, text: "Hardware & misc", icon: "bi bi-gear" },
  { id: 9, text: "Video card", icon: "bi bi-display" },
  { id: 10, text: "Sound card", icon: "bi bi-speaker" },
];

export const AssetCategoryFields = {
  computer: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19, 29],
  mouse: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19, 29],
  printer: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19, 29],
};

export const AssetFields = [
  { id: 1, key: "name", type: "input", label: "Name" },
  { id: 2, key: "location", type: "select", label: "Location" },
  {
    id: 3,
    key: "technicianInCharge",
    type: "select",
    label: "Technician in charge",
  },
  { id: 4, key: "groupInCharge", type: "select", label: "Group in charge" },
  {
    id: 5,
    key: "alternateUsernameNumber",
    type: "input",
    label: "Alternate username number",
  },
  {
    id: 6,
    key: "alternateUsername",
    type: "input",
    label: "Alternate username",
  },
  { id: 7, key: "serialNumber", type: "input", label: "Serial number" },
  { id: 8, key: "inventoryNumber", type: "input", label: "Inventory number" },
  { id: 9, key: "brand", type: "input", label: "Brand" },
  { id: 10, key: "user", type: "select", label: "User" },
  { id: 11, key: "group", type: "select", label: "Group" },
  { id: 12, key: "comments", type: "textarea", label: "Comments" },
  { id: 13, key: "status", type: "select", label: "Status" },
  { id: 14, key: "managementType", type: "select", label: "Management type" },
  { id: 15, key: "uuid", type: "input", label: "UUID" },
  { id: 16, key: "snmpCredential", type: "select", label: "SNMP credential" },
  { id: 17, key: "manufacturer", type: "select", label: "Manufacturer" },
  { id: 18, key: "sysdescr", type: "input", label: "Sysdescr" },
  { id: 19, key: "network", type: "select", label: "Network" },
  { id: 20, key: "memory", type: "number", label: "Memory" },
  {
    id: 21,
    key: "initialPageCounter",
    type: "number",
    label: "Initial page counter",
  },
  {
    id: 22,
    key: "currentPageCounter",
    type: "number",
    label: "Current counter of pages",
  },
  { id: 23, key: "numberOfLines", type: "number", label: "Number of lines" },
  {
    id: 24,
    key: "phonePowerSupplyType",
    type: "select",
    label: "Phone power supply type",
  },
  { id: 25, key: "pictures", type: "upload", label: "Pictures" },
  { id: 26, key: "stockTarget", type: "number", label: "Stock target" },
  { id: 27, key: "alertThreshold", type: "number", label: "Alert threshold" },
  { id: 28, key: "reference", type: "input", label: "Reference" },
  { id: 29, key: "computer-model", type: "select", label: "Model" },
  { id: 30, key: "computer-type", type: "select", label: "Type" },
];
