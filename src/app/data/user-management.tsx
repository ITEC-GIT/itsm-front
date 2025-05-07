import { TableColumn } from "react-data-table-component";
import { useState } from "react";
import {
  AliasesType,
  DepartmentsType,
  FieldRulesType,
  GroupsType,
  LocationsType,
  RolesType,
  UserType,
} from "../types/user-management";
import Select from "react-select";
import {
  columnLargeWidth,
  columnMediumWidth,
  columnSmallWidth,
  columnXLargeWidth,
  columnXXLargeWidth,
  columnXXXLargeWidth,
} from "./dataTable";
import { FaComputer } from "react-icons/fa6";
import { LuMonitor } from "react-icons/lu";
import { BasicType } from "../types/common";

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
  hoveredRowId: number | null,
  handleEditClick: (row: RolesType) => void
): TableColumn<RolesType>[] =>
  [
    {
      name: (
        <span className="ms-2"> Role Name
        </span>
      ),
      selector: (row: RolesType) => row.name,
      sortable: true,
      id: "name",
    },
    {
      name: (
        <span className="ms-2"> Permissions
        </span>
      ),
      selector: (row: RolesType) => row.permissions,
      sortable: true,
      id: "permissions",
    },

    {
      name: (
        <span className="ms-2"> Users
        </span>
      ),
      selector: (row: RolesType) => row.users,
      sortable: true,
      id: "users",
    },
    {
      name: (
        <span className="ms-2">
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
                <button
                  className="table-btn-action"
                  onClick={() => handleEditClick(row)}
                >
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
        <span className="ms-2"> Group Name
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
        <span className="ms-2"> Description
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
        <span className="ms-2"> Members
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

export const locationsOptions = [
  {
    id: 1,
    name: "IT Administrator",
  },
  {
    id: 2,
    name: "Support Technician",
  },
  {
    id: 3,
    name: "Network Manager",
  },
  {
    id: 4,
    name: "Software Deployment",
  },
  {
    id: 5,
    name: "Guest Auditor",
  },
].map((location) => ({
  value: location.id.toString(),
  label: location.name,
}));

export const DepartmentsColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<DepartmentsType>,
  handleInputChange: (field: "name" | "location", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<DepartmentsType>[] =>
  [
    {
      name: (
        <span className="ms-2"> Department Name
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
        <span className="ms-2"> Location
        </span>
      ),
      cell: (row: DepartmentsType) =>
        row.isInputRow ? (
          <Select
            classNamePrefix="react-select"
            className="form-select-container w-100"
            options={locationsOptions}
            isDisabled={disableInputRow}
            value={locationsOptions.find(
              (opt) => opt.value === inputRowData.location
            )}
            onChange={(selected) =>
              handleInputChange("location", selected?.value || "")
            }
            placeholder="Select Location"
            isClearable
          />
        ) : (
          <>{row.location}</>
        ),
    },
    {
      name: (
        <span className="ms-2"> Employees
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
    location: "location1",
    members: 3,
  },
  {
    id: 2,
    name: "Support Technician",
    location: "location1",
    members: 3,
  },
  {
    id: 3,
    name: "Network Manager",
    location: "location1",
    members: 709,
  },
  {
    id: 4,
    name: "Software Deployment",
    location: "location1",
    members: 7,
  },
  {
    id: 5,
    name: "Guest Auditor",
    location: "location1",
    members: 133,
  },
];

//locations
export const LocationsColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<LocationsType>,
  handleInputChange: (
    field: "name" | "address" | "state",
    value: string
  ) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<LocationsType>[] =>
  [
    {
      name: (
        <span className="ms-2"> Location Name
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
        <span className="ms-2"> Address
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
        <span className="ms-2"> State
        </span>
      ),
      selector: (row: LocationsType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.state || ""}
            onChange={(e) => handleInputChange("state", e.target.value)}
            placeholder="State"
            disabled={disableInputRow}
          />
        ) : (
          row.address
        ),
    },
    {
      name: (
        <span className="ms-2"> Departments
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
        <span className="ms-2"> Employees
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
    state: "state",
    departments: 9,
    employees: 3,
  },
  {
    id: 2,
    name: "Support Technician",
    address: "address",
    state: "state",
    departments: 9,
    employees: 3,
  },
  {
    id: 3,
    name: "Network Manager",
    address: "address",
    state: "state",
    departments: 9,
    employees: 3,
  },
  {
    id: 4,
    name: "Software Deployment",
    address: "address",
    state: "state",
    departments: 9,
    employees: 3,
  },
  {
    id: 5,
    name: "Guest Auditor",
    address: "address",
    state: "state",
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
        <span className="ms-2"> Computer
        </span>
      ),
      cell: (row: AliasesType) =>
        row.isInputRow ? (
          <Select
            classNamePrefix="react-select"
            className="form-select-container w-100"
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
          <>
            <span
              className="category-span w-62px me-5"
              style={{
                backgroundColor: "#e0e0e0", //"#d9d3cb", //
              }}
            >
              <LuMonitor />
            </span>
            {row.computer}
          </>
        ),
    },
    {
      name: (
        <span className="ms-2"> Alias
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
    title: "Role Mapping and Workstation",
    iconClass: "fa fa-shield-alt",
  },
  {
    id: 3,
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

export const initialUserData: UserType = {
  id: 0,
  name: "",
  username: "",
  email: "",
  roles: [],
  department: null,
  groups: [],
  isActive: true,
  profile_image: "",
  phone: null,
  phone2: null,
  mobile: null,
  comment: null,
  preferred_name: null,
  title: null,
};

export const UsersColumnsTable = (
  hoveredRowId: number | null,
  handleEditUser: (user: UserType) => void,
  handleDeleteUser: (userId: number) => void
): TableColumn<UserType>[] =>
  [
    {
      name: (
        <span className="ms-2"> Name
        </span>
      ),
      width: columnXXXLargeWidth,
      selector: (row: UserType) => row.name,
      sortable: true,
      id: "name",
      cell: (row: UserType) => (
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
        <span className="ms-2"> Username
        </span>
      ),
      width: columnXXXLargeWidth,
      selector: (row: UserType) => row.username,
      sortable: true,
      id: "username",
    },
    {
      name: (
        <span className="ms-2"> Roles
        </span>
      ),
      width: columnXXXLargeWidth,
      selector: (row: UserType) =>
        row.roles.map((role) => role.name).join(", "),
      sortable: true,
      id: "roles",
      cell: (row: UserType) => (
        <div className="d-flex flex-wrap gap-1">
          {row.roles.map((role) => (
            <span
              key={role.id}
              className="badge bg-primary text-white"
              style={{
                fontSize: "12px",
                padding: "5px 10px",
                borderRadius: "10px",
              }}
            >
              {role.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: (
        <span className="ms-2"> Title
        </span>
      ),
      width: columnXLargeWidth,
      selector: (row: UserType) => row.title?.name || "",
      sortable: true,
      id: "title",
    },
    {
      name: (
        <span className="ms-2"> Groups
        </span>
      ),
      width: columnXXXLargeWidth,
      selector: (row: UserType) =>
        (row.groups ?? []).map((g) => g.name).join(", "),
      sortable: true,
      id: "group",
      cell: (row: UserType) => (
        <div className="d-flex flex-wrap gap-1">
          {row.groups?.map((grp: BasicType) => (
            <span
              key={grp.id}
              className="badge bg-success text-white"
              style={{
                fontSize: "12px",
                padding: "5px 10px",
                borderRadius: "10px",
              }}
            >
              {grp.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: (
        <span className="ms-2"> Department
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UserType) => row.department?.name,
      sortable: true,
      id: "department",
      cell: (row: UserType) => (
        <div className="d-flex flex-wrap gap-1">
          <span
            className="badge bg-warning text-dark"
            style={{
              fontSize: "12px",
              padding: "5px 10px",
              borderRadius: "10px",
            }}
          >
            {row.department?.name}
          </span>
        </div>
      ),
    },
    {
      name: (
        <span className="ms-2"> Location
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: UserType) => row.location?.name || "",
      sortable: true,
      id: "location",
    },
    // {
    //   name: (
    //     <span>
    //       <span style={{ color: "#f0f0f0" }}>|</span> Supervised By
    //     </span>
    //   ),
    //   width: columnXXLargeWidth,
    //   selector: (row: UserType) => row.supervisedBy,
    //   sortable: true,
    //   id: "supervisedBy",
    // },
    {
      name: (
        <span className="ms-2"> Status
        </span>
      ),
      width: columnMediumWidth,
      selector: (row: UserType) => (row.isActive ? "Active" : "Inactive"),
      sortable: false,
      id: "status",
      cell: (row: UserType) => {
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
        <span className="ms-2">
        </span>
      ),
      width: "100px",
      cell: (row: UserType) => {
        const [showDeleteModal, setShowDeleteModal] = useState(false);

        const handleDeleteClick = () => setShowDeleteModal(true);

        const cancelDelete = () => setShowDeleteModal(false);

        return (
          <div
            className={`d-flex align-items-start ${
              hoveredRowId === row.id ? "show" : "hide"
            }`}
          >
            {hoveredRowId === row.id && (
              <>
                <button
                  className="table-btn-action"
                  onClick={() => handleEditUser(row)}
                >
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
                            onClick={(row) => {
                              handleDeleteUser(hoveredRowId);
                              setShowDeleteModal(false);
                            }}
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
  ].filter(Boolean) as TableColumn<UserType>[];

//field rules
export const FieldRulesColumnsTable = (
  hoveredRowId: number | null,
  inputRowData: Partial<FieldRulesType>,
  handleInputChange: (field: "name" | "rule", value: string) => void,
  handleSave: () => void,
  handleCancel: () => void,
  disableInputRow: boolean,
  isHoveringInputRow: boolean
): TableColumn<FieldRulesType>[] =>
  [
    {
      name: (
        <span className="ms-2"> Field Rule Name
        </span>
      ),
      cell: (row: FieldRulesType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Field Rule Name"
            disabled={disableInputRow}
          />
        ) : (
          row.name
        ),
    },
    {
      name: (
        <span className="ms-2"> Field Rule
        </span>
      ),
      cell: (row: FieldRulesType) =>
        row.isInputRow ? (
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            style={{ fontSize: "0.9rem" }}
            value={inputRowData.rule || ""}
            onChange={(e) => handleInputChange("rule", e.target.value)}
            placeholder="Field Rule"
            disabled={disableInputRow}
          />
        ) : (
          row.rule
        ),
    },
    {
      name: (
        <span className="ms-2"> Used In Tabs
        </span>
      ),
      cell: (row: FieldRulesType) =>
        Array.isArray(row.usedInTabs) ? row.usedInTabs.join(", ") : "—",
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
  ] as TableColumn<FieldRulesType>[];

export const fieldRulesMockData = [
  {
    id: 1,
    name: "Create",
    rule: "All",
    usedInTabs: ["All"],
  },
  {
    id: 2,
    name: "Edit",
    rule: "None",
    usedInTabs: ["All"],
  },
  {
    id: 3,
    name: "Delete",
    rule: "Read",
    usedInTabs: ["General", "Assets", "Tickets"],
  },
  {
    id: 4,
    name: "Reply",
    rule: "All",
    usedInTabs: ["Tickets"],
  },
  {
    id: 5,
    name: "Cancel",
    rule: "All",
    usedInTabs: ["Software Installation"],
  },
];
