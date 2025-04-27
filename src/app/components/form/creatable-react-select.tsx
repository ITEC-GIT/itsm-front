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

  const currentValue = value
    ? {
        label: (value as any).name || getOptionLabel(value),
        value: (value as any).id || getOptionValue(value),
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
          onChange(field, {
            id: selected.value,
            name: selected.label,
          } as any);
        }}
        onCreateOption={async (inputValue) => {
          if (onCreateOption) {
            const createdOption = await onCreateOption(field, inputValue);
            if (createdOption) {
              // 1. Update the real form value
              onChange(field, createdOption);

              // 2. Append manually to mappedOptions
              mappedOptions.push({
                label: createdOption.name,
                value: createdOption.id,
              });
            }
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
