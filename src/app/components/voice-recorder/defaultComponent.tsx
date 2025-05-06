import React from "react";
import styled from "styled-components";

const DeafultComponent = ({ text }: { text: string }) => {
  return (
    <StyledWrapper>
      <div className="loading-wave">
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
      </div>
      <small>{text}</small>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .loading-wave {
    width: 100%;
    max-width: 300px;
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 1rem;
  }

  .loading-bar {
    width: 1.5rem;
    height: 10vh;
    margin: 0 0.5rem;
    background-color: #3498db;
    border-radius: 0.3rem;
    animation: loading-wave-animation 1.2s ease-in-out infinite;
  }

  .loading-bar:nth-child(2) {
    animation-delay: 0.1s;
  }

  .loading-bar:nth-child(3) {
    animation-delay: 0.2s;
  }

  .loading-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  .loading-bar:nth-child(5) {
    animation-delay: 0.4s;
  }

  .loading-bar:nth-child(6) {
    animation-delay: 0.5s;
  }

  @keyframes loading-wave-animation {
    0% {
      height: 12vh;
    }
    50% {
      height: 8vh;
    }
    100% {
      height: 12vh;
    }
  }

  small {
    font-size: 1rem;
    color: #6c757d;
    padding: 0 1rem;
  }
`;

export { DeafultComponent };
