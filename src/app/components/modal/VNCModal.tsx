import React, { useRef, useState } from "react";
import { ConnectButton } from "../form/stepsButton";

interface RemoteConsoleModalProps {
  onClose: () => void;
  //   onConnect: (userId: string, vncIp: string, vncUrl: string) => void;
  onConnect: () => void;
}

const RemoteConsoleModal: React.FC<RemoteConsoleModalProps> = ({
  onClose,
  onConnect,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

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
      onConnect();
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

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
                User ID
              </label>
              <input
                type="text"
                className="form-control"
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
            <div className="mb-3" style={{ height: "85px" }}>
              <label htmlFor="vncIp" className="form-label required">
                VNC IP
              </label>
              <input
                type="text"
                className="form-control"
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
            <div className="mb-3" style={{ height: "85px" }}>
              <label htmlFor="vncUrl" className="form-label required">
                VNC URL
              </label>
              <input
                type="text"
                className="form-control"
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
          <div className="modal-footer border-0">
            <ConnectButton onClick={handleConnectClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RemoteConsoleModal };
