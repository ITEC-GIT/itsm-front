import React, { useState } from 'react';

const CustomAssigneeDropDown: React.FC = () => {
  const [status, setStatus] = useState('');
  const [filterText, setFilterText] = useState('');
  const [assignees] = useState([
    'David Carol',
    'Mark Hughes',
    'Otis James',
    'Smith Steven',
  ]);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };
  const handleSearchClick = ( e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body 
  };
  const handleAssigneeClick = (assignee: string) => {
    setSelectedAssignee(assignee);
    console.log('Selected Assignee:', assignee);
  };

  const filteredAssignees = assignees.filter((assignee) =>
    assignee.toLowerCase().includes(filterText)
  );

  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: '102%', left: 0, width: '300px' }} // Increased width
    >
      {/* Title Section */}
      <div className="mb-3">
        <h5 className="text-dark fw-bold">Assign it to</h5>
      </div>

      {/* Divider */}
      <div className="mb-1">
        <hr className="dropdown-divider" />
      </div>

      {/* Search Input */}
      <div className="card-body assigne-dropdown-card">
        <div className="input-group mb-3">
          <span className="input-group-text" id="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-icon"
            value={filterText}
            onChange={handleFilterChange}
            onClick={handleSearchClick}
          />
        </div>

        {/* Assignee List */}
        <ul className="list-group">
          <li
            className={`list-group-item dropdown-item ${
              !selectedAssignee ? 'active' : ''
            }`}
            onClick={() => handleAssigneeClick('None')}
          >
            None
            {!selectedAssignee && <i className="fas fa-check float-end"></i>}
          </li>
          {filteredAssignees.map((assignee) => (
            <li
              key={assignee}
              className={`list-group-item dropdown-item ${
                selectedAssignee === assignee ? 'active' : ''
              }`}
              onClick={() => handleAssigneeClick(assignee)}
            >
              {assignee}
              {selectedAssignee === assignee && (
                <i className="fas fa-check float-end"></i>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomAssigneeDropDown;
