import React from "react";
import styled, { keyframes } from "styled-components";
import { FaPlay } from "react-icons/fa";

const DeafultVoiceCardComponent = ({ text }: { text: string }) => {
  return (
    <StyledWrapper>
      <div className="fake-audio-player">
        <div className="play-icon">
          <FaPlay size={12} color="white" />
        </div>
        <div className="progress-bar">
          <div className="progress-filled" />
        </div>
      </div>
      <small>{text}</small>
    </StyledWrapper>
  );
};

const animateProgress = keyframes`
  0% { width: 0%; }
  80% { width: 100%; }
  100% { width: 0%; }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fff;


  .fake-audio-player {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 350px;
    height: 64px;
  }

  .play-icon {
    background-color: #2196f3;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background-color: #ddd;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-filled {
    height: 100%;
    background-color: #2196f3;
    animation: ${animateProgress} 2s ease-in-out infinite;
  }

  small {
    font-size: 0.875rem;
    color: #6c757d;
    opacity: 0.8;
    text-align: center;
  }
`;

export { DeafultVoiceCardComponent };
