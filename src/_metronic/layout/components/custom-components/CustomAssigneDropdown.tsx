import React, { useEffect, useMemo, useState } from "react";
import { mastersAtom } from "../../../../app/atoms/app-routes-global-atoms/globalFetchedAtoms";
import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTicketRequestBody } from "../../../../app/config/ApiTypes";
import { UpdateTicket } from "../../../../app/config/ApiCalls";

interface CustomAssigneeDropDownPropos {
  ticketId: string;

  assignedTo: string;
  setIsAssigneeDropdownOpen: (isOpen: boolean) => void;
}

const CustomAssigneeDropDown: React.FC<CustomAssigneeDropDownPropos> = ({ticketId,
  assignedTo,
  setIsAssigneeDropdownOpen,
}) => {
  const [status, setStatus] = useState("");
  const [filterText, setFilterText] = useState("");

  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body
  };
  const ItsmMasters = useAtomValue(mastersAtom);

  const assigneeOptions = useMemo(
    () =>
      ItsmMasters.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [ItsmMasters]
  );
  const handleAssigneeClick = (assignee: string) => {
    setSelectedAssignee(assignee);
    console.log("Selected Assignee:", assignee);
    const updatePayload: UpdateTicketRequestBody = {
      id: parseInt(ticketId, 10),
      assignee_id: parseInt(assignee, 10)
    };


    
    updateAssigneeTicketMutation.mutate(updatePayload);
    setIsAssigneeDropdownOpen(false);
  };


  const queryClient = useQueryClient();
  const updateAssigneeTicketMutation = useMutation<any, Error, UpdateTicketRequestBody>(
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
  const filteredAssignees = assigneeOptions.filter((assignee) =>
    assignee.label.toLowerCase().includes(filterText)
  );
  useEffect(() => {
    const initialAssignee = assigneeOptions.find(
      (option) => option.label === assignedTo
    );
    if (initialAssignee) {
      setSelectedAssignee(initialAssignee.label);
    }
  }, [assignedTo, assigneeOptions]);
  return (
    <div
      className="dropdown-menu p-4 show"
      style={{ top: "102%", left: 0, width: "300px" }} // Increased width
    >
      {/* Title Section */}
      <div className="mb-3">
        <h5 className="text-dark fw-bold">Assign it to</h5>
      </div>

      {/* Divider */}
      <div className="mb-1">
        <hr className="dropdown-divider" />
      </div>

      {/* Search Input */}
      <div className="card-body assigne-dropdown-card">
        <div className="input-group mb-3">
          <span className="input-group-text" id="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-icon"
            value={filterText}
            onChange={handleFilterChange}
            onClick={handleSearchClick}
          />
        </div>

        {/* Assignee List */}
        <ul className="list-group">
          <li
            className={`list-group-item dropdown-item ${
              !selectedAssignee ? "bg-primary text-white" : ""
            }`}
            onClick={() => handleAssigneeClick("None")}
          >
            None
            {!selectedAssignee && <i className="fas fa-check float-end"></i>}
          </li>
          {filteredAssignees.map((assignee) => (
            <li
              key={assignee.value}
              className={`list-group-item dropdown-item ${
                selectedAssignee === assignee.label
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => handleAssigneeClick(assignee.value)}
            >
              {assignee.label}
              {selectedAssignee === assignee.value && (
                <i className="fas fa-check float-end"></i>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomAssigneeDropDown;
