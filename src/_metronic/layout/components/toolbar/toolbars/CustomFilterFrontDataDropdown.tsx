import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { debounce } from "lodash";
import { staticDataAtom } from "../../../../../app/atoms/app-routes-global-atoms/approutesAtoms";

import { toolbarTicketsFrontFiltersAtom } from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";
import { transformStaticData } from "../../../../../utils/dataTransformUtils";
import {
  branchesAtom,
  mastersAtom,
  slavesAtom,
} from "../../../../../app/atoms/app-routes-global-atoms/globalFetchedAtoms";
interface CustomFilterFrontDataDropdownProps {
  setIsFilterFrontDropdownOpen: (isOpen: boolean) => void;
}

const CustomFilterFrontDataDropdown: React.FC<
  CustomFilterFrontDataDropdownProps
> = ({ setIsFilterFrontDropdownOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [staticData] = useAtom(staticDataAtom);

  const [status, setStatus] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [urgency, setUrgency] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [priority, setPriority] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [type, setType] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [requester, setRequester] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [branch, setBranch] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [assignee, setAssignee] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUrgency({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleRequesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequester({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignee({
      value: e.target.value,
      label: e.target.options[e.target.selectedIndex].text,
    });
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

  const [frontFilter, setFrontFilters] = useAtom(
    toolbarTicketsFrontFiltersAtom
  );

  const handleApply = () => {
    setFrontFilters({
      status: { value: status.value, label: status.label },
      urgency: { value: urgency.value, label: urgency.label },
      priority: { value: priority.value, label: priority.label },
      type: { value: type.value, label: type.label },
      requester: { value: requester.value, label: requester.label },
      branch: { value: branch.value, label: branch.label },
      assignee: { value: assignee.value, label: assignee.label }
    });
    setIsFilterFrontDropdownOpen(false);
  };

  const handleReset = () => {
    setStatus({ value: "", label: "" });
    setUrgency({ value: "", label: "" });
    setPriority({ value: "", label: "" });
    setType({ value: "", label: "" });
    setRequester({ value: "", label: "" });
    setBranch({ value: "", label: "" });
    setAssignee({ value: "", label: "" });
    setFrontFilters({
      status: { value: "", label: "" },
      urgency: { value: "", label: "" },
      priority: { value: "", label: "" },
      type: { value: "", label: "" },
      requester: { value: "", label: "" },
      branch: { value: "", label: "" },
      assignee: { value: "", label: "" }
    });
  };

  useEffect(() => {
    setStatus({
      value: frontFilter.status.value,
      label: frontFilter.status.label,
    });
    setUrgency({
      value: frontFilter.urgency.value,
      label: frontFilter.urgency.label,
    });
    setPriority({
      value: frontFilter.priority.value,
      label: frontFilter.priority.label,
    });
    setType({ value: frontFilter.type.value, label: frontFilter.type.label });
    setRequester({
      value: frontFilter.requester.value,
      label: frontFilter.requester.label,
    });
    setBranch({
      value: frontFilter.branch.value,
      label: frontFilter.branch.label,
    });
    setAssignee({
      value: frontFilter.assignee.value,
      label: frontFilter.assignee.label,
    });
  }, [frontFilter]);
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

  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: "120%", right: 0, width: "600px" }}
    >
      <div className="mb-3">
        <h5 className="text-primary fw-bold">Filter Options</h5>
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

      <div className="d-flex mb-3">
        <div className="me-2 flex-fill">
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

export default CustomFilterFrontDataDropdown;
