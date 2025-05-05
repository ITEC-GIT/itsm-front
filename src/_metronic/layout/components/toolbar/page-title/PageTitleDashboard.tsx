import clsx from "clsx";
import { useLayout } from "../../../core";
import { useAtom } from "jotai";
import {
  dashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";

const PageTitleDashboard = () => {
  const { config, classes } = useLayout();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  const [currentView, setCurrentView] = useAtom(dashboardViewAtom);
  const [selectedDeviceAtom, setSelectedDeviceAtom] = useAtom(
    selectedComputerDashboardAtom
  );

  const handleToggleView = () => {
    const newView = currentView === "main" ? "analytics" : "main";
    // if (newView === "analytics") setSelectedDeviceAtom(undefined);
    setCurrentView(newView);
  };

  return (
    <div
      id="kt_page_title"
      data-kt-swapper="true"
      data-kt-swapper-mode="prepend"
      data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx("page-title d-flex flex-wrap me-3", {
        "flex-column justify-content-center":
          appPageTitleDirection === "column",
        "align-items-center": appPageTitleDirection !== "column",
      })}
    >
      <div>
        <div className="d-flex align-items-center gap-2">
          <i
            onClick={handleToggleView}
            className={
              currentView === "main"
                ? "bi bi-box"
                : currentView === "analytics"
                ? "bi bi-bar-chart"
                : ""
            }
            style={{
              color: "black",
              fontSize: "medium",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
              padding: "5px",
              cursor: "pointer",
            }}
          ></i>
          {currentView === "analytics" ? (
            <h1
              onClick={handleToggleView}
              className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center"
              style={{ cursor: "pointer" }}
            >
              Analytics Dashboard
            </h1>
          ) : (
            <h1
              onClick={handleToggleView}
              className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center text-nowrap"
              style={{ cursor: "pointer" }}
            >
              Main Dashboard
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export { PageTitleDashboard };
