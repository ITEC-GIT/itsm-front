import React, { useState, useEffect } from 'react';
import { KTIcon } from '../../../helpers';

interface FilterDropDownMenuProps {
  filters: {
    statusOptions: string[];
    memberTypes: string[];
    notificationsEnabled: boolean;
  };
  onApply: (selectedFilters: any) => void;
  onReset: () => void;
  isOpen: boolean;
  toggleDropdown: () => void;
}

export const FilterDropDownMenu: React.FC<FilterDropDownMenuProps> = ({ filters, onApply, onReset, isOpen, toggleDropdown }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedMemberTypes, setSelectedMemberTypes] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(filters.notificationsEnabled);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleMemberTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMemberTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(e.target.checked);
  };
  useEffect(() => {
    setSelectedStatus('');
    setSelectedMemberTypes([]);
    setNotificationsEnabled(filters.notificationsEnabled);
  }, [filters, isOpen]);
  const handleApply = () => {
    onApply({
      status: selectedStatus,
      memberTypes: selectedMemberTypes,
      notificationsEnabled,
    });
    toggleDropdown();
  };

  const handleReset = () => {
    setSelectedStatus('');
    setSelectedMemberTypes([]);
    setNotificationsEnabled(filters.notificationsEnabled);
    onReset();
    toggleDropdown();
  };

  return (
    <div className='position-relative'>
      <button className='btn btn-sm btn-icon' onClick={toggleDropdown}>
        <KTIcon iconName='settings' className='fs-3 text-muted' />
      </button>
      {isOpen && (
        <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px'>
          <div className='px-7 py-5'>
            <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
          </div>

          <div className='separator border-gray-200'></div>

          <div className='px-7 py-5'>
            <div className='mb-10'>
              <label className='form-label fw-bold'>Status:</label>
              <div>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value=''></option>
                  {filters.statusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='mb-10'>
              <label className='form-label fw-bold'>Member Type:</label>
              <div className='d-flex'>
                {filters.memberTypes.map((type, index) => (
                  <label key={index} className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value={type}
                      checked={selectedMemberTypes.includes(type)}
                      onChange={handleMemberTypeChange}
                    />
                    <span className='form-check-label'>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='mb-10'>
              <label className='form-label fw-bold'>Notifications:</label>
              <div className='form-check form-switch form-switch-sm form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={notificationsEnabled}
                  onChange={handleNotificationsChange}
                />
                <label className='form-check-label'>Enabled</label>
              </div>
            </div>

            <div className='d-flex justify-content-end'>
              <button
                type='reset'
                className='btn btn-sm btn-light btn-active-light-primary me-2'
                onClick={handleReset}
              >
                Reset
              </button>
              <button type='button' className='btn btn-sm btn-primary' onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};