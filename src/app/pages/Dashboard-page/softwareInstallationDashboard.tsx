import { useEffect, useRef, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  CancelSoftwareInstallation,
  GetAllSoftwareInstallations,
} from "../../config/ApiCalls.ts";

import { SoftwareHistoryType } from "../../types/softwareInstallationTypes.ts";
import { Wizard } from "../../components/form/wizard.tsx";
import { getColumns, steps } from "../../data/softwareInstallation.tsx";
import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";

const SoftwareInstallationDashboard = ({
  computerIdProp,
}: {
  computerIdProp?: number;
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<SoftwareHistoryType>();
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<
    TableColumn<SoftwareHistoryType>[]
  >([]);
  const [data, setData] = useState<SoftwareHistoryType[]>([]);

  const handleCancelClick = (entry: SoftwareHistoryType) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (selectedEntry) {
      const response = await CancelSoftwareInstallation(selectedEntry.id);
      if (response.status === 200) {
        data.forEach((entry) => {
          if (entry.id === selectedEntry.id) {
            entry.status = "cancelled";
          }
        });
      }
      setSelectedEntry(undefined);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      const initialFilters = {
        range: "0-5",
        order: "desc",
        computer: computerIdProp,
      };

      try {
        const response = await GetAllSoftwareInstallations(initialFilters);

        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    initialFetch();
  }, [computerIdProp]);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  useEffect(() => {
    const calculateWidths = () => {
      const visibleCols = getColumns(handleCancelClick);
      setVisibleColumns(visibleCols);
      const visibleCount = visibleCols.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        visibleCols.forEach((col: TableColumn<SoftwareHistoryType>) => {
          if (col.id === "action") {
            newWidths[col.id as string] = col.width || "auto";
          } else if (col.id === "id") {
            newWidths[col.id as string] = col.width || "auto";
          } else {
            newWidths[col.id as string] = "50%";
          }
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;
          visibleCols.forEach((col: TableColumn<SoftwareHistoryType>) => {
            if (col.id === "action") {
              newWidths[col.id as string] = col.width || "auto";
            } else if (col.id === "id") {
              newWidths[col.id as string] = col.width || "auto";
            } else {
              if (col.width) {
                const pixelWidth = parseInt(col.width, 10);

                if (!isNaN(pixelWidth)) {
                  const columnPercentageWidth = Math.round(
                    (pixelWidth / containerWidth) * 100
                  );

                  if (columnPercentageWidth < baseWidthPercentage) {
                    newWidths[col.id as string] = `${baseWidthPercentage}%`;
                  } else {
                    newWidths[col.id as string] = col.width;
                  }
                } else {
                  newWidths[col.id as string] = `${baseWidthPercentage}%`;
                }
              } else {
                newWidths[col.id as string] = `${baseWidthPercentage}%`;
              }
            }
          });
        }
      }
      setColumnWidths(newWidths);
    };

    calculateWidths();

    const observer = new ResizeObserver(calculateWidths);
    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatedRouteWrapper>
      <div className="row d-flex custom-main-container custom-container-height">
        <div className="d-flex flex-column col-12">
          <h2>🚀 Software Installation</h2>
          <div>
            <div
              style={{
                padding: "10px",
                overflow: "auto",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="d-flex flex-column overflow-auto"
                style={{ maxHeight: "100%", flexGrow: 1 }}
              >
                <Wizard steps={steps} />
                <div className="mt-5" ref={tableContainerRef}>
                  <DataTable
                    columns={visibleColumns.map((col) => ({
                      ...col,
                      width: columnWidths[col.id as string],
                    }))}
                    data={data}
                    persistTableHead={true}
                    responsive
                    highlightOnHover
                    customStyles={customStyles}
                    sortIcon={sortIcon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className={`modal w-100 fade ${isModalOpen ? "show d-block" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-hidden={!isModalOpen}
          style={{
            background: isModalOpen ? "rgba(0,0,0,0.5)" : "transparent",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-5">
              <div className="d-flex justify-content-start align-items-center mb-5">
                <div className="circle-div">
                  <i className="bi bi-exclamation text-white custom-modal-animated-icon"></i>
                </div>
                <div className="d-flex flex-column">
                  <p>
                    Are you sure you want to cancel the installation of{" "}
                    <strong>{selectedEntry?.software}</strong>?
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="custom-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  className="custom-modal-confirm-btn"
                  onClick={confirmCancellation}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedRouteWrapper>
  );
};

export { SoftwareInstallationDashboard };
