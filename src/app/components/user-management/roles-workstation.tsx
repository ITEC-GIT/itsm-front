import { useState } from "react";

import { CustomReactSelect } from "../form/custom-react-select";
import { UserType } from "../../types/user-management";
import { useAtom } from "jotai";
import { usersPrerequisitesAtom } from "../../atoms/user-management-atoms/usersAtom";

const RolesWorkstationStep = ({
  formData,
  onChange,
  formErrors,
}: {
  formData: UserType;
  onChange: (field: string, value: any) => void;
  formErrors?: { [key: string]: string };
}) => {
  const [usersPrerequisites, setUsersPrerequisites] = useAtom(
    usersPrerequisitesAtom
  );

  const mapOptions = <T extends Record<string, any>>(
    items: T[],
    labelField: keyof T = "name"
  ) =>
    items.map((item) => ({
      value: item.id,
      label: String(item[labelField]),
    }));

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">Assign Roles</label>
            <CustomReactSelect
              isMulti={true}
              options={mapOptions(usersPrerequisites?.roles || [])}
              value={mapOptions(usersPrerequisites?.roles || []).filter((r) =>
                formData.roles?.map((role) => role.id).includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "roles",
                  Array.isArray(selected)
                    ? selected.map((r: any) => ({ id: r.value, name: r.label }))
                    : []
                )
              }
              placeholder="Select one or more roles"
            />
            {formErrors?.roles && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.roles}
              </small>
            )}
          </div>

          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">
              Select Department
            </label>
            <CustomReactSelect
              options={mapOptions(usersPrerequisites?.departments || [])}
              value={
                formData.department
                  ? {
                      value: formData.department.id,
                      label: formData.department.name,
                    }
                  : null
              }
              onChange={(selected) =>
                onChange(
                  "department",
                  selected ? { id: selected.value, name: selected.label } : null
                )
              }
              placeholder="Select one department"
              isClearable={false}
            />
            {formErrors?.department && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.department}
              </small>
            )}
          </div>

          {/* <div className="mb-5">
            <label className="form-label fw-bold">Supervised by Roles</label>
            <CustomReactSelect
              options={mapOptions(rolesOption)}
              value={mapOptions(rolesOption).filter((r) =>
                formData.supervisedByRoleIds.includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "supervisedByRoleIds",
                  selected.map((r: any) => r.value)
                )
              }
              isMulti={true}
              placeholder="Select supervising roles"
            />
          </div> */}

          {/* <div className="mb-5">
            <label className="form-label fw-bold">Supervisor</label>
            <CustomReactSelect
              options={mapOptions(supervisorUsers)}
              value={
                mapOptions(supervisorUsers).find(
                  (r) => formData.supervisorId === r.value
                ) || null
              }
              onChange={(selected) =>
                onChange("supervisorId", selected ? selected.value : null)
              }
              placeholder="Select a supervisor"
            />
          </div> */}
        </div>
        <div className="col-md-6">
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold">Select Groups</label>
            <CustomReactSelect
              options={mapOptions(usersPrerequisites?.groups || [])}
              value={mapOptions(usersPrerequisites?.groups || []).filter((r) =>
                formData.groups?.map((group) => group.id).includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "groups",
                  Array.isArray(selected)
                    ? selected.map((r: any) => ({ id: r.value, name: r.label }))
                    : []
                )
              }
              isMulti
              placeholder="Select one or more groups"
            />
          </div>

          {/* <div className="mb-5">
            <label className="form-label fw-bold required">
              Select Department
            </label>
            <CustomReactSelect
              options={mapOptions(departmentsOption)}
              value={mapOptions(departmentsOption).filter((r) =>
                formData.departmentId === r.value
              )}
              onChange={(selected) =>
                onChange(
                  "departmentIds",
                  selected.map((r: any) => r.value)
                )
              }
              placeholder="Select one or more departments"
            />
          </div> */}

          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold">Select Location</label>
            <CustomReactSelect
              options={mapOptions(usersPrerequisites?.locations || [])}
              value={
                formData.location
                  ? {
                      value: formData.location.id,
                      label: formData.location.name,
                    }
                  : null
              }
              onChange={(selected) =>
                onChange(
                  "location",
                  selected ? { id: selected.value, name: selected.label } : null
                )
              }
              placeholder="Select a location..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RolesWorkstationStep };
