import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import {
  InitiateSoftwareInstallation,
  GetAllComputers,
  GetAllLocations,
} from "../../config/ApiCalls";
import { useAtomValue } from "jotai";
import { userAtom } from "../../atoms/auth-atoms/authAtom";
import { SoftwareHistoryType } from "../../types/softwareInstallationTypes";
import { SelectDeviceType } from "../../types/devicesTypes";
import { SelectLocationType } from "../../types/locationsTypes";
import { formatName } from "../../../utils/custom";

interface Step {
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

const Wizard = ({
  steps,
  add,
  idgt,
}: {
  steps: any;
  add: React.Dispatch<React.SetStateAction<SoftwareHistoryType[]>>;
  idgt: number;
}) => {
  const userData = useAtomValue(userAtom);
  const [userName, setUserName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [deviceOptions, setDeviceOptions] = useState<SelectDeviceType[]>([]);
  const [locationOptions, setLocationOptions] = useState<SelectLocationType[]>(
    []
  );

  const [selectedDevices, setSelectedDevices] = useState<
    SelectDeviceType[] | []
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectLocationType | null>(null);
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

  const InsertSoftwareInstallation = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        "uploadManifest",
        JSON.stringify({
          input: {
            mid: selectedDevices.map((device) => device.serial),
            software: softwareName.trim(),
            url: softwareUrl.trim(),
            destination: destination.trim(),
            arguments: variables.trim(),
          },
        })
      );
      if (file) {
        formdata.append(
          "file",
          file,
          "postman-cloud:///1ef377a9-7314-40e0-ad32-85259e782318"
        );
      }
      const response = await InitiateSoftwareInstallation(formdata);

      if (response.status !== 200) {
        throw new Error("Opps! Something went wrong!");
      }
      return response;
    } catch (error: any) {
      console.error("Error during software installation:", error);
      if (!error.message) {
        setAlertContent({
          message:
            error.message ||
            "An unknown error occurred during the installation.",
          icon: "fas fa-exclamation-circle",
          type: "error",
        });
      }
      throw error;
    }
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
      id: idgt + 1,
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

          setTimeout(() => {
            setDisableInstallButton(false);
            setProgress(0);
            setShowAlert(false);
            setCurrentStep(1);
          }, 1000);

          return prev;
        }

        return prev + 10;
      });
    }, 500);

    InsertSoftwareInstallation()
      .then(() => {
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
                add((prev: SoftwareHistoryType[]) => [record, ...prev]);
              }, 1000);

              return prev;
            }

            return prev + 10;
          });
        }, 500);
      })
      .catch((error: any) => {
        console.error("Error creating record:", error);
        setShowAlert(true);
        setAlertContent({
          message:
            error.message ||
            "An unknown error occurred during the installation.",
          icon: "fas fa-exclamation-circle",
          type: "error",
        });
        setDisableInstallButton(false);
        setIsBackButtonDisabled(false);
        setProgress(0);
      });

    clearFields();
  };

  const clearFields = () => {
    setSoftwareName("");
    setSoftwareUrl("");
    setDestination("");
    setVariables("");
    setSelectedDevices([]);
    setProgress(0);
  };

  const fetchLocations = async () => {
    const response = await GetAllLocations();
    const data = response.data.data;
    const locationData = data.map((item: any) => ({
      id: item.id,
      name: formatName(item.name),
    }));
    setLocationOptions(locationData);
  };

  const fetchComputers = async () => {
    const response = await GetAllComputers();
    const data = response.data.data;
    const computersData = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      serial: item.serial,
      locations_id: item.locations_id,
    }));
    setDeviceOptions(computersData);
  };

  const fetchUserData = () => {
    if (userData?.session?.glpiname) {
      setUserName(userData.session.glpiname);
    }
  };

  const filteredDevices = useMemo(() => {
    return selectedLocation
      ? deviceOptions.filter(
          (device) => device.locations_id === selectedLocation.id
        )
      : deviceOptions;
  }, [selectedLocation, deviceOptions]);

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  useEffect(() => {
    fetchLocations();
    fetchComputers();
  }, []);

  return (
    <div className="container-fluid p-5 bg-white">
      <StepNavigation steps={steps} currentStep={currentStep} />

      <div className="mt-4">
        {currentStep === 1 && (
          <div className="d-flex flex-column">
            <div className="mb-4" style={{ height: "90px" }}>
              <label htmlFor="locationSelect" className="form-label">
                Select Location
              </label>
              <Select
                id="locationSelect"
                className="custom-select"
                classNamePrefix="react-select"
                options={locationOptions.map((location) => ({
                  value: location.id.toString(),
                  label: location.name,
                }))}
                value={
                  selectedLocation
                    ? {
                        value: selectedLocation.id.toString(),
                        label: selectedLocation.name,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const selectedLocationDetails = locationOptions.find(
                      (location) =>
                        location.id.toString() === selectedOption.value
                    );
                    setSelectedLocation(selectedLocationDetails || null);
                    setSelectedDevices([]); // Reset selected devices when location changes
                  } else {
                    setSelectedLocation(null);
                    setSelectedDevices([]); // Show all devices again
                  }
                }}
                isClearable // Allow user to clear selection
              />
            </div>
            <div className="mb-4" style={{ height: "90px" }}>
              <label htmlFor="deviceSelect" className="form-label required">
                Select Device
              </label>
              <Select
                id="deviceSelect"
                className="custom-select"
                classNamePrefix="react-select"
                isMulti
                options={filteredDevices.map((device) => ({
                  value: device.id.toString(),
                  label: device.name,
                }))}
                value={selectedDevices.map((device) => ({
                  value: device.id.toString(),
                  label: device.name,
                }))}
                onChange={(selectedOptions) => {
                  const selectedDevicesDetails = selectedOptions
                    ? selectedOptions.map((option) =>
                        deviceOptions.find(
                          (device) => device.id.toString() === option.value
                        )
                      )
                    : [];
                  setSelectedDevices(
                    (selectedDevicesDetails || []).filter(
                      (device): device is SelectDeviceType =>
                        device !== undefined
                    )
                  );
                }}
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
          <div className="mb-3">
            <label htmlFor="destinationInput" className="form-label required">
              Destination
            </label>
            <input
              type="text"
              className="form-control custom-input"
              id="destinationInput"
              name="destination"
              value={destination}
              placeholder="e.g., /user/local/software"
              onChange={(e) => setDestination(e.target.value)}
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
          <div className="d-flex flex-column">
            <div className="mt-4 mb-5">
              <label className="required">Software Name</label>
              <input
                type="text"
                onChange={(e) => {
                  setSoftwareNameError(false);
                  setSoftwareName(e.target.value);
                }}
                className="form-control custom-input"
                placeholder="Enter the software name"
              />
            </div>
            {softwareNameError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                Please provide a software name.
              </small>
            )}
            <div className="d-flex justify-content-between mt-5">
              <label>
                Choose your preferred method to provide the Software URL
              </label>
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

            {isUrlSelected ? (
              <div className="url-input-container">
                <label className="required">Software URL:</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setSoftwareUrlError(false);
                    setSoftwareUrl(e.target.value);
                  }}
                  className="form-control custom-input"
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
              <div className="file-upload-container">
                <label className="required">Upload Software File:</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="form-control custom-input"
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
        )}
        {currentStep === 4 && (
          <div className="mb-3">
            <label htmlFor="argumentsInput" className="form-label">
              Variables
            </label>
            <input
              type="text"
              id="argumentsInput"
              className="form-control custom-input"
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
          className="btn btn-primary"
          onClick={handleBack}
          disabled={isFirstStep ? true : isBackButtonDisabled}
        >
          Back
        </button>
        {isLastStep ? (
          <button
            className="btn btn-success"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleInstall(e)
            }
          >
            Submit
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <StepNavigationStep
              step={step}
              isActive={step.id === currentStep}
              isComplete={step.id < currentStep}
            />
            {/* Line between circles */}
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
            Step {index + 1}: {stepItem.title}
          </div>
        ))}
      </div>
    </>
  );
};

const StepNavigationStep: React.FC<StepNavigationStepProps> = ({
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

const Step: React.FC<{ title: string; children: React.ReactNode }> = ({
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

export { Wizard };
