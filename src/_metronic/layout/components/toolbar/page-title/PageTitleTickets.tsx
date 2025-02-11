import clsx from "clsx";
import {Link} from "react-router-dom";
import {useLayout} from "../../../core";
import Badge from "../../../../../app/components/custom-components/Badge";
import {usePageData} from "../../../core/PageData";
import {useAtom, useAtomValue} from "jotai";
import {
    toolbarTicketsBackendFiltersAtom,
    toolbarTicketsFrontFiltersAtom,
    toolbarTicketsSearchAtom,
} from "../../../../../app/atoms/toolbar-atoms/toolbarTicketsAtom";
import {
    fetchActionAtom,
    fetchLessPagesFlagAtom,
    fetchMorePagesFlagAtom,
    maxTotalAtom,
    numOfTicketsToFetchAtom,
    totalTicketsAccumultionAtom, totalTicketsFetchedAtom,
} from "../../../../../app/atoms/tickets-page-atom/ticketsPageAtom";
import {useSetAtom} from "jotai/index";
import {useEffect, useState} from "react";

const PageTitleTickets = () => {
    // const {pageTitle, pageDescription, pageBreadcrumbs} = usePageData()
    const {config, classes} = useLayout();
    const appPageTitleDirection = config.app?.pageTitle?.direction;
    const toolbarSearch = useAtomValue(toolbarTicketsSearchAtom);
    const [frontFilter, setFrontFilter] = useAtom(toolbarTicketsFrontFiltersAtom);
    const [backendFilter, setBackendFilter] = useAtom(
        toolbarTicketsBackendFiltersAtom
    );
    const handleBadgeFrontFiltersClose = (key: string) => {
        setFrontFilter((prev) => ({...prev, [key]: {value: "", label: ""}}));
    };

    const handleBadgeDBFiltersClose = (key: string) => {
        setBackendFilter((prev) => ({...prev, [key]: {value: "", label: ""}}));
    };
    const hasFrontFilterValues = Object.values(frontFilter).some(
        (filter) => filter && filter.value !== "");
    const hasBackendFilterValues = Object.values(backendFilter).some(
        (filter) => filter && filter.value !== ""
    );
    const totalTickets = useAtomValue(maxTotalAtom);
    const currentTicketsCount = useAtomValue(totalTicketsAccumultionAtom); // Set the total tickets per query of fetched in this instance only
    // THE BUG

    const numOfRecordsToFetch = useAtomValue(numOfTicketsToFetchAtom);

    const fetchMorePagesFlag = useAtomValue(fetchMorePagesFlagAtom);
    const fetchLessPagesFlag = useAtomValue(fetchLessPagesFlagAtom);

    const [fromDisplayTicketCount, setFromDisplayTicketCount] = useState(0);

    const [toDisplayTicketCount, setToDisplayTicketCount] = useState(0);
    const [totalTicketsFetched, setTotalTicketsFetchedAtom] =
        useAtom(totalTicketsFetchedAtom); // Set the total tickets per query of fetched in this instance only
    const [fetchAction, setFetchAction] = useAtom(fetchActionAtom);
    useEffect(() => {
        if (fetchAction==='more') {
            let toDisplay=0;
            let fromDisplay=0;
            if(currentTicketsCount<=numOfRecordsToFetch){
                toDisplay = currentTicketsCount;
                fromDisplay = 0;
            }
            else{
                toDisplay = currentTicketsCount;
                if(totalTicketsFetched<numOfRecordsToFetch){
                    fromDisplay = currentTicketsCount>numOfRecordsToFetch?currentTicketsCount-totalTicketsFetched:numOfRecordsToFetch;

                }
                else{
                    fromDisplay = currentTicketsCount>numOfRecordsToFetch?currentTicketsCount-numOfRecordsToFetch:numOfRecordsToFetch;

                }

            }
            setToDisplayTicketCount(toDisplay);
            setFromDisplayTicketCount(fromDisplay);

        } else if (fetchAction==='less') {
            let toDisplay=0;
            let fromDisplay=0;
            if(currentTicketsCount<=numOfRecordsToFetch){
                toDisplay=currentTicketsCount;

                fromDisplay=0;
            }
            else{
                const isDecimal = (currentTicketsCount / numOfRecordsToFetch) % 1 !== 0;

                if(isDecimal){

                    const mod=currentTicketsCount%numOfRecordsToFetch;
                    toDisplay=totalTickets-mod;
                    fromDisplay=toDisplay-numOfRecordsToFetch;
                }
                else{
                    fromDisplay=currentTicketsCount-numOfRecordsToFetch;

                    toDisplay=currentTicketsCount;
                }


                const p=0;
            }
            setFromDisplayTicketCount(fromDisplay);
            setToDisplayTicketCount(toDisplay);
        }
        if(fetchAction==='initial'){
            setFromDisplayTicketCount(0);
            setToDisplayTicketCount(currentTicketsCount);
        }
    },[fetchAction,currentTicketsCount])


    const x = 0;

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
            <div className="d-flex">
                <h1
                    className={clsx(
                        "page-heading d-flex text-gray-900 fw-bold fs-3 my-0",
                        {
                            "flex-column justify-content-center": appPageTitleDirection,
                            "align-items-center": !appPageTitleDirection,
                        }
                    )}
                >
                    Tickets
                </h1>
                <div className="count-align-bottom">
          <span className=" text-muted ms-2 " style={{fontSize: "12px"}}>
             {fromDisplayTicketCount}-{toDisplayTicketCount} of {totalTickets}
          </span>
                </div>
            </div>
            {/* end::Title */}
            <div className="row align-items-between py-2 ">
                <div className="col-auto">
                    {toolbarSearch && toolbarSearch.trim() !== "" ? (
                        <div className="breadcrumb-item text-gray-900">
                            {" "}
                            <strong>Searching...</strong>
                            {toolbarSearch}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="  d-flex flex-wrap align-items-center w-100 ms-4">

                    {hasFrontFilterValues && (
                        <div className=" d-flex align-items-center  flex-wrap">
                            <strong className="me-2">Filters:</strong>
                            {Object.entries(frontFilter).map(
                                ([key, value]) =>
                                    value.value && (
                                        <div className="me-2 my-1 " key={key}>
                                            <Badge
                                                backgroundColor="darkcyan"
                                                color="white"
                                                text={`${key}: ${value.label}`}
                                                onClose={() => handleBadgeFrontFiltersClose(key)}
                                            />
                                        </div>
                                    )
                            )}
                        </div>
                    )}
                    {hasBackendFilterValues && (
                        <div className=" d-flex align-items-center  flex-wrap">
                            <strong className="me-2">Query Filters:</strong>
                            {Object.entries(backendFilter).map(
                                ([key, value]) =>
                                    value.value && (
                                        <div className="me-2 my-1 " key={key}>
                                            <Badge
                                                backgroundColor="darkcyan"
                                                color="white"
                                                text={`${key}: ${value.label}`}
                                                onClose={() => handleBadgeDBFiltersClose(key)}
                                            />
                                        </div>
                                    )
                            )}
                        </div>
                    )}</div>
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
            </div>
        </div>
    );
};

export {PageTitleTickets};
