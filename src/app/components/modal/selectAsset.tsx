import { useState, useEffect } from "react";
import { devicesVNC } from "../../data/hyperCommands";
import { SelectDeviceType } from "../../types/devicesTypes";

interface props {
  setSelectedDevice: any;
  closeModal: any;
}

const SelectAssetsModal = ({ setSelectedDevice, closeModal }: props) => {
  //temporary until api call
  const [data, setData] = useState<any[]>(devicesVNC.slice(0, 10));
  const [allDevices, setAllDevices] = useState<any[]>(devicesVNC);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreDevices = () => {
    if (data.length >= allDevices.length) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextDevices = allDevices.slice(data.length, data.length + 10);
      setData((prevData) => [...prevData, ...nextDevices]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const modalContent = document.querySelector(".modal-body");
      if (
        modalContent &&
        modalContent.scrollTop + modalContent.clientHeight >=
          modalContent.scrollHeight - 10 &&
        !isLoading
      ) {
        loadMoreDevices();
      }
    };

    const modalBody = document.querySelector(".modal-body");
    modalBody?.addEventListener("scroll", handleScroll);

    return () => modalBody?.removeEventListener("scroll", handleScroll);
  }, [isLoading, data]);

  const handleSelectDevice = (device: SelectDeviceType) => {
    setSelectedDevice(device);
    closeModal();
  };

  return (
    <div className="modal show d-block tabIndex={-1}">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Select a Computer to Start the Remote Console Session
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <ul className="list-group">
              {data.map((device) => (
                <li
                  key={device.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{device.name}</strong> - {device.hostname}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectDevice(device)}
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>

            {isLoading && (
              <div className="mt-3">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SelectAssetsModal };
