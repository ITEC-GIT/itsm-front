import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import { KTIcon } from "../../../../helpers";
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
} from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";
import {
  totalTicketsAtom,
  fetchMorePagesFlagAtom,
  maxTotalAtom,
} from "../../../../../app/atoms/tickets-page-atom/ticketsPageAtom";
import CustomFilterDatabaseDropdown from "./CustomFilterDatabaseDropdown";
import CustomFilterFrontDataDropdown from "./CustomFilterFrontDataDropdown";
import useDebounce from "../../../../../app/custom-hooks/useDebounce";
import ItsmToolbar from "../../../../../app/components/dashboard/ItsmToolbar";

const ToolbarMainDashboard = () => {
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
  const fetchedTotalTickets = useAtomValue(totalTicketsAtom);
  const maxTotalTickets = useAtomValue(maxTotalAtom);

  const totalPages = Math.ceil(fetchedTotalTickets / ticketsPerPage);
  const minPagesToShow = 2;

  const setFetchMorePagesFlag = useSetAtom(fetchMorePagesFlagAtom);

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

  return <ItsmToolbar />;
};

export { ToolbarMainDashboard };
