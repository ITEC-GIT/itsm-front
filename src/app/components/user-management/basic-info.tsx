import React, { useState } from "react";
import { CustomReactSelect } from "../form/custom-react-select";
import { UserFormData } from "./create-user-model";

interface BasicInformationFormProps {
  formData: UserFormData;
  onChange: (field: string, value: string) => void;
}

const BasicInformationForm = ({
  formData,
  onChange,
}: BasicInformationFormProps) => {
  const catOption = ["issuer", "assignee", "admin"];

  const categoryOptions = catOption.map((item, index) => ({
    value: index + 1,
    label: item,
  }));

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
      onChange("profileImage", event.target?.result as string);
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
              formData.profileImage || "/media/misc/default-profile-picture.png"
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
          <div className="mb-5">
            <label className="form-label fw-bold required">Name</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold required">Username</label>
            <input
              type="text"
              className="form-control custom-placeholder"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => onChange("username", e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold required">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control custom-placeholder"
                placeholder="Enter a secure password"
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
                autoComplete="new-password"
                required
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-5">
            <label className="form-label fw-bold">User Category</label>
            <CustomReactSelect
              isMulti={false}
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (opt) => opt.label === formData.userCategory
                ) || null
              }
              onChange={(selectedOption) => {
                onChange("userCategory", selectedOption?.label || "");
              }}
              placeholder="Select user category"
            />
          </div>

          <div className="mb-5">
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
