import React from "react";
import Select, { components } from "react-select";
import { OptionsType } from "../../types/common";

interface CustomReactSelectProps {
  options: OptionsType[];
  value: OptionsType | OptionsType[] | null;
  onChange: (selected: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
}
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: 42,
    overflowY: "auto",
    flexWrap: "wrap",
    border: "1px solid var(--bs-gray-300)",
    borderRadius: "0.375rem",
    color: "var(--bs-gray-700)",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "var(--bs-gray-300)",
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    maxHeight: 42,
    overflowY: "auto",
    padding: "2px 8px",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 99999,
    position: "absolute",
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: 150,
    overflowY: "auto",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#4B5675",
    fontSize: "1rem",
    opacity: 0.5,
    fontWeight: 500,
    lineHeight: 1.5,
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

const CustomInput = (props: any) => (
  <components.Input
    {...props}
    innerRef={props.innerRef}
    // inputProps={{ autoComplete: "off" }}
  />
);
const CustomReactSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = false,
  isClearable = true,
  isDisabled = false,
}: CustomReactSelectProps) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isMulti={isMulti}
      isClearable={isClearable}
      styles={customStyles}
      components={{ Input: CustomInput }}
      isDisabled={isDisabled}
    />
  );
};

export { CustomReactSelect };
