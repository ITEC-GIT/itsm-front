import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { selectValueType } from "../../types/dashboard";
import { useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import Select from "react-select";
import Cookies from "js-cookie";
import {
  fetchXSRFToken,
  GetPrivateIPAddress,
  RemoteSSHConnect,
} from "../../config/ApiCalls";
import SSHClient from "../../components/Remote SSH/SSHClient";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const AlertModal = ({ onClose }: { onClose: () => void }) => (
  <div className="alert-overlay">
    <div className="alert-box">
      <h6>
        🚀 The selected device does not have the required agent installed.
      </h6>
      <div className="alert-button-container">
        <button className="btn btn-danger alert-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [openSSH, setOpenSSH] = useState<boolean>(false);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<selectValueType | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<selectValueType | null>(
    null
  );
  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );
  const [deviceError, setDeviceError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [usrnameError, setUsrnameError] = useState(false);

  const locationOptions = useMemo(
    () =>
      (staticData.Locations || []).map((location: any) => ({
        value: location.id ? Number(location.id) : 0,
        label: location.name || "",
      })),
    [staticData]
  );

  const userOptions = useMemo(() => {
    return (staticData.requesters || [])
      .filter(
        (device) => !selectedBranch || device.branch_id === selectedBranch.value
      )
      .map((device) => ({
        value: device.id ? Number(device.id) : 0,
        label: device.name || "",
      }));
  }, [staticData, selectedBranch]);

  const compOptions = useMemo(() => {
    return (staticData.computers || [])
      .filter(
        (device) => !selectedBranch || device.branchid === selectedBranch.value
      )
      .map((device) => ({
        value: device.id ? Number(device.id) : 0,
        label: device.name || "",
      }));
  }, [staticData, selectedBranch]);

  const handleBranchChange = (newValue: selectValueType | null) => {
    setSelectedBranch(newValue);
    setSelectedUser(null);
    setSelectedDevice(null);
  };

  const handleConnect = async () => {
    if (!selectedDevice) {
      setDeviceError(true);
      return;
    }
    if (!username) {
      setUsrnameError(true);
      return;
    }
    if (!pass) {
      setPassError(true);
      return;
    }
    setOpenSSH(true);
    const passParams = btoa(pass); //for query params which is not needed in our case
    try {
      // const response = await fetchXSRFToken();
      // console.log("response >>", response);
      // Cookies.set("_xsrf", response);
      const res = await RemoteSSHConnect(ipAddress, port, username, pass);
      console.log("res >>", res);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleReset = () => {
    setPort(22);
    setPass("");
    setSelectedBranch(null);
    setSelectedDevice(null);
    setSelectedUser(null);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    setSelectedDevice(null);
  };

  useEffect(() => {
    if (selectedDevice) {
      const fetchIPAddress = async () => {
        try {
          const res = await GetPrivateIPAddress(selectedDevice.value);
          const data = res.data.data[0];
          const ip = data?.private_ip_address || "";
          setIpAddress(ip);
          if (!ip) setAlertVisible(true);
        } catch (error) {
          console.error("Error fetching IP:", error);
          setIpAddress(" ");
          setAlertVisible(true);
        }
      };
      fetchIPAddress();
    } else {
      setIpAddress(" ");
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (computerIdProp) {
      const computer = staticData.computers.find(
        (device) => device.id === computerIdProp
      );
      if (computer) {
        const branch = staticData.Locations.find(
          (loc) => loc.id === computer.branchid
        );
        setSelectedBranch(
          branch ? { value: branch.id, label: branch.name } : null
        );
        setSelectedDevice({ value: computer.id, label: computer.name });
      }
    }
  }, [computerIdProp, staticData]);
  // const BASE_URL = import.meta.env.VITE_APP_ITSM_GLPI_SSH_URL;
  return (
    // <>
    //   <iframe src={BASE_URL} width="800" height="600"></iframe>
    //   <div></div>
    // </>
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div
          className="row d-flex custom-main-container custom-container-height"
          style={{ overflowY: "auto" }}
        >
          <div className="col-12">
            {!computerIdProp && (
              <div className="d-flex justify-content-between">
                <h2 className="text-center mb-4">🔐 Remote SSH</h2>
                <ActionIcons />
              </div>
            )}

            {openSSH ? (
              <SSHClient
                hostname={ipAddress}
                credentials={{
                  username,
                  password: pass,
                }}
              />
            ) : (
              <div className="row">
                <div className="mb-5 d-flex justify-content-end align-items-end">
                  <div
                    className="border rounded p-3"
                    style={{ width: "150px" }}
                  >
                    <label className="form-label text-start">
                      <i className="bi bi-usb-symbol text-primary"></i>
                      <span className="text-primary">Port</span>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-solid"
                      value={port}
                      placeholder="Enter Port (e.g., 8080)"
                      onChange={(e) => setPort(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Select Location</label>
                  <Select
                    options={locationOptions}
                    classNamePrefix="react-select"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    placeholder="Select Branch"
                    isClearable
                    maxMenuHeight={200}
                  />
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Username"
                    onChange={(e) => {
                      setUsrnameError(false);
                      setUsername(e.target.value);
                    }}
                    style={{ height: "47px" }}
                    required
                  />
                  {usrnameError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please enter your username.
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Select User</label>
                  <Select
                    options={userOptions}
                    classNamePrefix="react-select"
                    value={selectedUser}
                    onChange={(newValue) => setSelectedUser(newValue)}
                    placeholder="Select User"
                    isClearable
                    maxMenuHeight={200}
                  />
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label required">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-solid"
                    placeholder="Your password"
                    onChange={(e) => {
                      setPassError(false);
                      setPass(e.target.value);
                    }}
                    style={{ height: "47px" }}
                    required
                  />
                  {passError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please enter your password.
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-5">
                  <label className="custom-label required">Select Device</label>
                  <Select
                    classNamePrefix="react-select"
                    options={compOptions}
                    value={selectedDevice}
                    onChange={(newValue) => {
                      setDeviceError(false);
                      setSelectedDevice(newValue);
                    }}
                    placeholder="Select Device"
                    isClearable
                    maxMenuHeight={200}
                  />
                  {deviceError && (
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Please select a device.
                    </small>
                  )}
                </div>

                {selectedDevice && (
                  <div className="col-md-6 mb-5">
                    <label className="custom-label required">
                      Device IP Address
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      value={ipAddress}
                      readOnly
                      style={{ height: "47px" }}
                    />
                  </div>
                )}
                <div className="mt-5 d-flex flex-row justify-content-around gap-3">
                  <button
                    className="btn btn-sm btn-dark action-btn"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary action-btn"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {alertVisible && <AlertModal onClose={handleCloseAlert} />}
      </div>
    </AnimatedRouteWrapper>
  );
};

export { RemoteSSHPage };
