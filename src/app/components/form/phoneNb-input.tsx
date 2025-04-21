import React, { useState } from "react";
import Select from "react-select";

const countries = [
  {
    code: "ao",
    phone: "+244",
    countryName: "Angola",
  },
  // { code: "lb", phone: "+961", countryName: "Lebanon" },
];

interface PhoneNumberInputProps {
  phoneNb: string | null;
  onChange: (field: string, value: string) => void;
  field: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    width: 140,
    height: 42,
    minHeight: 42,
    border: "1px solid var(--bs-gray-300)",
    borderRadius: "0.475rem",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    paddingLeft: 4,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#4B5675",
    fontSize: "1.1rem",
    opacity: 0.5,
    fontWeight: 500,
    lineHeight: 1.5,
  }),
};

const PhoneNumberInput = ({
  phoneNb,
  onChange,
  field,
}: PhoneNumberInputProps) => {
  const options = countries.map((country) => ({
    value: country.code,
    label: (
      <div className="d-flex align-items-center gap-2">
        <img
          loading="lazy"
          width={20}
          height={14}
          src={`/media/flags/${country.code}.png`}
          alt={`Flag of ${country.countryName}`}
        />
        <span style={{ fontSize: "1rem" }}>
          {country.code.toUpperCase()} ({country.phone})
        </span>
      </div>
    ),
    country,
  }));

  return (
    <div className="mb-3">
      <div className="input-group custom-input-height">
        <div className="custom-input-height p-0 ">
          <Select
            options={options}
            defaultValue={options.find((opt) => opt.value === "ao")}
            styles={customStyles}
            className="react-select-container border-0"
            isSearchable={false}
            components={{
              IndicatorSeparator: () => null,
            }}
          />
        </div>
        <input
          type="tel"
          className="form-control custom-placeholder custom-input-height border-left-0"
          placeholder="Enter phone number"
          value={phoneNb ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
        />
      </div>
    </div>
  );
};

export { PhoneNumberInput };
