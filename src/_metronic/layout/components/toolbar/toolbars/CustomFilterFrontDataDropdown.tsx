import React, { useState } from 'react';
import Select from "react-select";

const CustomFilterFrontDataDropdown: React.FC = () => {
  const [status, setStatus] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleReset = () => {
    setStatus('');
    setIsAuthor(false);
    setIsCustomer(true);
    setNotificationsEnabled(true);
  };

  const handleApply = () => {
    console.log('Status:', status);
    console.log('Author:', isAuthor);
    console.log('Customer:', isCustomer);
    console.log('Notifications Enabled:', notificationsEnabled);
  };

  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: '120%', right: 0, width: '300px' }} // Increased width
    >
      {/* Title Section */}
      <div className="mb-3">
        <h5 className="text-dark fw-bold">Filter Options</h5>
      </div>

      {/* Divider */}
      <div className="mb-3">
        <hr className="dropdown-divider" />
      </div>

      {/* Status Section */}
      <div className="mb-3">
        <label className="form-label fw-bold">Status:</label>
        <select
          className="form-select"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">Select option</option>
          <option value="1">Approved</option>
          <option value="2">Pending</option>
          <option value="3">In Process</option>
          <option value="4">Rejected</option>
        </select>
      </div>

      {/* Status Section */}
      <div className="mb-3">
        <label className="form-label fw-bold">Urgency:</label>
        <select
          className="form-select"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">Select option</option>
          <option value="1">Approved</option>
          <option value="2">Pending</option>
          <option value="3">In Process</option>
          <option value="4">Rejected</option>
        </select>
      </div>

      {/* Status Section */}
      <div className="mb-3">
        <label className="form-label fw-bold">Priority:</label>
        <select
          className="form-select"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">Select option</option>
          <option value="1">Approved</option>
          <option value="2">Pending</option>
          <option value="3">In Process</option>
          <option value="4">Rejected</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomFilterFrontDataDropdown;
