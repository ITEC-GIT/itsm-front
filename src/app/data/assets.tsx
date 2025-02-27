import { AssetsHistoryType } from "../types/assetsTypes";
import { TableColumn } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";

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
    selector: (row: AssetsHistoryType) => row.action,
    sortable: true,
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
  //   id: 1,
  //   name: "Device 1",
  //   entity: "Entity A",
  //   serial_number: "SN123456",
  //   model: "Model X",
  //   location: "New York",
  //   last_update: "2023-10-01",
  //   component_processor: "Intel i7",
  //   type: "Laptop",
  //   project: "Project Alpha",
  //   address: "123 Main St",
  //   inventory_number: "INV001",
  //   alternate_username_number: "AU001",
  //   action: "Active",
  //   status: "Online", // New property
  //   public_ip: "225.225.225.225", // New property
  // },
  // {
  //   id: 2,
  //   name: "Device 2",
  //   entity: "Entity B",
  //   serial_number: "SN654321",
  //   model: "Model Y",
  //   location: "San Francisco",
  //   last_update: "2023-09-25",
  //   component_processor: "AMD Ryzen 5",
  //   type: "Desktop",
  //   project: "Project Beta",
  //   address: "456 Elm St",
  //   inventory_number: "INV002",
  //   alternate_username_number: "AU002",
  //   action: "Inactive",
  //   status: "Offline", // New property
  //   public_ip: "192.168.1.2", // New property
  // },
  // {
  //   id: 3,
  //   name: "Device 3",
  //   entity: "Entity C",
  //   serial_number: "SN789012",
  //   model: "Model Z",
  //   location: "Chicago",
  //   last_update: "2023-10-05",
  //   component_processor: "Intel i5",
  //   type: "Tablet",
  //   project: "Project Gamma",
  //   address: "789 Oak St",
  //   inventory_number: "INV003",
  //   alternate_username_number: "AU003",
  //   action: "Active",
  //   status: "Online", // New property
  //   public_ip: "192.168.1.3", // New property
  // },
  // {
  //   id: 4,
  //   name: "Device 4",
  //   entity: "Entity D",
  //   serial_number: "SN345678",
  //   model: "Model A",
  //   location: "Los Angeles",
  //   last_update: "2023-09-30",
  //   component_processor: "AMD Ryzen 7",
  //   type: "Server",
  //   project: "Project Delta",
  //   address: "101 Pine St",
  //   inventory_number: "INV004",
  //   alternate_username_number: "AU004",
  //   action: "Active",
  //   status: "Online", // New property
  //   public_ip: "192.168.1.4", // New property
  // },
  // {
  //   id: 5,
  //   name: "Device 5",
  //   entity: "Entity E",
  //   serial_number: "SN901234",
  //   model: "Model B",
  //   location: "Houston",
  //   last_update: "2023-10-02",
  //   component_processor: "Intel i9",
  //   type: "Workstation",
  //   project: "Project Epsilon",
  //   address: "202 Maple St",
  //   inventory_number: "INV005",
  //   alternate_username_number: "AU005",
  //   action: "Inactive",
  //   status: "Offline", // New property
  //   public_ip: "192.168.1.5", // New property
  // },
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
