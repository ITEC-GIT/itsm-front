
import clsx from 'clsx'
import { useState, useEffect, useCallback } from 'react'
import { KTIcon } from '../../../../helpers'
import { CreateAppModal, Dropdown1, FilterDropDownMenu, CustomButtonWithFilter } from '../../../../partials'
import { useLayout } from '../../../core'

import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { toolbarTicketsNavigationAtom, toolbarTicketsSearchAtom } from '../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom';
import { totalTicketsAtom, fetchMorePagesFlagAtom, maxTotalAtom } from '../../../../../app/atoms/tickets-page-atom/ticketsPageAtom';
import CustomFilterDatabaseDropdown from './CustomFilterDatabaseDropdown';
import CustomFilterFrontDataDropdown from './CustomFilterFrontDataDropdown'
import useDebounce from '../../../../../app/custom-hooks/useDebounce';

const ToolbarTickets = () => {
  const { config } = useLayout()
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false)
  const [searchTickets, setSearchTickets] = useAtom(toolbarTicketsSearchAtom);
  const [currentTicketsPage, setCurrentTicketsPage] = useAtom(toolbarTicketsNavigationAtom)
  const [searchInput, setSearchInput] = useState<string>(searchTickets)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const debouncedSearchInput = useDebounce(searchInput, 50)
  const ticketsPerPage = 3
  const fetchedTotalTickets = useAtomValue(totalTicketsAtom)
  const maxTotalTickets = useAtomValue(maxTotalAtom)


  const totalPages = Math.ceil(fetchedTotalTickets / ticketsPerPage)
  const minPagesToShow = 2


  const setFetchMorePagesFlag = useSetAtom(fetchMorePagesFlagAtom)



  useEffect(() => {
    setSearchTickets(debouncedSearchInput)
  }, [debouncedSearchInput, setSearchTickets])
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
  }, [])
  const handlePageChange = (page: number) => {
    setCurrentTicketsPage(page)
  }

  const handleFetchMorePages = () => {
    setFetchMorePagesFlag(true)
  }
  const [filter, setFilter] = useState<string | null>(null);

  const handleFilterApply = (selectedFilters: any) => {
    setFilter(selectedFilters);
  };

  const handleFilterReset = () => {
    setFilter(null);
  };

  const startPage = Math.floor((currentTicketsPage - 1) / minPagesToShow) * minPagesToShow + 1
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages)

  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? 'btn-light'
    : 'bg-body btn-color-gray-700 btn-active-color-primary'
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const [isFilterDatabaseDropdownOpen, setIsFilterDatabaseDropdownOpen] = useState(false);

  const toggleDatabaseDropdown = () => {
    setIsFilterDatabaseDropdownOpen(!isFilterDatabaseDropdownOpen);
  };

  const [isFilterFrontDropdownOpen, setIsFilterFrontDropdownOpen] = useState(false);

  const toggleFrontDropdown = () => {
    setIsFilterFrontDropdownOpen(!isFilterFrontDropdownOpen);
  };


  return (

    <div className='d-flex align-items-center gap-2 gap-lg-3'>
      <div className='position-relative my-1'>
        <KTIcon
          iconName='magnifier'
          className='fs-3 text-gray-500 position-absolute top-50 translate-middle ps-10'
        />
        <input
          type='text'
          className='form-control form-control-sm form-control-solid w-150px ps-10'
          name='Search Tickets'
          value={searchTickets}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='Search All Tickets'
        />
      </div>
      <div>
        <div className="btn-group">

          <button
            type="button"
            className="btn  dropdown-toggle dropdown-toggle-split"
            onClick={toggleFrontDropdown}
            aria-expanded={isFilterFrontDropdownOpen}
          >

            <span className="visually-hidden">Toggle Dropdown</span>
            <span>Filter   </span>
            <KTIcon iconName='filter' className='fs-6 text-muted me-1' />
            
          </button>
          {isFilterFrontDropdownOpen && <CustomFilterFrontDataDropdown setIsFilterFrontDropdownOpen={setIsFilterFrontDropdownOpen} />}

        </div>
       
      </div>

      {/* {config.app?.toolbar?.secondaryButton && (
        <a href='#' className='btn btn-sm btn-flex btn-light fw-bold'>
          Filter
        </a>
      )} */}


      <div className="container mt-4">
        <div className="btn-group">
          <button type="button" className="btn btn-primary"  disabled={fetchedTotalTickets >= maxTotalTickets} onClick={handleFetchMorePages}>Fetch More</button>
          <button
            type="button"
            className="btn btn-primary dropdown-toggle dropdown-toggle-split"
            onClick={toggleDatabaseDropdown}
            aria-expanded={isFilterDatabaseDropdownOpen}
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>
          {isFilterDatabaseDropdownOpen && <CustomFilterDatabaseDropdown  setIsFilterDatabaseDropdownOpen={setIsFilterDatabaseDropdownOpen} />}
        </div>


      </div>
      <CreateAppModal show={showCreateAppModal} handleClose={() => setShowCreateAppModal(false)} />
    </div>
  )
}

export { ToolbarTickets }
