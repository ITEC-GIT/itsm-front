import Select from "react-select";

interface GroupDeptStepProps {
  selectedGroups: number[];
  selectedDepartments: number[];
  selectedLocation: number | null;
  onGroupsChange: (groupIds: number[] | []) => void;
  onDepartmentsChange: (depIds: number[] | []) => void;
  onLocationChange: (locationId: number | null) => void;
}

const GroupsAndDepartmentsStep = ({
  selectedGroups,
  selectedDepartments,
  selectedLocation,
  onGroupsChange,
  onDepartmentsChange,
  onLocationChange,
}: GroupDeptStepProps) => {
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
    { value: 1, label: "Beirut HQ" },
    { value: 2, label: "Tripoli Office" },
    { value: 3, label: "Jounieh Branch" },
  ];

  const handleMultiSelectChange = (
    selected: any,
    type: "group" | "department"
  ) => {
    const ids = selected ? selected.map((item: any) => item.value) : [];
    if (type === "group") onGroupsChange(ids);
    else onDepartmentsChange(ids);
  };

  const mapOptions = (items: { id: number; name: string }[]) =>
    items.map((item) => ({ value: item.id, label: item.name }));

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-bold">Select Groups</label>
            <Select
              options={mapOptions(groupsOption)}
              value={mapOptions(groupsOption).filter((opt) =>
                selectedGroups.includes(opt.value)
              )}
              onChange={(selected) =>
                handleMultiSelectChange(selected, "group")
              }
              isMulti
              placeholder="Select one or more groups"
              classNamePrefix="select"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold required">
              Select Departments
            </label>
            <Select
              options={mapOptions(departmentsOption)}
              value={mapOptions(departmentsOption).filter((opt) =>
                selectedDepartments.includes(opt.value)
              )}
              onChange={(selected) =>
                handleMultiSelectChange(selected, "department")
              }
              isMulti
              placeholder="Select one or more departments"
              classNamePrefix="select"
            />
          </div>

          <div>
            <label className="form-label fw-bold">Select Location</label>
            <Select
              options={locationOptions}
              value={
                locationOptions.find((opt) => opt.value === selectedLocation) ||
                null
              }
              onChange={(selected) =>
                selected
                  ? onLocationChange(selected.value)
                  : onLocationChange(null)
              }
              placeholder="Select a location..."
              isClearable
              classNamePrefix="select"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { GroupsAndDepartmentsStep };
