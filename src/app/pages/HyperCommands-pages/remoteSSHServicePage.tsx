import { useEffect, useMemo, useRef, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons.tsx";
import { TerminalDisplay } from "../../components/Remote SSH/terminalDisplay.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { DisconnectButton } from "../../components/form/stepsButton.tsx";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      setErrorModalOpen(false);
    }
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setDivHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

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
    let hasError = false;

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

    if (hasError) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8002/auth/ssh", {
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
      const response = await fetch("http://127.0.0.1:8002/kill/ssh", {
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

      console.log("Session disconnected successfully.");
      setSessionId(null);
    } catch (error) {
      setErrorMessage("Disconnect error. Please try again.");
      setErrorModalOpen(true);
    }
  };

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div
          className="row d-flex custom-main-container custom-container-height"
          style={{ overflowY: "auto" }}
        >
          <div className="col-12">
            {!computerIdProp && (
              <div className="d-flex justify-content-between" ref={divRef}>
                <h2 className="text-center mb-4">🔐 Remote SSH</h2>
                <ActionIcons />
              </div>
            )}

            {!sessionId ? (
              <div className="d-flex justify-content-center">
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-4" style={{ height: "85px" }}>
                      <label className="custom-label required">SSH User</label>
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

                    <div className="col-md-6 mb-4" style={{ height: "85px" }}>
                      <label className="custom-label required">Password</label>
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
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6" style={{ height: "85px" }}>
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

                    <div className="col-md-6 d-flex flex-column align-items-end">
                      <div className="d-flex flex-column align-items-end border rounded p-3 w-50">
                        <label className="form-label text-start">
                          <i className="bi bi-usb-symbol text-primary"></i>
                          <span className="text-primary"> Port</span>
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-solid "
                          value={port}
                          placeholder="Enter Port (e.g., 22)"
                          onChange={(e) => setPort(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                      className="btn btn-sm btn-dark action-btn"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary action-btn"
                      onClick={handleConnect}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: `calc(100vh - var(--bs-app-header-height) - 20px - 20px  - ${divHeight}px)`,
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
            <div className="modal-dialog modal-dialog-centered" ref={dialogRef}>
              <div className="modal-content">
                <div className="modal-header border-0">
                  <div className="d-flex gap-2 align-items-start">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                    <h5
                      className="modal-title text-danger mb-1"
                      id="errorModalTitle"
                    >
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
