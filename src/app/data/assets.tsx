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

export const AssetFields = [
  {
    id: 1,
    key: "name",
    type: "input",
    label: "Name",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 2,
    key: "location",
    type: "select",
    label: "Location",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 3,
    key: "technicianInCharge",
    type: "select",
    label: "Technician in charge",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 4,
    key: "groupInCharge",
    type: "select",
    label: "Group in charge",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 5,
    key: "alternateUsernameNumber",
    type: "input",
    label: "Alternate username number",
    category: ["Computer", "Network device", "Devices", "Printer", "Phone"],
    group: "Ownership",
  },
  {
    id: 6,
    key: "alternateUsername",
    type: "input",
    label: "Alternate username",
    category: ["Computer", "Network device", "Devices", "Printer", "Phone"],
    group: "Ownership",
  },
  {
    id: 7,
    key: "serialNumber",
    type: "input",
    label: "Serial number",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 8,
    key: "inventoryNumber",
    type: "input",
    label: "Inventory number",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 9,
    key: "DevicesBrand",
    type: "input",
    label: "Brand",
    category: ["Devices"],
    group: "BasicInfo",
  },
  {
    id: 10,
    key: "user",
    type: "select",
    label: "User",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 11,
    key: "group",
    type: "select",
    label: "Group",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 12,
    key: "monitorType",
    type: "select",
    label: "Type",
    category: ["Monitor"],
    group: "BasicInfo",
  },
  {
    id: 13,
    key: "status",
    type: "select",
    label: "Status",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 14,
    key: "managementType",
    type: "select",
    label: "Management type",
    category: ["Computer", "Monitor", "Devices", "Printer", "Phone"],
    group: "MoreInfo",
  },
  {
    id: 15,
    key: "uuid",
    type: "input",
    label: "UUID",
    category: ["General"],
    group: "BasicInfo",
  },
  {
    id: 16,
    key: "snmpCredential",
    type: "select",
    label: "SNMP credential",
    category: ["Network device", "Printer"],
    group: "MoreInfo",
  },
  {
    id: 17,
    key: "manufacturer",
    type: "select",
    label: "Manufacturer",
    category: ["General"],
    group: "MoreInfo",
  },
  {
    id: 18,
    key: "sysdescr",
    type: "input",
    label: "Sysdescr",
    category: ["Network device", "Printer"],
    group: "MoreInfo",
  },
  {
    id: 19,
    key: "network",
    type: "select",
    label: "Network",
    category: ["Computer", "Printer"],
    group: "MoreInfo",
  },
  {
    id: 20,
    key: "memory",
    type: "number",
    label: "Memory",
    category: ["Printer"],
    group: "MoreInfo",
  },
  {
    id: 21,
    key: "initialPageCounter",
    type: "number",
    label: "Initial page counter",
    category: ["Pinter"],
    group: "MoreInfo",
  },
  {
    id: 22,
    key: "currentPageCounter",
    type: "number",
    label: "Current counter of pages",
    category: ["Computer"],
    group: "MoreInfo",
  },
  {
    id: 23,
    key: "numberOfLines",
    type: "number",
    label: "Number of lines",
    category: ["Phone"],
    group: "MoreInfo",
  },
  {
    id: 24,
    key: "phonePowerSupplyType",
    type: "select",
    label: "Phone power supply type",
    category: ["Phone"],
    group: "MoreInfo",
  },
  {
    id: 25,
    key: "pictures",
    type: "upload",
    label: "Pictures",
    category: ["Monitor", "Software", "Cartridge", "Consumable"],
    group: "Upload",
  },
  {
    id: 26,
    key: "stockTarget",
    type: "number",
    label: "Stock target",
    category: ["Computer"],
    group: "MoreInfo",
  },
  {
    id: 27,
    key: "alertThreshold",
    type: "number",
    label: "Alert threshold",
    category: ["Computer"],
    group: "MoreInfo",
  },
  {
    id: 28,
    key: "reference",
    type: "input",
    label: "Reference",
    category: ["Cartridge", "Consumable"],
    group: "MoreInfo",
  },
  {
    id: 29,
    key: "computerModel",
    type: "select",
    label: "Model",
    category: ["Computer"],
    group: "BasicInfo",
  },
  {
    id: 30,
    key: "computerType",
    type: "select",
    label: "Type",
    category: ["Computer"],
    group: "BasicInfo",
  },
  {
    id: 31,
    key: "size",
    type: "number",
    label: "Size",
    category: ["Monitor"],
    group: "MoreInfo",
  },
  {
    id: 32,
    key: "monitorPorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Monitor"],
    group: "Connectivity",
    options: [
      { value: "USB", label: "USB" },
      { value: "HDMI", label: "HDMI" },
      { value: "Ethernet", label: "Ethernet" },
      { value: "Audio", label: "Audio" },
    ],
  },
  {
    id: 33,
    key: "monitorModel",
    type: "select",
    label: "Model",
    category: ["Monitor"],
    group: "BasicInfo",
  },
  {
    id: 34,
    key: "publisher",
    type: "select",
    label: "Publisher",
    category: ["Software"],
    group: "MoreInfo",
  },
  {
    id: 35,
    key: "softwareCategory",
    type: "select",
    label: "Software category",
    category: ["Software"],
    group: "BasicInfo",
  },
  {
    id: 36,
    key: "AssociableToTicket",
    type: "checkboxGroup",
    label: "Associable to a ticket",
    category: ["Software"],
    group: "Updates",
  },
  {
    id: 37,
    key: "NetworkType",
    type: "select",
    label: "Type",
    category: ["Network device"],
    group: "BasicInfo",
  },
  {
    id: 38,
    key: "NetworkModel",
    type: "select",
    label: "Model",
    category: ["Network device"],
    group: "BasicInfo",
  },
  {
    id: 39,
    key: "Network",
    type: "select",
    label: "Network",
    category: ["Network device"],
    group: "MoreInfo",
  },
  {
    id: 40,
    key: "Memory",
    type: "select",
    label: "Memory (Mio)",
    category: ["Network device"],
    group: "MoreInfo",
  },
  {
    id: 41,
    key: "DevicesType",
    type: "select",
    label: "Type",
    category: ["Devices"],
    group: "BasicInfo",
  },
  {
    id: 41,
    key: "DevicesModel",
    type: "select",
    label: "Model",
    category: ["Devices"],
    group: "BasicInfo",
  },
  {
    id: 42,
    key: "CurrentCounterOfPages",
    type: "number",
    label: "Current counter of pages",
    category: ["Printer"],
    group: "MoreInfo",
  },
  {
    id: 43,
    key: "PrinterPorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Printer"],
    group: "Connectivity",
    options: [
      { value: "Serail", label: "Serail" },
      { value: "Parallel", label: "Parallel" },
      { value: "USB", label: "USB" },
      { value: "Ethernet", label: "Ethernet" },
      { value: "Wifi", label: "Wifi" },
    ],
  },
  {
    id: 44,
    key: "PrinterType",
    type: "select",
    label: "Type",
    category: ["Printer"],
    group: "BasicInfo",
  },
  {
    id: 45,
    key: "PrinterModel",
    type: "select",
    label: "Model",
    category: ["Printer"],
    group: "BasicInfo",
  },
  {
    id: 46,
    key: "Alert threshold",
    type: "number",
    label: "Alert threshold",
    category: ["Cartridge", "Consumable"],
    group: "MoreInfo",
  },
  {
    id: 47,
    key: "CartridgeType",
    type: "select",
    label: "Type",
    category: ["Cartridge"],
    group: "BasicInfo",
  },
  {
    id: 48,
    key: "Stock target",
    type: "number",
    label: "Stock target",
    category: ["Cartridge", "Consumable"],
    group: "BasicInfo",
  },
  {
    id: 49,
    key: "ConsumableType",
    type: "select",
    label: "Type",
    category: ["Consumable"],
    group: "BasicInfo",
  },
  {
    id: 50,
    key: "PhonePorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Phone"],
    group: "Connectivity",
    options: [
      { value: "Headset", label: "Headset" },
      { value: "Speaker", label: "Speaker" },
    ],
  },
  {
    id: 51,
    key: "PhoneType",
    type: "select",
    label: "Type",
    category: ["Phone"],
    group: "BasicInfo",
  },
  {
    id: 52,
    key: "PhoneModel",
    type: "select",
    label: "Model",
    category: ["Phone"],
    group: "BasicInfo",
  },
  {
    id: 53,
    key: "PhoneBrand",
    type: "select",
    label: "Brand",
    category: ["Phone"],
    group: "BasicInfo",
  },
  {
    id: 54,
    key: "RackType",
    type: "select",
    label: "Type",
    category: ["Rack"],
    group: "BasicInfo",
  },
  {
    id: 55,
    key: "RackModel",
    type: "select",
    label: "Model",
    category: ["Rack"],
    group: "BasicInfo",
  },
  {
    id: 56,
    key: "ServerRoom",
    type: "select",
    label: "Server Room",
    category: ["Rack"],
    group: "Room",
  },
  {
    id: 58,
    key: "DoorOrientationRoom",
    type: "select",
    label: "Door orientation in room",
    category: ["Rack"],
    group: "Room",
    options: [
      { label: "North", value: "North" },
      { label: "South", value: "South" },
      { label: "East", value: "East" },
      { label: "West", value: "West" },
    ],
  },
  {
    //ask about this
    id: 57,
    key: "PositionRoom",
    type: "input",
    label: "Position in room",
    category: ["Rack"],
    group: "Room",
  },
  {
    id: 59,
    key: "PositionRoom",
    type: "input",
    label: "Position in room",
    category: ["Rack"],
    group: "Room",
  },
  {
    id: 61,
    key: "Width",
    type: "number",
    label: "Width",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 62,
    key: "Height",
    type: "number",
    label: "Height",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 63,
    key: "Depth",
    type: "number",
    label: "Depth",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 64,
    key: "NumberOfUnits",
    type: "number",
    label: "Number of units",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 65,
    key: "Max. power",
    type: "number",
    label: "Max. power (in watts)",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 66,
    key: "Measured power",
    type: "number",
    label: "Measured power (in watts)",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 67,
    key: "Max. weight",
    type: "number",
    label: "Max. weight",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 68,
    key: "Power supplies",
    type: "number",
    label: "Power supplies",
    category: ["Enclosure"],
    group: "Asset Metrics",
  },
  {
    id: 69,
    key: "EnclosureModel",
    type: "select",
    label: "Model",
    category: ["Enclosure"],
    group: "BasicInfo",
  },
  {
    id: 70,
    key: "PDUModel",
    type: "select",
    label: "Model",
    category: ["PDU"],
    group: "BasicInfo",
  },
  {
    id: 71,
    key: "PDUType",
    type: "select",
    label: "Type",
    category: ["PDU"],
    group: "BasicInfo",
  },
  {
    id: 72,
    key: "PassiveModel",
    type: "select",
    label: "Model",
    category: ["Passive device"],
    group: "BasicInfo",
  },
  {
    id: 73,
    key: "PassiveType",
    type: "select",
    label: "Type",
    category: ["Passive device"],
    group: "BasicInfo",
  },
  {
    id: 74,
    key: "PINCODE",
    type: "password",
    label: "PIN code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 75,
    key: "PIN2CODE",
    type: "password",
    label: "PIN2 code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 76,
    key: "PUKCODE",
    type: "password",
    label: "PUK code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 77,
    key: "PUK2CODE",
    type: "password",
    label: "PUK2 code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 78,
    key: "Line",
    type: "select",
    label: "Line",
    category: ["Simcard"],
    group: "BasicInfo",
  },
  {
    id: 79,
    key: "SimcardType",
    type: "input",
    label: "Type",
    category: ["Simcard"],
    group: "BasicInfo",
  },
  {
    id: 80,
    key: "SimcardComponent",
    type: "select",
    label: "Component",
    category: ["Simcard"],
    group: "BasicInfo",
  },
  {
    id: 81,
    key: "Mobile Subscriber Identification Number",
    type: "input",
    label: "Mobile Subscriber Identification Number",
    category: ["Simcard"],
    group: "BasicInfo",
    note: "MSIN is the least 8 or 10 digits og IMSI ",
  },
];
