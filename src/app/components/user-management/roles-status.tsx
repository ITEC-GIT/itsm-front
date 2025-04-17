import React, { useState } from "react";
import { CustomSwitch } from "../form/custom-switch";
import { CustomReactSelect } from "../form/custom-react-select";

interface RoleStatusStepProps {
  selectedRoleIds: number[];
  selectedSupervisorId: number | null;
  selectedSupervisedByRoleIds: number[];
  onRolesChange: (roleIds: number[]) => void;
  onSupervisorChange: (userId: number | null) => void;
  onSupervisedByRoleChange: (roleIds: number[] | []) => void;
  onToggleStatus: (value: boolean) => void;
}

const RoleStatusStep = ({
  selectedRoleIds,
  selectedSupervisorId,
  selectedSupervisedByRoleIds,
  onRolesChange,
  onSupervisorChange,
  onSupervisedByRoleChange,
  onToggleStatus,
}: RoleStatusStepProps) => {
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

  const supervisorUsers = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Carla Haddad" },
  ];

  const userOptions = supervisorUsers.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const handleRoleSelect = (selected: any) => {
    const ids = selected ? selected.map((r: any) => r.value) : [];
    onRolesChange(ids);
  };

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-bold required">Assign Roles</label>
            <CustomReactSelect
              isMulti={true}
              options={roleOptions}
              value={roleOptions.filter((r) =>
                selectedRoleIds.includes(r.value)
              )}
              onChange={handleRoleSelect}
              placeholder="Select one or more roles"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Supervised by Roles</label>
            <CustomReactSelect
              options={roleOptions}
              value={roleOptions.filter((r) =>
                selectedSupervisedByRoleIds.includes(r.value)
              )}
              onChange={(selected) =>
                onSupervisedByRoleChange(
                  selected ? selected.map((r: any) => r.value) : []
                )
              }
              isMulti={true}
              placeholder="Select supervising roles"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Supervisor</label>
            <CustomReactSelect
              options={userOptions}
              value={
                userOptions.find((u) => u.value === selectedSupervisorId) ||
                null
              }
              onChange={(selected) =>
                onSupervisorChange(selected ? selected.value : null)
              }
              isMulti={true}
              placeholder="Select a supervisor"
            />
          </div>

          <div>
            <label className="form-label fw-bold">Account Status</label>
            <CustomSwitch setStatus={onToggleStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RoleStatusStep };
