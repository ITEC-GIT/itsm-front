import React, { useEffect, useState } from "react";
import { PhoneNumberInput } from "../form/phoneNb-input";
import CreatableSelect from "react-select/creatable";
import { CreatableSelectInput } from "../form/creatable-react-select";
import { CustomSwitch } from "../form/custom-switch";
import { User } from "../../modules/apps/user-management/users-list/core/_models";
import { UserType } from "../../types/user-management";
import { useAtom } from "jotai";
import { usersPrerequisitesAtom } from "../../atoms/user-management-atoms/usersAtom";
import { CreateTitleAPI } from "../../config/ApiCalls";
import { BasicType } from "../../types/common";

interface UserProfileFormProps {
  formData: UserType;
  onChange: (field: string, value: any) => void;
  onToggleStatus: (value: boolean) => void;
}

const UserProfileForm = ({
  formData,
  onChange,
  onToggleStatus,
}: UserProfileFormProps) => {
  const [usersPrerequisites, setUsersPrerequisites] = useAtom(
    usersPrerequisitesAtom
  );
  const [titleOptions, setTitleOptions] = useState<BasicType[]>(
    usersPrerequisites?.titles
      ? usersPrerequisites.titles.map((title) => ({
          id: title.id,
          name: title.title,
        }))
      : []
  );

  const handleCreateTitle = async (field: string, inputValue: string) => {
    try {
      const res = await CreateTitleAPI(inputValue);
      if (res.status === 201) {
        const newTitle = {
          id: res.data.id,
          name: res.data.title,
        };
        setTitleOptions((prev) => [...prev, newTitle]); // Important
        onChange(field, newTitle);
        return newTitle;
      }
    } catch (error) {
      console.error("Error creating title:", error);
    }
  };

  useEffect(() => {
    if (usersPrerequisites?.titles) {
      console.log(usersPrerequisites.titles);
      setTitleOptions(
        usersPrerequisites.titles.map((title) => ({
          id: title.id,
          name: title.title,
        }))
      );
    }
  }, [usersPrerequisites?.titles]);

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="mb-5">
            <label className="form-label fw-bold">Phone Number </label>
            <PhoneNumberInput
              phoneNb={formData.phone}
              onChange={onChange}
              field={"phone"}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">Phone Number 2</label>
            <PhoneNumberInput
              phoneNb={formData.phone2}
              onChange={onChange}
              field={"phone2"}
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
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => String(opt.id)}
              onCreateOption={handleCreateTitle}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">Preferred Name</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              placeholder="Enter Preferred Name"
              value={formData.preferred_name ?? ""}
              onChange={(e) => onChange("preferred_name", e.target.value)}
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
