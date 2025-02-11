import React, {useState, useEffect} from "react";
import {styleText} from "util";
import "../../../assets/sass/custom/ticketcard.scss"; // Ensure the CSS is imported
import CustomAssigneeDropDown from "./CustomAssigneDropdown";
import CustomActionsDropdown from "./CustomActionsDropdown";
import {ticketPerformingActionOnAtom} from "../../../../app/atoms/tickets-page-atom/ticketsActionsAtom";
import {useAtom} from "jotai";
import {mastersAtom} from "../../../../app/atoms/app-routes-global-atoms/globalFetchedAtoms";
import {Assignee} from "../../../../app/types/TicketTypes";
import detective from "./detective.svg";

interface CardProps {
  id: string;
  status: "solved" | "closed" | "pending" | "assigned" | "new" | "plan";
  title: string;
  description: string;
  date: string;
  assignedTo: {
    name: string;
  };
  priority: string;
  raisedBy: {
    initials: string;
    name: string;
  };
  type: string;
  urgency: string;
  lastUpdate: string;
  onClick?: () => void;
  onPin?: (id: string) => void; // New prop for pinning
  isPinned?: boolean;
  isStarred: boolean;
  onStarred?: (id: string) => void;
  isCurrentUserMaster: boolean;
  assignees: Assignee[];
  isDetailsPage?: boolean;
}

const TicketCard: React.FC<CardProps> = ({
                                           id,
                                           status,
                                           title,
                                           description,
                                           assignedTo,
                                           priority,
                                           raisedBy,
                                           date,
                                           type,
                                           urgency,
                                           lastUpdate,
                                           onClick,
                                           onPin,
                                           isPinned = false,
                                           isStarred,
                                           onStarred,
                                           isCurrentUserMaster,
                                           assignees,
                                           isDetailsPage = false,

                                         }) => {
  const [isRadioSelected, setIsRadioSelected] = useState(false);
  const [iconColors, setIconColors] = useState({
    pin: isPinned,
    heart: false,
    check: false,
    threeDotsCircle: false,
    star: isStarred,
  });
  const [isCardFocused, setIsCardFocused] = useState(false); // Track focus state
  const [isDescriptionUnderlined, setIsDescriptionUnderlined] = useState(false); // Track description underline state
  const [timeAgo, setTimeAgo] = useState("");
  const [updateTimeAgo, setUpdateTimeAgo] = useState("");

  const calculateTimeAgo = (date: string): string => {
    const now = new Date();
    const providedDate = new Date(date);
    const diffInMs = now.getTime() - providedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      } else {
        return `${diffInHours} hours ago`;
      }
    } else {
      return `${diffInDays} days ago`;
    }
  };
  useEffect(() => {
    setUpdateTimeAgo(calculateTimeAgo(lastUpdate));
  }, [lastUpdate]);
  useEffect(() => {
    // Function to calculate the time difference

    setTimeAgo(calculateTimeAgo(date));
  }, [date]);
  const handleRadioClick = () => {
    setIsRadioSelected((prev) => !prev); // Toggle the state
  };
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

  const handleIconClick = (
      icon: "pin" | "heart" | "check" | "threeDotsCircle" | "star",
      e: React.MouseEvent
  ) => {
    if (!isDetailsPage) {

      e.stopPropagation(); // Stop event propagation to prevent on click body
      setIconColors((prev) => ({
        ...prev,
        [icon]: !prev[icon],
      }));
      if (icon === "pin") {
        if (onPin) {
          onPin(id); // Call the onPin function when the pin icon is clicked

        }
      } else if (icon === "star") {
        if (onStarred) {
          onStarred(id);

        }
      } else if (icon === "threeDotsCircle") {
        e.stopPropagation(); // Stop event propagation to prevent on click body
        setIsActionsDropdownOpen((prev) => !prev); // Toggle dropdown state
      }
    }
  };
  const handleMenuClick = (icon: "menu", e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body
  };
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const handleAssignToClick = (icon: "assign", e: React.MouseEvent) => {
    if (!isDetailsPage) {
      e.stopPropagation();
      if (isCurrentUserMaster) {
        setIsAssigneeDropdownOpen((prev) => !prev);
      }
    }


  };

  const handleCardClick = () => {

    setIsCardFocused((prev) => !prev); // Toggle card focus
    setIsDescriptionUnderlined((prev) => !prev); // Toggle underline for description
    if (onClick) {
      onClick();
    }


    // Call onClick prop}
  };

  return (
      <div className="position-relative mt-4" style={{width: "100%"}}>
        {/* <button
        onClick={handleRadioClick}
        classNameName={`custom-button ${isRadioSelected ? "selected" : ""}`} // Add 'selected' className when selected
      >
        {isRadioSelected ? "✔" : ""}
      </button> */}

        <div
            className="card border mb-3 card-hover"
            style={{
              transition: "all 0.3s ease",
              position: "relative",
              borderWidth: isCardFocused ? "3px" : "1px", // Highlight border on focus
              boxShadow: isCardFocused ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Add shadow on focus
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderWidth = "3px";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderWidth = isCardFocused ? "3px" : "1px";
              e.currentTarget.style.boxShadow = isCardFocused
                  ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                  : "none";
            }}
            onClick={handleCardClick} // Add onClick event to toggle focus and underline
        >
          <div className="card-content">
            {/* Header Section */}

            <div className="row d-flex card-title-container row-bottom-margin">
              <div className="col-md-auto col-md-1 bdd">
                <div className="d-flex align-content-end id-text ">
                  <span className="text-muted id-text">{id}</span>
                </div>
                <div className=" d-flex id-badge align-self-start align-content-center">
                <span
                    className={`badgee text-uppercase text-white ${
                        status === "solved"
                            ? "badge-bg-solved"
                            : status === "closed"
                                ? "badge-bg-closed"
                                : status === "pending"
                                    ? "bg-warning"
                                    : status === "assigned"
                                        ? "badge-bg-assigned"
                                        : status === "new"
                                            ? "badge-bg-new"
                                            : status === "plan"
                                                ? "bg-info"
                                                : ""
                    }`}
                >
                  {status}
                </span>
                </div>
              </div>
              <div className="col-md-9">
                <div className="d-flex flex-column title-desc">
                  <div className="d-flex align-items-center title-date-container">
                    <h3 className="mt-0 mb-1 ml-2 pe-4">{title}</h3>
                    <p className="text-muted mb-0">created {timeAgo}</p>
                  </div>
                  <p
                      className={`text-muted mb-0 ${
                          isDescriptionUnderlined ? "text-decoration-underline" : ""
                      }`}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </div>
            <div className="row mt-3 card-footer-table row-upper-border">
              <div
                  className="col-md-1 d-flex  icon-container card-column-border-right "
                  onClick={(e) => handleMenuClick("menu", e)}
              >
                <div
                    className="text-center icon-cell "
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f3fb")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={(e) => handleIconClick("pin", e)}
                >
                  <div
                      className="d-flex justify-content-center align-items-center  "
                      style={{height: "100%"}}
                  >
                    <i
                        className={`bi ${
                            iconColors.pin ? "bi-pin-fill" : "bi-pin"
                        }`}
                        style={{
                          fontSize: "23px",
                          color: iconColors.pin ? "#ab58ff" : "inherit", // Use a custom color when active
                          transition: "color 0.3s ease",
                        }}
                    ></i>
                  </div>
                </div>
                <div
                    className="text-center  icon-cell"
                    onClick={(e) => handleIconClick("star", e)}
                >
                  <div
                      className="d-flex justify-content-center align-items-center"
                      style={{height: "100%"}}
                  >
                    <i
                        className={`bi ${
                            iconColors.star ? "bi-star-fill" : "bi-star"
                        }`}
                        style={{
                          fontSize: "23px",
                          color: iconColors.star ? "gold" : "inherit", // Use gold color for the filled star
                          transition: "color 0.3s ease",
                        }}
                    ></i>
                  </div>
                </div>
                <div
                    className="text-center icon-cell"
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f3fb")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={(e) => handleIconClick("threeDotsCircle", e)} // Call the handler to toggle color
                >
                  <div
                      className="d-flex justify-content-center align-items-center"
                      style={{height: "100%"}}
                  >
                    <i
                        className={`bi bi-three-dots`}
                        style={{
                          fontSize: "23px",
                          color: iconColors.threeDotsCircle ? "inherit" : "inherit", // Change color when clicked
                          transition: "color 0.3s ease",
                        }}
                    ></i>
                  </div>
                  {isActionsDropdownOpen && (
                      <CustomActionsDropdown
                          id={id}
                          urgency={urgency}
                          status={status}
                          priority={priority}
                          type={type}
                          setIsActionsDropdownOpen={setIsActionsDropdownOpen}
                      />
                  )}
                </div>
              </div>
              <div
                  className="col-md-auto col-md-2 d-flex align-items-start  ps-2 border-end other-info card-column-border-right position-relative"
                  onClick={(e) => handleAssignToClick("assign", e)}
              >
                {assignees.map((assignee, index) => (
                    <div
                        key={index}
                        className="d-flex align-items-center mb-2 align-self-center"
                        style={{
                          borderRight:
                              index !== assignees.length - 1
                                  ? "1px solid #ccc"
                                  : "none",
                          paddingRight: index !== assignees.length - 1 ? "10px" : "0",
                          paddingLeft: index !== 0 ? "10px" : "0",
                        }}
                    >
                      <img
                          src={assignee.avatar || detective}
                          alt="Assigned Profile"
                          className="rounded-circle me-2"
                          style={{width: "30px", height: "30px"}}
                      />
                      <div>
                        <small className="text-muted">assigned to</small>
                        <p className="mb-0">{assignee.name}</p>
                      </div>
                    </div>
                ))}
                {isAssigneeDropdownOpen && (
                    <CustomAssigneeDropDown
                        assignees={assignees}
                        ticketId={id}
                        setIsAssigneeDropdownOpen={setIsAssigneeDropdownOpen}
                    />
                )}
              </div>
              <div className="col-md-auto col-md-2 ps-2 border-end card-column-border-right">
                <small className="text-muted">priority</small>
                <p className="mb-0 text-danger">{priority}</p>
              </div>
              <div
                  className="col-md-auto col-md-2 d-flex align-items-start ps-2 border-end card-column-border-right card-column-border-right">
                <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center abbr"
                    style={{
                      width: "30px",
                      height: "30px",
                      padding: "10px",
                      top: "10px",
                    }}
                >
                  {raisedBy.initials}
                </div>
                <div className="ms-2 ps-2">
                  <small className="text-muted">raised by</small>
                  <p className="mb-0">{raisedBy.name}</p>
                </div>
              </div>
              <div
                  className="col-md-auto col-md-2 d-flex align-items-start ps-2 border-end card-column-border-right card-column-border-right">
                <div className="col-md-auto ps-2 border-end ">
                  <small className="text-muted">category</small>
                  <p className="mb-0">{type}</p>
                </div>
              </div>
              <div className="col-md-auto col-md-2 d-flex align-items-start ps-2 border-end ">
                <div className="col-md-auto ps-2 border-end ">
                  <small className="text-muted">last update</small>
                  <p className="mb-0">{updateTimeAgo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TicketCard;
