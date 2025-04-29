import React, { useEffect, useState } from "react";
import { Sidebar } from "./assetSidebar";
import { DetailsButtons } from "../../data/assets";
import { GetComputerDetailsAPI } from "../../config/ApiCalls";
import { useAtom } from "jotai";
import { selectedComputerInfoAtom } from "../../atoms/assets-atoms/assetAtoms";
import { PCDetailsType } from "../../types/assetsTypes";
import { capitalize } from "../../../utils/custom";
import { CircularSpinner } from "../spinners/circularSpinner";
import { TbArrowBadgeRight } from "react-icons/tb";

const cardTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "700",
  marginBottom: "0.75rem",
  color: "#4B5563",
};

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "0.75rem",
  padding: "1rem",
  background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.06)",
  height: "100%",
};

const DataCardGrid = ({
  title,
  data,
  fallbackMessage = "No information available",
  excludeFields = ["Hash"],
}: {
  title: string;
  data: any;
  fallbackMessage?: string;
  excludeFields?: string[];
}) => {
  if (!data || !data.length)
    return <div className="text-muted">{fallbackMessage}</div>;

  return (
    <div className="col-12 mb-4">
      <h5
        style={{
          fontSize: "1.5rem",
          fontWeight: "500",
          marginBottom: "1rem",
          color: "#1F2937",
        }}
      >
        <TbArrowBadgeRight size={18} color="#4B5563" />
        {title}
      </h5>
      <div className="row">
        {data.map((item: any) => {
          const fields = Object.keys(item)
            .filter((key) => !excludeFields.includes(key))
            .map((key) => {
              let value = item[key];
              if (typeof value === "object" && value !== null) {
                value = Array.isArray(value)
                  ? value.join(", ")
                  : JSON.stringify(value);
              }
              return {
                label: key,
                value: value || "",
              };
            });

          const cardTitle =
            item.NAME ||
            item.SMODEL ||
            Object.values(item).find((val) => val && typeof val === "string") ||
            "Unknown";

          return (
            <div key={item.Hash} className="col-md-6 col-lg-4 mb-4">
              <DetailCard title={cardTitle} fields={fields} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailCard = ({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value: any }[];
}) => (
  <div style={cardStyle}>
    <h1 style={cardTitleStyle}>{title}</h1>
    <div>
      {fields.map((field, index) => {
        let displayValue = field.value;
        if (typeof field.value === "object" && field.value !== null) {
          displayValue = Array.isArray(field.value)
            ? field.value.join(", ")
            : JSON.stringify(field.value);
        }

        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontWeight: 300, fontSize: "1rem" }}>
              {capitalize(field.label.replace(/[_-]/g, " "))}
            </span>
            <span
              title={displayValue}
              style={{
                backgroundColor: "#E0E7FF",
                color: "#3730A3",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "0.9rem",
                maxWidth: "50%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "block",
                cursor: "default",
              }}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const HardwareComponent = ({
  hardwareData,
}: {
  hardwareData?: PCDetailsType["hardware"];
}) => {
  if (!hardwareData) return <div>No hardware information available.</div>;

  const hardwareSections = Object.entries(hardwareData)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    .map(([key, value]) => ({
      name: key,
      data: value,
      title: `${key.charAt(0).toUpperCase() + key.slice(1)} Information`,
    }));

  return (
    <div className="row">
      {hardwareSections.length > 0 ? (
        hardwareSections.map((section) => (
          <DataCardGrid
            key={section.name}
            title={section.title}
            data={section.data}
          />
        ))
      ) : (
        <div>No hardware details available</div>
      )}
    </div>
  );
};

const NetworkPortsComponent = ({ networkData }: { networkData: any }) => (
  <div className="row">
    <DataCardGrid title="Network Information" data={networkData?.network} />
  </div>
);

const AntivirusComponent = ({ antivirusData }: { antivirusData: any }) => (
  <div className="row">
    <DataCardGrid
      title="Antivirus Information"
      data={antivirusData?.antivirus}
    />
  </div>
);

const OperatingSystemComponent = ({ osData }: { osData: any }) => (
  <div className="row">
    <DataCardGrid
      title="Operating System Information"
      data={osData?.operatingsystem}
    />
  </div>
);

const VolumeComponent = ({ driveData }: { driveData: any }) => (
  <div className="row">
    <DataCardGrid title="Drive Information" data={driveData?.drive} />
  </div>
);

const AssetDetailsComponent = () => {
  const [selectedButton, setSelectedButton] = useState<number>(1);
  const [pcDetails, setPCDetails] = useState<PCDetailsType>();
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- loading state

  const [selectedComputerInfo, setSelectedComputerInfo] = useAtom(
    selectedComputerInfoAtom
  );

  useEffect(() => {
    const fetchPCDetails = async () => {
      setIsLoading(true);
      const res = await GetComputerDetailsAPI(selectedComputerInfo.id);
      if (res.status === 200) {
        setPCDetails(res.data);
      } else {
        console.error("Error fetching PC details:", res);
      }
      setIsLoading(false);
    };
    fetchPCDetails();
  }, []);

  let renderComponent: JSX.Element;

  switch (selectedButton) {
    case 1:
      renderComponent = (
        <HardwareComponent hardwareData={pcDetails?.hardware} />
      );
      break;
    case 2:
      renderComponent = (
        <NetworkPortsComponent networkData={pcDetails?.network} />
      );
      break;
    case 3:
      renderComponent = (
        <AntivirusComponent antivirusData={pcDetails?.antivirus} />
      );
      break;
    case 4:
      renderComponent = <OperatingSystemComponent osData={pcDetails?.os} />;
      break;
    case 5:
      renderComponent = <VolumeComponent driveData={pcDetails?.drive} />;
      break;
    default:
      renderComponent = (
        <HardwareComponent hardwareData={pcDetails?.hardware} />
      );
  }

  return (
    <div
      className="row none-scroll-width vertical-scroll h-100"
      style={{ paddingTop: "5px" }}
    >
      <div
        className="col-2  border-end h-100"
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Sidebar
          buttons={DetailsButtons}
          selectedId={selectedButton}
          onButtonClick={setSelectedButton}
        />
      </div>

      <div className="col-10 p-4">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <CircularSpinner />
          </div>
        ) : (
          //display part
          <span
            style={{ fontSize: "1.5rem", fontWeight: "500" }}
            className="mb-3"
          >
            {renderComponent}
          </span>
        )}
      </div>
    </div>
  );
};

export { AssetDetailsComponent };
