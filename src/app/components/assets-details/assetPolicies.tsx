import React, { useState } from "react";
import { Sidebar } from "./assetSidebar";
import { PoliciesButtons } from "../../types/assetsTypes";

const WindowsServiceComponent = () => <div>Windows Service Content</div>;
const AllProcessesComponent = () => <div>All Processes Content</div>;
const SoftwareComponent = () => <div>Software Content</div>;
const ManagedSoftwareComponent = () => <div>Managed Software Content</div>;
const RegistryEditorComponent = () => <div>Registry Editor Content</div>;
const FileExplorerComponent = () => <div>File Explorer Content</div>;

const AssetPoliciesComponent = () => {
  const [selectedButton, setSelectedButton] = useState<number>(1);
  let renderComponent: JSX.Element;

  switch (selectedButton) {
    case 1:
      renderComponent = <WindowsServiceComponent />;
      break;
    case 2:
      renderComponent = <AllProcessesComponent />;
      break;
    case 3:
      renderComponent = <SoftwareComponent />;
      break;
    case 4:
      renderComponent = <ManagedSoftwareComponent />;
      break;
    case 5:
      renderComponent = <RegistryEditorComponent />;
      break;
    case 6:
      renderComponent = <FileExplorerComponent />;
      break;
    default:
      renderComponent = <WindowsServiceComponent />; // Default to Windows Service
  }

  return (
    <div className="row app-row p-2">
      <div className="col-2 bg-light border-end p-3">
        <Sidebar
          buttons={PoliciesButtons}
          selectedId={selectedButton}
          onButtonClick={setSelectedButton}
        />
      </div>

      <div className="col-10 p-4">
        <span
          style={{ fontSize: "1.5rem", fontWeight: "500" }}
          className="mb-3"
        >
          {PoliciesButtons.find((button) => button.id === selectedButton)
            ?.text || "Policies"}
        </span>
        <div className="d-flex flex-column align-items-center justify-content-center h-75">
          {renderComponent}
        </div>
      </div>
    </div>
  );
};

export { AssetPoliciesComponent };
