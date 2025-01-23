import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLayout } from "../../../core";
import Badge from "../../../../../app/components/custom-components/Badge";
import { usePageData } from "../../../core/PageData";
import { useAtom, useAtomValue } from "jotai";
import {
  toolbarTicketsFrontFiltersAtom,
  toolbarTicketsSearchAtom,
} from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";

const PageTitleTickets = () => {
  // const {pageTitle, pageDescription, pageBreadcrumbs} = usePageData()
  const { config, classes } = useLayout();
  const appPageTitleDirection = config.app?.pageTitle?.direction;
  const toolbarSearch = useAtomValue(toolbarTicketsSearchAtom);
  const [frontFilter,setFrontFilter] = useAtom(toolbarTicketsFrontFiltersAtom);
  const backendFilter = useAtomValue(toolbarTicketsFrontFiltersAtom);
  const handleBadgeClose = (key: string) => {
    setFrontFilter((prev) => ({ ...prev, [key]: '' }));
  };
  const hasFrontFilterValues = Object.values(frontFilter).some(value => value !== '');

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
      <div className="row align-items-between py-2 ">
        <div className="col-auto">
          {toolbarSearch && toolbarSearch.trim() !== "" ? (
            <div className="breadcrumb-item text-gray-900">
              {" "}
              <strong>Searching...</strong>{toolbarSearch}
            </div>
          ) : (
            ""
          )}
        </div>
        {hasFrontFilterValues && (

        <div className="d-flex flex-wrap align-items-center w-100">
          <div className=" d-flex align-items-center  flex-wrap">
            <strong className="me-2">Filters:</strong>
            {Object.entries(frontFilter).map(
              ([key, value]) =>
                value && (
                  <div className="me-2 my-1 " key={key}>
                    <Badge
                      backgroundColor="darkcyan"
                      color="white"
                      text={`${key}: ${value}`}
                      onClose={() => handleBadgeClose(key)}

                    />
                  </div>
                )
            )}
          </div>
          {/* <div className=" d-flex align-items-center flex-wrap flex-grow-1">
            <strong className="me-2">Fetch Filters:</strong>
            {Object.entries(frontFilter).map(
              ([key, value]) =>
                value && (
                  <div className="me-2" key={key}>
                    <Badge
                      backgroundColor="darkslategray"
                      color="white"
                      text={`${key}/ ${value}`}
                    />
                  </div>
                )
            )}
          </div> */}
        </div>)}
      </div>
    </div>
  );
};

export { PageTitleTickets };
