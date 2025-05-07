import { useEffect, useMemo, useRef, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons.tsx";
import { TerminalDisplay } from "../../components/Remote SSH/terminalDisplay.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { DisconnectButton } from "../../components/form/stepsButton.tsx";
import { CustomReactSelect } from "../../components/form/custom-react-select.tsx";
import { BasicType, PrivateIpSchema } from "../../types/common.ts";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms.ts";
import { StaticDataType } from "../../types/filtersAtomType.ts";
import { GetPrivateIPAddressAPI } from "../../config/ApiCalls.ts";
import { UserSessions } from "../../components/screenshots/userSessionSidebar.tsx";
import { sshHistoryAtom } from "../../atoms/hypercommands-atoms/remote-ssh-atom.ts";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [sshHistory, setSshHistory] = useAtom(sshHistoryAtom);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [hostError, setHostError] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);
  const [divHeight, setDivHeight] = useState<number>(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [privateIps, setPrivateIps] = useState<PrivateIpSchema[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const [deviceError, setDeviceError] = useState(false);

  const compOptions = (staticData.computers || [])
    .filter((device) => privateIps.some((ip) => ip.mid === device.id))
    .map((device) => ({
      value: device.id ? Number(device.id) : 0,
      label: device.name || "",
    }));

  const base_ssh_url = import.meta.env.VITE_APP_ITSM_SSH;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      setErrorModalOpen(false);
    }
  };

  const handleReset = () => {
    setPort(22);
    setPass("");
    setUsername("");
    setIpAddress("");
    setUserError(false);
    setPassError(false);
    setHostError(false);
  };

  const handleConnect = async () => {
    const newEntry = {
      computerId: selectedDevice?.value,
      computerName: selectedDevice?.label,
      host: ipAddress,
      username,
      password: pass,
      port,
      timestamp: new Date().toISOString(),
    };

    setSshHistory((prev) => {
      const updated = [...prev, newEntry];
      return updated.slice(-10);
    });

    let hasError = false;

    if (!selectedDevice) {
      setDeviceError(true);
      hasError = true;
    }
    if (!username) {
      setUserError(true);
      hasError = true;
    }
    if (!pass) {
      setPassError(true);
      hasError = true;
    }
    if (!ipAddress) {
      setHostError(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch(`${base_ssh_url}/auth/ssh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: username,
          password: pass,
          host: ipAddress,
          port: port,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.detail || "Authentication failed.");
        setErrorModalOpen(true);
        return;
      }

      setSessionId(result.session_id);
    } catch (error) {
      setErrorMessage("Connection error. Please try again.");
      setErrorModalOpen(true);
    }
  };

  const handleDisconnect = async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`${base_ssh_url}/kill/ssh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.detail || "Failed to disconnect.");
        setErrorModalOpen(true);
        return;
      }

      setSessionId(null);
    } catch (error) {
      setErrorMessage("Disconnect error. Please try again.");
      setErrorModalOpen(true);
    }
  };

  const handleDeviceChange = (selectedOption: any) => {
    setDeviceError(false);
    const selectedComputerId = Number(selectedOption?.value);
    setSelectedDevice(selectedOption);

    const selectedIp = privateIps.find((ip) => ip.mid === selectedComputerId);
    if (selectedIp?.private_ip_address) {
      setIpAddress(selectedIp.private_ip_address);
      setHostError(false);
    } else {
      setIpAddress("");
    }

    // Load last used credentials
    const lastUsed = [...sshHistory]
      .reverse()
      .find((entry) => entry.computerId === selectedComputerId);

    if (lastUsed) {
      setUsername(lastUsed.username);
      setPass(lastUsed.password);
      setPort(lastUsed.port || 22);
    }
  };

  const applySessionEntry = (entry: any) => {
    setSelectedDevice({
      value: entry.computerId,
      label: entry.computerName,
    });
    setUsername(entry.username);
    setPass(entry.password);
    setPort(entry.port || 22);
    setIpAddress(entry.host);
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setDivHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

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
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div
          className="row d-flex custom-main-container custom-container-height"
          style={{ overflowY: "auto" }}
        >
          <div className="col-12 h-100">
            {!computerIdProp && (
              <div
                className="d-flex justify-content-between flex-wrap"
                ref={divRef}
              >
                <h2 className="text-center mb-4">🔐 Remote SSH</h2>
                <ActionIcons />
              </div>
            )}

            {!sessionId ? (
              <div
                className="row"
                style={{
                  height: `calc(100vh - var(--bs-app-header-height) - 30px - ${divHeight}px) `,
                }}
              >
                <div className="col-12 col-sm-5 col-md-4 col-lg-3 mb-4">
                  <UserSessions onSelectHistory={applySessionEntry} />
                </div>
                <div className="col-12 col-sm-7 col-md-8 col-lg-9">
                  <div className="d-flex justify-content-start">
                    <div className="w-100">
                      <div className="row mb-4">
                        <div
                          className="col-12 col-md-6 mb-4"
                          style={{ minHeight: "85px" }}
                        >
                          <label
                            htmlFor="userId"
                            className="form-label required"
                          >
                            Computer
                          </label>
                          <CustomReactSelect
                            options={compOptions}
                            value={selectedDevice}
                            onChange={handleDeviceChange}
                            placeholder="Select Device"
                            isClearable
                          />
                          {deviceError && (
                            <small
                              className="text-danger"
                              style={{ fontSize: "0.875rem" }}
                            >
                              Please select a computer.
                            </small>
                          )}
                        </div>

                        <div
                          className="col-12 col-md-6 mb-4"
                          style={{ minHeight: "85px" }}
                        >
                          <label className="custom-label required">
                            SSH Host/IP
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder custom-input-height"
                            placeholder="Enter Host/IP"
                            value={ipAddress}
                            onChange={(e) => {
                              setHostError(false);
                              setIpAddress(e.target.value);
                            }}
                            required
                          />
                          {hostError && (
                            <small
                              className="text-danger"
                              style={{ fontSize: "0.875rem" }}
                            >
                              Please enter the SSH Host/IP.
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div
                          className="col-12 col-md-6 mb-4"
                          style={{ minHeight: "85px" }}
                        >
                          <label className="custom-label required">
                            SSH User
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder custom-input-height"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => {
                              setUserError(false);
                              setUsername(e.target.value);
                            }}
                            autoComplete="new-username"
                            required
                          />
                          {userError && (
                            <small
                              className="text-danger"
                              style={{ fontSize: "0.875rem" }}
                            >
                              Please enter your username.
                            </small>
                          )}
                        </div>

                        <div
                          className="col-12 col-md-6 mb-4"
                          style={{ minHeight: "85px" }}
                        >
                          <label className="custom-label required">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control custom-placeholder custom-input-height"
                            placeholder="Enter Password"
                            value={pass}
                            onChange={(e) => {
                              setPassError(false);
                              setPass(e.target.value);
                            }}
                            autoComplete="new-password"
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

                        <div className="col-5 col-md-2 d-flex flex-column align-items-end">
                          <div className="d-flex flex-column align-items-end border rounded p-3 w-100">
                            <label className="form-label text-start">
                              <i className="bi bi-usb-symbol text-primary"></i>
                              <span className="text-primary"> Port</span>
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-solid"
                              value={port}
                              placeholder="Enter Port (e.g., 22)"
                              onChange={(e) => setPort(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                        <button
                          className="btn btn-sm btn-dark action-btn"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                        <button
                          className="btn btn-sm btn-primary action-btn"
                          onClick={handleConnect}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: `calc(100vh - var(--bs-app-header-height) - 40px - ${divHeight}px)`,
                }}
              >
                <div className="d-flex flex-column gap-2 h-100">
                  <div className="d-flex justify-content-end">
                    <DisconnectButton onClick={handleDisconnect} />
                  </div>
                  <TerminalDisplay sessionId={sessionId} />
                </div>
              </div>
            )}
          </div>
        </div>

        {errorModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            onClick={handleBackdropClick}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="modal-dialog modal-dialog-centered w-100"
              ref={dialogRef}
            >
              <div className="modal-content">
                <div className="modal-header border-0">
                  <div className="d-flex gap-2 align-items-start">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                    <h5 className="modal-title text-danger mb-1">
                      Oops, something went wrong
                    </h5>
                  </div>
                </div>
                <div className="modal-body">
                  <p>{errorMessage}</p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setErrorModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedRouteWrapper>
  );
};

export { RemoteSSHPage };
