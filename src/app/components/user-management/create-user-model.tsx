import { useEffect, useRef, useState } from "react";
import { steps } from "../../data/user-management";
import { StepNavigation } from "../form/wizard";
import { BasicInformationForm } from "./basic-info";
import { GroupsAndDepartmentsStep } from "./groups-departments";
import { RolesWorkstationStep } from "./roles-workstation";
import { NextButton, BackButton, SaveButton } from "../form/stepsButton";
import { UserProfileForm } from "./user-profile";
export interface UserFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  userCategory: string;
  preferredName: string;
  profileImage: string;
  phoneNb: string;
  phoneNb2: string;
  mobile: string;
  comment: string;
  title: {
    id: number;
    title: string;
  };
  rolesId: number[];
  supervisorId: number | null;
  supervisedByRoleIds: number[];
  groupIds: number[];
  departmentIds: number[];
  locationId: number | null;
  isActive: boolean;
}
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
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    userCategory: "",
    preferredName: "",
    profileImage: "",
    phoneNb: "",
    phoneNb2: "",
    mobile: "",
    title: {
      id: 0,
      title: "",
    },
    rolesId: [] as number[],
    supervisorId: null as number | null,
    supervisedByRoleIds: [] as number[],
    groupIds: [] as number[],
    departmentIds: [] as number[],
    locationId: null as number | null,
    isActive: true,
    comment: "",
  });

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [status, setStatus] = useState<boolean>(true);

  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | null
  >(null);
  const [selectedSupervisedByRoleIds, setSelectedSupervisedByRoleIds] =
    useState<number[]>([]);

  const stepsRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const btnsRef = useRef<HTMLDivElement>(null);
  const [btnsHeight, setBtnsHeight] = useState(0);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Ignore react-select dropdowns & clear buttons
      const isSelectDropdown =
        target.closest(".select__menu") ||
        target.closest(".select__clear-indicator");
      if (isSelectDropdown) return;

      if (modalRef.current && !modalRef.current.contains(target)) {
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

  useEffect(() => {
    if (stepsRef.current) {
      const rect = stepsRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
    if (btnsRef.current) {
      const rect = btnsRef.current.getBoundingClientRect();
      setBtnsHeight(Math.round(rect.height));
    }
  }, [stepsRef.current, btnsRef.current]);

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
          </div>

          <div className="modal-body" style={{ maxHeight: "75vh" }}>
            <div ref={stepsRef}>
              <StepNavigation steps={steps} currentStep={currentStep} />
            </div>

            <div className="mt-5">
              {currentStep === 1 && (
                <div
                  style={{
                    height: `calc(75vh - ${height}px - 48px )`,
                    overflowY: "auto",
                  }}
                >
                  <BasicInformationForm
                    formData={formData}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {currentStep === 2 && (
                <div
                  style={{
                    height: `calc(75vh - ${height}px - 48px )`,
                    overflowY: "auto",
                  }}
                >
                  <RolesWorkstationStep
                    formData={formData}
                    onChange={handleInputChange}
                  />

                  {/* <RoleStatusStep
                    selectedSupervisorId={selectedSupervisorId}
                    onSupervisorChange={setSelectedSupervisorId}
                    selectedSupervisedByRoleIds={selectedSupervisedByRoleIds}
                    onSupervisedByRoleChange={setSelectedSupervisedByRoleIds}
                    selectedRoleIds={selectedRoles}
                    onRolesChange={setSelectedRoles}
                    selectedGroups={selectedGroups}
                    selectedDepartments={selectedDepartments}
                    selectedLocation={selectedLocation}
                    onGroupsChange={setSelectedGroups}
                    onDepartmentsChange={setSelectedDepartments}
                    onLocationChange={setSelectedLocation}
                  /> */}
                </div>
              )}
              {currentStep === 3 && (
                <div
                  style={{
                    height: `calc(75vh - ${height}px - 48px )`,
                    overflowY: "auto",
                  }}
                >
                  <UserProfileForm
                    formData={formData}
                    onChange={handleInputChange}
                    onToggleStatus={setStatus}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-5 pb-4"
            style={{
              height: "48px",
            }}
          >
            <div>
              {currentStep !== 1 && <BackButton onClick={handleBack} />}
            </div>

            <div className="d-flex gap-2">
              {currentStep === 2 && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleSave}
                >
                  Finish
                </button>
              )}

              {currentStep < steps.length ? (
                <NextButton onClick={handleNext} />
              ) : (
                <SaveButton onClick={handleSave} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserCreationModal };
