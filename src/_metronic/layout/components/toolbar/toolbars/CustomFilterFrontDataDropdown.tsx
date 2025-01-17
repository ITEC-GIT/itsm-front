import React, { useState } from 'react';

const CustomFilterFrontDataDropdown: React.FC = () => {
  const [status, setStatus] = useState('');
  const [urgency, setUrgency] = useState('');
  const [priority, setPriority] = useState('');
  const [type, setType] = useState('');
  const [requester, setRequester] = useState('');
  const [branch, setBranch] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUrgency(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleRequesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequester(e.target.value);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
  };

  const statusOptions = [{ value: 'Approved', label: 'Approved' }, { value: 'Pending', label: 'Pending' }, { value: 'Process', label: 'Process' }, { value: 'Rejected', label: 'Rejected' }];
  const urgencyOptions = [{ value: 'Very low', label: 'Very low' }, { value: 'Very high', label: 'Very high' }];
  const priorityOptions = [{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }];
  const typeOptions = [{ value: 'Incident', label: 'Incident' }, { value: 'Request', label: 'Request' }];
  const requesterOptions = [{ value: 'User1', label: 'User1' }, { value: 'User2', label: 'User2' }];
  const branchOptions = [{ value: 'Branch1', label: 'Branch1' }, { value: 'Branch2', label: 'Branch2' }];

  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: '120%', right: 0, width: '600px' }}
    >
      <div className="mb-3">
        <h5 className="text-dark fw-bold">Filter Options</h5>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Status:</label>
          <select className="form-select" value={status} onChange={handleStatusChange}>
            <option value="">Select option</option>
            {statusOptions.map((status) => (<option key={status.value} value={status.value}>{status.label}</option>))}
          </select>
        </div>
        <div className="flex-fill">
          <label className="form-label fw-bold">Urgency:</label>
          <select className="form-select" value={urgency} onChange={handleUrgencyChange}>
            <option value="">Select option</option>
            {urgencyOptions.map((urgency) => (<option key={urgency.value} value={urgency.value}>{urgency.label}</option>))}
          </select>
        </div>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Priority:</label>
          <select className="form-select" value={priority} onChange={handlePriorityChange}>
            <option value="">Select option</option>
            {priorityOptions.map((priority) => (<option key={priority.value} value={priority.value}>{priority.label}</option>))}
          </select>
        </div>
        <div className="flex-fill">
          <label className="form-label fw-bold">Type:</label>
          <select className="form-select" value={type} onChange={handleTypeChange}>
            <option value="">Select option</option>
            {typeOptions.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
          </select>
        </div>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Requester:</label>
          <select className="form-select" value={requester} onChange={handleRequesterChange}>
            <option value="">Select option</option>
            {requesterOptions.map((requester) => (<option key={requester.value} value={requester.value}>{requester.label}</option>))}
          </select>
        </div>
        <div className="flex-fill">
          <label className="form-label fw-bold">Branch:</label>
          <select className="form-select" value={branch} onChange={handleBranchChange}>
            <option value="">Select option</option>
            {branchOptions.map((branch) => (<option key={branch.value} value={branch.value}>{branch.label}</option>))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-sm btn-secondary me-2" onClick={() => { setStatus(''); setUrgency(''); setPriority(''); setType(''); setRequester(''); setBranch(''); }}>
          Reset
        </button>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => { console.log({ status, urgency, priority, type, requester, branch }); }}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomFilterFrontDataDropdown;