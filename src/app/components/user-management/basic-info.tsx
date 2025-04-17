import React from "react";

interface BasicInformationFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    profileImage?: string | null;
  };
  onChange: (field: string, value: string) => void;
}

const BasicInformationForm = ({
  formData,
  onChange,
}: BasicInformationFormProps) => {
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
          <label className="form-label fw-bold">First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            autoComplete="given-name"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold required">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => onChange("username", e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold required">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter a secure password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
      </div>
    </div>
  );
};

export { BasicInformationForm };
