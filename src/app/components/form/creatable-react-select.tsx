import React from "react";
import CreatableSelect from "react-select/creatable";

export interface GenericSelectOption {
  [key: string]: any;
}

interface CreatableSelectInputProps<T extends GenericSelectOption> {
  placeholder?: string;
  field: string;
  value: T | null;
  onChange: (field: string, value: T | null) => void;
  onCreateOption: (field: string, label: string) => T;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
  classNamePrefix?: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    height: 42,
    minHeight: 42,
    border: "1px solid var(--bs-gray-300)",
    borderRadius: "0.375rem",
    color: "var(--bs-gray-700) !important",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#4B5675",
    fontSize: "1rem",
    opacity: 0.5,
    fontWeight: 500,
    lineHeight: 1.5,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: 200,
    overflowY: "auto",
    zIndex: 9999999,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#4B5675",
    fontSize: "1rem",
    opacity: 1,
    fontWeight: 500,
    lineHeight: 1.5,
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#4B5675",
    fontSize: "1rem",
    opacity: 1,
    fontWeight: 500,
    lineHeight: 1.5,
  }),
};

const CreatableSelectInput = <T extends GenericSelectOption>({
  placeholder = "Select or create...",
  field,
  value,
  onChange,
  onCreateOption,
  options,
  getOptionLabel,
  getOptionValue,
  classNamePrefix = "select",
}: CreatableSelectInputProps<T>) => {
  const mappedOptions = options.map((opt) => ({
    label: getOptionLabel(opt),
    value: getOptionValue(opt),
  }));

  const currentValue =
    value && getOptionLabel(value)?.trim() !== ""
      ? {
          label: getOptionLabel(value),
          value: getOptionValue(value),
        }
      : null;

  return (
    <div>
      <CreatableSelect
        classNamePrefix={classNamePrefix}
        isClearable
        placeholder={placeholder}
        value={currentValue}
        options={mappedOptions}
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.value.toString()}
        onChange={(selected) => {
          if (!selected) {
            onChange(field, null);
            return;
          }

          let mappedValue = options.find(
            (opt) =>
              getOptionValue(opt).toString() === selected.value.toString()
          );

          if (!mappedValue && onCreateOption) {
            const newOption = onCreateOption(field, selected.label);
            onChange(field, newOption);
            return;
          }

          onChange(field, mappedValue ?? null);
        }}
        onCreateOption={(inputValue) => {
          if (onCreateOption) {
            const newOption = onCreateOption(field, inputValue);
            onChange(field, newOption);
          }
        }}
        styles={customStyles}
      />
    </div>
  );
};

export { CreatableSelectInput };

//  styles={{
//           control: (base, state) => ({
//             ...base,
//             height: 42,
//             minHeight: 42,
//             border: "1px solid var(--bs-gray-300)",
//             borderRadius: "0.375rem",
//             // fontSize: "1rem",
//             // fontWeight: 500,
//             // lineHeight: 1.5,
//             color: "var(--bs-gray-700) !important",
//           }),
//           placeholder: (base) => ({
//             ...base,
//             color: "#6c757d !important",
//           }),
//           menuList: (base) => ({
//             ...base,
//             maxHeight: 200,
//             overflowY: "auto",
//             zIndex: 9999999,
//           }),
//           singleValue: (base) => ({
//             ...base,
//             color: "#212529",
//           }),
//           input: (base) => ({
//             ...base,
//             color: "var(--bs-gray-700)",
//           }),
//         }}
