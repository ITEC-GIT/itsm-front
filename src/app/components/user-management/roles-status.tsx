import React, { useState } from "react";
import Select from "react-select";
import { CustomSwitch } from "../form/custom-switch";

interface RoleStatusStepProps {
  selectedRoleIds: number[];
  onToggleStatus: (value: boolean) => void;
  onRolesChange: (roleIds: number[]) => void;
}

const RoleStatusStep: React.FC<RoleStatusStepProps> = ({
  selectedRoleIds,
  onToggleStatus,
  onRolesChange,
}) => {
  const [rolesOption, setRolesOption] = useState([
    { id: 1, name: "Administrator" },
    { id: 2, name: "HR Manager" },
    { id: 3, name: "Team Lead" },
    { id: 4, name: "Technician" },
    { id: 5, name: "Viewer" },
    { id: 6, name: "Finance Officer" },
    { id: 7, name: "Support Agent" },
    { id: 8, name: "IT Manager" },
  ]);

  const roleOptions = rolesOption.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleRoleSelect = (selected: any) => {
    const ids = selected ? selected.map((r: any) => r.value) : [];
    onRolesChange(ids);
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-md-8">
          <label className="form-label fw-bold">Assign Roles</label>
          <Select
            isMulti
            classNamePrefix="select"
            options={roleOptions}
            value={roleOptions.filter((r) => selectedRoleIds.includes(r.value))}
            onChange={handleRoleSelect}
            placeholder="Select one or more roles"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Account Status</label>
          <CustomSwitch setStatus={onToggleStatus} />
        </div>
      </div>
    </>
  );
};

export { RoleStatusStep };
