import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import Cookies from "js-cookie";
import { DatePicker } from "./datePicker";
import { deepEqual, formatDate } from "../../../utils/custom";
import { GetAllSoftwareInstallationRequestType as filterType } from "../../types/softwareInstallationTypes";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/Config";
import { useAtom } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { FilterValue } from "../../types/filtersAtomType";
import { customStyles } from "../../data/multiSelect";
import { CustomReactSelect } from "./custom-react-select";

interface FilterSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeFilters: string[];
  filtersStoreName: string;
  filters: filterType;
  saveFilters: React.Dispatch<React.SetStateAction<filterType>>;
  initialFilters?: any;
}

interface FiltersTitleProps {
  id: string;
  name: string;
  AtomKey: string;
  data: { value: number; label: string }[];
}

const filtersOptions: FiltersTitleProps[] = [
  {
    id: "AssetCategoriesFilter",
    name: "Category",
    AtomKey: "assetCategories",
    data: [],
  },

  {
    id: "computersFilter",
    name: "Computer",
    AtomKey: "computers",
    data: [],
  },
  {
    id: "dateFilter",
    name: "Date Range",
    AtomKey: "",
    data: [],
  },
];

const FilterSidebarMulti: React.FC<FilterSidebarProps> = ({
  isOpen,
  filters,
  toggleSidebar,
  activeFilters,
  filtersStoreName,
  saveFilters,
  initialFilters,
}) => {
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, { value: number; label: string }[]>
  >({});

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [savedFilters, setSavedFilters] = useState<any>([]);
  const [editFilterIndex, setEditFilterIndex] = useState<number | null>(null);
  const [editFilterName, setEditFilterName] = useState<string>("");

  const userId = Number(Cookies.get("user"));
  const filtersDbName = "Filters";

  const handleApplyFilters = () => {
    if (Object.keys(selectedFilters).length === 0 && !startDate && !endDate)
      return;

    const filtersSelection: Record<string, any> = {};

    Object.entries(selectedFilters).forEach(([key, values]) => {
      const filterConfig = filtersOptions.find((option) => option.id === key);

      if (values.length > 0 && filterConfig) {
        const selectedValues = values
          .map((value) => {
            const item = filterData[key]?.find(
              (item: any) => item.label === value.label
            );
            return item ? Number(item.value) : null;
          })
          .filter((v) => v !== null);

        if (selectedValues.length > 0) {
          filtersSelection[filterConfig.name.toLowerCase()] =
            selectedValues.length === 1 ? selectedValues[0] : selectedValues;
        }
      }
    });

    const dateFrom = formatDate(startDate ? new Date(startDate) : null);
    const dateTo = formatDate(endDate ? new Date(endDate) : null);

    if (dateFrom) filtersSelection.date_from = dateFrom;
    if (dateTo) filtersSelection.date_to = dateTo;

    const wholeFilter = {
      ...initialFilters,
      ...filtersSelection,
    };
    saveFilters(wholeFilter);
    // toggleSidebar();
    // handleClearFilters();
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setStartDate("");
    setEndDate("");
    saveFilters(initialFilters ?? {});
  };

  const handleFilterChange = (
    filterId: string,
    selectedOption: MultiValue<FilterValue> | null
  ) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterId]: selectedOption
        ? selectedOption.map((option) => ({
            value: Number(option.value), // Force number type
            label: option.label,
          }))
        : [],
    }));
  };

  const loadSavedFilters = async () => {
    const allFilters = await loadFromIndexedDB(
      userId,
      filtersDbName,
      filtersStoreName
    );
    setSavedFilters(allFilters);
  };

  const handleSavedFilterClick = (selectedFilter: any) => {
    setSelectedFilters(selectedFilter.filters);
    setStartDate(selectedFilter.startDate || "");
    setEndDate(selectedFilter.endDate || "");
  };

  const deleteSavedFilter = async (id: number) => {
    await removeFromIndexedDB(userId, filtersDbName, filtersStoreName, id);
    loadSavedFilters();
  };

  const generateUniqueFilterName = (existingFilters: any[]): string => {
    const namePrefix = "Untitled ";
    const existingNames = new Set(
      existingFilters
        .map((filter) => filter.name)
        .filter((name) => name.startsWith(namePrefix))
        .map((name) => parseInt(name.replace(namePrefix, ""), 10))
        .filter((num) => !isNaN(num))
    );

    let counter = 1;
    while (existingNames.has(counter)) {
      counter++;
    }

    return `${namePrefix}${counter}`;
  };

  const handleSaveFilter = async () => {
    if (Object.keys(selectedFilters).length === 0) return;
    const latestFilters =
      (await loadFromIndexedDB(userId, filtersDbName, filtersStoreName)) || [];

    const filterExists = latestFilters.some(
      (filter: any) =>
        deepEqual(filter.filters, selectedFilters) &&
        filter.startDate === startDate &&
        filter.endDate === endDate
    );

    if (filterExists) return;
    const newFilterName = generateUniqueFilterName(latestFilters);
    const filterData = {
      name: newFilterName,
      filters: { ...selectedFilters },
      startDate,
      endDate,
    };
    await saveToIndexedDB(userId, filtersDbName, filtersStoreName, filterData);
    loadSavedFilters();
  };

  const handleEditFilter = (index: number, name: string) => {
    if (editFilterIndex === index) {
      handleSaveEditedFilter(index);
    } else {
      setEditFilterIndex(index);
      setEditFilterName(name);
    }
  };

  const handleSaveEditedFilter = async (index: number) => {
    if (!editFilterName.trim()) return;
    const updatedFilters = [...savedFilters];
    updatedFilters[index].name = editFilterName.trim();

    await saveToIndexedDB(
      userId,
      filtersDbName,
      filtersStoreName,
      updatedFilters
    );
    setEditFilterIndex(null);
    loadSavedFilters();
  };

  const handleCloseSidebar = () => {
    //handleClearFilters();
    toggleSidebar();
  };

  const [staticData] = useAtom(staticDataAtom);

  useEffect(() => {
    const fetchData = async () => {
      const newFilterData: Record<string, any> = {};
      for (const filter of filtersOptions) {
        if (activeFilters.includes(filter.id)) {
          try {
            if (filter.id === "dateFilter") continue;

            const sourceData =
              staticData[filter.AtomKey as keyof typeof staticData];

            newFilterData[filter.id] = Array.isArray(sourceData)
              ? sourceData.map((item) => ({
                  value: ("id" in item ? Number(item.id) : 0) || 0,
                  label:
                    "label" in item
                      ? item.label.toLowerCase()
                      : "status" in item
                      ? item.status.toLowerCase()
                      : "name" in item
                      ? item.name.toLowerCase()
                      : "Unnamed",
                }))
              : [];
          } catch (error) {
            console.error(`Failed to fetch data for ${filter.id}:`, error);
          }
        }
      }
      setFilterData(newFilterData);
    };

    fetchData();
    loadSavedFilters();
  }, [staticData]);

  useEffect(() => {
    if (
      isOpen &&
      filters &&
      Object.keys(filters).length > 0 &&
      Object.keys(filterData).length > 0
    ) {
      const initializedFilters: Record<string, FilterValue[]> = {};

      Object.entries(filters).forEach(([key, value]) => {
        const filterOption = filtersOptions.find(
          (opt) => opt.name.toLowerCase() === key.toLowerCase()
        );

        if (filterOption && filterData[filterOption.id]) {
          const matchedItems = Array.isArray(value) ? value : [value];

          const selected = matchedItems
            .map((val) =>
              filterData[filterOption.id].find(
                (item: FilterValue) => Number(item.value) === Number(val)
              )
            )
            .filter(Boolean) as FilterValue[];

          if (selected.length > 0) {
            initializedFilters[filterOption.id] = selected;
          }
        }
      });

      // Proper mapping here
      const mappedInitializedFilters: Record<
        string,
        { value: number; label: string }[]
      > = {};

      Object.entries(initializedFilters).forEach(([key, values]) => {
        mappedInitializedFilters[key] = values.map((item) => ({
          value: Number(item.value),
          label: item.label,
        }));
      });

      setSelectedFilters(mappedInitializedFilters);
    }
  }, [isOpen, filterData, filters]);

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn  p-3" onClick={handleCloseSidebar}>
          <i className={`fas fa-chevron-left`}></i>
        </button>

        <h4 className="font-bold mb-0 text-xl text-center text-indigo-600">
          Filters
        </h4>
      </div>

      <div className="d-flex flex-column gap-3 ">
        {filtersOptions.map((filter) => {
          if (activeFilters.includes(filter.id)) {
            return (
              <div key={filter.id} className="p-3 ">
                <h5 className="text-dark mb-2">{filter.name}</h5>

                {filter.id === "dateFilter" ? (
                  <>
                    <div>
                      <label className="custom-label">From</label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="form-group">
                      <label className="custom-label">To</label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </>
                ) : filterData[filter.id] ? (
                  <CustomReactSelect
                    options={filterData[filter.id]}
                    value={selectedFilters[filter.id] || []}
                    onChange={(selectedOption) =>
                      handleFilterChange(filter.id, selectedOption)
                    }
                    isMulti={true}
                    placeholder={`Select ${filter.name}`}
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

      <div className="row d-flex justify-content-between m-0 gap-2 p-3">
        <button
          className="btn custom-btn p-3 blue-bg-btn"
          onClick={handleClearFilters}
        >
          <span className="hyper-btn-text">Clear</span>
        </button>
        <button
          className="btn p-3 custom-btn blue-bg-btn"
          onClick={handleApplyFilters}
        >
          <span className="hyper-btn-text">Apply</span>
        </button>
        <button
          className="btn p-3 custom-btn blue-bg-btn"
          onClick={handleSaveFilter}
        >
          <span className="hyper-btn-text">Save</span>
        </button>
      </div>

      {savedFilters.length > 0 && (
        <div className=" mt-3 bg-white p-3">
          <h5 className="font-semibold text-lg text-dark mb-3">
            Saved Filters
          </h5>
          <div>
            <ul className="list-unstyled m-0 p-0">
              {savedFilters.map((filter: any, index: number) => (
                <li
                  key={index}
                  className="d-flex justify-content-between align-items-center list-item p-2"
                  style={{
                    borderRadius: "5px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {editFilterIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editFilterName}
                        onChange={(e) => setEditFilterName(e.target.value)}
                        onBlur={() => handleSaveEditedFilter(index)}
                        className="form-control"
                        autoFocus
                      />
                      <i
                        className={`bi bi-check2-circle save-filters-icon`}
                        style={{
                          color: "green",
                          marginLeft: "5px",
                          marginRight: "5px",
                        }}
                        onClick={() => handleSaveEditedFilter(index)}
                      ></i>
                    </>
                  ) : (
                    <div>
                      <span
                        className="filter-name cursor-pointer"
                        onClick={() => handleSavedFilterClick(filter)}
                      >
                        {filter.name}
                      </span>
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    {editFilterIndex !== index ? (
                      <i
                        className={`bi bi-pencil save-filters-icon `}
                        style={{
                          color: "black",
                        }}
                        onClick={() => handleEditFilter(index, filter.name)}
                      ></i>
                    ) : (
                      ""
                    )}

                    <i
                      className="bi bi-trash save-filters-icon text-danger"
                      onClick={() => deleteSavedFilter(filter.id)}
                    ></i>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export { FilterSidebarMulti };
