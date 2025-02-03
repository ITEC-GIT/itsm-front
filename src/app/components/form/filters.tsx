import React, { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { DatePicker } from "../form/datePicker";
import { getData } from "../../../utils/custom";
import { GetAllSoftwareInstallationRequestType as filterType } from "../../types/softwareInstallationTypes";

interface FilterSidebar {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeFilters: string[];
  saveFilters: React.Dispatch<React.SetStateAction<filterType>>;
}

interface FiltersTitleProps {
  id: string;
  name: string;
  storeName: string;
  data: { value: string; label: string }[];
}

const filtersOptions: FiltersTitleProps[] = [
  {
    id: "softwareStatusFilter",
    name: "Status",
    storeName: "SoftwareStatus",
    data: [],
  },
  {
    id: "userFilter",
    name: "User",
    storeName: "assignees",
    data: [],
  },
  {
    id: "computersFilter",
    name: "Computer",
    storeName: "Computers",
    data: [],
  },
  {
    id: "dateFilter",
    name: "Date Range",
    storeName: "",
    data: [],
  },
];

const FilterSidebar: React.FC<FilterSidebar> = ({
  isOpen,
  toggleSidebar,
  activeFilters,
  saveFilters,
}) => {
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, { value: string; label: string } | null>
  >({});

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const userId = Number(Cookies.get("user"));
  const dbName = "static_fields";

  useEffect(() => {
    const fetchData = async () => {
      const newFilterData: Record<string, any> = {};
      for (const filter of filtersOptions) {
        if (activeFilters.includes(filter.id)) {
          try {
            if (filter.id === "dateFilter") continue;
            newFilterData[filter.id] = await getData(
              filter.storeName,
              userId,
              dbName
            );
          } catch (error) {
            console.error(`Failed to fetch data for ${filter.id}:`, error);
          }
        }
      }
      setFilterData(newFilterData);
    };

    fetchData();
  }, [activeFilters]);

  // yyyy-MM-dd
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  };

  const handleApplyFilters = () => {
    const filtersSelection: Record<string, any> = {};
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        if (key === "softwareStatusFilter") {
          filtersSelection.status = value.label;
        } else {
          filtersSelection[key] = value.value;
        }
      }
    });

    const dateFrom = formatDate(startDate ? new Date(startDate) : null);
    const dateTo = formatDate(endDate ? new Date(endDate) : null);

    if (dateFrom) filtersSelection.date_from = dateFrom;
    if (dateTo) filtersSelection.date_to = dateTo;

    const initialFilters = {
      range: "0-50",
      order: "desc",
    };

    const wholeFilter = {
      ...initialFilters,
      ...filtersSelection,
    };

    console.log("wholeFilter ==>>", wholeFilter);
    saveFilters(wholeFilter);
    handleClearFilters();

    toggleSidebar();
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setStartDate("");
    setEndDate("");
  };

  const handleFilterChange = (
    filterId: string,
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterId]: selectedOption,
    }));
  };

  return (
    <div
      className={`sidebar collapse collapse-horizontal show bg-white text-black shadow-2xl rounded-xl ${
        isOpen ? "d-block" : "d-none"
      }`}
      style={{
        width: "100%",
        height: "100%",
        backdropFilter: isOpen ? "blur(5px)" : "none",
      }}
    >
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="toggle-btn close-filter-btn p-3"
          onClick={toggleSidebar}
        >
          <i className={`fas fa-chevron-left`}></i>
        </button>

        <h4 className="font-bold mb-0 text-xl text-center text-indigo-600">
          Filters
        </h4>
      </div>

      <div className="d-flex flex-column gap-3 bg-light border rounded shadow-sm">
        {filtersOptions.map((filter) => {
          if (activeFilters.includes(filter.id)) {
            return (
              <div key={filter.id} className="p-3 ">
                <h5 className="text-dark mb-2">{filter.name}</h5>

                {filter.id === "dateFilter" ? (
                  <>
                    <div className="shadow-sm">
                      <label className="custom-label">From</label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="form-group shadow-sm">
                      <label
                        className="datePickerLabel custom-label"
                        htmlFor="datePicker"
                      >
                        To
                      </label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </>
                ) : filterData[filter.id] ? (
                  <Select
                    options={filterData[filter.id]}
                    placeholder={`Select ${filter.name}`}
                    className="custom-select shadow-sm"
                    classNamePrefix="react-select"
                    value={selectedFilters[filter.id] ?? null}
                    onChange={(selectedOption) =>
                      handleFilterChange(
                        filter.id,
                        selectedOption as {
                          value: string;
                          label: string;
                        } | null
                      )
                    }
                  />
                ) : (
                  <p className="text-muted">Loading...</p>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="d-flex justify-content-between mt-3 p-3">
        <button
          className="toggle-btn p-3 hyper-connect-btn"
          onClick={handleClearFilters}
        >
          <span className="hyper-btn-text">Clear</span>
        </button>
        <button
          className="toggle-btn p-3 hyper-connect-btn"
          onClick={handleApplyFilters}
        >
          <span className="hyper-btn-text">Apply</span>
        </button>
      </div>
    </div>
  );
};

export { FilterSidebar };
