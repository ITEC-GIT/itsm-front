import clsx from "clsx";
import { useState, useEffect, useCallback, useMemo } from "react";
import { KTIcon } from "../../../../helpers";
import { motion } from "framer-motion";
import {
  CreateAppModal,
  Dropdown1,
  FilterDropDownMenu,
  CustomButtonWithFilter,
} from "../../../../partials";
import { useLayout } from "../../../core";

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import {
  toolbarTicketsNavigationAtom,
  toolbarTicketsSearchAtom,
  toolbarNewTicketsAtom as importedToolbarNewTicketsAtom,
} from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";
import {
  totalTicketsAccumultionAtom,
  fetchMorePagesFlagAtom,
  maxTotalAtom,
  fetchLessPagesFlagAtom,
  numOfTicketsToFetchAtom,
  newTicketsAvailableCount,
  isTicketsFetchedAtom,
} from "../../../../../app/atoms/tickets-page-atom/ticketsPageAtom";
import CustomFilterDatabaseDropdown from "./CustomFilterDatabaseDropdown";
import CustomFilterFrontDataDropdown from "./CustomFilterFrontDataDropdown";
import useDebounce from "../../../../../app/custom-hooks/useDebounce";
import leftArrow from "./left-arrow.png";
import rightArrow from "./right-arrow.png";
import { left, right } from "@popperjs/core";
import UseAnimations from "react-useanimations";
import alertTriangle from "react-useanimations/lib/alertTriangle";

const ToolbarTickets = () => {
  const { config } = useLayout();
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
  const [searchTickets, setSearchTickets] = useAtom(toolbarTicketsSearchAtom);
  const [currentTicketsPage, setCurrentTicketsPage] = useAtom(
    toolbarTicketsNavigationAtom
  );
  const [searchInput, setSearchInput] = useState<string>(searchTickets);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const debouncedSearchInput = useDebounce(searchInput, 50);
  const ticketsPerPage = 3;
  const fetchedTotalTickets = useAtomValue(totalTicketsAccumultionAtom);

  const maxTotalTickets = useAtomValue(maxTotalAtom);
  const displayFetchedTotalTickets = fetchedTotalTickets > maxTotalTickets ? maxTotalTickets : fetchedTotalTickets;// this is needed in case of user creation

  const totalPages = Math.ceil(fetchedTotalTickets / ticketsPerPage);
  const minPagesToShow = 2;

  const setFetchMorePagesFlag = useSetAtom(fetchMorePagesFlagAtom);
  const setFetchLessPagesFlag = useSetAtom(fetchLessPagesFlagAtom);
  const setToolbarNewTickets = useSetAtom(importedToolbarNewTicketsAtom);
  useEffect(() => {
    setSearchTickets(debouncedSearchInput);
  }, [debouncedSearchInput, setSearchTickets]);
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);
  const handlePageChange = (page: number) => {
    setCurrentTicketsPage(page);
  };

  const handleFetchMorePages = () => {
    setFetchMorePagesFlag(true);
  };
  const handleFetchLessPages = () => {
    setFetchLessPagesFlag(true);
  };
  const [filter, setFilter] = useState<string | null>(null);

  const handleFilterApply = (selectedFilters: any) => {
    setFilter(selectedFilters);
  };

  const handleFilterReset = () => {
    setFilter(null);
  };

  const startPage =
    Math.floor((currentTicketsPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const [isFilterDatabaseDropdownOpen, setIsFilterDatabaseDropdownOpen] =
    useState(false);

  const toggleDatabaseDropdown = () => {
    setIsFilterDatabaseDropdownOpen(!isFilterDatabaseDropdownOpen);
  };

  const [isFilterFrontDropdownOpen, setIsFilterFrontDropdownOpen] =
    useState(false);

  const toggleFrontDropdown = () => {
    setIsFilterFrontDropdownOpen(!isFilterFrontDropdownOpen);
  };
  const numOfRecordsToFetch = useAtomValue(numOfTicketsToFetchAtom);
  const fetchNewTickets = () => {
    setToolbarNewTickets(true);
  };
  const [mismatchCount, setMismatchCount] = useAtom(newTicketsAvailableCount);
  const [isTicketsFetched, setIsTicketsFetched] = useAtom(isTicketsFetchedAtom);
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      <div className="d-flex position-relative my-1">
        {mismatchCount > 0 && (
          <motion.button
            className="btn btn-warning d-flex align-items-center px-3 py-2 border-0"
            style={{ minWidth: "180px", maxWidth: "250px", borderRadius: "0" }}
            onClick={fetchNewTickets}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="d-flex align-items-center gap-2"
              style={{ color: "#800000", fontWeight: "bold" }}
            >
              {mismatchCount.toString() + " "}
              New Tickets
              <UseAnimations
                animation={alertTriangle}
                fillColor="#800000"
                strokeColor="#800000"
                size={24}
              />
            </span>
          </motion.button>
        )}
        <div className="d-flex position-relative my-1">
          <div className="position-relative w-100">
            <i
              className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
              style={{ fontSize: "14px" }}
            ></i>
            <input
              type="text"
              className="form-control form-control-sm form-control-solid w-200px"
              name="Search Tickets"
              value={searchTickets}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search All Tickets"
              style={{ paddingLeft: "35px" }} // Space for the icon + some gap
            />
          </div>
        </div>
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
            <span>Filter </span>
            <KTIcon iconName="filter" className="fs-6 text-muted me-1" />
          </button>
          {isFilterFrontDropdownOpen && (
            <CustomFilterFrontDataDropdown
              setIsFilterFrontDropdownOpen={setIsFilterFrontDropdownOpen}
            />
          )}
        </div>
      </div>

      {/* {config.app?.toolbar?.secondaryButton && (
        <a href='#' className='btn btn-sm btn-flex btn-light fw-bold'>
          Filter
        </a>
      )} */}

      <div className="container">
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={handleFetchLessPages}
            disabled={isTicketsFetched || fetchedTotalTickets <= numOfRecordsToFetch}
            >
            <img
              src={leftArrow}
              alt="Fetch Less Pages"
              width="16"
              height="16"
            />
          </button>
          <button
            className="btn btn-primary"
            onClick={handleFetchMorePages}
            disabled={isTicketsFetched || displayFetchedTotalTickets >= maxTotalTickets}
            >
            <img
              src={rightArrow}
              alt="Fetch More Pages"
              width="16"
              height="16"
            />
          </button>
          <button
            type="button"
            className="btn btn-primary dropdown-toggle dropdown-toggle-split"
            onClick={toggleDatabaseDropdown}
            aria-expanded={isFilterDatabaseDropdownOpen}
          >
            <i className="fas fa-cog"></i>
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>
          {isFilterDatabaseDropdownOpen && (
            <CustomFilterDatabaseDropdown
              setIsFilterDatabaseDropdownOpen={setIsFilterDatabaseDropdownOpen}
            />
          )}
        </div>
      </div>
      <CreateAppModal
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
      />
    </div>
  );
};

export { ToolbarTickets };
