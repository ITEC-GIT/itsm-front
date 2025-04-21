import React, { useState } from "react";
import { CustomSwitch } from "../form/custom-switch";
import { CustomReactSelect } from "../form/custom-react-select";
import { UserFormData } from "./create-user-model";

const RolesWorkstationStep = ({
  formData,
  onChange,
}: {
  formData: UserFormData;
  onChange: (field: string, value: any) => void;
}) => {
  const rolesOption = [
    { id: 1, name: "Administrator" },
    { id: 2, name: "HR Manager" },
    { id: 3, name: "Team Lead" },
    { id: 4, name: "Technician" },
    { id: 5, name: "Viewer" },
    { id: 6, name: "Finance Officer" },
    { id: 7, name: "Support Agent" },
    { id: 8, name: "IT Manager" },
  ];

  const supervisorUsers = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Carla Haddad" },
  ];

  const groupsOption = [
    { id: 1, name: "Administrators" },
    { id: 2, name: "Managers" },
    { id: 3, name: "Staff" },
    { id: 4, name: "Contractors" },
  ];

  const departmentsOption = [
    { id: 1, name: "IT" },
    { id: 2, name: "HR" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Logistics" },
  ];

  const locationOptions = [
    { id: 1, name: "Beirut HQ" },
    { id: 2, name: "Tripoli Office" },
    { id: 3, name: "Jounieh Branch" },
  ];

  const mapOptions = (items: { id: number; name: string }[]) =>
    items.map((item) => ({ value: item.id, label: item.name }));

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-5">
            <label className="form-label fw-bold required">Assign Roles</label>
            <CustomReactSelect
              isMulti={true}
              options={mapOptions(rolesOption)}
              value={mapOptions(rolesOption).filter((r) =>
                formData.rolesId.includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "rolesId",
                  selected.map((r: any) => r.value)
                )
              }
              placeholder="Select one or more roles"
            />
          </div>

          <div className="mb-5">
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
          </div>

          <div className="mb-5">
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
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-5">
            <label className="form-label fw-bold">Select Groups</label>
            <CustomReactSelect
              options={mapOptions(groupsOption)}
              value={mapOptions(groupsOption).filter((r) =>
                formData.groupIds.includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "groupIds",
                  selected.map((r: any) => r.value)
                )
              }
              isMulti
              placeholder="Select one or more groups"
            />
          </div>

          <div className="mb-5">
            <label className="form-label fw-bold required">
              Select Departments
            </label>
            <CustomReactSelect
              options={mapOptions(departmentsOption)}
              value={mapOptions(departmentsOption).filter((r) =>
                formData.departmentIds.includes(r.value)
              )}
              onChange={(selected) =>
                onChange(
                  "departmentIds",
                  selected.map((r: any) => r.value)
                )
              }
              isMulti
              placeholder="Select one or more departments"
            />
          </div>

          <div className="mb-5">
            <label className="form-label fw-bold">Select Location</label>
            <CustomReactSelect
              options={mapOptions(locationOptions)}
              value={
                mapOptions(locationOptions).find(
                  (r) => formData.locationId === r.value
                ) || null
              }
              onChange={(selected) =>
                onChange("locationId", selected ? selected.value : null)
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
