import { TableColumn } from "react-data-table-component";
import { useState } from "react";
import {
  AliasesType,
  DepartmentsType,
  GroupsType,
  LocationsType,
  RolesType,
  UsersType,
} from "../types/user-management";
import Select from "react-select";
import {
  columnLargeWidth,
  columnXLargeWidth,
  columnXXLargeWidth,
} from "./dataTable";

//roles
export const RolesActiveFilters = [];
export const rolesMockData = [
  {
    id: 1,
    name: "IT Administrator",
    permissions: "View All",
    users: 3,
    actions: ["Edit", "Delete"],
  },
  {
    id: 2,
    name: "Support Technician",
    permissions: "Limited",
    users: 2,
    actions: ["Edit"],
  },
  {
    id: 3,
    name: "Network Manager",
    permissions: "View All",

    users: 8,
    actions: ["Edit", "Delete"],
  },
  {
    id: 4,
    name: "Software Deployment",
    permissions: "Read Only",

    users: 8,
    actions: ["Edit"],
  },
  {
    id: 5,
    name: "Guest Auditor",
    permissions: "Limited",

    users: 8,
    actions: ["View"],
  },
];
export const RolesColumnsTable = (
  hoveredRowId: number | null
): TableColumn<RolesType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Role Name
        </span>
      ),
      selector: (row: RolesType) => row.name,
      sortable: true,
      id: "name",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Permissions
        </span>
      ),
      selector: (row: RolesType) => row.permissions,
      sortable: true,
      id: "permissions",
    },

    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Users
        </span>
      ),
      selector: (row: RolesType) => row.users,
      sortable: true,
      id: "users",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span>
        </span>
      ),
      width: "100px",
      cell: (row: RolesType) => {
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
                            <h3>Delete Role</h3>
                            <p>
                              Are you sure you want to delete the selected role?
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
  ].filter(Boolean) as TableColumn<RolesType>[];

export const tabs = [
  {
    key: "dashboard",
    label: "Dashboard",
    permission: "All",
    fields: ["View Stats", "Edit Widgets"],
  },
  {
    key: "hyperCommand",
    label: "Hyper Command",
    permission: "Read",
    fields: ["Execute", "Schedule", "Audit Logs"],
  },
  {
    key: "assets",
    label: "Assets",
    permission: "None",
    fields: ["View Hardware", "Edit Hardware", "Assign Owner"],
  },
  {
    key: "tickets",
    label: "Tickets",
    permission: "None",
    fields: ["View Tickets", "Assign Tickets", "Close Tickets"],
  },
  {
    key: "help desk",
    label: "Help Desk",
    permission: "All",
    fields: ["View ", "Create", "Edit", "Delete"],
  },
  {
    key: "userManagement",
    label: "User Management",
    permission: "Read",
    fields: ["Add User", "Delete User", "Assign Roles"],
  },
] as const;
export const permissions = ["All", "Read", "None"];

//groups
export const GroupsColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<GroupsType>,
  handleInputChange: (field: "name" | "description", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<GroupsType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Group Name
        </span>
      ),
      selector: (row) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. Network Admins"
            disabled={disableInputRow}
          />
        ) : (
          row.name
        ),
    },

    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Description
        </span>
      ),
      selector: (row) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="What this group manages or handles..."
            disabled={disableInputRow}
          />
        ) : (
          row.description
        ),
    },

    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Members
        </span>
      ),
      selector: (row) =>
        row.isInputRow ? <span className="text-muted">0</span> : row.members,
    },
    {
      name: "",
      width: "100px",
      cell: (row) =>
        row.isInputRow ? (
          <div className="d-flex gap-2 align-items-center">
            {isHoveringInputRow && (
              <>
                <button
                  className="table-btn-action"
                  onClick={handleSave}
                  disabled={disableInputRow}
                >
                  <i className="bi bi-check-lg text-success table-icon" />
                </button>
                <button className="table-btn-action" onClick={handleCancel}>
                  <i className="bi bi-x-lg text-danger table-icon" />
                </button>
              </>
            )}
          </div>
        ) : hoveredRowId === row.id ? (
          <div className="d-flex gap-2">
            <button className="table-btn-action">
              <i className="bi bi-pencil text-primary table-icon"></i>
            </button>
            <button className="table-btn-action">
              <i className="bi bi-x-lg text-danger table-icon"></i>
            </button>
          </div>
        ) : null,
    },
  ] as TableColumn<GroupsType>[];

export const groupsMockData = [
  {
    id: 1,
    name: "IT Administrator",
    description: "desc",
    members: 3,
  },
  {
    id: 2,
    name: "Support Technician",
    description: "desc",
    members: 3,
  },
  {
    id: 3,
    name: "Network Manager",
    description: "desc",
    members: 709,
  },
  {
    id: 4,
    name: "Software Deployment",
    description: "desc",
    members: 7,
  },
  {
    id: 5,
    name: "Guest Auditor",
    description: "desc",
    members: 133,
  },
];

//department
export const DepartmentsColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<DepartmentsType>,
  handleInputChange: (field: "name", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<DepartmentsType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Department Name
        </span>
      ),
      selector: (row: DepartmentsType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. Network Admins"
            disabled={disableInputRow}
          />
        ) : (
          row.name
        ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Employees
        </span>
      ),
      selector: (row: DepartmentsType) =>
        row.isInputRow ? <span className="text-muted">0</span> : row.members,
    },
    {
      name: "",
      width: "100px",
      cell: (row: DepartmentsType) =>
        row.isInputRow ? (
          <div className="d-flex gap-2 align-items-center">
            {isHoveringInputRow && (
              <>
                <button
                  className="table-btn-action"
                  onClick={handleSave}
                  disabled={disableInputRow}
                >
                  <i className="bi bi-check-lg text-success table-icon" />
                </button>
                <button className="table-btn-action" onClick={handleCancel}>
                  <i className="bi bi-x-lg text-danger table-icon" />
                </button>
              </>
            )}
          </div>
        ) : hoveredRowId === row.id ? (
          <div className="d-flex gap-2">
            <button className="table-btn-action">
              <i className="bi bi-pencil text-primary table-icon"></i>
            </button>
            <button className="table-btn-action">
              <i className="bi bi-x-lg text-danger table-icon"></i>
            </button>
          </div>
        ) : null,
    },
  ] as TableColumn<DepartmentsType>[];

export const depsMockData = [
  {
    id: 1,
    name: "IT Administrator",
    members: 3,
  },
  {
    id: 2,
    name: "Support Technician",
    members: 3,
  },
  {
    id: 3,
    name: "Network Manager",
    members: 709,
  },
  {
    id: 4,
    name: "Software Deployment",
    members: 7,
  },
  {
    id: 5,
    name: "Guest Auditor",
    members: 133,
  },
];

//locations
export const LocationsColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<LocationsType>,
  handleInputChange: (field: "name" | "address", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<LocationsType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Location Name
        </span>
      ),
      selector: (row: LocationsType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. Network Admins"
            disabled={disableInputRow}
          />
        ) : (
          row.name
        ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Address
        </span>
      ),
      selector: (row: LocationsType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Address"
            disabled={disableInputRow}
          />
        ) : (
          row.address
        ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Departments
        </span>
      ),
      selector: (row: LocationsType) =>
        row.isInputRow ? (
          <span className="text-muted">0</span>
        ) : (
          row.departments
        ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Employees
        </span>
      ),
      selector: (row: LocationsType) =>
        row.isInputRow ? <span className="text-muted">0</span> : row.employees,
    },
    {
      name: "",
      width: "100px",
      cell: (row: DepartmentsType) =>
        row.isInputRow ? (
          <div className="d-flex gap-2 align-items-center">
            {isHoveringInputRow && (
              <>
                <button
                  className="table-btn-action"
                  onClick={handleSave}
                  disabled={disableInputRow}
                >
                  <i className="bi bi-check-lg text-success table-icon" />
                </button>
                <button className="table-btn-action" onClick={handleCancel}>
                  <i className="bi bi-x-lg text-danger table-icon" />
                </button>
              </>
            )}
          </div>
        ) : hoveredRowId === row.id ? (
          <div className="d-flex gap-2">
            <button className="table-btn-action">
              <i className="bi bi-pencil text-primary table-icon"></i>
            </button>
            <button className="table-btn-action">
              <i className="bi bi-x-lg text-danger table-icon"></i>
            </button>
          </div>
        ) : null,
    },
  ] as TableColumn<LocationsType>[];

export const locationsMockData = [
  {
    id: 1,
    name: "IT Administrator",
    address: "address",
    departments: 9,
    employees: 3,
  },
  {
    id: 2,
    name: "Support Technician",
    address: "address",
    departments: 9,
    employees: 3,
  },
  {
    id: 3,
    name: "Network Manager",
    address: "address",
    departments: 9,
    employees: 3,
  },
  {
    id: 4,
    name: "Software Deployment",
    address: "address",
    departments: 9,
    employees: 3,
  },
  {
    id: 5,
    name: "Guest Auditor",
    address: "address",
    departments: 9,
    employees: 3,
  },
];

//aliases
export const computersList = [
  { id: 1, name: "Desktop 1" },
  { id: 2, name: "Desktop 2" },
  { id: 3, name: "Desktop 3" },
  { id: 4, name: "Desktop 4" },
  { id: 5, name: "Desktop 5" },
];
const computerOptions = computersList.map((c) => ({
  value: c.id.toString(),
  label: c.name,
}));

export const AliasesColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<AliasesType>,
  handleInputChange: (field: "computer" | "alias", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<AliasesType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Computer
        </span>
      ),
      cell: (row: AliasesType) =>
        row.isInputRow ? (
          <Select
            classNamePrefix="react-select"
            className="form-select-container w-50"
            options={computerOptions}
            isDisabled={disableInputRow}
            value={computerOptions.find(
              (opt) => opt.value === inputRowData.computer
            )}
            onChange={(selected) =>
              handleInputChange("computer", selected?.value || "")
            }
            placeholder="Select Computer"
            isClearable
          />
        ) : (
          row.computer
        ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Alias
        </span>
      ),
      cell: (row: AliasesType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.alias || ""}
            onChange={(e) => handleInputChange("alias", e.target.value)}
            placeholder="Alias"
            disabled={disableInputRow}
          />
        ) : (
          row.alias
        ),
    },
    {
      name: "",
      width: "100px",
      cell: (row: AliasesType) =>
        row.isInputRow ? (
          <div className="d-flex gap-2 align-items-center">
            {isHoveringInputRow && (
              <>
                <button
                  className="table-btn-action"
                  onClick={handleSave}
                  disabled={disableInputRow}
                >
                  <i className="bi bi-check-lg text-success table-icon" />
                </button>
                <button className="table-btn-action" onClick={handleCancel}>
                  <i className="bi bi-x-lg text-danger table-icon" />
                </button>
              </>
            )}
          </div>
        ) : hoveredRowId === row.id ? (
          <div className="d-flex gap-2">
            <button className="table-btn-action">
              <i className="bi bi-pencil text-primary table-icon"></i>
            </button>
            <button className="table-btn-action">
              <i className="bi bi-x-lg text-danger table-icon"></i>
            </button>
          </div>
        ) : null,
    },
  ] as TableColumn<AliasesType>[];

export const aliesesMockData = [
  {
    id: 1,
    alias: "IT Administrator",
    computer: "desktop 1",
  },
  {
    id: 2,
    alias: "Support Technician",
    computer: "desktop 2",
  },
  {
    id: 3,
    alias: "Network Manager",
    computer: "desktop 3",
  },
  {
    id: 4,
    alias: "Software Deployment",
    computer: "desktop 4",
  },
  {
    id: 5,
    alias: "Guest Auditor",
    computer: "desktop 5",
  },
];

//users

export const steps = [
  {
    id: 1,
    title: "Basic Info",
    iconClass: "fa fa-user-circle",
  },
  {
    id: 2,
    title: "Role Assignment & Supervision",
    iconClass: "fa fa-shield-alt",
  },
  {
    id: 3,
    title: "Workplace Assignment",
    iconClass: "fa fa-sitemap",
  },
  {
    id: 4,
    title: "Profile Summary",
    iconClass: "fa fa-id-badge",
  },
];

const gradientColors = [
  "#0061ff",
  "#60efff",
  "#e81cff",
  "#40c9ff",
  "#595cff",
  "#c6f8ff",
];

const generateGradient = (name: string) => {
  const hash = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const color1 = gradientColors[hash % gradientColors.length];
  const color2 = gradientColors[(hash + 1) % gradientColors.length];
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export const UsersColumnsTable = (
  hoveredRowId: number | null
): TableColumn<UsersType>[] =>
  [
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Name
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UsersType) => row.name,
      sortable: true,
      id: "name",
      cell: (row: UsersType) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              background: generateGradient(row.name),
              color: "#fff",
              width: "30px",
              height: "30px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {row.name?.charAt(0) || "?"}
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Group
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UsersType) => row.group,
      sortable: true,
      id: "group",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Department
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UsersType) => row.department,
      sortable: true,
      id: "department",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Location
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UsersType) => row.location,
      sortable: true,
      id: "location",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Supervised By
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UsersType) => row.supervisedBy,
      sortable: true,
      id: "supervisedBy",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Status
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: UsersType) => (row.isActive ? "Active" : "Inactive"),
      sortable: false,
      id: "status",
      cell: (row: UsersType) => {
        return (
          <span
            style={{
              backgroundColor: "#e3edff",
              color: "#333",
              fontWeight: "500",
              padding: "5px",
              borderRadius: "3px",
              width: "65px",
              textAlign: "center",
            }}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span>
        </span>
      ),
      width: "100px",
      cell: (row: UsersType) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);

        const handleDeleteClick = () => setShowDeleteModal(true);
        const confirmDelete = () => setShowDeleteModal(false);
        const cancelDelete = () => setShowDeleteModal(false);

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
                            <h3>Delete User</h3>
                            <p>
                              Are you sure you want to delete the selected user?
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
  ].filter(Boolean) as TableColumn<UsersType>[];

export const usersMockData = [
  {
    id: 1,
    name: "Karem Salah",
    department: ["Sales", "Marketing"],
    group: ["Managers", "Team Leads"],
    location: ["North Region", "HQ"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 2,
    name: "Ibrahim Darwish",
    department: ["HR"],
    group: ["Employees"],
    location: ["All"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 3,
    name: "Abbass Zoughaib",
    department: ["Operations"],
    group: ["Contractors", "Vendors"],
    location: ["West Region"],
    supervisedBy: "Aly Salemeh",
    isActive: false,
  },
  {
    id: 4,
    name: "Rida Wazneh",
    department: ["Finance", "HR"],
    group: ["Auditors"],
    location: ["HQ", "East Region"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 5,
    name: "Show Bonus Field",
    department: ["Executive"],
    group: ["C-Level"],
    location: ["HQ"],
    supervisedBy: "Aly Salemeh",
    isActive: false,
  },
  {
    id: 11,
    name: "Karem Salah",
    department: ["Sales", "Marketing"],
    group: ["Managers", "Team Leads"],
    location: ["North Region", "HQ"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 12,
    name: "Ibrahim Darwish",
    department: ["HR"],
    group: ["Employees"],
    location: ["All"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 13,
    name: "Abbass Zoughaib",
    department: ["Operations"],
    group: ["Contractors", "Vendors"],
    location: ["West Region"],
    supervisedBy: "Aly Salemeh",
    isActive: false,
  },
  {
    id: 14,
    name: "Rida Wazneh",
    department: ["Finance", "HR"],
    group: ["Auditors"],
    location: ["HQ", "East Region"],
    supervisedBy: "Aly Salemeh",
    isActive: true,
  },
  {
    id: 15,
    name: "Show Bonus Field",
    department: ["Executive"],
    group: ["C-Level"],
    location: ["HQ"],
    supervisedBy: "Aly Salemeh",
    isActive: false,
  },
];
