import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLayout } from "../../../core";
import { usePageData } from "../../../core/PageData";
import { useAtomValue } from "jotai";
import { toolbarTicketsSearchAtom } from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";

const PageTitleDashboard = () => {
  const { config, classes } = useLayout();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  const toolbarSearch = useAtomValue(toolbarTicketsSearchAtom);

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
      {/* begin::Title */}
      <h1
        className={clsx("page-heading d-flex text-gray-900 fw-bold fs-3 my-0", {
          "flex-column justify-content-center": appPageTitleDirection,
          "align-items-center": !appPageTitleDirection,
        })}
      >
        Tickets
      </h1>
      {/* end::Title */}
      {toolbarSearch && toolbarSearch.trim() !== "" ? (
        <div className="breadcrumb-item text-gray-900">
          {" "}
          Searching... {toolbarSearch}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export { PageTitleDashboard };
