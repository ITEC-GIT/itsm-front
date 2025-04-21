import React, { useState } from "react";
import styled from "styled-components";

interface CustomSwitchProps {
  setStatus: (value: boolean) => void;
}

const CustomSwitch = ({ setStatus }: CustomSwitchProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setIsChecked(value);
    console.log("Switch is:", value ? "Active" : "Inactive");
    setStatus(value ? true : false);
  };

  return (
    <StyledWrapper>
      <input
        type="checkbox"
        className="theme-checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .theme-checkbox {
    --toggle-size: 12px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 6.25em;
    height: 3.125em;
    background: -webkit-gradient(
        linear,
        left top,
        right top,
        color-stop(50%, #efefef),
        color-stop(50%, #064884)
      )
      no-repeat;
    background: -o-linear-gradient(left, #efefef 50%, #064884 50%) no-repeat;
    background: linear-gradient(to right, #efefef 50%, #064884 50%) no-repeat;
    background-size: 205%;
    background-position: 0;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
    border-radius: 99em;
    position: relative;
    cursor: pointer;
    font-size: var(--toggle-size);
  }

  .theme-checkbox::before {
    content: "";
    width: 2.25em;
    height: 2.25em;
    position: absolute;
    top: 0.438em;
    left: 0.438em;
    background: -webkit-gradient(
        linear,
        left top,
        right top,
        color-stop(50%, #efefef),
        color-stop(50%, #064884)
      )
      no-repeat;
    background: -o-linear-gradient(left, #efefef 50%, #064884 50%) no-repeat;
    background: linear-gradient(to right, #efefef 50%, #064884 50%) no-repeat;
    background-size: 205%;
    background-position: 100%;
    border-radius: 50%;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
  }

  .theme-checkbox:checked::before {
    left: calc(100% - 2.25em - 0.438em);
    background-position: 0;
  }

  .theme-checkbox:checked {
    background-position: 100%;
  }
`;

export { CustomSwitch };
