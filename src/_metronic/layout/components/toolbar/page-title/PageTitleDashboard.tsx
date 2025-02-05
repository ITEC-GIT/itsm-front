import clsx from "clsx";
import { useLayout } from "../../../core";
import { useAtom } from "jotai";
import { dashboardViewAtom } from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";

const PageTitleDashboard = () => {
  const { config, classes } = useLayout();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  const [currentView, setCurrentView] = useAtom(dashboardViewAtom);

  const handleToggleView = () => {
    const newView = currentView === "main" ? "analytics" : "main";
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
      <div
        className="d-flex align-items-center gap-2"
        onClick={handleToggleView}
        style={{ cursor: "pointer" }}
      >
        <i
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
          }}
        ></i>
        {currentView === "analytics" ? (
          <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
            Analytics Dashboard
          </h1>
        ) : (
          <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
            Main Dashboard
          </h1>
        )}
      </div>
    </div>
  );
};

export { PageTitleDashboard };
