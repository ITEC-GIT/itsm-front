import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { selectValueType } from "../../types/dashboard";
import { useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../types/filtersAtomType";
import Select from "react-select";
import { userAtom } from "../../atoms/auth-atoms/authAtom";
import { GetPrivateIPAddress, RemoteSSHConnect } from "../../config/ApiCalls";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const userData = useAtomValue(userAtom);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [ipAddress, setIpAddress] = useState("");
  const [userInputIp, setUserInputIp] = useState("");
  const [port, setPort] = useState(22);
  const [userName, setUserName] = useState("");
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
  const [ipError, setIpError] = useState(false);
  const [hostname, setHostname] = useState("");

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
    return (staticData.Computers || [])
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
    if (!pass) {
      setPassError(true);
      return;
    }
    if (!ipAddress && !userInputIp) {
      setIpError(true);
      return;
    }

    try {
      const response = await RemoteSSHConnect(
        hostname,
        port,
        userName,
        btoa(pass)
      );

      const result = await response.json();
      //add error handler bs kezim tetzabat men l backend in order to handle the error 
      console.log("SSH connection response:", result);
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
    setAlertMessage("");
    setAlertVariant("");
  };

  useEffect(() => {
    if (selectedDevice) {
      const fetchIPAddress = async () => {
        try {
          const res = await GetPrivateIPAddress(selectedDevice.value);
          const data = res.data.data[0];
          setIpAddress(data?.private_ip_address || "");
        } catch (error) {
          console.error("Error fetching IP:", error);
          setIpAddress("");
        }
      };
      fetchIPAddress();
    } else {
      setIpAddress("");
    }
  }, [selectedDevice]);

  useEffect(() => {
    setHostname(userInputIp || ipAddress);
  }, [ipAddress, userInputIp]);

  useEffect(() => {
    if (computerIdProp) {
      const computer = staticData.Computers.find(
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

  useEffect(() => {
    if (userData?.session?.glpiname) {
      setUserName(userData.session.glpiname);
    }
  }, [userData]);

  return (
    <div
      className="container-fluid"
      style={{ paddingLeft: "30px", paddingRight: "30px" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-10 col-xl-12">
          {!computerIdProp && (
            <div className="d-flex justify-content-between">
              <h2 className="text-center mb-4">🔐 Remote SSH</h2>
              <ActionIcons />
            </div>
          )}
          <div className="container">
            <div className="card p-5">
              <div className="row">
                <div className="col-md-12 mb-5 d-flex justify-content-end align-items-end">
                  <div
                    className="border rounded p-3 mb-4"
                    style={{ width: "150px" }}
                  >
                    <label className="form-label text-start">
                      <i className="bi bi-usb-symbol text-primary"></i>
                      <span className="text-primary">Port</span>
                    </label>
                    <input
                      type="number"
                      className="form-control custom-input"
                      value={port}
                      placeholder="Enter Port (e.g., 8080)"
                      onChange={(e) => setPort(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Select Location</label>
                  <Select
                    className="custom-select"
                    options={locationOptions}
                    classNamePrefix="react-select"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    placeholder="Select Branch"
                    isClearable
                  />
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Username</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={userName}
                    style={{ height: "47px" }}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label">Select User</label>
                  <Select
                    className="custom-select"
                    options={userOptions}
                    classNamePrefix="react-select"
                    value={selectedUser}
                    onChange={(newValue) => setSelectedUser(newValue)}
                    placeholder="Select Device"
                    isClearable
                  />
                </div>
                <div className="col-md-6 mb-5">
                  <label className="custom-label required">Password</label>
                  <input
                    type="password"
                    className="form-control custom-input"
                    placeholder="Your password"
                    onChange={(e) => setPass(e.target.value)}
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
                    className="custom-select"
                    options={compOptions}
                    classNamePrefix="react-select"
                    value={selectedDevice}
                    onChange={(newValue) => setSelectedDevice(newValue)}
                    placeholder="Select Device"
                    isClearable
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
                      className="form-control custom-input"
                      value={ipAddress || userInputIp}
                      onChange={(e) => setUserInputIp(e.target.value)}
                      placeholder="Enter IP Address"
                      readOnly={!!ipAddress}
                      required={!ipAddress}
                      onFocus={() => setIpError(false)} // Reset error when editing
                    />
                    {ipError && !ipAddress && (
                      <small
                        className="text-danger"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Please enter the IP address.
                      </small>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-5 d-flex flex-column justify-content-around flex-sm-row gap-3">
                <button
                  type="button"
                  className="btn hyper-reset-btn"
                  onClick={handleReset}
                  style={{ width: "150px" }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn hyper-connect-btn"
                  onClick={handleConnect}
                  style={{ width: "150px" }}
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RemoteSSHPage };
