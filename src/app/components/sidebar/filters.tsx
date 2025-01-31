import React, { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { DatePicker } from "../form/datePicker";
import { getData } from "../../../utils/custom";

interface FilterSidebar {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeFilters: string[];
  saveFilters: (data: any) => void;
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

const filterKeyMap: Record<string, string> = {
  softwareStatusFilter: "status",
  userFilter: "user",
  computersFilter: "computer",
};

const FilterSidebar: React.FC<FilterSidebar> = ({
  isOpen,
  toggleSidebar,
  activeFilters,
  saveFilters,
}) => {
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [selectedFilters, setSelectedFilters] = useState({
    status: null as { value: string; label: string } | null,
    user: null as { value: string; label: string } | null,
    computer: null as { value: string; label: string } | null,
  });
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
    return date.toISOString().split("T")[0]; // "2025-01-23"
  };

  const handleSaveFilters = () => {
    const filters: Record<string, any> = {};
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        filters[key] = key === "status" ? value.label : value.value;
      }
    });

    const dateFrom = formatDate(startDate ? new Date(startDate) : null);
    const dateTo = formatDate(endDate ? new Date(endDate) : null);

    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;

    console.log("filters ==>>", filters);
    saveFilters(filters);
    toggleSidebar();
  };

  const handleFilterChange = (
    filterId: string,
    selectedOption: { value: string; label: string } | null
  ) => {
    const key = filterKeyMap[filterId];
    if (key) {
      setSelectedFilters((prevState) => ({
        ...prevState,
        [key]: selectedOption,
      }));
    }
  };

  return (
    <div
      className={`sidebar collapse collapse-horizontal show bg-white text-black shadow-2xl rounded-xl border-4 p-4 ${
        isOpen ? "d-block" : "d-none"
      }`}
      style={{
        width: "100%",
        maxWidth: "20%",
        backdropFilter: isOpen ? "blur(5px)" : "none",
        // borderImageSource: "linear-gradient(90deg, #007bff, #0056b3)",
        // borderImageSlice: 1,
      }}
    >
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="toggle-btn p-3 hyper-connect-btn"
          onClick={toggleSidebar}
        >
          <i
            className={`fas fa-chevron-${isOpen ? "left" : "right"}`}
            style={{ transition: "transform 0.3s" }}
          ></i>
        </button>
        <h4 className="font-bold mb-0 text-xl text-center text-indigo-600">
          Filters
        </h4>
      </div>

      <div className="d-flex flex-column gap-3">
        {filtersOptions.map((filter) => {
          if (activeFilters.includes(filter.id)) {
            return (
              <div
                key={filter.id}
                className="p-3 bg-light border rounded shadow-sm"
              >
                <h5 className="text-dark mb-2">{filter.name}</h5>

                {/* Date Filter */}
                {filter.id === "dateFilter" ? (
                  <>
                    <div className="form-group shadow-sm">
                      <label
                        className="datePickerLabel custom-label"
                        htmlFor="datePicker"
                      >
                        From
                      </label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="form-group">
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

      <div className="text-center mt-2">
        <button
          className="toggle-btn p-3 hyper-connect-btn"
          onClick={handleSaveFilters}
        >
          Save Filters
        </button>
      </div>
    </div>
  );
};

export { FilterSidebar };
