import React, { useState } from "react";

interface GroupDeptStepProps {
  selectedGroups: number[];
  selectedDepartments: number[];
  onToggle: (type: "group" | "department", value: number) => void;
}

const GroupsAndDepartmentsStep = ({
  selectedGroups,
  selectedDepartments,
  onToggle,
}: GroupDeptStepProps) => {
  const [active, setActive] = useState<"group" | "department">("group");

  const [groupsOption, setGroupsOption] = useState([
    { id: 1, name: "Administrators" },
    { id: 2, name: "Managers" },
    { id: 3, name: "Staff" },
    { id: 4, name: "Contractors" },
    { id: 5, name: "Administrators" },
    { id: 6, name: "Managers" },
    { id: 7, name: "Staff" },
    { id: 8, name: "Contractors" },
  ]);

  const [departmentsOption, setDepartmentsOption] = useState([
    { id: 1, name: "IT" },
    { id: 2, name: "HR" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Logistics" },
    { id: 11, name: "IT" },
    { id: 12, name: "HR" },
    { id: 31, name: "Finance" },
    { id: 41, name: "Logistics" },
  ]);

  const renderOptions = (
    items: { id: number; name: string }[],
    selected: number[],
    type: "group" | "department"
  ) => (
    <div className="mt-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded p-3 mb-3 d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <input
            className="form-check-input form-check-sm me-2"
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => onToggle(type, item.id)}
            id={`${type}-${item.id}`}
            style={{ transform: "scale(0.85)" }}
          />
          <label
            className="form-check-label fw-bold"
            htmlFor={`${type}-${item.id}`}
            style={{ cursor: "pointer" }}
          >
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="d-flex mb-3 gap-2 bg-light border-radius-12">
        <button
          className={`btn flex-fill fw-bold border-radius-12 ${
            active === "group" ? "bg-white " : "btn-light"
          }`}
          onClick={() => setActive("group")}
        >
          Groups
        </button>
        <button
          className={`btn flex-fill fw-bold border-radius-12 ${
            active === "department" ? "bg-white  " : "btn-light"
          }`}
          onClick={() => setActive("department")}
        >
          Departments
        </button>
      </div>

      <h5 className=" mt-5">A user can belong to multiple {active}.</h5>

      {active === "group"
        ? renderOptions(groupsOption, selectedGroups, "group")
        : renderOptions(departmentsOption, selectedDepartments, "department")}
    </div>
  );
};

export { GroupsAndDepartmentsStep };
