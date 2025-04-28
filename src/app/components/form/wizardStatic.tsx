import React, { useState, useEffect, useMemo } from "react";
import {
  InitiateSoftwareInstallation,
  GetAllComputersAPI,
} from "../../config/ApiCalls";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "../../atoms/auth-atoms/authAtom";
import { SoftwareHistoryType } from "../../types/softwareInstallationTypes";
import { SelectDeviceType } from "../../types/devicesTypes";
import { formatName } from "../../../utils/custom";
import { BasicType } from "../../types/common";
import { CustomReactSelect } from "./custom-react-select";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";

export interface Step {
  id: number;
  title: string;
  iconClass: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
}

interface StepNavigationStepProps {
  step: Step;
  isActive: boolean;
  isComplete: boolean;
}

export const WizardStatic = ({
  steps,
  add,
  idgt,
}: {
  steps: any;
  add?: React.Dispatch<React.SetStateAction<SoftwareHistoryType[]>>;
  idgt?: number;
}) => {
  const userData = useAtomValue(userAtom);
  const [userName, setUserName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [deviceOptions, setDeviceOptions] = useState<SelectDeviceType[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<BasicType[]>([]);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevices, setSelectedDevices] = useState<
    SelectDeviceType[] | []
  >([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<BasicType | null>(null);
  const [softwareName, setSoftwareName] = useState<string>("");
  const [softwareUrl, setSoftwareUrl] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [variables, setVariables] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);
  const [deviceError, setDeviceError] = useState<boolean>(false);
  const [destinationError, setDestinationError] = useState<boolean>(false);
  const [softwareUrlError, setSoftwareUrlError] = useState<boolean>(false);
  const [softwareNameError, setSoftwareNameError] = useState<boolean>(false);

  const [isUrlSelected, setIsUrlSelected] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<{
    message: string;
    icon: string;
    type: "success" | "error";
  } | null>(null);
  const [disableInstallButton, setDisableInstallButton] = useState(false);

  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 && selectedDevices.length == 0) {
        setDeviceError(true);
        return;
      }
      if (currentStep === 2 && !destination) {
        setDestinationError(true);
        return;
      }

      if (currentStep === 2 && !destination.startsWith("/")) {
        setDestinationError(true);
        return;
      }

      if (currentStep === 3 && !softwareName) {
        setSoftwareNameError(true);
        return;
      }

      if (currentStep === 3 && softwareUrl && !softwareUrl.includes("/")) {
        setSoftwareUrlError(true);
        return;
      }

      if (currentStep === 3 && !softwareUrl && !file) {
        setSoftwareUrlError(true);
        return;
      }

      setDeviceError(false);
      setDestinationError(false);
      setSoftwareUrlError(false);
      setSoftwareNameError(false);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInstall = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsBackButtonDisabled(true);
    setDisableInstallButton(true);
    setProgress(10);
    setCurrentStep(5);

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const record: SoftwareHistoryType = {
      id: idgt ? idgt + 1 : 1,
      software: softwareName.trim(),
      url: softwareUrl.trim(),
      destination: destination.trim(),
      arguments: variables.trim(),
      computer_name:
        selectedDevices.map((device) => device.name).join(", ") ?? "",
      user_name: userName,
      status: "initialized",
      created_at: date.toLocaleDateString("en-US", options),
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setShowAlert(true);
          setAlertContent({
            message: "Installed Successfully!",
            icon: "fas fa-check-circle",
            type: "success",
          });

          setTimeout(() => {
            setDisableInstallButton(false);
            setProgress(0);
            setShowAlert(false);
            setCurrentStep(1);
            clearFields();
            add?.((prev: SoftwareHistoryType[]) => [record, ...prev]);
          }, 1000);

          return prev;
        }
        return prev + 10;
      });
    }, 500);
  };

  const clearFields = () => {
    setSoftwareName("");
    setSoftwareUrl("");
    setDestination("");
    setVariables("");
    setSelectedDevices([]);
    setProgress(0);
  };

  const handleDeviceChange = (selectedOptions: any) => {
    setDeviceError(false);
    if (selectedOptions) {
      const mappedDevices = selectedOptions.map((option: any) => ({
        id: Number(option.value),
        name: option.label,
      }));
      setSelectedDevices(mappedDevices);
    } else {
      setSelectedDevices([]);
    }
  };

  const fetchUserData = () => {
    if (userData?.user_name) {
      setUserName(userData.user_name);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  return (
    <div className=" bg-white">
      <StepNavigation steps={steps} currentStep={currentStep} />

      <div className="col-12 mt-4" style={{ height: "140px" }}>
        {currentStep === 1 && (
          <div className="d-flex flex-column">
            <div
              className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 p-2"
              style={{ height: "90px" }}
            >
              <label htmlFor="deviceSelect" className="form-label required">
                Select Devices
              </label>
              <CustomReactSelect
                options={compOptions}
                value={selectedDevices.map((device) => ({
                  value: device.id,
                  label: device.name,
                }))}
                onChange={handleDeviceChange}
                placeholder="Select Device"
                isClearable={false}
                isMulti={true}
              />

              {deviceError && (
                <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                  Please select a device.
                </small>
              )}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-3">
            <label htmlFor="destinationInput" className="form-label required">
              Destination
            </label>
            <input
              type="text"
              className="form-control form-control-solid"
              id="destinationInput"
              name="destination"
              value={destination}
              placeholder="e.g., /user/local/software"
              onChange={(e) => {
                setDestinationError(false);
                setDestination(e.target.value);
              }}
              required
            />
            {destinationError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                Please provide a valid destination (starts with "/").
              </small>
            )}
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <div className="row d-flex justify-content-end">
              <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-4 mb-5 d-flex justify-content-end">
                <div className=" d-flex">
                  <label
                    className={`form-check-label me-2 ${
                      isUrlSelected ? "fw-bold text-dark" : "fw-bold text-muted"
                    }`}
                    htmlFor="flexSwitchCheckDefault"
                  >
                    Enter URL
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      checked={!!isUrlSelected}
                      onChange={() => {
                        setFile(null);
                        setIsUrlSelected((prev) => !prev);
                      }}
                    />
                    <label
                      className={`form-check-label ${
                        !isUrlSelected
                          ? "fw-bold text-dark"
                          : "fw-bold text-muted"
                      }`}
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Upload File
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-between">
              <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-4 mb-5">
                <label className="required">Software Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setSoftwareNameError(false);
                    setSoftwareName(e.target.value);
                  }}
                  className="form-control form-control-solid"
                  placeholder="Enter the software name"
                />
                {softwareNameError && (
                  <small
                    className="text-danger"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Please provide a software name.
                  </small>
                )}
              </div>
              {isUrlSelected ? (
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-4 mb-5 url-input-container">
                  <label className="required">Software URL:</label>
                  <input
                    type="text"
                    onChange={(e) => {
                      setSoftwareUrlError(false);
                      setSoftwareUrl(e.target.value);
                    }}
                    className="form-control form-control-solid"
                    placeholder="Enter the software URL"
                  />
                  {softwareUrlError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please provide a software URL/File.
                    </small>
                  )}
                </div>
              ) : (
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mt-4 mb-5 file-upload-container">
                  <label className="required">Upload Software File:</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="form-control form-control-solid"
                  />
                  {file && <p>Selected file: {file.name}</p>}
                  {softwareUrlError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please provide a software URL/File.
                    </small>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="mb-3">
            <label htmlFor="argumentsInput" className="form-label">
              Variables
            </label>
            <input
              type="text"
              id="argumentsInput"
              className="form-control form-control-solid"
              placeholder="e.g., /a /b arg1=value1 arg2=value2"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
            />
          </div>
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
              alertContent.type === "error" ? "error-circle" : "success-circle"
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
        <button
          className="btn btn-sm btn-primary action-btn"
          onClick={handleBack}
          disabled={isFirstStep ? true : isBackButtonDisabled}
        >
          Back
        </button>
        {isLastStep ? (
          <button
            className="btn btn-sm btn-success action-btn"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleInstall(e)
            }
          >
            Submit
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary action-btn"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepNavigationStep
              step={step}
              isActive={step.id === currentStep}
              isComplete={step.id < currentStep}
            />
            {index < steps.length - 1 && (
              <div
                className={`step-line ${
                  currentStep > step.id ? "step-line-complete" : ""
                }`}
              ></div>
            )}
          </React.Fragment>
          //   <div className="step-title">{step.title}</div>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        {steps.map((stepItem, index) => (
          <div key={stepItem.id} className="step-title">
            {/* Step {index + 1}:  */}
            {stepItem.title}
          </div>
        ))}
      </div>
    </>
  );
};

export const StepNavigationStep: React.FC<StepNavigationStepProps> = ({
  step,
  isActive,
  isComplete,
}) => {
  const buttonClass = isComplete
    ? "border-color-success text-color-success"
    : isActive
    ? "border-color-primary text-color-primary"
    : "border-color-secondary text-color-secondary";

  return (
    <div className="d-flex flex-column align-items-center">
      <button
        className={`btn ${buttonClass} rounded-circle step-button`}
        disabled
      >
        <i className={`${step.iconClass} step-icon`}></i>
      </button>

      {/* <div className="step-title">{step.title}</div> */}
    </div>
  );
};

export const Step: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div>
      <h1 className="mb-4">{title}</h1>
      {children}
    </div>
  );
};
