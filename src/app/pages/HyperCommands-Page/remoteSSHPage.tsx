import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { TerminalDisplay } from "../../components/Remote SSH/terminalDisplay.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const RemoteSSHPage = ({ computerIdProp }: { computerIdProp?: number }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [hostError, setHostError] = useState(false);

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
    if (!username) {
      setUserError(true);
      return;
    }
    if (!pass) {
      setPassError(true);
      return;
    }
    if (!ipAddress) {
      setHostError(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/ssh", {
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
        console.error("Authentication failed:", result.detail);
        return;
      }

      setSessionId(result.session_id);
    } catch (error) {
      console.error("Connection error:", error);
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
              <div className="d-flex justify-content-between">
                <h2 className="text-center mb-4">🔐 Remote SSH</h2>
                <ActionIcons />
              </div>
            )}

            {!sessionId ? (
              <div className="row justify-content-center align-items-center">
                <div className="mb-5 d-flex justify-content-end align-items-end">
                  <div
                    className="border rounded p-3"
                    style={{ width: "150px" }}
                  >
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
                <div className="row">
                  <div className="col-md-4 mb-5">
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

                  <div className="col-md-4 mb-5">
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

                <div className="col-md-4 mb-5">
                  <label className="custom-label required">SSH Host/IP</label>
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
                    onClick={handleConnect}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ) : (
              <TerminalDisplay sessionId={sessionId} />
            )}
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { RemoteSSHPage };
