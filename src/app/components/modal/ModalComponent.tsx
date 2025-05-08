import React from "react";

interface ModalComponentProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  type: "error" | "success" | "warning";
}

const ModalComponent = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  type,
}: ModalComponentProps) => {
  if (!isOpen) {
    return null;
  }

  const typeIconClass: Record<ModalComponentProps["type"], string> = {
    error: "fas fa-times-circle text-danger",
    success: "fas fa-check-circle text-success",
    warning: "fas fa-exclamation-triangle text-warning",
  };

  const typeBtnClass: Record<ModalComponentProps["type"], string> = {
    error: "bg-danger",
    success: "bg-success",
    warning: "bg-warning",
  };
  const iconClass = typeIconClass[type];
  const btnClass = typeBtnClass[type];
  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onCancel}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-body d-flex align-items-start">
            <i className={`animated-icon ${iconClass}`}></i>
            <div
              className="text-start"
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className={`btn ${btnClass} text-white`}
              onClick={onConfirm}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ModalComponent };
