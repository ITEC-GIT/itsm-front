import { useEffect, useRef, useState } from "react";
import { permissions, tabs } from "../../data/user-management";
import { FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
interface RolePermissionFields {
  [field: string]: string;
}

interface RolePermissions {
  [tabKey: string]: {
    access: string;
    fields?: RolePermissionFields;
  };
}

interface RoleCreationModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: { roleName: string; permissions: RolePermissions }) => void;
}

const RoleCreationModal = ({
  show,
  onClose,
  onSave,
}: RoleCreationModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [roleNameError, setRoleNameError] = useState<boolean>(false);

  const [accordionOpen, setAccordionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [permissionsState, setPermissionsState] = useState<{
    [key: string]: {
      fields: {
        [field: string]: AccessLevel;
      };
    };
  }>({});

  type AccessLevel = (typeof permissions)[number];

  const renderPermissionToggle = (
    uniqueKey: string,
    currentPermission: AccessLevel,
    onChange: (perm: AccessLevel) => void
  ) => (
    <div className="btn-group btn-group-sm" role="group">
      {permissions.map((perm, index) => (
        <button
          key={`${uniqueKey}_${perm}`}
          className="btn "
          type="button"
          style={{
            backgroundColor: currentPermission === perm ? "#6c737c" : "#e1e2e5",
            color: currentPermission === perm ? "white" : "#6c737c",
            fontWeight: "900",
          }}
          onClick={() => onChange(perm as AccessLevel)}
        >
          {perm}
        </button>
      ))}
    </div>
  );

  const handleFieldChange = (
    tabKey: string,
    field: string,
    value: AccessLevel
  ) => {
    setPermissionsState((prev: typeof permissionsState) => ({
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
    if (show) {
      const initialState = Object.fromEntries(
        tabs.map((tab) => [
          tab.key,
          {
            fields: Object.fromEntries(
              tab.fields.map((field) => [field, tab.permission])
            ),
          },
        ])
      );
      setPermissionsState(initialState);
    }
  }, [show]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
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

  const calculateTabPermission = (tabKey: string): AccessLevel => {
    const fields = permissionsState[tabKey]?.fields;
    if (!fields) return "None";

    const values = Object.values(fields);
    const unique = new Set(values);

    if (unique.size === 1) return values[0];
    return "Custom" as AccessLevel;
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      setRoleNameError(true);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      id="roleCreationModal"
      tabIndex={-1}
      aria-hidden={!show}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header border-0 flex-column align-items-start pb-0">
            <h3 className="modal-title fw-bold mb-1">Add New Role</h3>
            <p className="text-muted fs-6 m-0">
              Create a new user role with specific permissions
            </p>
          </div>

          <div
            className="modal-body"
            style={{ height: "60vh", overflowY: "auto" }}
          >
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label required">Role Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={roleName}
                    onChange={(e) => {
                      setRoleNameError(false);
                      setRoleName(e.target.value);
                    }}
                    placeholder="e.g. Administrator, Editor"
                    required
                  />
                  {roleNameError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please provide a valid destination (starts with "/").
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="permissions-section">
              <h5>Permission Settings</h5>
              <p className="text-muted fs-6 m-0">
                Configure access levels for different sections
              </p>

              <div className="permissions-list mt-3">
                {tabs.map((tab) => (
                  <div key={tab.key} className="permission-item">
                    <div className="permission-header">
                      <button
                        className="accordion-toggle"
                        onClick={() => toggleAccordion(tab.key)}
                        aria-expanded={accordionOpen[tab.key]}
                      >
                        {accordionOpen[tab.key] ? (
                          <FiChevronDown className="accordion-icon" />
                        ) : (
                          <FiChevronRight className="accordion-icon" />
                        )}
                        <span className="permission-title">{tab.label}</span>
                      </button>

                      {renderPermissionToggle(
                        tab.key,
                        calculateTabPermission(tab.key),
                        (perm) => {
                          const updatedFields = Object.fromEntries(
                            tab.fields.map((field) => [field, perm])
                          );
                          setPermissionsState((prev) => ({
                            ...prev,
                            [tab.key]: { fields: updatedFields },
                          }));
                        }
                      )}
                    </div>

                    {accordionOpen[tab.key] && (
                      <div className="permission-details ">
                        {tab.fields.map((field) => (
                          <div key={field} className="permission-field">
                            <label className="field-label">{field}</label>
                            {renderPermissionToggle(
                              `${tab.key}_${field}`,
                              permissionsState[tab.key]?.fields?.[field] ||
                                "None",
                              (perm) => handleFieldChange(tab.key, field, perm)
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center p-5">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoleCreationModal };
