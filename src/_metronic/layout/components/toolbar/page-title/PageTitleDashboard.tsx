import clsx from "clsx";
import { useLayout } from "../../../core";
import { useAtom } from "jotai";
import {
  dashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";
import { MdDoubleArrow } from "react-icons/md";

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
          <MdDoubleArrow
            onClick={handleToggleView}
            className="fs-2 arrow-icon"
          />

          
            <h1
              onClick={handleToggleView}
              className="page-heading d-flex fw-bold fs-3 my-0 flex-column justify-content-center header-blue-color"
              style={{
                cursor: "pointer",
              }}
            >
             {currentView === "analytics" ? "Analytics Dashboard" : "Main Dashboard"}
            </h1>
         
        </div>
      </div>
    </div>
  );
};

export { PageTitleDashboard };
