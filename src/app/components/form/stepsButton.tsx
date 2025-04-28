import React from "react";
import styled from "styled-components";

const BackButton = ({ onClick }: { onClick: any }) => {
  return (
    <BackStyledWrapper>
      <button className="text-dark" onClick={onClick}>
        <svg
          height={16}
          width={16}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1024 1024"
        >
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" />
        </svg>
        <span>Back</span>
      </button>
    </BackStyledWrapper>
  );
};

const BackStyledWrapper = styled.div`
  button {
    display: flex;
    height: 3em;
    width: 100px;
    align-items: center;
    justify-content: center;
    background-color: #eeeeee4b;
    border-radius: 3px;
    letter-spacing: 1px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: none;
    background: #fff;
  }

  button > svg {
    margin-right: 5px;
    margin-left: 5px;
    font-size: 20px;
    transition: all 0.4s ease-in;
  }

  button:hover > svg {
    font-size: 1.2em;
    transform: translateX(-5px);
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const NextButton = ({ onClick }: { onClick: any }) => {
  return (
    <NextStyledWrapper>
      <button onClick={onClick} className="bg-dark-blue-btn text-white">
        <span>Next</span>
        <svg
          height={16}
          width={16}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="white"
            d="M149.309584 528.47523c0-11.2973 9.168824-20.466124 20.466124-20.466124h604.773963l-188.083679-188.083679c-7.992021-7.992021-7.992021-20.947078 0-28.939099 4.001127-3.990894 9.240455-5.996574 14.46955-5.996574s10.478655 1.995447 14.479783 5.996574l223.00912 223.00912c3.837398 3.837398 5.996574 9.046027 5.996574 14.46955 0 5.433756-2.159176 10.632151-5.996574 14.46955l-223.019353 223.029586c-7.992021 7.992021-20.957311 7.992021-28.949332 0-7.992021-8.002254-7.992021-20.957311 0-28.949332l188.073446-188.073446H169.775708c-11.2973 0-20.466124-9.158591-20.466124-20.466124z"
          />
        </svg>
      </button>
    </NextStyledWrapper>
  );
};

const NextStyledWrapper = styled.div`
  button {
    display: flex;
    height: 3em;
    width: 100px;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    letter-spacing: 1px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: none;
  }

  button > svg {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 20px;
    color: white;
  }

  button:hover > svg {
    font-size: 1.2em;
    transform: translateX(5px);
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

const SaveButton = ({ onClick }: { onClick: any }) => {
  return (
    <SaveStyledWrapper>
      <button
        onClick={onClick}
        className="bg-dark-blue-btn text-white bg-success"
      >
        <span>Save</span>
      </button>
    </SaveStyledWrapper>
  );
};

const ConnectButton = ({ onClick }: { onClick: any }) => {
  return (
    <SaveStyledWrapper>
      <button
        onClick={onClick}
        className="bg-dark-blue-btn text-white bg-primary"
      >
        <span>Connect</span>
      </button>
    </SaveStyledWrapper>
  );
};

const DisconnectButton = ({ onClick }: { onClick: any }) => {
  return (
    <SaveStyledWrapper>
      <button
        onClick={onClick}
        className="bg-dark-blue-btn text-white bg-danger"
      >
        <span>Disconenct</span>
      </button>
    </SaveStyledWrapper>
  );
};

const OkButton = ({ onClick }: { onClick: any }) => {
  return (
    <SaveStyledWrapper>
      <button
        onClick={onClick}
        className="bg-dark-blue-btn text-white bg-primary"
      >
        <span>Ok</span>
      </button>
    </SaveStyledWrapper>
  );
};

const SaveStyledWrapper = styled.div`
  button {
    display: flex;
    height: 3em;
    width: 100px;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    letter-spacing: 1px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: none;
  }

  button:hover {
    transform: translateY(-2px);
  }
`;

export {
  BackButton,
  OkButton,
  NextButton,
  SaveButton,
  ConnectButton,
  DisconnectButton,
};
