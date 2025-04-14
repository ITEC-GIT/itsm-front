import { TableColumn } from "react-data-table-component";
import { columnXLargeWidth } from "./dataTable";
import { useState } from "react";

export const RolesActiveFilters = [];

export const rolesMockData = [
  {
    id: 1,
    name: "IT Administrator",
    permissions: "View All",
    supervisedBy: "Alex Haddad",
    users: ["Sara Karam", "Jad Mansour", "Omar Nasser"],
    actions: ["Edit", "Delete"],
  },
  {
    id: 2,
    name: "Support Technician",
    permissions: "Limited",
    supervisedBy: "Maya Farhat",
    users: ["Rami Sleiman", "Nour Hamdan"],
    actions: ["Edit"],
  },
  {
    id: 3,
    name: "Network Manager",
    permissions: "View All",
    supervisedBy: "Tony Rizk",
    users: ["Lara Youssef"],
    actions: ["Edit", "Delete"],
  },
  {
    id: 4,
    name: "Software Deployment",
    permissions: "Read Only",
    supervisedBy: "Nadine Abou Jaoude",
    users: ["Firas Khoury", "Salma Ayoub"],
    actions: ["Edit"],
  },
  {
    id: 5,
    name: "Guest Auditor",
    permissions: "Limited",
    supervisedBy: "Compliance Officer",
    users: ["External Auditor"],
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
          <span style={{ color: "#f0f0f0" }}>|</span> Supervised By
        </span>
      ),
      selector: (row: RolesType) => row.supervisedBy,
      sortable: true,
      id: "supervisedBy",
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
