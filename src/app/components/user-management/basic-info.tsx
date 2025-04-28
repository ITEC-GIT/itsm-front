import React, { useState } from "react";
import { CustomReactSelect } from "../form/custom-react-select";
import { UserFormType, UserType } from "../../types/user-management";
import { usersPrerequisitesAtom } from "../../atoms/user-management-atoms/usersAtom";
import { useAtom } from "jotai";

interface BasicInformationFormProps {
  formData: UserFormType;
  onChange: (field: string, value: string) => void;
  formErrors?: { [key: string]: string };
}

const BasicInformationForm = ({
  formData,
  onChange,
  formErrors,
}: BasicInformationFormProps) => {
  const [usersPrerequisites, setUsersPrerequisites] = useAtom(
    usersPrerequisitesAtom
  );

  const categoryOptions = usersPrerequisites?.user_categories
    ? Object.entries(usersPrerequisites.user_categories).map(
        ([_, value], index) => ({
          value: index + 1,
          label: value,
        })
      )
    : [];

  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      alert("Only PNG, JPG, and JPEG files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange("profile_image", event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column align-items-center mb-4">
        <label
          className="position-relative overflow-hidden d-block"
          style={{
            width: "95px",
            height: "95px",
            borderRadius: "50%",
            border: "2px dashed #ccc",
            cursor: "pointer",
          }}
        >
          <img
            src={
              formData.profile_image ||
              "/media/misc/default-profile-picture.png"
            }
            alt="User Avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            className="position-absolute"
            style={{
              width: "100%",
              height: "100%",
              opacity: 0,
              top: 0,
              left: 0,
              cursor: "pointer",
            }}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")}
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="row g-3 ">
        <div className="col-md-6">
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">Name</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => {
                onChange("name", e.target.value);
              }}
              required
            />
            {formErrors?.name && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.name}
              </small>
            )}
          </div>
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">Username</label>
            <input
              type="text"
              className="form-control custom-placeholder"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => onChange("username", e.target.value)}
              required
              autoComplete="new-username"
            />
            {formErrors?.username && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.username}
              </small>
            )}
          </div>
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control custom-placeholder"
                placeholder="Enter a secure password"
                value={formData.user_password ?? ""}
                onChange={(e) => onChange("user_password", e.target.value)}
                required
                autoComplete="new-password"
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
              </span>
            </div>
            {formErrors?.user_password && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.user_password}
              </small>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold required">User Category</label>
            <CustomReactSelect
              isMulti={false}
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (opt) => opt.label === formData.user_category
                ) || null
              }
              onChange={(selectedOption) => {
                onChange("user_category", selectedOption?.label || "");
              }}
              placeholder="Select user category"
            />
            {formErrors?.user_category && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                {formErrors.user_category}
              </small>
            )}
          </div>

          <div className="mb-5" style={{ height: "85px" }}>
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control custom-placeholder"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { BasicInformationForm };
