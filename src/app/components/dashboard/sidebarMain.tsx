import { useAtom } from "jotai";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../atoms/dashboard-atoms/dashboardAtom";
import { useCallback, useEffect, useState } from "react";
import { GetComputer } from "../../config/ApiCalls";
import { GetComputerResponseType } from "../../types/dashboard";
// import { Tooltip } from "bootstrap";

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

const getWindowWidth = () => {
  if (typeof window === "undefined") return 1200;
  return Math.min(
    window.innerWidth,
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
};

const MOBILE_BREAKPOINT = 766;

const SidebarMain = () => {
  const [selectedComputerAtom] = useAtom(selectedComputerDashboardAtom);
  const [computer, setComputer] = useState<GetComputerResponseType>();
  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    getWindowWidth() <= MOBILE_BREAKPOINT
  );

  const handleResize = useCallback(() => {
    const currentWidth = getWindowWidth();
    console.log("Detected window width:", currentWidth);
    setIsCollapsed(currentWidth <= MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    const debouncedResize = debounce(handleResize, 100);

    debouncedResize();

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, [handleResize]);

  const fetchComputer = async () => {
    if (selectedComputerAtom) {
      const computerInfo = await GetComputer(selectedComputerAtom);
      setComputer(computerInfo.data);
    }
  };

  // useEffect(() => {
  //   const tooltipTriggerList = document.querySelectorAll(
  //     '[data-bs-toggle="tooltip"]'
  //   );
  //   tooltipTriggerList.forEach((tooltipEl) => new Tooltip(tooltipEl));
  // }, []);

  useEffect(() => {
    fetchComputer();
  }, [selectedComputerAtom]);

  return (
    <div
      className={`sidebar-main p-3 ${isCollapsed ? "collapsed" : "expanded"}`}
    >
      {selectedComputerAtom ? (
        <div className="computer-info p-3">
          <div className="custom-scrolling">
            {!isCollapsed ? (
              <div className="computer-header">
                <h2 className="computer-name">{computer?.name}</h2>
                <span className="computer-type">
                  {computer?.type.name} - {computer?.model.name}
                </span>
              </div>
            ) : (
              <div className="computer-header text-center">
                <i className="bi bi-laptop icon-computer"></i>
              </div>
            )}

            {!isCollapsed && (
              <h5 className="section-title-borderless">Tickets</h5>
            )}

            <div className="d-flex flex-column align-items-start">
              <button
                className={`btn-command ${
                  isCollapsed && activeView === "ticket"
                    ? "active-collapsed"
                    : ""
                }`}
                onClick={() => setActiveView("ticket")}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={"Tickets"}
              >
                <i className="bi bi-bug"></i>
                {!isCollapsed && " Tickets"}
              </button>
            </div>

            {!isCollapsed && <h5 className="section-title">Hyper Commands</h5>}

            <div className="d-flex flex-column align-items-start">
              {[
                {
                  view: "software-installation",
                  icon: "cloud-upload",
                  text: "Software Installation",
                },
                { view: "remote-ssh", icon: "terminal", text: "Remote SSH" },
                { view: "remote-console", icon: "tv", text: "Remote Console" },
                // {
                //   view: "performance",
                //   icon: "speedometer2",
                //   text: "Performance",
                // },
              ].map((item) => (
                <button
                  key={item.view}
                  className={`btn-command ${
                    isCollapsed && activeView === item.view
                      ? "active-collapsed"
                      : ""
                  }`}
                  onClick={() => setActiveView(item.view)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.text}
                >
                  <i className={`bi bi-${item.icon}`}></i>
                  {!isCollapsed && ` ${item.text}`}
                </button>
              ))}
            </div>

            {!isCollapsed && <h5 className="section-title">Actions</h5>}

            <div className="d-flex flex-column align-items-start">
              {[
                {
                  view: "screenshots",
                  icon: "card-image",
                  text: "Screenshots",
                },
                {
                  view: "camera-picture",
                  icon: "camera-fill",
                  text: "Camera Picture",
                },
                { view: "voice-record", icon: "mic", text: "Voice Records" },
              ].map((item) => (
                <button
                  key={item.view}
                  className={`btn-command ${
                    isCollapsed && activeView === item.view
                      ? "active-collapsed"
                      : ""
                  }`}
                  onClick={() => setActiveView(item.view)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.text}
                >
                  <i className={`bi bi-${item.icon}`}></i>
                  {!isCollapsed && ` ${item.text}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`empty-state ${!isCollapsed ? "align-items-center" : ""}`}
        >
          <i className="bi bi-laptop icon-computer"></i>
          {!isCollapsed && <p>No Computer Selected</p>}
        </div>
      )}
    </div>
  );
};

export { SidebarMain };
