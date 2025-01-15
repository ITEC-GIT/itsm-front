import React, { useState, useEffect } from "react";
import { styleText } from "util";
import "../../../assets/sass/custom/ticketcard.scss"; // Ensure the CSS is imported
import CustomAssigneeDropDown from "./CustomAssigneDropdown";
interface CardProps {
  id: string;
  status: "SOLVED" | "CANCELED" | "PENDING";
  title: string;
  description: string;
  date: string; // New prop for the date
  assignedTo: {
    avatar: string;
    name: string;
  };
  priority: string;
  raisedBy: {
    initials: string;
    name: string;
  };
  category: string;
  lastUpdate: string;
  onClick: () => void;
  onPin: (id: string) => void; // New prop for pinning
  isPinned: boolean;
  isStarred: boolean;
  onStarred: (id: string) => void;
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
  category,
  lastUpdate,
  onClick,
  onPin,
  isPinned,
  isStarred,
  onStarred,
}) => {
  const [isRadioSelected, setIsRadioSelected] = useState(false);
  const [iconColors, setIconColors] = useState({
    pin: isPinned,
    heart: false,
    check: false,
    threeDotsCircle: false,
    star: isStarred,
  });
  const [isCardFocused, setIsCardFocused] = useState(false);  // Track focus state
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
  const handleIconClick = (icon: "pin" | "heart" | "check" | "threeDotsCircle" | "star", e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body 
    setIconColors((prev) => ({
      ...prev,
      [icon]: !prev[icon],
    }));
    if (icon === "pin") {
      onPin(id); // Call the onPin function when the pin icon is clicked
    }
    else if (icon === "star") {
      onStarred(id);
    }
  };
  const handleMenuClick = (icon: "menu", e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body 
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAssignToClick = (icon: "assign", e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent on click body 
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown state

  };

  const handleCardClick = () => {
    setIsCardFocused((prev) => !prev); // Toggle card focus
    setIsDescriptionUnderlined((prev) => !prev); // Toggle underline for description
    onClick(); // Call onClick prop
  };

  return (
    <div className="position-relative mt-4" style={{ width: "100%" }}>
      {/* <button
        onClick={handleRadioClick}
        className={`custom-button ${isRadioSelected ? "selected" : ""}`} // Add 'selected' class when selected
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
          e.currentTarget.style.boxShadow = isCardFocused ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none";
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
                  className={`badgee text-uppercase text-white ${status === "SOLVED"
                    ? "badge-bg-solved"
                    : status === "CANCELED"
                      ? "badge-bg-closed"
                      : status === "PENDING"
                        ? "bg-warning"
                        : status === "ASSIGNED"
                          ? "badge-bg-assigned"
                          : status === "NEW"
                            ? "badge-bg-new"
                            : status === "PLAN"
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
                  className={`text-muted mb-0 ${isDescriptionUnderlined ? "text-decoration-underline" : ""}`}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>
          <div className="row mt-3 card-footer-table row-upper-border">
            <div className="col-md-1 d-flex  icon-container card-column-border-right " onClick={(e) => handleMenuClick("menu", e)}            >
              <div
                className="text-center icon-cell "
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f3fb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={(e) => handleIconClick("pin", e)}
              >
                <div className="d-flex justify-content-center align-items-center  " style={{ height: "100%" }}>
                  <i
                    className={`bi ${iconColors.pin ? "bi-pin-fill" : "bi-pin"}`}
                    style={{
                      fontSize: "23px",
                      color: iconColors.pin ? "#ab58ff" : "inherit", // Use a custom color when active
                      transition: "color 0.3s ease",
                    }}
                  ></i>
                </div>
              </div>
              <div
                className="text-center border-end icon-cell"
                onClick={(e) => handleIconClick("star", e)}
              >
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                  <i
                    className={`bi ${iconColors.star ? "bi-star-fill" : "bi-star"}`}
                    style={{
                      fontSize: "23px",
                      color: iconColors.star ? "gold" : "inherit", // Use gold color for the filled star
                      transition: "color 0.3s ease",
                    }}
                  ></i>
                </div>
              </div>
              <div
                className="text-center border-end icon-cell"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f3fb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={(e) => handleIconClick("threeDotsCircle", e)} // Call the handler to toggle color
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <i
                    className={`bi bi-three-dots`}
                    style={{
                      fontSize: "23px",
                      color: iconColors.threeDotsCircle ? "blue" : "inherit", // Change color when clicked
                      transition: "color 0.3s ease",
                    }}
                  ></i>
                </div>
              </div>
            </div>
            <div
              className="col-md-auto col-md-2 d-flex align-items-center ps-2 border-end other-info card-column-border-right position-relative" // Add position-relative
              onClick={(e) => handleAssignToClick("assign", e)}
            >
              <img
                src={assignedTo.avatar}
                alt="Assigned Profile"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <div>
                <small className="text-muted">assigned to</small>
                <p className="mb-0">{assignedTo.name}</p>
              </div>
              {isDropdownOpen && <CustomAssigneeDropDown />}

            </div>
            <div className="col-md-auto col-md-2 ps-2 border-end card-column-border-right">
              <small className="text-muted">priority</small>
              <p className="mb-0 text-danger">{priority}</p>
            </div>
            <div className="col-md-auto col-md-2 d-flex align-items-start ps-2 border-end card-column-border-right card-column-border-right">
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center abbr"
                style={{
                  width: "30px",
                  height: "30px",
                  padding: "10px",
                  top: "10px"
                }}
              >
                {raisedBy.initials}
              </div>
              <div className="ms-2 ps-2">
                <small className="text-muted">raised by</small>
                <p className="mb-0">{raisedBy.name}</p>
              </div>
            </div>
            <div className="col-md-auto col-md-2 d-flex align-items-start ps-2 border-end card-column-border-right card-column-border-right">

              <div className="col-md-auto ps-2 border-end ">
                <small className="text-muted">category</small>
                <p className="mb-0">{category}</p>
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
