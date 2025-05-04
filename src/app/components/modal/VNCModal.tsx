import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "../form/stepsButton";
import { useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { CustomReactSelect } from "../form/custom-react-select";
import { SelectDeviceType } from "../../types/devicesTypes";
import { BasicType, PrivateIpSchema } from "../../types/common";
import { StaticDataType } from "../../types/filtersAtomType";
import { GetPrivateIPAddressAPI } from "../../config/ApiCalls";

interface RemoteConsoleModalProps {
  onClose: () => void;
  onConnect: () => void;
  connectionInfo: {
    computerId: number;
    computerIp: string;
  };
  setConnectionInfo: React.Dispatch<
    React.SetStateAction<{
      computerId: number;
      computerIp: string;
    }>
  >;
}


const RemoteConsoleModal: React.FC<RemoteConsoleModalProps> = ({
  onClose,
  onConnect,
  connectionInfo,
  setConnectionInfo,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const [privateIps, setPrivateIps] = useState<PrivateIpSchema[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BasicType | null>(null);

  const [deviceError, setDeviceError] = useState(false);

  const compOptions = (staticData.computers || [])
    .filter((device) => privateIps.some((ip) => ip.mid === device.id))
    .map((device) => ({
      value: device.id ? Number(device.id) : 0,
      label: device.name || "",
    }));

  const handleConnectClick = () => {
    if (!connectionInfo.computerId) {
      setDeviceError(true);
    } else {
      setDeviceError(false);
      onConnect();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDeviceChange = (selectedOption: any) => {
    setDeviceError(false);

    if (selectedOption) {
      const selectedComputerId = Number(selectedOption.value);
      const selectedIp = privateIps.find((ip) => ip.mid === selectedComputerId);

      setSelectedDevice({
        id: selectedComputerId,
        name: selectedOption.label,
      });

      setConnectionInfo((prev: any) => ({
        ...prev,
        computerId: selectedComputerId,
        computerIp: selectedIp?.private_ip_address || "",
      }));
    } else {
      setSelectedDevice(null);
      setConnectionInfo((prev: any) => ({
        ...prev,
        computerId: null,
        computerIp: "",
      }));
    }
  };

  useEffect(() => {
    const fetchPrivateIps = async () => {
      try {
        const response = await GetPrivateIPAddressAPI();
        setPrivateIps(response.data);
      } catch (error) {
        console.error("Failed to fetch private IP addresses:", error);
      }
    };

    fetchPrivateIps();
  }, []);

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered" ref={dialogRef}>
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Start Remote Session</h5>
          </div>
          <div className="modal-body">
            <div className="mb-3" style={{ height: "85px" }}>
              <label htmlFor="userId" className="form-label required">
                Computer
              </label>
              <CustomReactSelect
                options={compOptions}
                value={
                  selectedDevice
                    ? {
                        value: selectedDevice.id
                          ? Number(selectedDevice.id)
                          : 0,
                        label: selectedDevice.name || "",
                      }
                    : null
                }
                onChange={handleDeviceChange}
                placeholder="Select Device"
                isClearable={false}
              />
              {deviceError && (
                <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                  User ID is required.
                </small>
              )}
            </div>
            <div className="mb-3" style={{ height: "85px" }}>
              <label htmlFor="vncIp" className="form-label required">
                VNC IP
              </label>
              <input
                type="text"
                className="form-control"
                id="vncIp"
                value={connectionInfo.computerIp}
                placeholder="VNC IP"
                readOnly
              />
            </div>
          </div>
          <div className="modal-footer border-0">
            <ConnectButton onClick={handleConnectClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RemoteConsoleModal };
