import React from "react";
import Select from "react-select";
import { OptionsType } from "../../types/common";

interface CustomReactSelectProps {
  options: OptionsType[];
  value: OptionsType | OptionsType[] | null;
  onChange: (selected: any) => void;
  placeholder?: string;
  isMulti?: boolean;
}

const CustomReactSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = false,
}: CustomReactSelectProps) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isMulti={isMulti}
      isClearable
      classNamePrefix="select"
      styles={{
        menuList: (base) => ({
          ...base,
          maxHeight: 200,
          overflowY: "auto",
        }),
      }}
    />
  );
};

export { CustomReactSelect };
