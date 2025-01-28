import React, { useState, useEffect, useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { debounce, find, set } from "lodash";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { transformStaticData } from "../../../../utils/dataTransformUtils";
import { staticDataAtom } from "../../../../app/atoms/app-routes-global-atoms/indexDBAtoms";
import { UpdateTicketRequestBody } from "../../../../app/config/ApiTypes";
import { UpdateTicket } from "../../../../app/config/ApiCalls";
import { ticketPerformingActionOnAtom } from "../../../../app/atoms/tickets-page-atom/ticketsActionsAtom";

interface CustomActionsDropdownProps {
  id: string;
  urgency: string;
  status: string;
  priority: string;
  type: string;
  setIsActionsDropdownOpen: (isOpen: boolean) => void;
}

const CustomActionsDropdown: React.FC<CustomActionsDropdownProps> = ({
  id: ticketId,
  urgency: initialUrgency,
  status: initialStatus,
  priority: initialPriority,
  type: initialType,
  setIsActionsDropdownOpen,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ticketPerformingActionOn, setTicketPerformingActionOn] = useAtom(
    ticketPerformingActionOnAtom
  );
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const staticData = useAtomValue(staticDataAtom);

  const { statusOptions, urgencyOptions, priorityOptions, typeOptions } =
    transformStaticData(staticData);
  const findOptionLabel = (
    options: { label: string; value: string }[],
    label: string
  ) => {
    const option = options.find((option) => option.label === label);
    return option ? option.value : "";
  };

  const findOption = (
    options: { label: string; value: string }[],
    value: number
  ) => {
    return (
      options.find((option) => parseInt(option.value, 10) === value) || {
        label: "",
        value: "",
      }
    );
  };

  const [status, setStatus] = useState(
    findOptionLabel(statusOptions, initialStatus)
  );
  const [urgency, setUrgency] = useState(
    findOptionLabel(urgencyOptions, initialUrgency)
  );
  const [priority, setPriority] = useState(
    findOptionLabel(priorityOptions, initialPriority)
  );
  const [type, setType] = useState(findOptionLabel(typeOptions, initialType));

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

  // const [dueDateTime, setDueDateTime] = useState("");
  // const [formattedTodDate, setFormattedToDate] = useState("");

  // const handleDueDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const rawDate = e.target.value; // Format: yyyy,mm,dd
  //   setDueDateTime(rawDate);

  //   if (rawDate) {
  //     // Replace commas with dashes
  //     const dashDate = rawDate.replace(/,/g, "-");
  //     setFormattedToDate(dashDate);
  //   } else {
  //     setFormattedToDate("");
  //   }
  // };
  const handleReset = () => {
    setStatus(findOptionLabel(statusOptions, initialStatus));
    setUrgency(findOptionLabel(urgencyOptions, initialUrgency));
    setPriority(findOptionLabel(priorityOptions, initialPriority));
    setType(findOptionLabel(typeOptions, initialType));
  };
  const queryClient = useQueryClient();

  const updateTicketMutation = useMutation<any, Error, UpdateTicketRequestBody>(
    {
      mutationFn: UpdateTicket,
      onSuccess: (response) => {
        const responseData = response.data;

        console.log("response", response);
        const message = "success";
      },
      onError: (error) => {
        alert("There was an error: " + error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["create"] }); // Updated invalidateQueries syntax
      },
    }
  );
  const handleApply = () => {
    const updatePayload: UpdateTicketRequestBody = {
      id: parseInt(ticketId, 10),
    };

    if (status !== "") {
      updatePayload.status = parseInt(status, 10);
    }
    if (urgency !== "") {
      updatePayload.urgency = parseInt(urgency, 10);
    }
    if (priority !== "") {
      updatePayload.priority = parseInt(priority, 10);
    }
    if (type !== "") {
      updatePayload.type = parseInt(type, 10);
    }
    setIsActionsDropdownOpen(false);
    const ticketPerformingActionOn = {
      id: ticketId,
      status: findOption(statusOptions, parseInt(status, 10)),
      urgency: findOption(urgencyOptions, parseInt(urgency, 10)),
      priority: findOption(priorityOptions, parseInt(priority, 10)),
      type: findOption(typeOptions, parseInt(type, 10)),
    };
    // const ticketPerformingActionOn = {'id': ticketId, 'action': 'update', 'priority': findOption(priorityOptions,parseInt(priority, 10) )};
    setTicketPerformingActionOn(ticketPerformingActionOn);

    updateTicketMutation.mutate(updatePayload);
  };
  return (
    <div
      className="dropdown-menu p-4 show"
      onClick={(e) => e.stopPropagation()}
      style={{ top: "120%", left: 0, width: "600px" }}
    >
      <div className="mb-3">
        <h5 className="text-primary fw-bold">Ticket Actions</h5>
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
            {statusOptions.map((status: { label: string; value: string }) => (
              <option key={status.label} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2">
          <label className="form-label fw-bold">Types:</label>
          <select
            className="form-select"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Select option</option>
            {typeOptions.map((type: { label: string; value: string }) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="me-2">
          <label className="form-label fw-bold">Urgency:</label>
          <select
            className="form-select"
            value={urgency}
            onChange={handleUrgencyChange}
          >
            <option value="">Select option</option>
            {urgencyOptions.map((urgency: { label: string; value: string }) => (
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
            {priorityOptions.map(
              (priority: { label: string; value: string }) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              )
            )}
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

export default CustomActionsDropdown;
