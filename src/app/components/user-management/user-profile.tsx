import React from "react";
import { PhoneNumberInput } from "../form/phoneNb-input";
import CreatableSelect from "react-select/creatable";
import { CreatableSelectInput } from "../form/creatable-react-select";
import { CustomSwitch } from "../form/custom-switch";

interface UserProfileFormProps {
  formData: {
    phoneNb: string | null;
    phoneNb2: string | null;
    mobile: string | null;
    title: {
      id: number;
      title: string;
    };
    preferredName: string | null;
    comment?: string | null;
    email: string | null;
  };
  onChange: (field: string, value: any) => void;
  onToggleStatus: (value: boolean) => void;
}

const titleOptions = [
  { id: 1, title: "Mr." },
  { id: 2, title: "Ms." },
  { id: 3, title: "Eng." },
  { id: 4, title: "Prof." },
];

const UserProfileForm = ({
  formData,
  onChange,
  onToggleStatus,
}: UserProfileFormProps) => {
  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-5">
            <label className="form-label fw-bold">Phone Number </label>
            <PhoneNumberInput
              phoneNb={formData.phoneNb}
              onChange={onChange}
              field={"phoneNb"}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">Phone Number 2</label>
            <PhoneNumberInput
              phoneNb={formData.phoneNb2}
              onChange={onChange}
              field={"phoneNb2"}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">Mobile</label>
            <PhoneNumberInput
              phoneNb={formData.mobile}
              onChange={onChange}
              field={"mobile"}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-5 d-flex flex-column align-items-sm-end align-items-start">
            <label className="form-label fw-bold">Account Status</label>
            <CustomSwitch setStatus={onToggleStatus} />
          </div>

          <div className="mb-5">
            <label className="form-label fw-bold">Title</label>
            <CreatableSelectInput
              placeholder="Select or create a title..."
              field="title"
              value={formData.title ? formData.title : null}
              onChange={onChange}
              options={titleOptions}
              getOptionLabel={(opt) => opt.title}
              getOptionValue={(opt) => opt.id}
              onCreateOption={(field, inputValue) => ({
                id: Date.now(),
                title: inputValue,
              })}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">Preferred Name</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              placeholder="Enter Preferred Name"
              value={formData.preferredName ?? ""}
              onChange={(e) => onChange("preferredName", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-5">
          <label className="form-label fw-bold">Comment</label>
          <textarea
            className="form-control custom-placeholder custom-input-height"
            placeholder="Add comment.."
            value={formData.comment ?? ""}
            onChange={(e) => onChange("comment", e.target.value)}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export { UserProfileForm };
