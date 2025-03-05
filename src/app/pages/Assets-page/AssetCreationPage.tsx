import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  AssetsField,
  CategoryOption,
  FieldValues,
} from "../../types/assetsTypes";
import { AssetFields, Steps } from "../../data/assets";
import { StepNavigation } from "../../components/form/wizard";
import { ModalComponent } from "../../components/modal/ModalComponent";
import { BackButton } from "../../components/form/backButton";

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
  const [groupedFields, setGroupedFields] = useState<
    Record<string, AssetsField[]>
  >({});
  const [creationSteps, setCreationSteps] = useState(Steps);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLastStep, setIsLastStep] = useState(
    currentStep === creationSteps.length
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<{
    message: string;
    icon: string;
    type: "success" | "error";
  } | null>(null);
  const [disableInstallButton, setDisableInstallButton] = useState(false);
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [categoryDisabled, setCategoryDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChangeCategoryClick = () => {
    setShowModal(true);
  };

  const handleConfirmCategoryChange = () => {
    setSelectedCategory(null);
    setIsCategorySelected(false);
    setCategoryDisabled(false);
    setFieldValues({});
    setCurrentStep(1);
  };

  const handleCancelCategoryChange = () => {};

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
    setCurrentStep(1);
    setFieldValues({});
    setCategoryDisabled(true);
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

  const isFirstStep = currentStep === 1;

  const handleNext = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
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
    console.log("grouped ==>>", groupedFields);
    setGroupedFields(groupedFields);
  }, [selectedCategory]);

  useEffect(() => {
    let filteredSteps = Steps.filter(
      (step) => groupedFields && groupedFields.hasOwnProperty(step.title)
    );

    const submissionStep = Steps.find((step) => step.title === "Submission");
    if (submissionStep) {
      filteredSteps = [...filteredSteps, submissionStep];
    }

    console.log("filteredSteps ==>>", filteredSteps);
    setCreationSteps(filteredSteps);
  }, [groupedFields]);

  useEffect(() => {
    const updatedLastStep = creationSteps.length;
    setIsLastStep(currentStep === updatedLastStep);
  }, [creationSteps, currentStep]);

  return (
    <div className="container-fluid p-5">
      <BackButton navigateFrom={`assets/new`} navigateTo={"assets"} />
      <div className="card p-5 mt-3">
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
              isDisabled={categoryDisabled}
            />
            {categoryDisabled && (
              <>
                <button
                  className="btn btn-secondary mt-2"
                  data-bs-toggle="modal"
                  data-bs-target="#alert-modal" //
                  onClick={handleChangeCategoryClick}
                >
                  Change Category
                </button>
                <ModalComponent
                  isOpen={showModal}
                  onConfirm={handleConfirmCategoryChange}
                  onCancel={handleCancelCategoryChange}
                  message="<h5>Are you sure you want to change the category?</h5>
                          <h6>All data in the following steps will be lost.</h6>"
                />
              </>
            )}
          </div>
        </div>
        {isCategorySelected && (
          <>
            <div className="container-fluid p-5 bg-white">
              <StepNavigation steps={creationSteps} currentStep={currentStep} />

              <div className="mt-4">
                {creationSteps.map(
                  (group, index) =>
                    currentStep === index + 1 && (
                      <div className="row" key={group.title}>
                        {groupedFields[group.title] &&
                        currentStep !== creationSteps.length
                          ? groupedFields[group.title].map(
                              (field: AssetsField) => (
                                <div
                                  key={field.id}
                                  className="col-md-4 col-lg-4 mb-3"
                                >
                                  <label className="form-label d-flex align-items-center">
                                    {field.label}
                                    {field.note && (
                                      <span className="note-icon-container">
                                        <span className="note-icon">i</span>
                                        <span className="note-tooltip">
                                          {field.note}
                                        </span>
                                      </span>
                                    )}
                                  </label>
                                  {field.type === "input" && (
                                    <input
                                      type="text"
                                      className="form-control form-control-solid"
                                      placeholder={field.label}
                                      value={fieldValues[field.id] || ""}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                  {field.type === "number" && (
                                    <input
                                      type="number"
                                      className="form-control form-control-solid"
                                      placeholder={field.label}
                                      value={fieldValues[field.id] || ""}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                  {field.type === "select" && (
                                    <select
                                      className="form-select form-select-white"
                                      value={fieldValues[field.id]}
                                      onChange={(selectedOption) =>
                                        handleFieldChange(
                                          field.id,
                                          selectedOption
                                        )
                                      }
                                      // isClearable
                                    />
                                  )}
                                  {field.type === "upload" && (
                                    <input
                                      type="file"
                                      className="form-control"
                                      onChange={(e) =>
                                        handleFieldChange(
                                          field.id,
                                          e.target.files
                                        )
                                      }
                                    />
                                  )}
                                  {field.type === "checkboxGroup" && (
                                    <div className="checkbox-group">
                                      {field.options &&
                                        field.options.map((option) => (
                                          <div
                                            key={option.value}
                                            className="checkbox-item"
                                          >
                                            <label className="custom-checkbox-label">
                                              <input
                                                type="checkbox"
                                                value={option.value}
                                                checked={selectedPorts.includes(
                                                  option.value
                                                )}
                                                onChange={() =>
                                                  handlePortChange(option.value)
                                                }
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
                                        type={
                                          passwordVisible[field.id]
                                            ? "text"
                                            : "password"
                                        }
                                        className="form-control custom-bottom-border"
                                        placeholder={field.label}
                                        value={fieldValues[field.id] || ""}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            field.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <span
                                        className="password-toggle-icon"
                                        onClick={() =>
                                          togglePasswordVisibility(field.id)
                                        }
                                      >
                                        {passwordVisible[field.id]
                                          ? "👁️"
                                          : "🔒"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            )
                          : ""}
                      </div>
                    )
                )}
              </div>
              {showAlert && alertContent && (
                <div
                  className={
                    alertContent.type === "error"
                      ? "error-indicator"
                      : "success-indicator"
                  }
                >
                  <div
                    className={
                      alertContent.type === "error"
                        ? "error-circle"
                        : "success-circle"
                    }
                  >
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <p
                    className={
                      alertContent.type === "error"
                        ? "error-message"
                        : "success-message"
                    }
                  >
                    {alertContent.message}
                  </p>
                </div>
              )}

              {disableInstallButton && progress < 100 && (
                <div className="progress" style={{ height: "30px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {progress}% Installing...
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={handleBack}>
                  Back
                </button>
                {isLastStep ? (
                  <button className="btn btn-success">Submit</button>
                ) : (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { AssetCreationPage };
