import { useState } from "react";
import { AppButtons } from "../../types/assetsTypes";
import { Sidebar } from "./assetSidebar";

const AssetAppsComponent = () => {
  const [selectedButton, setSelectedButton] = useState<number>(1);
  let renderComponent = <></>;
//   swicth
  return (
    <div className="row app-row p-2">
      <div className="col-2 bg-light border-end p-3">
        <Sidebar
          buttons={AppButtons}
          selectedId={selectedButton}
          onButtonClick={setSelectedButton}
        />
      </div>

      <div className="col-8 p-4">
        <h4>File Explorer</h4>
        <div className="d-flex flex-column align-items-center justify-content-center h-75">
          <img
            src="https://via.placeholder.com/200"
            alt="Agent Unreachable"
            className="mb-3"
            style={{ maxWidth: "200px" }}
          />
          <p className="text-muted">
            The agent is not reachable right now. Please try again once the
            agent is online.
          </p>
        </div>
      </div>
    </div>
  );
};

export { AssetAppsComponent };
