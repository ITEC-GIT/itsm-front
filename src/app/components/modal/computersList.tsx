import { useState, useEffect, useMemo, useRef } from "react";
import { devicesVNC } from "../../data/hyperCommands";
import { SelectDeviceType } from "../../types/devicesTypes";
import { useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { SearchComponent } from "../../components/form/search";
import { debounce } from "lodash";

interface props {
  isOpen: boolean;
  setSelectedDevice: any;
  closeModal: any;
}

const ComputersListModal = ({
  isOpen,
  setSelectedDevice,
  closeModal,
}: props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const computersAtom = staticData["computers" as keyof typeof staticData];

  const allDevices = useMemo(() => {
    return Array.isArray(computersAtom) && computersAtom.length > 0
      ? computersAtom.map((item: any) => ({
          value: "id" in item ? item.id?.toString() : "",
          label:
            "label" in item
              ? item.label.toLowerCase()
              : item.name?.toLowerCase() ?? "",
          id: item.id,
          name: item.name || item.label,
        }))
      : [];
  }, [computersAtom]);

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleSelectDevice = (device: SelectDeviceType) => {
    setSelectedDevice(device);
    closeModal();
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query.toLowerCase());
      }, 100),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onclose]);

  const handleSearchChange = (query: string) => {
    debouncedSearch(query);
  };

  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) return allDevices;
    return allDevices.filter((device) =>
      device.name.toLowerCase().includes(searchQuery)
    );
  }, [allDevices, searchQuery]);

  const loadMoreDevices = () => {
    if (data.length >= filteredDevices.length) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextBatch = filteredDevices.slice(data.length, data.length + 10);
      setData((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    setData(filteredDevices.slice(0, 10));
  }, [filteredDevices]);

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
  }, [isLoading, data, filteredDevices]);

  return (
    <div className="modal show d-block tabIndex={-1}">
      <div ref={modalRef} className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              Select a Computer to Start the Remote Console Session
            </h5>
            <SearchComponent
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
                    <strong>{device.name}</strong>
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

export { ComputersListModal };
