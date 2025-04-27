import React, { useState } from "react";
import { Sidebar } from "./assetSidebar";
import { DetailsButtons } from "../../data/assets";

const HardwareComponent = () => <div>Hardware & misc</div>;
const NetworkPortsComponent = () => <div>Network ports</div>;
const AntivirusComponent = () => <div>Antivirus</div>;
const OperatingSystemComponent = () => <div>Operating system</div>;
const VolumeComponent = () => <div>Disk volume</div>;

const AssetDetailsComponent = () => {
  const [selectedButton, setSelectedButton] = useState<number>(1);
  let renderComponent: JSX.Element;

  switch (selectedButton) {
    case 1:
      renderComponent = <HardwareComponent />;
      break;
    case 2:
      renderComponent = <NetworkPortsComponent />;
      break;
    case 3:
      renderComponent = <AntivirusComponent />;
      break;
    case 4:
      renderComponent = <OperatingSystemComponent />;
      break;
    case 5:
      renderComponent = <VolumeComponent />;
      break;
    default:
      renderComponent = <HardwareComponent />;
  }

  return (
    <div
      className="row none-scroll-width vertical-scroll h-100"
      style={{ paddingTop: "5px" }}
    >
      <div className="col-2 bg-light border-end h-100">
        <Sidebar
          buttons={DetailsButtons}
          selectedId={selectedButton}
          onButtonClick={setSelectedButton}
        />
      </div>

      <div className="col-10 p-4">
        <span
          style={{ fontSize: "1.5rem", fontWeight: "500" }}
          className="mb-3"
        >
          {DetailsButtons.find((button) => button.id === selectedButton)
            ?.text || ""}
        </span>
      </div>
    </div>
  );
};

export { AssetDetailsComponent };
