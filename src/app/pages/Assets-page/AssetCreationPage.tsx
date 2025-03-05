import React, { useState } from "react";
import Select from "react-select";
import {
  AssetsField,
  CategoryOption,
  FieldValues,
} from "../../types/assetsTypes";
import { AssetFields } from "../../data/assets";

const AssetCreationPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [comments, setComments] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [passwordVisible, setPasswordVisible] = useState<{
    [id: number]: boolean;
  }>({});

  const togglePasswordVisibility = (id: number) => {
    setPasswordVisible({
      ...passwordVisible,
      [id]: !passwordVisible[id],
    });
  };

  const categories: CategoryOption[] = [
    { value: "Computer", label: "Computer" },
    { value: "Monitor", label: "Monitor" },
    { value: "Network device", label: "Network device" },
    { value: "Devices", label: "Devices" },
    { value: "Printer", label: "Printer" },
    { value: "Cartridge", label: " Cartridge" },
    { value: "Consumable", label: " Consumable" },
    { value: "Mouse", label: "Mouse" },
    { value: "Phone", label: "Phone" },
    { value: "Rack", label: "Rack" },
    { value: "Enclosure", label: "Enclosure" },
    { value: "Passive device", label: "Passive device" },
    { value: "Simcard", label: "Simcard item" },
  ];

  const handlePortChange = (port: string) => {
    if (selectedPorts.includes(port)) {
      setSelectedPorts(selectedPorts.filter((p) => p !== port));
    } else {
      setSelectedPorts([...selectedPorts, port]);
    }
  };

  const handleCategoryChange = (selectedOption: CategoryOption | null) => {
    setSelectedCategory(selectedOption);
    setIsCategorySelected(!!selectedOption);
    setFieldValues({});
  };

  const handleFieldChange = (id: number, value: any) => {
    setFieldValues({ ...fieldValues, [id]: value });
  };

  const groupFieldsByGroup = (fields: AssetsField[]) => {
    const groupedFields: { [group: string]: AssetsField[] } = {};
    fields.forEach((field) => {
      if (!groupedFields[field.group]) {
        groupedFields[field.group] = [];
      }
      groupedFields[field.group].push(field);
    });
    return groupedFields;
  };

  const renderFields = () => {
    const commonFields = AssetFields.filter((field) =>
      field.category.includes("General")
    );
    let filteredFields: AssetsField[] = [];

    if (selectedCategory) {
      filteredFields = AssetFields.filter((field) =>
        field.category.includes(selectedCategory.value)
      );
    }

    const allFields = [...commonFields, ...filteredFields];
    const groupedFields = groupFieldsByGroup(allFields);

    return Object.entries(groupedFields).map(([group, fields]) => (
      <div key={group} className="col-md-12 mb-4">
        <div className="card p-3">
          <div className="row">
            {fields.map((field) => (
              <div key={field.id} className="col-md-3 col-lg-4 mb-3">
                <label className="form-label d-flex align-items-center">
                  {field.label}
                  {field.note && (
                    <span className="note-icon-container">
                      <span className="note-icon">i</span>
                      <span className="note-tooltip">{field.note}</span>
                    </span>
                  )}
                </label>
                {field.type === "input" && (
                  <input
                    type="text"
                    className="form-control custom-bottom-border"
                    placeholder={field.label}
                    value={fieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    className="form-control custom-bottom-border"
                    placeholder={field.label}
                    value={fieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === "select" && (
                  <Select
                    value={fieldValues[field.id]}
                    onChange={(selectedOption) =>
                      handleFieldChange(field.id, selectedOption)
                    }
                    isClearable
                  />
                )}
                {field.type === "upload" && (
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.files)
                    }
                  />
                )}
                {field.type === "checkboxGroup" && (
                  <div className="checkbox-group">
                    {field.options &&
                      field.options.map((option) => (
                        <div key={option.value} className="checkbox-item">
                          <label className="custom-checkbox-label">
                            <input
                              type="checkbox"
                              value={option.value}
                              checked={selectedPorts.includes(option.value)}
                              onChange={() => handlePortChange(option.value)}
                              className="custom-checkbox-input"
                            />
                            <span className="custom-checkbox-visual"></span>
                            {option.label}
                          </label>
                        </div>
                      ))}
                  </div>
                )}
                {field.type === "password" && (
                  <div className="password-input-container">
                    <input
                      type={passwordVisible[field.id] ? "text" : "password"}
                      className="form-control custom-bottom-border"
                      placeholder={field.label}
                      value={fieldValues[field.id] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                    />
                    <span
                      className="password-toggle-icon"
                      onClick={() => togglePasswordVisibility(field.id)}
                    >
                      {passwordVisible[field.id] ? "👁️" : "🔒"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid p-5">
      <div className="card p-5">
        <div className="row mt-3 row-add-asset-form">
          <div className="col-md-3 col-lg-4 mb-5">
            <label className="form-label d-flex align-items-center">
              Category
            </label>
            <Select
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              isClearable
            />
          </div>
        </div>
        {isCategorySelected && (
          <>
            <div className="row mt-5 row-add-asset-form">{renderFields()}</div>
            <div className="row mt-5 row-add-asset-form">
              <div className="col-md-12 mb-4">
                <div className="card p-5">
                  <div className="row">
                    <label className="form-label d-flex align-items-center">
                      Comments
                    </label>
                    <textarea
                      className="form-control custom-bottom-border"
                      placeholder="Add some comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={!isCategorySelected}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { AssetCreationPage };
