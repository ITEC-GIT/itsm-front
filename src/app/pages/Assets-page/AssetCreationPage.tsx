// import React, { useState } from "react";
// import Select from "react-select";
// import { AssetCategoryFields } from "../../data/assets";

// const AssetCreationPage = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [fieldValues, setFieldValues] = useState({});

//   const categories = [
//     { value: "computer", label: "Computer" },
//     { value: "mouse", label: "Mouse" },
//     { value: "printer", label: "Printer" },
//   ];

//   const handleCategoryChange = (selectedOption: string) => {
//     setSelectedCategory(selectedOption);
//     setFieldValues({}); // Reset field values when category changes.
//   };

//   const handleFieldChange = (id: number, value: string) => {
//     setFieldValues({ ...fieldValues, [id]: value });
//   };

//   const renderFields = () => {
//     if (!selectedCategory || !AssetCategoryFields[selectedCategory.value]) {
//       return null;
//     }

//     return AssetCategoryFields[selectedCategory.value].map((field) => (
//       <div key={field.id} className="col-md-3 col-lg-4 mb-5">
//         <label className="form-label d-flex align-items-center">
//           {field.label}
//         </label>
//         {field.type === "text" && (
//           <input
//             type="text"
//             className="form-control custom-bottom-border"
//             placeholder={field.label}
//             value={fieldValues[field.id] || ""}
//             onChange={(e) => handleFieldChange(field.id, e.target.value)}
//           />
//         )}
//         {field.type === "select" && (
//           <Select
//             options={field.options}
//             value={fieldValues[field.id]}
//             onChange={(selectedOption) =>
//               handleFieldChange(field.id, selectedOption)
//             }
//             isClearable
//           />
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="container-fluid p-5">

//       <div className="card p-5">
//         <div className="row mb-5">
//           <input
//             type="text"
//             className="form-control custom-bottom-border"
//             placeholder="Enter name"
//           />
//         </div>
//         <div className="row mt-3 row-add-asset-form">
//           <div className="col-md-3 col-lg-4 mb-5">
//             <label className="form-label d-flex align-items-center">
//               Category
//             </label>
//             <Select
//               options={categories}
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//             />
//           </div>
//         </div>

//         <div className="row mt-5 row-add-asset-form">{renderFields()}</div>

//         {selectedCategory && (
//           <div className="row mt-5 mb-5 ">
//             <textarea
//               className="form-control custom-bottom-border"
//               placeholder="Comments"
//               rows={3}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssetCreationPage;
