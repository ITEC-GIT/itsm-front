import React, { useState, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
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
interface CustomFilterBackendDataDropdownProps {
  setIsFilterDatabaseDropdownOpen: (isOpen: boolean) => void;
}

const CustomFilterBackendDataDropdown: React.FC<
  CustomFilterBackendDataDropdownProps
> = ({ setIsFilterDatabaseDropdownOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [requester, setRequester] = useState("");
  const [branch, setBranch] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUrgency(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleRequesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequester(e.target.value);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
  };
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignee(e.target.value);
  };
  const statusOptions = [
    { value: "new", label: "new" },
    { value: "assigned", label: "assigned" },
    { value: "plan", label: "plan" },
    { value: "solved", label: "solved" },
  ];
  const urgencyOptions = [
    { value: "Very low", label: "Very low" },
    { value: "Very high", label: "Very high" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Low", label: "Low" },
  ];
  const priorityOptions = [
    { value: "Very low", label: "Very low" },
    { value: "Medium", label: "Medium" },
    { value: "Very high", label: "Very high" },
  ];
  const typeOptions = [
    { value: "Incident", label: "Incident" },
    { value: "Request", label: "Request" },
    { value: "Demand", label: "Demand" },
  ];
  // the 3 below are the ones i want to get from db
  const requesterOptions = [
    { value: "User1", label: "User1" },
    { value: "User2", label: "User2" },
  ];
  const branchOptions = [
    { value: "Branch1", label: "Branch1" },
    { value: "Branch2", label: "Branch2" },
  ];
  const assigneeOptions = [
    { value: "m.harb", label: "m.harb" },
    { value: "cobalt", label: "cobalt" },
    { value: "m.hareb", label: "m.hareb" },
  ];

  const [backendFilter, setBackendFilters] = useAtom(
    toolbarTicketsBackendFiltersAtom
  );

  const handleApply = () => {
    setBackendFilters({
      status,
      urgency,
      priority,
      type,
      requester,
      branch,
      assignee,
      from: formattedFromdDate,
      to: formattedTodDate,
    });
    setIsFilterDatabaseDropdownOpen(false);

    const filterBody: ApiRequestBody = {
      status: status,
      urgency: urgency,
      priority: priority,
      type: type,
      requester: requester,
      branch: branch,
      assignee: assignee,
      from: formattedFromdDate,
      to:formattedTodDate ,
      range: "0-5",
      order: "desc"
    };

    filterBackendMutation.mutate(filterBody); 

  };
  const handleReset = () => {
    setStatus("");
    setUrgency("");
    setPriority("");
    setType("");
    setRequester("");
    setBranch("");
    setAssignee("");
    setFromDateTime("");
    setToDateTime("");
    setBackendFilters({
      status: "",
      urgency: "",
      priority: "",
      type: "",
      requester: "",
      branch: "",
      assignee: "",
      from: "",
      to: "",
    });
  };
  useEffect(() => {
    setStatus(backendFilter.status);
    setUrgency(backendFilter.urgency);
    setPriority(backendFilter.priority);
    setType(backendFilter.type);
    setRequester(backendFilter.requester);
    setBranch(backendFilter.branch);
    setAssignee(backendFilter.assignee);
    setFromDateTime(backendFilter.from);
    setToDateTime(backendFilter.to);
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
  const [toDateTime, setToDateTime] = useState("");
  const [formattedTodDate, setFormattedToDate] = useState("");

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

  const filterBackendMutation = useMutation<any, Error, ApiRequestBody>(
    {
      mutationFn: FetchFilteredTickets, 
      onSuccess: (data) => {
        console.log(data);
        const message = "success";

        const timer = setTimeout(() => {
          setLoading(false);
          setRenderr(true);
        }, 500);

        setRenderr(false);
      },
      onError: (error) => {
        alert("There was an error: " + error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["create"] }); // Updated invalidateQueries syntax
      },
    }
  );
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
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Select option</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-fill">
          <label className="form-label fw-bold">Urgency:</label>
          <select
            className="form-select"
            value={urgency}
            onChange={handleUrgencyChange}
          >
            <option value="">Select option</option>
            {urgencyOptions.map((urgency) => (
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
            value={priority}
            onChange={handlePriorityChange}
          >
            <option value="">Select option</option>
            {priorityOptions.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex mb-3">
        <div className="flex-fill">
          <label className="form-label fw-bold">Type:</label>
          <select
            className="form-select"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Select option</option>
            {typeOptions.map((type) => (
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
            value={requester}
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
        <div className="flex-fill">
          <label className="form-label fw-bold">Branch:</label>
          <select
            className="form-select"
            value={branch}
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

      <div className="d-flex mb-3">
        <div className="flex-fill">
          <label className="form-label fw-bold">Assignee:</label>
          <select
            className="form-select"
            value={assignee}
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
