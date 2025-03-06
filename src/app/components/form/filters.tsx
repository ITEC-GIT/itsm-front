// idea to be discussed

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { DatePicker } from "../form/datePicker";
import { deepEqual, formatDate, getData } from "../../../utils/custom";
import { GetAllSoftwareInstallationRequestType as filterType } from "../../types/softwareInstallationTypes";
import {
  loadFromIndexedDB,
  removeFromIndexedDB,
  saveToIndexedDB,
} from "../../indexDB/Config";
import { useAtom } from "jotai";
import { staticDataAtom } from "../../atoms/filters-atoms/filtersAtom";

interface FilterSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeFilters: string[];
  saveFilters: React.Dispatch<React.SetStateAction<filterType>>;
}

// interface FiltersTitleProps {
//   id: string;
//   name: string;
//   storeName: string;
//   data: { value: string; label: string }[];
//   atomName?: string;
// }
interface FiltersTitleProps {
  id: string;
  name: string;
  AtomKey: string;
  data: { value: string; label: string }[];
}

// const filtersOptions: FiltersTitleProps[] = [
//   {
//     id: "softwareStatusFilter",
//     name: "Status",
//     storeName: "SoftwareStatus",
//     data: [],
//   },
//   {
//     id: "userFilter",
//     name: "User",
//     storeName: "assignees",
//     data: [],
//   },
//   {
//     id: "computersFilter",
//     name: "Computer",
//     storeName: "Computers",
//     data: [],
//   },
//   {
//     id: "dateFilter",
//     name: "Date Range",
//     storeName: "",
//     data: [],
//   },
// ];

const filtersOptions: FiltersTitleProps[] = [
  {
    id: "softwareStatusFilter",
    name: "Status",
    AtomKey: "SoftwareStatus",
    data: [],
  },
  {
    id: "userFilter",
    name: "User",
    AtomKey: "assignees",
    data: [],
  },
  {
    id: "computersFilter",
    name: "Computer",
    AtomKey: "Computers",
    data: [],
  },
  {
    id: "dateFilter",
    name: "Date Range",
    AtomKey: "",
    data: [],
  },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
  const [savedFilters, setSavedFilters] = useState<any>([]);
  const [editFilterIndex, setEditFilterIndex] = useState<number | null>(null);
  const [editFilterName, setEditFilterName] = useState<string>("");

  const userId = Number(Cookies.get("user"));
  const staticDbName = "JotaiDB";
  const filtersDbName = "savedFiltersDB";
  const filtersStoreName = "softwareFilters";

  const handleApplyFilters = () => {
    console.log("hii");
    if (Object.keys(selectedFilters).length === 0 && !startDate && !endDate)
      return;
    const filtersSelection: Record<string, any> = {};
    console.log("selectedFilters ==>>", selectedFilters);
    if (Object.keys(selectedFilters).length !== 0) {
      Object.entries(selectedFilters).forEach(([key, value]) => {
        const filterConfig = filtersOptions.find((option) => option.id === key);
        if (value) {
          if (key === "softwareStatusFilter") {
            filtersSelection.status = value.label;
          } else {
            const selectedFilter = filterData[key]?.find(
              (item: any) => item.label === value.label
            );
            if (selectedFilter && filterConfig) {
              filtersSelection[filterConfig.name.toLowerCase()] = Number(
                selectedFilter.value
              );
            }
          }
        }
      });
    }

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
    // handleClearFilters();

    // toggleSidebar();
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setStartDate("");
    setEndDate("");
    //ask about this
    const initialFilters = {
      range: "0-50",
      order: "desc",
    };
    saveFilters(initialFilters);
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
      // If the check icon is clicked, save the edited name
      handleSaveEditedFilter(index);
    } else {
      // If the pen icon is clicked, enable editing mode
      setEditFilterIndex(index);
      setEditFilterName(name);
    }
  };

  // const handleEditFilter = (index: number, name: string) => {
  //   setEditFilterIndex(index);
  //   setEditFilterName(name);
  // };

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
                  value: ("id" in item ? item.id?.toString() : "") || "",
                  label:
                    "label" in item
                      ? item.label
                      : "status" in item
                      ? item.status
                      : "name" in item
                      ? item.name
                      : "Unnamed",
                }))
              : [];
            console.log("newFilterData ==>>", newFilterData);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const newFilterData: Record<string, any> = {};
  //     for (const filter of filtersOptions) {
  //       if (activeFilters.includes(filter.id)) {
  //         try {
  //           if (filter.id === "dateFilter") continue;
  //           newFilterData[filter.id] = await getData(
  //             filter.storeName,
  //             userId,
  //             staticDbName
  //           );
  //         } catch (error) {
  //           console.error(`Failed to fetch data for ${filter.id}:`, error);
  //         }
  //       }
  //     }
  //     setFilterData(newFilterData);
  //   };

  //   fetchData();
  //   loadSavedFilters();
  // }, [activeFilters]);

  return (
    <div
      className={`sidebar collapse collapse-horizontal show bg-white text-black shadow-2xl rounded-xl ${
        isOpen ? "d-block" : "d-none"
      }`}
      style={{
        width: "100%",
        height: "90%",
        overflowY: "auto",
        backdropFilter: isOpen ? "blur(5px)" : "none",
      }}
    >
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
                  <Select
                    options={filterData[filter.id]}
                    placeholder={`Select ${filter.name}`}
                    // className="form-select-solid"
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
        <div className="saved-filters-container mt-3 bg-white shadow-sm rounded-lg p-3">
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

export { FilterSidebar };
