import React, { useState } from "react";
import Select from "react-select";
import { HistoryType } from "../../types/HyperCommandsTypes";
import { initialMockData } from "../../pages/HyperCommands-Page/softwareInstallationPage";

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

const Wizard = ({ steps }: { steps: any }) => {
  //temporary
  const [history, setHistory] = useState<HistoryType[]>(initialMockData);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const deviceOptions = ["Device 1", "Device 2", "Device 3"];
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [softwareUrl, setSoftwareUrl] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [variables, setVariables] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);
  const [deviceError, setDeviceError] = useState<boolean>(false);
  const [destinationError, setDestinationError] = useState<boolean>(false);
  const [softwareUrlError, setSoftwareUrlError] = useState<boolean>(false);

  const [isUrlSelected, setIsUrlSelected] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [disableInstallButton, setDisableInstallButton] = useState(false);

  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 && !selectedDevice) {
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

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInstall = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsBackButtonDisabled(true);
    event.preventDefault();

    const isAlreadyInstalled = history.some(
      (entry) =>
        entry.software === softwareUrl && entry.device === selectedDevice
    );

    if (isAlreadyInstalled) {
      setAlertMessage(
        `${softwareUrl} is already installed on ${selectedDevice}.`
      );
      setAlertVariant("warning");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setDisableInstallButton(true);
    setProgress(10);

    setCurrentStep(5);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setAlertMessage(`${softwareUrl} installed successfully!`);
          setAlertVariant("success");
          setShowAlert(true);

          setHistory((prevHistory) => [
            ...prevHistory,
            {
              software: softwareUrl,
              device: selectedDevice,
              variables: variables,
              destination: destination,
              status: "initialized",
              user: "cobalt",
            },
          ]);

          setTimeout(() => {
            setProgress(0);
            setShowAlert(false);
            setDisableInstallButton(false);
            setCurrentStep(1);
          }, 1000);

          return prev;
        }

        // Dynamic progress feedback
        if (prev < 30) {
          setAlertMessage("Downloading software...");
        } else if (prev < 70) {
          setAlertMessage("Installing software...");
        } else if (prev < 100) {
          setAlertMessage("Finalizing installation...");
        }

        return prev + 10;
      });
    }, 500);
    clearFields();
  };

  const clearFields = () => {
    setSoftwareUrl("");
    setDestination("");
    setVariables("");
    setSelectedDevice("");
    setProgress(0);
  };

  return (
    <div className="container p-5 bg-white">
      <StepNavigation steps={steps} currentStep={currentStep} />

      <div className="mt-4">
        {currentStep === 1 && (
          <div className="mb-4" style={{ height: "90px" }}>
            <label htmlFor="deviceSelect" className="form-label required">
              Select Device
            </label>
            <Select
              id="deviceSelect"
              className="custom-select"
              classNamePrefix="react-select"
              options={deviceOptions.map((device) => ({
                value: device,
                label: device,
              }))}
              value={
                selectedDevice
                  ? { value: selectedDevice, label: selectedDevice }
                  : null
              }
              onChange={(selectedOption) =>
                setSelectedDevice(selectedOption ? selectedOption.value : "")
              }
            />
            {deviceError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                Please select a device.
              </small>
            )}
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
            <div className="d-flex justify-content-between mt-5">
              <label className="mb-3">
                Choose your preferred method to provide the Software URL
              </label>
              <div className="mb-4 d-flex">
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

      {showAlert && (
        <div className={`alert alert-${alertVariant} mt-3`}>
          <i
            className={`fas ${
              alertVariant === "success"
                ? "fa-check-circle"
                : "fa-exclamation-triangle"
            }`}
          ></i>
          {alertMessage}
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
    ? "border-success text-success"
    : isActive
    ? "border-primary text-primary"
    : "border-secondary text-secondary";

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
