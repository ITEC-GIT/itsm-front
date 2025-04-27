import React, { useRef } from "react";

interface RemoteConsoleModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const RemoteConsoleModal: React.FC<RemoteConsoleModalProps> = ({
  onClose,
  onConnect,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If click is outside the modal dialog, close
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
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">
                User ID
              </label>
              <input
                type="text"
                className="form-control"
                id="userId"
                placeholder="Enter User ID"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vncIp" className="form-label">
                VNC IP
              </label>
              <input
                type="text"
                className="form-control"
                id="vncIp"
                placeholder="Enter VNC IP"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vncUrl" className="form-label">
                VNC URL
              </label>
              <input
                type="text"
                className="form-control"
                id="vncUrl"
                placeholder="Enter VNC URL"
              />
            </div>
          </div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConnect}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RemoteConsoleModal };
