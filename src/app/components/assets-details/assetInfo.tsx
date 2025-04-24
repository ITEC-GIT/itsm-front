import { MdComputer } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { assignIcon } from "../../data/assets";
import { useState } from "react";
import { ActionModal } from "../modal/ActionModal";
import { capitalize } from "../../../utils/custom";

const AssetInfoComponent = ({ assetData }: { assetData: any }) => {
  if (!assetData) return;
  const [showActionModal, setShowActionModal] = useState(false);
  const icon = assignIcon(assetData.category.name);

  return (
    <div className="row d-flex flex-column flex-md-row justify-content-between mb-4">
      <div className="col-12 col-md-6 d-flex gap-2">
        <div>
          <span className="d-flex me-2 type-icon">{icon}</span>
        </div>

        <div className="d-flex flex-column w-100">
          <div className="d-flex  align-items-center gap-5">
            <h3 className="mb-0">{assetData.name}</h3>
            <span className="badge bg-success text-white fs-6 px-3 py-2">
              Active
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 mt-2">
            <div>
              <MdComputer className="location-icon" />
              <span className="location-text">{assetData.computer.name}</span>
            </div>
            <div>
              <TbCategory className="location-icon" />
              <span className="location-text">
                {capitalize(assetData.category.name)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 d-flex flex-wrap justify-content-md-end mt-3 mt-md-0 p-0">
        <button
          className="btn custom-btn me-2 mb-2"
          onClick={() => setShowActionModal(!showActionModal)}
        >
          <i className="bi bi-gear"></i> Actions
        </button>
      </div>
      {showActionModal && (
        <ActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          category={assetData.category.name.toLowerCase()}
          assetId={assetData.id}
        />
      )}
    </div>
  );
};

export { AssetInfoComponent };
