import React from "react";

interface BasicInformationFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
}

const BasicInformationForm = ({
  formData,
  onChange,
}: BasicInformationFormProps) => {
  return (
    <div className="container-fluid">
      <div className="row g-3">
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
          <label className="form-label fw-bold">Username</label>
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
          <label className="form-label fw-bold">Password</label>
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
