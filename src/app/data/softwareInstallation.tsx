import { TableColumn } from "react-data-table-component";
import { SoftwareHistoryType } from "../types/softwareInstallationTypes";
import {
  columnLargeWidth,
  columnMediumWidth,
  columnSmallWidth,
  columnXLargeWidth,
  columnXXLargeWidth,
  columnXXXLargeWidth,
} from "./dataTable";
import { getBackgroundColor, getCircleColor } from "../../utils/custom";

const categories = ["received", "cancelled", "initialized"];

const colors = ["#f7c1c1", "#e0e0e0", "#fae4ae"];

export const getColumns = (
  handleCancelClick: (row: SoftwareHistoryType) => void
): TableColumn<SoftwareHistoryType>[] => [
  {
    name: "#",
    sortable: true,
    sortFunction: (a: SoftwareHistoryType, b: SoftwareHistoryType) =>
      a.id - b.id,
    width: columnMediumWidth,
    cell: (row: SoftwareHistoryType) => {
      const backgroundColor = getBackgroundColor(
        row.status,
        categories,
        colors
      );
      return (
        <span
          style={{
            backgroundColor: backgroundColor,
            padding: "5px",
            borderRadius: "3px",
            width: "62px",
            textAlign: "center",
          }}
        >
          <span>{row.id}</span>
        </span>
      );
    },
    id: "id",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Software
      </span>
    ),
    selector: (row: SoftwareHistoryType) => row.software,
    sortable: true,
    width: columnXXXLargeWidth,
    cell: (row: SoftwareHistoryType) => (
      <span
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={row.software}
      >
        {row.software}
      </span>
    ),
    id: "Software",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Device
      </span>
    ),

    selector: (row: SoftwareHistoryType) => row.computer_name,
    width: columnXXXLargeWidth,
    cell: (row: SoftwareHistoryType) => (
      <span
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={row.computer_name}
      >
        {row.computer_name}
      </span>
    ),
    sortable: true,
    id: "Device",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> URL
      </span>
    ),
    width: columnXXLargeWidth,
    selector: (row: SoftwareHistoryType) => row.url,
    sortable: true,
    id: "URL",
    cell: (row: SoftwareHistoryType) => (
      <span
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={row.url}
        className="url-cell"
      >
        {row.url}
      </span>
    ),
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Destination
      </span>
    ),
    width: columnXXLargeWidth,
    selector: (row: SoftwareHistoryType) => row.destination,
    sortable: true,
    cell: (row: SoftwareHistoryType) => (
      <span
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={row.destination}
      >
        {row.destination}
      </span>
    ),
    id: "Destination",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Arguments
      </span>
    ),
    width: columnXXLargeWidth,
    selector: (row: SoftwareHistoryType) => row.arguments,
    sortable: true,
    id: "Arguments",
    cell: (row: SoftwareHistoryType) => (
      <span
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={row.arguments}
      >
        {row.arguments}
      </span>
    ),
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Status
      </span>
    ),
    selector: (row: SoftwareHistoryType) => row.status,
    sortable: true,
    width: columnLargeWidth,
    id: "Status",
    cell: (row: SoftwareHistoryType) => {
      const backgroundColor = getBackgroundColor(
        row.status,
        categories,
        colors
      );
      return (
        <span
          style={{
            backgroundColor: backgroundColor,
            padding: "5px",
            borderRadius: "3px",
            width: "100px",
            textAlign: "left",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: getCircleColor(row.status),
              marginRight: "8px",
            }}
          ></span>
          <span>{row.status}</span>
        </span>
      );
    },
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> User
      </span>
    ),
    width: columnXLargeWidth,
    selector: (row: SoftwareHistoryType) => row.user_name,
    sortable: true,
    id: "User",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Date
      </span>
    ),
    id: "Date",
    width: columnLargeWidth,
    selector: (row: SoftwareHistoryType) => {
      const date = new Date(row.created_at);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    },
    sortable: true,
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Action
      </span>
    ),
    width: columnMediumWidth,
    cell: (row: SoftwareHistoryType) => (
      <button
        className="btn d-flex justify-content-center align-items-center"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Cancel Installation"
        onClick={() => handleCancelClick(row)}
        disabled={row.status === "cancelled" || row.status === "received"}
      >
        <i className="bi bi-x-lg text-danger text-center table-icon"></i>
      </button>
    ),
    sortable: false,
    id: "Action",
  },
];

export const steps = [
  { id: 1, title: "Device", iconClass: "fa fa-desktop" },
  { id: 2, title: "Destination", iconClass: "fa fa-location-arrow" },
  { id: 3, title: "Software", iconClass: "fa fa-cogs" },
  { id: 4, title: "Variables", iconClass: "fa fa-sliders-h" },
  { id: 5, title: "Submission", iconClass: "fa fa-check-circle" },
];

export const activeFilters = [
  "softwareStatusFilter",
  "userFilter",
  "computersFilter",
  "dateFilter",
];
