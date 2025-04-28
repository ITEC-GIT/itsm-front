import { useEffect, useMemo, useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons.tsx";
import { TerminalDisplay } from "../../components/Remote SSH/terminalDisplay.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { ConnectButton } from "../../components/form/stepsButton.tsx";

const RemoteConsoleDashboardComponent = ({
  computerIdProp,
}: {
  computerIdProp?: number;
}) => {
  const [userId, setUserId] = useState("");
  const [vncIp, setVncIp] = useState("");
  const [vncUrl, setVncUrl] = useState("");

  const [userIdError, setUserIdError] = useState(false);
  const [vncIpError, setVncIpError] = useState(false);
  const [vncUrlError, setVncUrlError] = useState(false);

  const handleConnectClick = () => {
    let hasError = false;

    if (!userId.trim()) {
      setUserIdError(true);
      hasError = true;
    } else {
      setUserIdError(false);
    }

    if (!vncIp.trim()) {
      setVncIpError(true);
      hasError = true;
    } else {
      setVncIpError(false);
    }

    if (!vncUrl.trim()) {
      setVncUrlError(true);
      hasError = true;
    } else {
      setVncUrlError(false);
    }

    if (!hasError) {
      //   onConnect();
      //   onConnect(userId, vncIp, vncUrl);
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    if (userIdError) setUserIdError(false);
  };

  const handleVncIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVncIp(e.target.value);
    if (vncIpError) setVncIpError(false);
  };

  const handleVncUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVncUrl(e.target.value);
    if (vncUrlError) setVncUrlError(false);
  };

  return (
    <AnimatedRouteWrapper>
      <div
        className="row d-flex custom-main-container custom-container-height"
        style={{ overflowY: "auto" }}
      >
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <h2 className="text-center mb-4">🔐 Remote SSH</h2>
          </div>
        </div>

        <div className="row mb-4 d-flex justify-content-center">
          <div className="col-6" style={{ height: "85px" }}>
            <label htmlFor="userId" className="custom-label required">
              User ID
            </label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              value={userId}
              id="userId"
              onChange={handleUserIdChange}
              placeholder="Enter User ID"
              required
            />
            {userIdError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                User ID is required.
              </small>
            )}
          </div>
        </div>

        <div className="row mb-4 d-flex justify-content-center">
          <div className="col-6" style={{ height: "85px" }}>
            <label className="custom-label required"> VNC IP</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              value={vncIp}
              id="vncIp"
              placeholder="Enter VNC IP"
              onChange={handleVncIpChange}
              required
            />
            {vncIpError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                VNC IP is required.
              </small>
            )}
          </div>
        </div>

        <div className="row mb-4 d-flex justify-content-center">
          <div className="col-6" style={{ height: "85px" }}>
            <label className="custom-label required"> VNC URL</label>
            <input
              type="text"
              className="form-control custom-placeholder custom-input-height"
              value={vncIp}
              id="vncUrl"
              placeholder="Enter VNC URL"
              onChange={handleVncUrlChange}
              required
            />
            {vncUrlError && (
              <small className="text-danger" style={{ fontSize: "0.875rem" }}>
                VNC URL is required.
              </small>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <ConnectButton onClick={handleConnectClick} />
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { RemoteConsoleDashboardComponent };
