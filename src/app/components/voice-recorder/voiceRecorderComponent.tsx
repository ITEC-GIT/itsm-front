import React from "react";
import styled from "styled-components";

type VoiceCardProps = {
  audioUrl: string;
};

const VoiceCardComponent = ({ audioUrl }: VoiceCardProps) => {
  return (
    <StyledWrapper>
      <div className="voice-chat-card">
        {/* <div className="voice-chat-card-header">
          <img className="avatar" />
          <div className="username">User name</div>
          <div className="status" />
        </div> */}
        <div className="voice-chat-card-body">
          <div className="audio-container">
            <audio controls>
              <source type="audio/mp3" src={audioUrl} />
            </audio>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .voice-chat-card {
    width: 100%;
    max-width: 300px;
    margin: 20px auto;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 2px 2px 10px #ccc;
    padding: 10px;
    background-color: #e8e8e8;
  }

  .voice-chat-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    color: black;
    background-color: #333;
  }

  .username {
    margin: 0;
    font-size: 18px;
    color: black;
  }

  .status {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    margin-left: 10px;
  }

  .voice-chat-card-body {
    padding: 10px;
  }

  .status-text {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .audio-container {
    display: flex;
    align-items: center;
  }

  audio {
    width: 100%;
  }
`;

export { VoiceCardComponent };
