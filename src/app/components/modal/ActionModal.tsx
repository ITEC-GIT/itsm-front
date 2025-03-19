import { useEffect, useRef, useState } from "react";
import { Actions, getAvailableActions } from "../../data/assets";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  assetId: number;
}

type AllowedActionsType = {
  [key: string]: {
    key: string;
    labels: { name: string; icon: string }[];
  };
};

const CustomGridItem = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div
      className="custom-grid-item d-flex flex-column text-center p-3 h-100"
      style={{ backgroundColor: "#3c3d3e", borderRadius: "5px" }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <img src={`${icon}`} />
        <p className="mt-3 mb-0 text-dark">{text}</p>
      </div>
    </div>
  );
};

const ActionModal = ({ isOpen, onClose, category }: ActionModalProps) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [allowedActions, setAllowedActions] =
    useState<AllowedActionsType | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const data = getAvailableActions(category);
    setAllowedActions(data as AllowedActionsType);
  }, [category]);

  if (!allowedActions) {
    return null;
  }

  const hasOnlyMoreActions =
    Object.keys(allowedActions).length === 1 && allowedActions["More Actions"];

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        ref={modalRef}
      >
        <div
          className="modal-content overflow-auto none-scroll-width"
          style={{
            backgroundColor: "white",
            height: `calc(100vh - var(--bs-app-header-height) - var(--bs-app-header-height) )`,
          }}
        >
          <div className="modal-body p-0">
            <div className="container-fluid p-3">
              {hasOnlyMoreActions ? (
                <div>
                  <div className="d-flex justify-content-between text-center ps-1">
                    <p className="text-dark">{Actions["More Actions"].key}</p>

                    <i
                      className="bi bi-three-dots text-dark"
                      onClick={() => setShowMoreActions(!showMoreActions)}
                    ></i>
                  </div>

                  <div className="row g-1">
                    {allowedActions["More Actions"].labels.map(
                      (label, labelIndex) => (
                        <div
                          key={`${label}-${labelIndex}`}
                          className="col-6 col-md-4 col-lg-3"
                          style={{ height: "130px" }}
                        >
                          <CustomGridItem icon={label.icon} text={label.name} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {showMoreActions ? (
                    <div>
                      <div className="d-flex justify-content-between text-center ps-1">
                        <p className="text-dark">
                          {Actions["More Actions"].key}
                        </p>

                        <i
                          className="bi bi-three-dots text-dark"
                          onClick={() => setShowMoreActions(!showMoreActions)}
                        ></i>
                      </div>

                      <div className="row g-1">
                        {allowedActions["More Actions"].labels.map(
                          (label, labelIndex) => (
                            <div
                              key={`${label}-${labelIndex}`}
                              className="col-6 col-md-4 col-lg-3"
                              style={{ height: "130px" }}
                            >
                              <CustomGridItem
                                icon={label.icon}
                                text={label.name}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    Object.keys(allowedActions)
                      .filter((key) => key !== "More Actions")
                      .map((key, index) => (
                        <div key={index}>
                          {index === 0 ? (
                            <div className="d-flex justify-content-between text-center ps-1">
                              <p className="text-dark">{Actions[key].key}</p>

                              <i
                                className="bi bi-three-dots text-dark"
                                onClick={() =>
                                  setShowMoreActions(!showMoreActions)
                                }
                              ></i>
                            </div>
                          ) : (
                            <p className="text-dark">{Actions[key].key}</p>
                          )}

                          <div className="row g-1">
                            {Actions[key].labels.map((label, labelIndex) => (
                              <div
                                key={`${index}-${labelIndex}`}
                                className="col-6 col-md-4 col-lg-3"
                                style={{ height: "130px" }}
                              >
                                <CustomGridItem
                                  icon={label.icon}
                                  text={label.name}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ActionModal };
