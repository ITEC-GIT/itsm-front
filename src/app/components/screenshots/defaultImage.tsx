import React from "react";
import styled, { keyframes } from "styled-components";

const slide = keyframes`
  0%, 100% {
    bottom: -35px;
  }
  25%, 75% {
    bottom: -2px;
  }
  20%, 80% {
    bottom: 2px;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(-15deg);
  }
  25%, 75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(25deg);
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fff;

  .default-image-loader {
    width: 120px;
    height: 100px;
    position: relative;
    background: #f4f4f4;
    border-radius: 4px;
    overflow: hidden;
  }

  .default-image-loader::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    transform: rotate(45deg) translate(30%, 40%);
    background: #2e86de;
    box-shadow: 32px -34px 0 5px #0097e6;
    animation: ${slide} 2s infinite ease-in-out alternate;
  }

  .default-image-loader::after {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0097e6;
    transform: rotate(0deg);
    transform-origin: 35px 145px;
    animation: ${rotate} 2s infinite ease-in-out;
  }

  .default-image-loader-note {
    font-size: 0.875rem;
    color: #6c757d;
    opacity: 0.8;
    text-align: center;
  }
`;

const DefaultImage = ({ text }: { text: string }) => (
  <StyledWrapper>
    <div className="default-image-loader" />
    <small className="default-image-loader-note">{text}</small>
  </StyledWrapper>
);

export { DefaultImage };
