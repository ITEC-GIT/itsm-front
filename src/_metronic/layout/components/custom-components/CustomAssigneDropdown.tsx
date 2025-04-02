import React, { useEffect, useMemo, useRef, useState } from "react";
import Select, { components } from "react-select";
import { mastersAtom } from "../../../../app/atoms/app-routes-global-atoms/globalFetchedAtoms";
import { useAtom, useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTicketRequestBody } from "../../../../app/config/ApiTypes";
import { UpdateTicket } from "../../../../app/config/ApiCalls";
import { Assignee } from "../../../../app/types/TicketTypes";
import { selectedAssigneesAtom } from "../../../../app/atoms/assignee-atoms/assigneeAtoms";
import { ticketPerformingActionOnAtom } from "../../../../app/atoms/tickets-page-atom/ticketsActionsAtom";

interface CustomAssigneeDropDownPropos {
  ticketId: string;
  assignees: Assignee[];
  setIsAssigneeDropdownOpen: (isOpen: boolean) => void;
}

const CustomAssigneeDropDown: React.FC<CustomAssigneeDropDownPropos> = ({
  ticketId,
  assignees,
  setIsAssigneeDropdownOpen,
}) => {
  const [filterText, setFilterText] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useAtom(
    selectedAssigneesAtom
  );

  const [ticketChangeAssigneenOn, setChangeAssigneeOn] = useAtom(
    ticketPerformingActionOnAtom
  );
  useEffect(() => {}, []);
  const previousAssigneesRef = useRef<{ value: string; label: string }[]>();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };

  const ItsmMasters = useAtomValue(mastersAtom);

  const assigneeOptions = useMemo(
    () =>
      ItsmMasters.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })),
    [ItsmMasters]
  );

  const handleAssigneeChange = (selectedOptions: any) => {
    const previousAssignees = previousAssigneesRef.current || [];

    setSelectedAssignees(selectedOptions);

    const assigneeIds = selectedOptions.map((option: { value: string }) =>
      parseInt(option.value, 10)
    );
    const updatePayload: UpdateTicketRequestBody = {
      id: parseInt(ticketId, 10),
      assignee_id: assigneeIds,
    };

    updateAssigneeTicketMutation.mutate(updatePayload);
    setIsAssigneeDropdownOpen(false);

    // Compare previous and current assignees
    const addedAssignees = selectedOptions.filter(
      (option: { value: string; label: string }) =>
        !previousAssignees.some(
          (prevOption) =>
            prevOption.value === option.value &&
            prevOption.label === option.label
        )
    );

    const removedAssignees = previousAssignees.filter(
      (prevOption: { value: string; label: string }) =>
        !selectedOptions.some(
          (option: { value: string; label: string }) =>
            option.value === prevOption.value &&
            option.label === prevOption.label
        )
    );

    if (addedAssignees.length > 0 || removedAssignees.length > 0) {
      console.log("Assignees changed for ticket ID:", ticketId);
      console.log("Added assignees:", addedAssignees);
      console.log("Removed assignees:", removedAssignees);

      const updatedAssignees = ItsmMasters.filter((item) =>
        assigneeIds.includes(item.id)
      ).map((item) => ({
        id: item.id,
        name: item.name,
        avatar: item.Avatar,
      }));

      const assigneeChangedInfo = {
        ticketId: ticketId,
        assigneeNewData: updatedAssignees,
        assigneeIds: assigneeIds,
      };

      setChangeAssigneeOn(assigneeChangedInfo);
    }

    // Update the ref with the current assignees
    previousAssigneesRef.current = selectedOptions;
  };

  const queryClient = useQueryClient();
  const updateAssigneeTicketMutation = useMutation<
    any,
    Error,
    UpdateTicketRequestBody
  >({
    mutationFn: UpdateTicket,
    onSuccess: (response) => {
      console.log("response", response);
    },
    onError: (error) => {
      alert("There was an error: " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["create"] });
    },
  });

  useEffect(() => {
    const initialAssignees = assigneeOptions.filter((option) =>
      assignees.some((assignee) => assignee.name === option.label)
    );
    previousAssigneesRef.current = initialAssignees;

    setSelectedAssignees(initialAssignees);
  }, [assignees, assigneeOptions]);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const handlePosition = () => {
      const dropdownElement = document.getElementById(
        `dropdown-assignee-${ticketId}`
      );
      if (dropdownElement) {
        const rect = dropdownElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.bottom > windowHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    handlePosition();
    window.addEventListener("resize", handlePosition);
    return () => {
      window.removeEventListener("resize", handlePosition);
    };
  }, [ticketId]);
  return (
    <div
      id={`dropdown-assignee-${ticketId}`}
      onClick={(e) => e.stopPropagation()}
      className="dropdown-menu p-4 show"
      style={{
        top: dropdownPosition === "bottom" ? "102%" : "auto",
        bottom: dropdownPosition === "top" ? "102%" : "auto",
        left: 0,
        width: "350px",
        backgroundColor: "#f8f9fa", // Off-white background color
        border: "2px solid #ccc", // Light grey border
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for 2D effect
        zIndex: 1000,
      }}
    >
      {/* Title Section */}
      <div className="mb-3">
        <h5 className="text-primary fw-bold">Assign it to</h5>
      </div>

      {/* Divider */}
      <div className="mb-1">
        <hr className="dropdown-divider" />
      </div>

      {/* Search Input */}
      <div
        className="card-body assigne-dropdown-card"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Select
          isMulti
          options={assigneeOptions}
          value={selectedAssignees}
          onChange={(selectedOptions, actionMeta) => {
            if (actionMeta.action === "select-option") {
              actionMeta.option?.value && actionMeta.option?.label;
            }
            handleAssigneeChange(selectedOptions);

            // Stop event propagation explicitly
            // actionMeta.option && actionMeta.option.stopPropagation?.();
          }}
          placeholder="Search and select assignees"
          className="basic-multi-select"
          classNamePrefix="select"
          closeMenuOnSelect={false}
          isSearchable
        />

        {/* <Select
          isMulti
          options={assigneeOptions}
          value={selectedAssignees}
          onChange={(selectedOptions, actionMeta) => {
            // Stop event propagation only when selecting an option
            if (actionMeta.action === "select-option") {
              actionMeta.option?.value && actionMeta.option?.label; // Ensure option exists

              // Stop event from bubbling up
            }
            handleAssigneeChange(selectedOptions);
          }}
          placeholder="Search and select assignees"
          className="basic-multi-select"
          classNamePrefix="select"
          closeMenuOnSelect={false}
          isSearchable
        /> */}
      </div>
    </div>
  );
};

export default CustomAssigneeDropDown;
