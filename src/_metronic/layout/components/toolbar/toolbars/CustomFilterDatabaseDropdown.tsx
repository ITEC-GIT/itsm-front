import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { debounce, set } from "lodash";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { toolbarTicketsBackendFiltersAtom } from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";
import { ApiRequestBody } from "../../../../../app/config/ApiTypes";
import { FetchFilteredTickets } from "../../../../../app/config/ApiCalls";
import { staticDataAtom } from "../../../../../app/atoms/app-routes-global-atoms/approutesAtoms";
import { transformStaticData } from "../../../../../utils/dataTransformUtils";
import {
  branchesAtom,
  mastersAtom,
  slavesAtom,
} from "../../../../../app/atoms/app-routes-global-atoms/globalFetchedAtoms";
import StarredToggle from "../../custom-components/StaredSwitch.tsx";
interface CustomFilterBackendDataDropdownProps {
  setIsFilterDatabaseDropdownOpen: (isOpen: boolean) => void;
}

const CustomFilterBackendDataDropdown: React.FC<
  CustomFilterBackendDataDropdownProps
> = ({ setIsFilterDatabaseDropdownOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [staticData] = useAtom(staticDataAtom);

  const [status, setStatus] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [urgency, setUrgency] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [priority, setPriority] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [type, setType] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [requester, setRequester] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [branch, setBranch] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [assignee, setAssignee] = useState<{ value: string; label: string }>({ value: "", label: "" });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUrgency({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };

  const handleRequesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequester({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignee({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text });
  };
  const { statusOptions, urgencyOptions, priorityOptions, typeOptions } =
    transformStaticData(staticData);

  const ItsmBranches = useAtomValue(branchesAtom);
  const ItsmSlaves = useAtomValue(slavesAtom);
  const ItsmMasters = useAtomValue(mastersAtom);

  const requesterOptions = useMemo(
    () =>
      ItsmSlaves.map((item) => ({
        value: item.id,
        label: item.user_name,
      })),
    [ItsmSlaves]
  );

  const branchOptions = useMemo(
    () =>
      ItsmBranches.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [ItsmBranches]
  );
  const assigneeOptions = useMemo(
    () =>
      ItsmMasters.map((item) => ({
        value: item.id,
        label: item.user_name,
      })),
    [ItsmMasters]
  );

  const [backendFilter, setBackendFilters] = useAtom(
    toolbarTicketsBackendFiltersAtom
  );

  const handleApply = () => {
    const checkingFilters = {
      status: status?.value,
      urgency: urgency?.value,
      priority: priority?.value,
      type: type?.value,
      requester: requester?.value,
      branch: branch?.value,
      assignee: assignee?.value,
      from: formattedFromdDate,
      to: formattedTodDate,
      isStarred: isStarred.toString() === "false" ? "" : isStarred.toString(),
    };
    // const allEmpty = Object.values(checkingFilters).every(val => val === "" || val === null || val === undefined);
    //
    // if (allEmpty) return;

    setBackendFilters({
      status: { value: status.value, label: status.label },
      urgency: { value: urgency.value, label: urgency.label },
      priority: { value: priority.value, label: priority.label },
      type: { value: type.value, label: type.label },
      requester: { value: requester.value, label: requester.label },
      branch: { value: branch.value, label: branch.label },
      assignee: { value: assignee.value, label: assignee.label },
      from: { value: formattedFromdDate, label: formattedFromdDate },
      to: { value: formattedTodDate, label: formattedTodDate },
      isStarred: { value: (isStarred.toString()==="false"?"":isStarred.toString()), label: (isStarred.toString()==="false"?"":isStarred.toString()) },

    });
    setIsFilterDatabaseDropdownOpen(false);

    const filterBody: ApiRequestBody = {
      range: "0-5",
      order: "desc",
      opening_date: { from_date: "", to_date: "" },
    };

    if (status.value) filterBody.status = status.value;
    if (urgency.value) filterBody.urgency = urgency.value;
    if (priority.value) filterBody.priority = priority.value;
    if (type.value) filterBody.type = type.value;
    if (requester.value) filterBody.requester = requester.value;
    if (branch.value) filterBody.area_id = branch.value;
    if (assignee.value) filterBody.assignee = assignee.value;
    if (formattedFromdDate) filterBody.opening_date.from_date = formattedFromdDate;
    if (formattedTodDate) filterBody.opening_date.to_date = formattedTodDate;
    if(isStarred)filterBody.starred = Number(isStarred);
    // filterBody.opening_date={"from":formattedFromdDate,"to":formattedTodDate}
    // filterBackendMutation.mutate(filterBody);


  };
  const handleReset = () => {
    setStatus({ value: "", label: "" });
    setUrgency({ value: "", label: "" });
    setPriority({ value: "", label: "" });
    setType({ value: "", label: "" });
    setRequester({ value: "", label: "" });
    setBranch({ value: "", label: "" });
    setAssignee({ value: "", label: "" });
    setFromDateTime("");
    setToDateTime("");
    setIsStarred(false);
    setBackendFilters({
      status: { value: "", label: "" },
      urgency: { value: "", label: "" },
      priority: { value: "", label: "" },
      type: { value: "", label: "" },
      requester: { value: "", label: "" },
      branch: { value: "", label: "" },
      assignee: { value: "", label: "" },
      from: { value: "", label: "" },
      to: { value: "", label: "" },
      isStarred: { value: '', label:''},

    });
    setIsFilterDatabaseDropdownOpen(false);
  };
  useEffect(() => {
    setStatus({ value: backendFilter.status.value, label: backendFilter.status.label });
    setUrgency({ value: backendFilter.urgency.value, label: backendFilter.urgency.label });
    setPriority({ value: backendFilter.priority.value, label: backendFilter.priority.label });
    setType({ value: backendFilter.type.value, label: backendFilter.type.label });
    setRequester({ value: backendFilter.requester.value, label: backendFilter.requester.label });
    setBranch({ value: backendFilter.branch.value, label: backendFilter.branch.label });
    setAssignee({ value: backendFilter.assignee.value, label: backendFilter.assignee.label });
    setFromDateTime(backendFilter.from.value);
    setToDateTime(backendFilter.to.value);
    setIsStarred(
        backendFilter.isStarred.value === 'true'
            ? true
            : backendFilter.isStarred.value === 'false'
                ? false
                : false // or any default value for an empty string ''
    );
  }, [backendFilter]);
  const handleWindowFocus = useCallback(
    debounce(() => {
      console.log("Window focused! Refetching data...");
      // Add your data refetching logic here
    }, 500),
    []
  );

  useEffect(() => {
    // Add the focus event listener
    window.addEventListener("focus", handleWindowFocus);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      handleWindowFocus.cancel(); // Cancel any pending debounce calls
    };
  }, [handleWindowFocus]);
  const [fromDateTime, setFromDateTime] = useState("");
  const [formattedFromdDate, setFormattedFromDate] = useState("");
  const handleFromDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // Format: yyyy,mm,dd
    setFromDateTime(rawDate);

    if (rawDate) {
      // Replace commas with dashes
      const dashDate = rawDate.replace(/,/g, "-");
      setFormattedFromDate(dashDate);
    } else {
      setFormattedFromDate("");
    }
  };
  const [toDateTime, setToDateTime] = useState("");
  const [formattedTodDate, setFormattedToDate] = useState("");

  const handleToDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // Format: yyyy,mm,dd
    setToDateTime(rawDate);

    if (rawDate) {
      // Replace commas with dashes
      const dashDate = rawDate.replace(/,/g, "-");
      setFormattedToDate(dashDate);
    } else {
      setFormattedToDate("");
    }
  };
  // Create a QueryClient instance
  const queryClient = new QueryClient();

  // Parameters for the POST request

  // React Query `useQuery` Hook
  // const { data, error, isLoading, refetch } = useQuery({
  //   queryKey,
  //   queryFn: () => fetchPostData(params),
  //   refetchOnWindowFocus: true, // Refetch when window regains focus
  //   refetchInterval: 180000, // Refetch every 3 minutes (in milliseconds)
  //   enabled: false, // Start fetching as soon as the component is mounted
  // });
  // Define the type for the API response
  type ApiResponse = {
    status: string; // Example: "success" or "error"
    message: string; // Example: "Operation completed successfully."
  };

  // Define the type for the API request body

  const [loading, setLoading] = React.useState<boolean>(false);
  const [renderr, setRenderr] = React.useState<boolean>(false);

  const filterBackendMutation = useMutation<any, Error, ApiRequestBody>({
    mutationFn: FetchFilteredTickets,
    onSuccess: (data) => {
      console.log(data);
      const message = "success";
    },
    onError: (error) => {
      alert("There was an error: " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["create"] }); // Updated invalidateQueries syntax
    },
  });
  const [isStarred, setIsStarred] = useState(false); // State in parent

  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: "120%", right: 0, width: "600px" }}
    >
      <div className="mb-3">
        <h5 className="text-primary fw-bold">Filter Query Options</h5>
      </div>
      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">From:</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={fromDateTime}
            onChange={handleFromDateTimeChange}
          />
        </div>
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">To:</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={toDateTime}
            onChange={handleToDateTimeChange}
          />
        </div>
      </div>
      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Status:</label>
          <select
            className="form-select"
            value={status.value}
            onChange={handleStatusChange}
          >
            <option value="">Select option</option>
            {statusOptions.map((status: { value: string; label: string }) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Urgency:</label>
          <select
            className="form-select"
            value={urgency.value}
            onChange={handleUrgencyChange}
          >
            <option value="">Select option</option>
            {urgencyOptions.map((urgency: { value: string; label: string }) => (
              <option key={urgency.value} value={urgency.value}>
                {urgency.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Priority:</label>
          <select
            className="form-select"
            value={priority.value}
            onChange={handlePriorityChange}
          >
            <option value="">Select option</option>
            {priorityOptions.map(
              (priority: { value: string; label: string }) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Type:</label>
          <select
            className="form-select"
            value={type.value}
            onChange={handleTypeChange}
          >
            <option value="">Select option</option>
            {typeOptions.map((type: { value: string; label: string }) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Requester:</label>
          <select
            className="form-select"
            value={requester.value}
            onChange={handleRequesterChange}
          >
            <option value="">Select option</option>
            {requesterOptions.map((requester) => (
              <option key={requester.value} value={requester.value}>
                {requester.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2 flex-fill">
          <label className="form-label fw-bold">Branch:</label>
          <select
            className="form-select"
            value={branch.value}
            onChange={handleBranchChange}
          >
            <option value="">Select option</option>
            {branchOptions.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex mb-3 gap-2">
        <div className="flex-fill">
          <label className="form-label fw-bold">Assignee:</label>
          <select
            className="form-select"
            value={assignee.value}
            onChange={handleAssigneeChange}
          >
            <option value="">Select option</option>
            {assigneeOptions.map((assignee) => (
              <option key={assignee.value} value={assignee.value}>
                {assignee.label}
              </option>
            ))}
          </select>
        </div>
        <div className='d-flex align-self-end'>
          <StarredToggle isStarred={isStarred} onToggle={setIsStarred} />
        </div>


      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomFilterBackendDataDropdown;
