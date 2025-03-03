import React, { useEffect } from "react";
import Select from "react-select";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      id="addAssetModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="addAssetModalLabel"
      aria-hidden={!isOpen}
      style={{
        background: isOpen ? "rgba(0,0,0,0.5)" : "transparent",
        width: "100%",
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "60vw" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex flex-column">
              <h5>Add Asset</h5>
              <p className="text-muted">
                Add assets you want to keep a record of but don’t want to
                monitor.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary fs-5">
                <i className="bi bi-floppy fs-2"></i>
                Save
              </button>
            </div>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-bottom-border"
                placeholder="Enter name"
              />
            </div>
            <div className="row mt-5 row-add-asset-form">
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  User
                </label>
                <Select></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control custom-bottom-border"
                  placeholder="Serial number"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Group
                </label>
                <Select></Select>
              </div>
            </div>
            <div className="row mt-3 row-add-asset-form">
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Technician in charge
                </label>
                <Select></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control custom-bottom-border"
                  placeholder="Alternate username number"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Computer type
                </label>
                <Select></Select>
              </div>
            </div>
            <div className="row mt-3 row-add-asset-form">
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Category
                </label>
                <Select></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control custom-bottom-border"
                  placeholder="UUID"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Group in charge
                </label>
                <Select></Select>
              </div>
            </div>
            <div className="row mt-3 row-add-asset-form">
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Location
                </label>
                <Select></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control custom-bottom-border"
                  placeholder="Inventory Number"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Status
                </label>
                <Select></Select>
              </div>
            </div>
            <div className="row mt-3 row-add-asset-form">
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Manufacturer
                </label>
                <Select></Select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control custom-bottom-border"
                  placeholder="Alternate username"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label d-flex align-items-center">
                  Model
                </label>
                <Select></Select>
              </div>
            </div>
            <div className="mb-3 mt-3">
              <textarea
                className="form-control custom-bottom-border"
                placeholder="Comments"
                rows={3} // Adjust rows as needed for multi-line input
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddAssetModal };
