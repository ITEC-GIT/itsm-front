import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../types/filtersAtomType";
import Select from "react-select";
import { userAtom } from "../../atoms/auth-atoms/authAtom";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [connected, setConnected] = useState<boolean>(false);
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
    () => [
      { value: 0, label: "All Branches" },
      ...(staticData.Locations || []).map((location: any) => ({
        value: location.id ? Number(location.id) : 0,
        label: location.name || "",
      })),
    ],
    [staticData]
  );

  const userOptions = useMemo(() => {
    return (
      (staticData.requesters || [])
        // .filter(
        //   (device) => !selectedBranch || device.branchid === selectedBranch.value
        // )
        .map((device) => ({
          value: device.id ? Number(device.id) : 0,
          label: device.name || "",
        }))
    );
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

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
  };

  const validateHostname = (hostname: string) => {
    const regex =
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$|^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return regex.test(hostname);
  };

  const validatePort = (port: string | number) => {
    return Number(port) > 0;
  };

  const validateCredentials = () => {
    if (!userName || !pass) {
      setAlertMessage("Please enter both username and password.");
      setAlertVariant("danger");
      return false;
    }
    return true;
  };

  const handleConnect = () => {
    // if (!hostname || !port) {
    //   setAlertMessage("Please provide both hostname and port.");
    //   setAlertVariant("danger");
    //   return;
    // }
    // if (!validateHostname(hostname as string)) {
    //   setAlertMessage(
    //     "Invalid hostname. Please enter a valid hostname or IP address."
    //   );
    //   setAlertVariant("danger");
    //   return;
    // }
    // if (!validatePort(port)) {
    //   setAlertMessage("Port must be a positive number.");
    //   setAlertVariant("danger");
    //   return;
    // }
    // if (!validateCredentials()) return;
    // setConnected(true);
    // setAlertMessage("Connected to server successfully!");
    // setAlertVariant("success");
  };

  const handleReset = () => {
    setPort(22);
    setPass("");
    setSelectedBranch(null);
    setSelectedDevice(null);
    setSelectedUser(null);
    setAlertMessage("");
    setAlertVariant("");
    setConnected(false);
  };

  useEffect(() => {
    if (userData?.session?.glpiname) {
      setUserName(userData.session.glpiname);
    }
  }, [userData]);

  return (
    // <Content>
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
          <div className="row p-4 shadow-sm bg-light rounded mt-2 ">
            <div className="d-flex justify-content-end">
              <div
                className=" border rounded p-3 mb-4"
                style={{ width: "150px" }}
              >
                <label className="form-label text-start">
                  <i className="bi bi-usb-symbol text-primary"></i>{" "}
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

            <div className="col-lg-6 ">
              <div className="mb-5">
                <label className="form-label">Select Location</label>
                <Select
                  className="custom-select"
                  options={locationOptions}
                  classNamePrefix="react-select"
                  value={selectedBranch}
                  onChange={(newValue) => setSelectedBranch(newValue)}
                  placeholder="Select Branch"
                  isClearable
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Select User</label>
                <Select
                  className="custom-select"
                  options={userOptions}
                  classNamePrefix="react-select"
                  value={selectedUser}
                  onChange={(newValue) => setSelectedUser(newValue)}
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
              <div className="mb-5">
                <label className="form-label required">Select Device</label>
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
            </div>

            <div className="col-lg-6">
              <div className="mb-5">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={userName}
                  style={{ height: "48px" }}
                  readOnly
                />
              </div>

              <div className="mb-5">
                <label className="form-label required">Password</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={pass}
                  placeholder="Your password"
                  onChange={(e) => setPass(e.target.value)}
                  style={{ height: "48px" }}
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
            </div>

            <div className="d-flex flex-column justify-content-around flex-sm-row gap-3">
              <button
                type="button"
                className="btn hyper-connect-btn"
                onClick={handleConnect}
                style={{ width: "150px" }}
              >
                Connect
              </button>

              <button
                type="button"
                className="btn hyper-reset-btn"
                onClick={handleReset}
                style={{ width: "150px" }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    // </Content>
  );
};

export { RemoteSSHPage };
