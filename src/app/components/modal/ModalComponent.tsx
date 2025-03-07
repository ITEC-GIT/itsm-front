import React from "react";

interface ModalComponentProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ModalComponent = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: ModalComponentProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body d-flex align-items-center">
            <i className="fas fa-exclamation-triangle animated-icon"></i>
            <div
              className="text-start"
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ModalComponent };
