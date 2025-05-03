import { Link } from "react-router-dom";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { useLayout } from "../../core";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ToggleComponent } from "../../../assets/ts/components";
import { useAtom } from "jotai";
import {
  isSidebarOpenAtom,
  sidebarToggleAtom,
} from "../../../../app/atoms/sidebar-atom/sidebar";

type PropsType = {
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
};

const SidebarLogo = (props: PropsType) => {
  const { config } = useLayout();
  const [toggleInstance, setToggleInstance] = useAtom(sidebarToggleAtom);
  const [isSidebarOpenA, setIsSidebarOpenA] = useAtom(isSidebarOpenAtom);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(() => {
    return localStorage.getItem("sidebarState") === "minimized";
  });
  // Initialize sidebar toggle instance
  useEffect(() => {
    setTimeout(() => {
      const toggleObj = ToggleComponent.getInstance(
        toggleRef.current!
      ) as ToggleComponent | null;

      setToggleInstance(toggleObj);
      if (!toggleObj) return;

      // Add a class to prevent sidebar hover effect after toggle click
      toggleObj.on("kt.toggle.change", () => {
        props.sidebarRef.current?.classList.add("animating");

        setTimeout(() => {
          props.sidebarRef.current?.classList.remove("animating");
        }, 300);
      });
    }, 600);
  }, []); // No unnecessary dependencies

  // Restore sidebar state and prevent Metronic from overriding it
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarState");
    const isMinimized = storedState === "minimized";

    document.body.classList.toggle("app-sidebar-minimize", isMinimized);
    document.body.setAttribute(
      "data-kt-app-sidebar-minimize",
      isMinimized ? "on" : "off"
    );

    const toggleObj: any = ToggleComponent.getInstance(toggleRef.current!);
    toggleObj?.off?.("kt.toggle.change"); // Cleanup previous event listener

    const handleToggleChange = () => {
      const isMinimized = document.body.classList.contains(
        "app-sidebar-minimize"
      );
      setIsSidebarMinimized(isMinimized);
      localStorage.setItem("sidebarState", isMinimized ? "minimized" : "open");
      setIsSidebarOpenA(isMinimized ? false : true);
    };

    setTimeout(() => {
      toggleObj?.on?.("kt.toggle.change", handleToggleChange);
    }, 600);

    return () => {
      toggleObj?.off?.("kt.toggle.change", handleToggleChange); // Cleanup on unmount
    };
  }, []);

  // Toggle Sidebar and Update Local Storage
  const handleSidebarToggle = () => {
    const newState = !isSidebarMinimized;
    setIsSidebarMinimized(newState);
    localStorage.setItem("sidebarState", newState ? "minimized" : "open");
    setIsSidebarOpenA(newState ? false : true);

    document.body.classList.toggle("app-sidebar-minimize", newState);
    document.body.setAttribute(
      "data-kt-app-sidebar-minimize",
      newState ? "on" : "off"
    );
  };

  return (
    <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
      <Link to="/dashboard">
        {config.layoutType === "dark-sidebar" ? (
            <div>
              <img
                  alt="Logo"
                  src={toAbsoluteUrl("media/svg/GRANDNET ICON - STAR.svg")}
                  className="h-30px app-sidebar-logo-default"
              />
              <img
                  alt="Logo"
                  src={toAbsoluteUrl("media/svg/GRANDNET_LOGO_RGB.svg")}
                  className="h-30px app-sidebar-logo-default"
              />
            </div>

        ) : (
            <>
              <img
                  alt="Logo"
                  src={toAbsoluteUrl("media/svg/GRANDNET ICON - STAR.svg")}
                  className="h-30px app-sidebar-logo-default theme-light-show"
            />
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/GRANDNET ICON - STAR.svg")}
              className="h-30px app-sidebar-logo-default theme-dark-show"
            />
          </>
        )}

        <img
          alt="Logo"
          src={toAbsoluteUrl("media/svg/GRANDNET ICON - STAR.svg")}
          className="h-20px app-sidebar-logo-minimize"
        />
      </Link>

      <div
        ref={toggleRef}
        id="kt_app_sidebar_toggle"
        className={clsx(
          "app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate",
          { active: isSidebarMinimized }
        )}
        onClick={handleSidebarToggle}
        data-kt-toggle="true"
        data-kt-toggle-target="body"
        data-kt-toggle-name="app-sidebar-minimize"
      >
        <KTIcon iconName="black-left-line" className="fs-3 rotate-180 ms-1" />
      </div>
    </div>
  );
};

export { SidebarLogo };
