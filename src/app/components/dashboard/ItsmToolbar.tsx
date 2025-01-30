import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import Select from "react-select";

import "./customStyles.css";

const ItsmToolbar = ({
  branches,
  users,
  setSelectedBranch,
  setSelectedUser,
  setSearchString,
}: {
  branches: any;
  users: any;
  setSelectedBranch: any;
  setSelectedUser: any;
  setSearchString: any;
}) => {
  const { classes } = useLayout();

  const formattedBranches = branches.map(
    (branch: { id: number; name: string }) => ({
      label: branch.name,
      value: branch.id,
    })
  );

  // const formattedUsers = users.map((user: { id: number; name: string }) => ({
  //   label: user.name,
  //   value: user.id,
  // }));
  const formattedUsers: { label: string; value: number }[] = []
  const handleSelectChange = (selectedOption: any, label: string) => {
    if (label === "Branch") {
      setSelectedBranch(selectedOption.value);
    } else if (label === "User") {
      setSelectedUser(selectedOption.value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div
      id="kt_app_toolbar_container"
      className={clsx("app-container ", classes.toolbarContainer.join(" "))}
    >
      <div className="row justify-content-end">
        {[
          { label: "User", options: formattedUsers, icon: "bi-person" },
          { label: "Branch", options: formattedBranches, icon: "bi-diagram-3" },
        ].map(({ label, options, icon }, index) => (
          <div key={label} className="col-sm-4 col-md-4 col-lg-4 col-xl-3 mb-3">
            <div className="filter-card">
              <div className="filter-card-header">
                <i className={`bi ${icon} filter-icon`}></i>
                <span className="filter-label">{label}</span>
              </div>
              <Select
                options={options}
                className="custom-select"
                placeholder={`Select ${label}`}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, label)
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    "&:hover": { borderColor: "#4CAF50" },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                menuPortalTarget={document.body}
              />
            </div>
          </div>
        ))}

        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
          <div className="filter-card">
            <div className="filter-card-header">
              <i className="bi bi-search filter-icon"></i>
              <span className="filter-label">Search</span>
            </div>
            <div className="search-input-wrapper">
              <input
                type="text"
                id="search-input"
                className="form-control search-input"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .filter-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .filter-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .filter-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .filter-icon {
          font-size: 20px;
          color: #4CAF50;
          margin-right: 8px;
        }
        .filter-label {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .search-input-wrapper {
          position: relative;
        }
        .search-input {
          height: 40px;
          border-radius: 6px;
          border: 1px solid #ccc;
          padding-left: 36px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
          outline: none;
        }
        .search-input-wrapper .filter-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 18px;
          color: #999;
        }
        .custom-select__control {
          height: 40px !important;
        }
      `}</style>
    </div>
  );
};

export default ItsmToolbar;

// const ItsmToolbar = ({
//   branches,
//   users,
//   setSelectedBranch,
//   setSelectedUser,
//   setSearchString,
// }: {
//   branches: any;
//   users: any;
//   setSelectedBranch: any;
//   setSelectedUser: any;
//   setSearchString: any;
// }) => {
//   const { classes } = useLayout();

//   const formattedBranches = branches.map(
//     (branch: { id: number; name: string }) => ({
//       label: branch.name,
//       value: branch.id,
//     })
//   );

//   const formattedUsers = users.map((user: { id: number; name: string }) => ({
//     label: user.name,
//     value: user.id,
//   }));

//   const handleSelectChange = (selectedOption: any, label: string) => {
//     if (label === "Branch") {
//       setSelectedBranch(selectedOption.value);
//     } else if (label === "User") {
//       setSelectedUser(selectedOption.value);
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchString(e.target.value);
//   };

//   return (
//     <div
//       id="kt_app_toolbar_container"
//       className={clsx("app-container", classes.toolbarContainer.join(" "))}
//     >
//       <div className="row justify-content-end">
//         {[
//           { label: "Branch", options: formattedBranches },
//           { label: "User", options: formattedUsers },
//         ].map(({ label, options }, index) => (
//           <div key={label} className="col-md-3 mb-3">
//             <div>
//               <Select
//                 options={options}
//                 className="custom-select"
//                 placeholder={`Select ${label}`}
//                 onChange={(selectedOption) =>
//                   handleSelectChange(selectedOption, label)
//                 }
//               />
//             </div>
//           </div>
//         ))}

//         <div className="col-md-3">
//           <div>
//             <input
//               type="text"
//               id="search-input"
//               className="form-control"
//               placeholder="Search..."
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItsmToolbar;
