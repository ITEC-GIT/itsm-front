import { useState } from "react";
import { AssetsHistoryType, CategoryOption } from "../types/assetsTypes";
import { TableColumn } from "react-data-table-component";
import { Link } from "react-router-dom";
import { getBackgroundColor } from "../../utils/custom";
import { useAtom } from "jotai";
import { showActionColumnAtom } from "../atoms/table-atom/tableAtom";
import {
  columnLargeWidth,
  columnMediumWidth,
  columnSmallWidth,
  columnXLargeWidth,
  columnXXLargeWidth,
  columnXXXLargeWidth,
} from "./dataTable";

export const categories: CategoryOption[] = [
  { value: "Computer", label: "Computer" },
  { value: "Monitor", label: "Monitor" },
  { value: "Network device", label: "Network device" },
  { value: "Devices", label: "Devices" },
  { value: "Printer", label: "Printer" },
  { value: "Cartridge", label: " Cartridge" },
  { value: "Consumable", label: " Consumable" },
  { value: "Mouse", label: "Mouse" },
  { value: "Phone", label: "Phone" },
  { value: "Rack", label: "Rack" },
  { value: "Enclosure", label: "Enclosure" },
  { value: "Passive device", label: "Passive device" },
  { value: "Simcard", label: "Simcard item" },
];

const assetCategories = [
  "Computer",
  "Monitor",
  "Network device",
  "Devices",
  "Printer",
  "Cartridge",
  "Consumable",
  "Mouse",
  "Phone",
  "Rack",
  "Enclosure",
  "Passive device",
  "Simcard",
];

const colors = [
  "#f7c1c1",
  "#f7c1c1",
  "#fadcbf",
  "#fadcbf",
  "#fae4ae",
  "#fae4ae",
  "#e0e0e0",
  "#e0e0e0",
  "#fde9b3",
  "#fde9b3",
  "#d9d3cb",
  "#d9d3cb",
  "#f7c1c1",
];

export const getColumns = (
  hoveredRowId: number | null
): TableColumn<AssetsHistoryType>[] =>
  [
    {
      name: "#",
      sortable: true,
      sortFunction: (a: AssetsHistoryType, b: AssetsHistoryType) => a.id - b.id,
      width: columnSmallWidth,
      cell: (row: AssetsHistoryType) => {
        const backgroundColor = getBackgroundColor(
          row.category,
          assetCategories,
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
          <span style={{ color: "#f0f0f0" }}>|</span> Device
        </span>
      ),
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Type
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: AssetsHistoryType) => row.type,
      sortable: true,
      id: "type",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Status
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: AssetsHistoryType) => row.status,
      sortable: true,
      id: "status",
      cell: (row: AssetsHistoryType) => {
        return (
          <span
            style={{
              backgroundColor: "#e3edff",
              color: "#333",
              fontWeight: "500",
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Public IP
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: AssetsHistoryType) => row.public_ip,
      sortable: true,
      id: "public_ip",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Entity
        </span>
      ),
      selector: (row: AssetsHistoryType) => row.entity,
      width: columnLargeWidth,
      cell: (row: AssetsHistoryType) => (
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Serial Number
        </span>
      ),
      width: columnXXLargeWidth,
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Model
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: AssetsHistoryType) => row.model,
      sortable: true,
      cell: (row: AssetsHistoryType) => (
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Location
        </span>
      ),
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Component Processor
        </span>
      ),
      width: columnXXXLargeWidth,
      selector: (row: AssetsHistoryType) => row.component_processor,
      sortable: true,
      id: "component_processor",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Last Updated
        </span>
      ),
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
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Project
        </span>
      ),
      width: columnXLargeWidth,
      selector: (row: AssetsHistoryType) => row.project,
      sortable: true,
      id: "project",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Address
        </span>
      ),
      width: columnXLargeWidth,
      selector: (row: AssetsHistoryType) => row.address,
      sortable: true,
      id: "address",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Inventory NB
        </span>
      ),
      width: columnXLargeWidth,
      selector: (row: AssetsHistoryType) => row.inventory_number,
      sortable: true,
      id: "inventory_number",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Username NB
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: AssetsHistoryType) => row.alternate_username_number,
      sortable: true,
      id: "alternate_username_number",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span>
        </span>
      ),
      width: "70px",
      cell: (row: AssetsHistoryType) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);

        const handleDeleteClick = () => {
          setShowDeleteModal(true);
        };

        const confirmDelete = () => {
          setShowDeleteModal(false);
        };

        const cancelDelete = () => {
          setShowDeleteModal(false);
        };

        return (
          <div
            className={`d-flex align-items-start ${
              hoveredRowId === row.id ? "show" : "hide"
            }`}
          >
            {hoveredRowId === row.id && (
              <>
                <button className="table-btn-action" onClick={() => {}}>
                  <i className="bi bi-pencil text-primary table-icon"></i>
                </button>
                <button
                  className="table-btn-action"
                  onClick={handleDeleteClick}
                >
                  <i className="bi bi-x-lg text-danger table-icon"></i>
                </button>

                {showDeleteModal && (
                  <div
                    className={`modal w-100 fade ${
                      showDeleteModal ? "show d-block" : ""
                    }`}
                    role="dialog"
                    aria-hidden={!showDeleteModal}
                    style={{
                      background: showDeleteModal
                        ? "rgba(0,0,0,0.5)"
                        : "transparent",
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content p-5">
                        <div className="d-flex justify-content-start align-items-center mb-5">
                          <div className="circle-div">
                            <i className="bi bi-exclamation text-white custom-modal-animated-icon"></i>
                          </div>
                          <div className="d-flex flex-column">
                            <h3>Delete assets</h3>
                            <p>
                              Are you sure you want to delete the selected
                              assets?
                            </p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mt-5">
                          <button
                            onClick={cancelDelete}
                            className="custom-modal-cancel-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="custom-modal-confirm-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      },
      sortable: false,
      id: "action",
    },
  ].filter(Boolean) as TableColumn<AssetsHistoryType>[];

export const columns: TableColumn<AssetsHistoryType>[] = [
  {
    name: "#",
    sortable: true,
    sortFunction: (a: AssetsHistoryType, b: AssetsHistoryType) => a.id - b.id,
    width: columnMediumWidth,
    cell: (row: AssetsHistoryType) => {
      const backgroundColor = getBackgroundColor(
        row.category,
        assetCategories,
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
        <span style={{ color: "#f0f0f0" }}>|</span> Device
      </span>
    ),
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Type
      </span>
    ),
    width: columnLargeWidth,
    selector: (row: AssetsHistoryType) => row.type,
    sortable: true,
    id: "type",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Status
      </span>
    ),
    width: columnLargeWidth,
    selector: (row: AssetsHistoryType) => row.status,
    sortable: true,
    id: "status",
    cell: (row: AssetsHistoryType) => {
      return (
        <span
          style={{
            backgroundColor: "#e3edff",
            color: "#333",
            fontWeight: "500",
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Public IP
      </span>
    ),
    width: columnLargeWidth,
    selector: (row: AssetsHistoryType) => row.public_ip,
    sortable: true,
    id: "public_ip",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Entity
      </span>
    ),
    selector: (row: AssetsHistoryType) => row.entity,
    width: columnLargeWidth,
    cell: (row: AssetsHistoryType) => (
      <span data-bs-toggle="tooltip" data-bs-placement="top" title={row.entity}>
        {row.entity}
      </span>
    ),
    sortable: true,
    id: "entity",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Serial Number
      </span>
    ),
    width: columnXXLargeWidth,
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Model
      </span>
    ),
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Location
      </span>
    ),
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Component Processor
      </span>
    ),
    width: columnXXXLargeWidth,
    selector: (row: AssetsHistoryType) => row.component_processor,
    sortable: true,
    id: "component_processor",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Last Updated
      </span>
    ),
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
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Project
      </span>
    ),
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.project,
    sortable: true,
    id: "project",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Address
      </span>
    ),
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.address,
    sortable: true,
    id: "address",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Inventory NB
      </span>
    ),
    width: columnXLargeWidth,
    selector: (row: AssetsHistoryType) => row.inventory_number,
    sortable: true,
    id: "inventory_number",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Username NB
      </span>
    ),
    width: columnXXLargeWidth,
    selector: (row: AssetsHistoryType) => row.alternate_username_number,
    sortable: true,
    id: "alternate_username_number",
  },
  {
    name: (
      <span>
        <span style={{ color: "#f0f0f0" }}>|</span> Action
      </span>
    ),
    width: columnMediumWidth,
    cell: (row: AssetsHistoryType) => {
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [showActionColumn] = useAtom(showActionColumnAtom);

      const handleDeleteClick = () => {
        setShowDeleteModal(true);
      };

      const confirmDelete = () => {
        setShowDeleteModal(false);
      };

      const cancelDelete = () => {
        setShowDeleteModal(false);
      };

      return (
        <div
          className={`d-flex align-items-start ${
            showActionColumn ? "show" : "hide"
          }`}
        >
          <button className="table-btn-action" onClick={() => {}}>
            <i className="bi bi-pencil text-primary table-icon"></i>
          </button>
          <button className="table-btn-action" onClick={handleDeleteClick}>
            <i className="bi bi-x-lg fs-2 text-danger table-icon"></i>
          </button>

          {showDeleteModal && (
            <div
              className={`modal w-100 fade ${
                showDeleteModal ? "show d-block" : ""
              }`}
              role="dialog"
              aria-hidden={!showDeleteModal}
              style={{
                background: showDeleteModal ? "rgba(0,0,0,0.5)" : "transparent",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-5">
                  <div className="d-flex justify-content-start align-items-center mb-5">
                    <div className="circle-div">
                      <i className="bi bi-exclamation text-white custom-modal-animated-icon"></i>
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
                      className="custom-modal-cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="custom-modal-confirm-btn"
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
  {
    id: 111,
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
  },
  {
    id: 1111,
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
  },
  {
    id: 22,
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
  },
  {
    id: 222,
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
  },
  {
    id: 2222,
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
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
    status: "Online",
    public_ip: "192.168.1.10",
    category: "Network device",
  },
  {
    id: 22222,
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
    status: "Offline",
    public_ip: "192.168.1.11",
    category: "Rack",
  },
  {
    id: 333,
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
    status: "Online",
    public_ip: "192.168.1.12",
    category: "Devices",
  },
  {
    id: 55555,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 5555,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 555,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 55,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 4444,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 444,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
  },
  {
    id: 44,
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
    status: "Online",
    public_ip: "192.168.1.13",
    category: "Enclouser",
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
    status: "Online",
    public_ip: "192.168.1.14",
    category: "Computer",
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
    group: "Basic Information",
  },
  {
    id: 2,
    key: "location",
    type: "select",
    label: "Location",
    category: ["General"],
    group: "Basic Information",
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
    group: "Basic Information",
  },
  {
    id: 8,
    key: "inventoryNumber",
    type: "input",
    label: "Inventory number",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 9,
    key: "DevicesBrand",
    type: "input",
    label: "Brand",
    category: ["Devices"],
    group: "Basic Information",
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
    group: "Basic Information",
  },
  {
    id: 12,
    key: "monitorType",
    type: "select",
    label: "Type",
    category: ["Monitor"],
    group: "Basic Information",
  },
  {
    id: 13,
    key: "status",
    type: "select",
    label: "Status",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 14,
    key: "managementType",
    type: "select",
    label: "Management type",
    category: ["Computer", "Monitor", "Devices", "Printer", "Phone"],
    group: "More Information",
  },
  {
    id: 15,
    key: "uuid",
    type: "input",
    label: "UUID",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 16,
    key: "snmpCredential",
    type: "select",
    label: "SNMP credential",
    category: ["Network device", "Printer"],
    group: "More Information",
  },
  {
    id: 17,
    key: "manufacturer",
    type: "select",
    label: "Manufacturer",
    category: ["General"],
    group: "More Information",
  },
  {
    id: 18,
    key: "sysdescr",
    type: "input",
    label: "Sysdescr",
    category: ["Network device", "Printer"],
    group: "More Information",
  },
  {
    id: 19,
    key: "network",
    type: "select",
    label: "Network",
    category: ["Computer", "Printer"],
    group: "More Information",
  },
  {
    id: 20,
    key: "memory",
    type: "number",
    label: "Memory",
    category: ["Printer"],
    group: "More Information",
  },
  {
    id: 21,
    key: "initialPageCounter",
    type: "number",
    label: "Initial page counter",
    category: ["Pinter"],
    group: "More Information",
  },
  {
    id: 22,
    key: "currentPageCounter",
    type: "number",
    label: "Current counter of pages",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 23,
    key: "numberOfLines",
    type: "number",
    label: "Number of lines",
    category: ["Phone"],
    group: "More Information",
  },
  {
    id: 24,
    key: "phonePowerSupplyType",
    type: "select",
    label: "Phone power supply type",
    category: ["Phone"],
    group: "More Information",
  },
  {
    id: 25,
    key: "pictures",
    type: "upload",
    label: "Pictures",
    category: ["Monitor", "Software", "Cartridge", "Consumable"],
    group: "Uploads",
  },
  {
    id: 26,
    key: "stockTarget",
    type: "number",
    label: "Stock target",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 27,
    key: "alertThreshold",
    type: "number",
    label: "Alert threshold",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 28,
    key: "reference",
    type: "input",
    label: "Reference",
    category: ["Cartridge", "Consumable"],
    group: "More Information",
  },
  {
    id: 29,
    key: "computerModel",
    type: "select",
    label: "Model",
    category: ["Computer"],
    group: "Basic Information",
  },
  {
    id: 30,
    key: "computerType",
    type: "select",
    label: "Type",
    category: ["Computer"],
    group: "Basic Information",
  },
  {
    id: 31,
    key: "size",
    type: "number",
    label: "Size",
    category: ["Monitor"],
    group: "More Information",
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
    group: "Basic Information",
  },
  {
    id: 34,
    key: "publisher",
    type: "select",
    label: "Publisher",
    category: ["Software"],
    group: "More Information",
  },
  {
    id: 35,
    key: "softwareCategory",
    type: "select",
    label: "Software category",
    category: ["Software"],
    group: "Basic Information",
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
    group: "Basic Information",
  },
  {
    id: 38,
    key: "NetworkModel",
    type: "select",
    label: "Model",
    category: ["Network device"],
    group: "Basic Information",
  },
  {
    id: 39,
    key: "Network",
    type: "select",
    label: "Network",
    category: ["Network device"],
    group: "More Information",
  },
  {
    id: 40,
    key: "Memory",
    type: "select",
    label: "Memory (Mio)",
    category: ["Network device"],
    group: "More Information",
  },
  {
    id: 41,
    key: "DevicesType",
    type: "select",
    label: "Type",
    category: ["Devices"],
    group: "Basic Information",
  },
  {
    id: 100,
    key: "DevicesModel",
    type: "select",
    label: "Model",
    category: ["Devices"],
    group: "Basic Information",
  },
  {
    id: 42,
    key: "CurrentCounterOfPages",
    type: "number",
    label: "Current counter of pages",
    category: ["Printer"],
    group: "More Information",
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
    group: "Basic Information",
  },
  {
    id: 45,
    key: "PrinterModel",
    type: "select",
    label: "Model",
    category: ["Printer"],
    group: "Basic Information",
  },
  {
    id: 46,
    key: "Alert threshold",
    type: "number",
    label: "Alert threshold",
    category: ["Cartridge", "Consumable"],
    group: "More Information",
  },
  {
    id: 47,
    key: "CartridgeType",
    type: "select",
    label: "Type",
    category: ["Cartridge"],
    group: "Basic Information",
  },
  {
    id: 48,
    key: "Stock target",
    type: "number",
    label: "Stock target",
    category: ["Cartridge", "Consumable"],
    group: "Basic Information",
  },
  {
    id: 49,
    key: "ConsumableType",
    type: "select",
    label: "Type",
    category: ["Consumable"],
    group: "Basic Information",
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
    group: "Basic Information",
  },
  {
    id: 52,
    key: "PhoneModel",
    type: "select",
    label: "Model",
    category: ["Phone"],
    group: "Basic Information",
  },
  {
    id: 53,
    key: "PhoneBrand",
    type: "select",
    label: "Brand",
    category: ["Phone"],
    group: "Basic Information",
  },
  {
    id: 54,
    key: "RackType",
    type: "select",
    label: "Type",
    category: ["Rack"],
    group: "Basic Information",
  },
  {
    id: 55,
    key: "RackModel",
    type: "select",
    label: "Model",
    category: ["Rack"],
    group: "Basic Information",
  },
  {
    id: 56,
    key: "ServerRoom",
    type: "select",
    label: "Server Room",
    category: ["Rack"],
    group: "Room Details",
  },
  {
    id: 58,
    key: "DoorOrientationRoom",
    type: "select",
    label: "Door orientation in room",
    category: ["Rack"],
    group: "Room Details",
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
    group: "Room Details",
  },
  {
    id: 59,
    key: "PositionRoom",
    type: "input",
    label: "Position in room",
    category: ["Rack"],
    group: "Room Details",
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
    group: "Basic Information",
  },
  {
    id: 70,
    key: "PDUModel",
    type: "select",
    label: "Model",
    category: ["PDU"],
    group: "Basic Information",
  },
  {
    id: 71,
    key: "PDUType",
    type: "select",
    label: "Type",
    category: ["PDU"],
    group: "Basic Information",
  },
  {
    id: 72,
    key: "PassiveModel",
    type: "select",
    label: "Model",
    category: ["Passive device"],
    group: "Basic Information",
  },
  {
    id: 73,
    key: "PassiveType",
    type: "select",
    label: "Type",
    category: ["Passive device"],
    group: "Basic Information",
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
    group: "Basic Information",
  },
  {
    id: 79,
    key: "SimcardType",
    type: "input",
    label: "Type",
    category: ["Simcard"],
    group: "Basic Information",
  },
  {
    id: 80,
    key: "SimcardComponent",
    type: "select",
    label: "Component",
    category: ["Simcard"],
    group: "Basic Information",
  },
  {
    id: 81,
    key: "Mobile Subscriber Identification Number",
    type: "input",
    label: "Mobile Subscriber Identification Number",
    category: ["Simcard"],
    group: "Basic Information",
    note: "MSIN is the least 8 or 10 digits og IMSI ",
  },
  {
    id: 82,
    key: "Comments",
    type: "textArea",
    label: "Comments",
    category: ["General"],
    group: "More Information",
  },
];

// export const Steps = [
//   {
//     title: "Ownership",
//     iconClass: "fa-solid fa-user-shield",
//   },
//   {
//     title: "Basic Information",
//     iconClass: "fa-solid fa-circle-info",
//   },
//   {
//     title: "More Information",
//     iconClass: "fa-solid fa-file-lines",
//   },
//   {
//     title: "Connectivity",
//     iconClass: "fa-solid fa-wifi",
//   },
//   {
//     title: "Uploads",
//     iconClass: "fa-solid fa-upload",
//   },
//   {
//     title: "Room Details",
//     iconClass: "fa-solid fa-house",
//   },
//   {
//     title: "Asset Metrics",
//     iconClass: "fa-solid fa-chart-line",
//   },
//   {
//     title: "Credentials",
//     iconClass: "fa-solid fa-id-card",
//   },
//   {
//     title: "Submission",
//     iconClass: "fa-solid fa-circle-check",
//   },
// ];

export const Steps = [
  {
    id: 1,
    title: "Ownership",
    iconClass: "fa-solid fa-user-shield",
  },
  {
    id: 2,
    title: "Basic Information",
    iconClass: "fa-solid fa-circle-info",
  },
  {
    id: 3,
    title: "More Information",
    iconClass: "fa-solid fa-file-lines",
  },
  {
    id: 4,
    title: "Connectivity",
    iconClass: "fa-solid fa-wifi",
  },
  {
    id: 5,
    title: "Uploads",
    iconClass: "fa-solid fa-upload",
  },
  {
    id: 6,
    title: "Room Details",
    iconClass: "fa-solid fa-house",
  },
  {
    id: 7,
    title: "Asset Metrics",
    iconClass: "fa-solid fa-chart-line",
  },
  {
    id: 8,
    title: "Credentials",
    iconClass: "fa-solid fa-id-card",
  },
  {
    id: 9,
    title: "Submission",
    iconClass: "fa-solid fa-circle-check",
  },
];
