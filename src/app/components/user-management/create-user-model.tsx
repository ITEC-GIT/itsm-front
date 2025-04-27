import { useEffect, useRef, useState } from "react";
import { initialUserData, steps } from "../../data/user-management";
import { StepNavigation } from "../form/wizard";
import { BasicInformationForm } from "./basic-info";
import { RolesWorkstationStep } from "./roles-workstation";
import { NextButton, BackButton, SaveButton } from "../form/stepsButton";
import { UserProfileForm } from "./user-profile";
import { UserFormType, UserType } from "../../types/user-management";
import {
  CreateUserAPI,
  GetPrerequisitesAPI,
  UpdateUserAPI,
} from "../../config/ApiCalls";
import { useAtom } from "jotai";
import { usersPrerequisitesAtom } from "../../atoms/user-management-atoms/usersAtom";
import { groups } from "d3";

interface UserCreationModalProps {
  show: boolean;
  selectedUser?: UserType | null;
  onClose: () => void;
  onSave: (user: any) => void;
}

const UserCreationModal = ({
  show,
  selectedUser,
  onClose,
  onSave,
}: UserCreationModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [usersPrerequisites, setUsersPrerequisites] = useAtom(
    usersPrerequisitesAtom
  );
  const [formData, setFormData] = useState<UserFormType>(initialUserData);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [status, setStatus] = useState<boolean>(true);

  // const [selectedSupervisorId, setSelectedSupervisorId] = useState<
  //   number | null
  // >(null);
  // const [selectedSupervisedByRoleIds, setSelectedSupervisedByRoleIds] =
  //   useState<number[]>([]);

  const stepsRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const btnsRef = useRef<HTMLDivElement>(null);
  const [btnsHeight, setBtnsHeight] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[field]) {
        delete updatedErrors[field];
      }
      return updatedErrors;
    });
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    const userPayload: any = {
      user_name: formData.username,
      user_category: formData.user_category || "issuer",
      locations_id: formData.location?.id || null,
      departments_id: formData.department?.id || null,
      user_titles_id: formData.title?.id || null,
      groups_ids: formData.groups?.map((r) => r.id),
      is_active: status ? 1 : 0,
      roles_ids: formData.roles.map((r) => r.id),
      profile: {
        preferred_name: formData.preferred_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        phone2: formData.phone2 || null,
        mobile: formData.mobile || null,
        profile_image: formData.profile_image || null,
        comment: formData.comment || null,
        name: formData.name,
      },
    };
    try {
      let newUser;

      if (selectedUser) {
        //need to update user
        if (formData.user_password && formData.user_password.trim() !== "") {
          userPayload.user_password = formData.user_password;
        }
        const res = await UpdateUserAPI(selectedUser.id, userPayload);
        newUser = res.data;
      } else {
        userPayload.user_password = formData.user_password;
        const res = await CreateUserAPI(userPayload);
        newUser = {
          id: res.data.id,
          name: formData.name,
          username: formData.username,
          user_category: formData.user_category,
          email: formData.email,
          profile_image: formData.profile_image,
          phone: formData.phone,
          phone2: formData.phone2,
          mobile: formData.mobile,
          comment: formData.comment,
          preferred_name: formData.preferred_name,
          roles: formData.roles.map((r) => ({
            id: r.id,
            name: r.name,
          })),
          groups: formData.groups?.map((g) => ({
            id: g.id,
            name: g.name,
          })),
          department: formData.department,
          location: formData.location,
          title: formData.title,
          isActive: status,
        };
      }

      onSave(newUser);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      }
      if (!formData.username.trim()) {
        errors.username = "Username is required";
      }
      if (!formData.user_password?.trim()) {
        errors.user_password = "Password is required";
      }
      if (!formData.user_category?.trim()) {
        errors.user_category = "User Category is required";
      }
    } else if (currentStep === 2) {
      if (!formData.roles.length) {
        errors.roles = "At least one role must be selected";
      }
      if (!formData.department || !formData.department.id) {
        errors.department = "Department must be selected";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchPrerequisites = async () => {
      const res = await GetPrerequisitesAPI();
      setUsersPrerequisites(res.data);
    };
    fetchPrerequisites();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
      setStatus(selectedUser.isActive);
      setSelectedGroups(selectedUser.groups?.map((g) => g.id) || []);
      setSelectedDepartments(
        selectedUser.department ? [selectedUser.department.id] : []
      );
      setSelectedLocation(selectedUser.location?.id || null);
      setSelectedRoles(selectedUser.roles.map((r) => r.id));
    } else {
      setFormData(initialUserData);
      setStatus(true);
      setSelectedGroups([]);
      setSelectedDepartments([]);
      setSelectedLocation(null);
      setSelectedRoles([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

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

  const isFinishDisabled =
    currentStep === 2 && (!!formErrors.roles || !!formErrors.department);

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
                    formErrors={formErrors}
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
                    formErrors={formErrors}
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
                  className={`btn ${
                    isFinishDisabled ? "btn-secondary" : "btn-outline-secondary"
                  }`}
                  onClick={handleSave}
                  disabled={isFinishDisabled}
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
