import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../types/filtersAtomType";
import Select from "react-select";
import { userAtom } from "../../atoms/auth-atoms/authAtom";
import { GetPrivateIPAddress } from "../../config/ApiCalls";
import { DeviceIPAddressType } from "../../types/devicesTypes";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");

  const userData = useAtomValue(userAtom);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
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
  const [progress, setProgress] = useState(0);

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
        //&&
        // device.requesterid === selectedUser?.value
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

  const fetchIPAddress = async () => {
    if (selectedDevice) {
      const res = await GetPrivateIPAddress(selectedDevice.value);
      const data: DeviceIPAddressType = res.data.data[0];
      return data.private_ip_address;
    }
  };

  const handleConnect = async () => {
    if (selectedDevice && userName && pass.trim()) {
      const hostname = await fetchIPAddress();
      if (!hostname) {
        setAlertMessage(
          "Unable to fetch IP address. Please check network connectivity, ensure the device is powered on and reachable."
        );
        setAlertVariant("danger");
        return;
      }
      console.log("hostname ==>>", hostname);
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
    if (computerIdProp) {
      const computer = staticData.Computers.find(
        (device) => device.id === computerIdProp
      );
      if (computer) {
        const branch = staticData.Locations.find(
          (loc) => loc.id === computer.branchid
        );
        // const user = staticData.requesters.find(
        //   (req) => req.id === computer.requesterid
        // );

        setSelectedBranch(
          branch ? { value: branch.id, label: branch.name } : null
        );
        // setSelectedUser(user ? { value: user.id, label: user.name } : null);
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
                <div className="col-md-6 mb-5 d-flex justify-content-end align-items-end">
                  <div
                    className=" border rounded p-3 mb-4"
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
