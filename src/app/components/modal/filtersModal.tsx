import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: any) => void;
}

const FilterModal = ({ isOpen, onClose, onApplyFilter }: FilterModalProps) => {
  const [softwareFilter, setSoftwareFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const handleApply = () => {
    onApplyFilter({
      software: softwareFilter,
      status: statusFilter,
    });
    onClose();
  };

  return (
    <div
      className={`modal ${isOpen ? "show" : ""}`}
      tabIndex={-1}
      role="dialog"
      style={{
        display: isOpen ? "block" : "none",
      }}
    >
      <div className="modal-dialog filter-modal" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Filter Installations</h5>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="softwareFilter" className="form-label">
                Software
              </label>
              <input
                type="text"
                id="softwareFilter"
                className="form-control"
                value={softwareFilter}
                onChange={(e) => setSoftwareFilter(e.target.value)}
                placeholder="Search by Software"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="statusFilter" className="form-label">
                Status
              </label>
              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="installed">Installed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApply}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FilterModal };
