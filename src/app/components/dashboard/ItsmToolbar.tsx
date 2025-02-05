import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import Select from "react-select";

const ItsmToolbar = () => {
  const { classes } = useLayout();
  return (
    <div
      id="kt_app_toolbar_container"
      className={clsx("app-container ", classes.toolbarContainer.join(" "))}
    >
      <div className="d-flex">
        <Select />

        <div className="search-input-wrapper">
          <input
            type="text"
            id="search-input"
            className="form-control search-input"
            placeholder="Search..."
            // onChange={handleSearchChange}
          />
        </div>
      </div>
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
