import { useEffect, useRef, useState } from "react";
import { steps } from "../../data/user-management";
import Select from "react-select";
import { StepNavigation } from "../form/wizard";
import { BasicInformationForm } from "./basic-info";
import { GroupsAndDepartmentsStep } from "./groups-departments";
import { RoleStatusStep } from "./roles-status";
import { NextButton, BackButton, SaveButton } from "../form/stepsButton";

interface UserCreationModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
}
const UserCreationModal = ({
  show,
  onClose,
  onSave,
}: UserCreationModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [status, setStatus] = useState<boolean>(true);

  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | null
  >(null);
  const [selectedSupervisedByRoleIds, setSelectedSupervisedByRoleIds] =
    useState<number[]>([]);

  const [locations, setLocations] = useState([
    { id: 1, name: "Beirut HQ" },
    { id: 2, name: "Tripoli Branch" },
    { id: 3, name: "Dubai Office" },
    { id: 4, name: "Remote Access Only" },
  ]);

  const supervisorUsers = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Carla Haddad" },
  ];

  const allRoles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "HR Manager" },
    { id: 3, name: "Team Lead" },
  ];

  const userOptions = supervisorUsers.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const roleOptions = allRoles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const locationOptions = locations.map((loc) => ({
    value: loc.id,
    label: loc.name,
  }));

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  const selectedOption =
    locationOptions.find((opt) => opt.value === selectedLocationId) || null;
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (type: "group" | "department", id: number) => {
    if (type === "group") {
      setSelectedGroups((prev) =>
        prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
      );
    } else {
      setSelectedDepartments((prev) =>
        prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
      );
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = () => {
    onSave();
  };

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
            className="column-modal-dropdown-checkbox"
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => handleToggle(type, item.id)}
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

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      id="userCreationModal"
      tabIndex={-1}
      aria-hidden={!show}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header border-0 flex-column align-items-start pb-0">
            <h3 className="modal-title fw-bold mb-1">Add New User</h3>
            <p className="text-muted fs-6 m-0">Create a new user</p>
          </div>

          <div
            className="modal-body"
            style={{ height: "60vh", overflowY: "auto" }}
          >
            <StepNavigation steps={steps} currentStep={currentStep} />

            <div className="mt-5">
              {currentStep === 1 && (
                <BasicInformationForm
                  formData={formData}
                  onChange={handleInputChange}
                />
              )}
              {currentStep === 2 && (
                <RoleStatusStep
                  selectedRoleIds={selectedRoles}
                  onToggleStatus={setStatus}
                  onRolesChange={setSelectedRoles}
                />
              )}
              {currentStep === 3 && (
                <GroupsAndDepartmentsStep
                  selectedGroups={selectedGroups}
                  selectedDepartments={selectedDepartments}
                  onToggle={handleToggle}
                />
              )}
              {currentStep === 4 && (
                <div className="mb-4">
                  <label className="form-label fw-bold">Select Location</label>
                  <Select
                    options={locationOptions}
                    value={selectedOption}
                    onChange={(selected) =>
                      selected
                        ? setSelectedLocationId(selected.value)
                        : setSelectedLocationId(null)
                    }
                    placeholder="Select a location..."
                    isClearable
                    classNamePrefix="select"
                  />
                </div>
              )}
              {currentStep === 5 && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Supervisor</label>
                    <Select
                      options={userOptions}
                      value={
                        userOptions.find(
                          (u) => u.value === selectedSupervisorId
                        ) || null
                      }
                      onChange={(selected) =>
                        setSelectedSupervisorId(
                          selected ? selected.value : null
                        )
                      }
                      placeholder="Select a supervisor"
                      isClearable
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Supervised by Roles
                    </label>
                    <Select
                      options={roleOptions}
                      value={roleOptions.filter((r) =>
                        selectedSupervisedByRoleIds.includes(r.value)
                      )}
                      onChange={(selected) =>
                        setSelectedSupervisedByRoleIds(
                          selected ? selected.map((r) => r.value) : []
                        )
                      }
                      isMulti
                      placeholder="Select supervising roles"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center px-5 pb-4">
            <BackButton onClick={handleBack} disable={currentStep === 1} />

            {currentStep < steps.length ? (
              <NextButton onClick={handleNext} />
            ) : (
              <SaveButton onClick={handleSave} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserCreationModal };
