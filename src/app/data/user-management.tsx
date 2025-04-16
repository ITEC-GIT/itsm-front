import { TableColumn } from "react-data-table-component";
import { useState } from "react";

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
          <span style={{ color: "#f0f0f0" }}>|</span> Name
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
