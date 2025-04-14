import React, { useEffect, useRef, useState } from "react";

interface RolePermissionFields {
  [field: string]: string;
}

interface RolePermissions {
  [tabKey: string]: {
    access: string;
    fields?: RolePermissionFields;
  };
}

interface RoleCreationWizardModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: {
    roleName: string;
    supervisorRole: string;
    permissions: RolePermissions;
  }) => void;
}

const RoleCreationWizardModal = ({
  show,
  onClose,
  onSave,
}: RoleCreationWizardModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [supervisorRole, setSupervisorRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [accordionOpen, setAccordionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const accessLevels = ["None", "Read", "All"] as const;
  type AccessLevel = (typeof accessLevels)[number];

  const tabs = [
    {
      key: "dashboard",
      label: "Dashboard",
      fields: ["View Stats", "Edit Widgets"],
    },
    {
      key: "hyperCommand",
      label: "Hyper Command",
      fields: ["Execute", "Schedule", "Audit Logs"],
    },
    {
      key: "assets",
      label: "Assets",
      fields: ["View Hardware", "Edit Hardware", "Assign Owner"],
    },
    {
      key: "tickets",
      label: "Tickets",
      fields: ["View Tickets", "Assign Tickets", "Close Tickets"],
    },
    {
      key: "userManagement",
      label: "User Management",
      fields: ["Add User", "Delete User", "Assign Roles"],
    },
  ] as const;

  const handleAccessChange = (tabKey: string, value: AccessLevel) => {
    setPermissions((prev) => ({
      ...prev,
      [tabKey]: { ...prev[tabKey], access: value },
    }));
  };

  const handleFieldChange = (
    tabKey: string,
    field: string,
    value: AccessLevel
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        fields: {
          ...((prev[tabKey] && prev[tabKey].fields) || {}),
          [field]: value,
        },
      },
    }));
  };

  const toggleAccordion = (tabKey: string) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [tabKey]: !prev[tabKey],
    }));
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the modal when clicking outside
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      id="roleCreationModal"
      tabIndex={-1}
      aria-hidden={!show}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header border-0">
            <h5 className="modal-title">Create New Role</h5>
          </div>
          <div
            className="modal-body"
            style={{ height: "60vh", overflowY: "auto" }}
          >
            <form>
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Supervisor Role</label>
                    <select
                      className="form-select"
                      value={supervisorRole}
                      onChange={(e) => setSupervisorRole(e.target.value)}
                    >
                      <option value="">Select Supervisor</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3">
                  <div
                    className="nav flex-column nav-pills align-items-start"
                    id="v-pills-tab"
                    role="tablist"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        className={`nav-link ${
                          activeTab === tab.key ? "active" : ""
                        }`}
                        id={`v-pills-${tab.key}-tab`}
                        type="button"
                        role="tab"
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                        <i
                          className={`bi ${
                            accordionOpen[tab.key]
                              ? "bi-dash-circle"
                              : "bi-plus-circle"
                          } ms-2`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccordion(tab.key);
                          }}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-sm-9">
                  <div className="tab-content" id="v-pills-tabContent">
                    {tabs.map((tab) => (
                      <div
                        key={tab.key}
                        className={`tab-pane fade ${
                          activeTab === tab.key ? "show active" : ""
                        }`}
                        id={`v-pills-${tab.key}`}
                        role="tabpanel"
                        aria-labelledby={`v-pills-${tab.key}-tab`}
                      >
                        <div className="mb-3">
                          <label className="form-label">Access Level</label>
                          <select
                            className="form-select"
                            value={permissions[tab.key]?.access || "None"}
                            onChange={(e) =>
                              handleAccessChange(
                                tab.key,
                                e.target.value as AccessLevel
                              )
                            }
                          >
                            {accessLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                        {accordionOpen[tab.key] && (
                          <div className="accordion" id={`${tab.key}Accordion`}>
                            <div className="accordion-item">
                              <h2
                                className="accordion-header"
                                id={`${tab.key}Heading`}
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#${tab.key}Collapse`}
                                  aria-expanded="true"
                                  aria-controls={`${tab.key}Collapse`}
                                >
                                  Field Permissions
                                </button>
                              </h2>
                              <div
                                id={`${tab.key}Collapse`}
                                className="accordion-collapse collapse show"
                                aria-labelledby={`${tab.key}Heading`}
                                data-bs-parent={`#${tab.key}Accordion`}
                              >
                                <div className="accordion-body">
                                  {tab.fields.map((field) => (
                                    <div key={field} className="mb-2">
                                      <label className="form-label">
                                        {field}
                                      </label>
                                      <select
                                        className="form-select"
                                        value={
                                          permissions[tab.key]?.fields?.[
                                            field
                                          ] || "None"
                                        }
                                        onChange={(e) =>
                                          handleFieldChange(
                                            tab.key,
                                            field,
                                            e.target.value as AccessLevel
                                          )
                                        }
                                      >
                                        {accessLevels.map((level) => (
                                          <option key={level} value={level}>
                                            {level}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="d-flex justify-content-end mb-3 gap-3 p-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onSave({ roleName, supervisorRole, permissions })}
            >
              Save Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoleCreationWizardModal };
