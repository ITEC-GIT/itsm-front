import React, { useState } from 'react';
import { KTIcon } from '../../../helpers';
import { FilterDropDownMenu } from './FilterDropDownMenu';

interface CustomButtonWithFilterProps {
  onFetchMore: () => void;
  filters: {
    statusOptions: string[];
    memberTypes: string[];
    notificationsEnabled: boolean;
  };
  onApplyFilters: (selectedFilters: any) => void;
  onResetFilters: () => void;
  fetchedTotalTickets: number;
  maxTotalTickets: number;
}

export const CustomButtonWithFilter: React.FC<CustomButtonWithFilterProps> = ({
  onFetchMore,
  filters,
  onApplyFilters,
  onResetFilters,
  fetchedTotalTickets,
  maxTotalTickets,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const toggleFilterDropdown = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div
      className="d-flex bg-primary rounded p-2"
      style={{ gap: '2px' }} // Optional spacing between buttons
    >
      {/* Fetch More Button */}
      <button
        className="btn btn-sm btn-primary d-flex align-items-center"
        onClick={onFetchMore}
        disabled={fetchedTotalTickets >= maxTotalTickets}
      >
        Fetch More
      </button>

      {/* Filter Button */}
      <div className="position-relative tickets-filter-background">
        <button
          className="btn btn-sm btn-primary d-flex align-items-center tickets-filter-background"
          onClick={(e) => {
            toggleFilterDropdown();
          }}
        >
          <KTIcon iconName="filter" className="fs-6 text-muted tickets-filter-background" />
        </button>

        {isFilterOpen && (
          <FilterDropDownMenu
            filters={filters}
            onApply={onApplyFilters}
            onReset={onResetFilters}
            isOpen={isFilterOpen}
            toggleDropdown={toggleFilterDropdown}
          />
        )}
      </div>
    </div>
  );
};
