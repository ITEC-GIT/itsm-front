import React, { useEffect, useRef, useState } from "react";
import { AssetHistoryComponent } from "./assetHistory";
import TicketPageWrapper from "../../pages/tickets-pages/TicketPageWrapper";
import { AssetAppsComponent } from "./assetApps";
import { AssetDetailsComponent } from "./assetDetails";
import { AssetSummaryComponent } from "./assetSummary";
import { AssetPoliciesComponent } from "./assetPolicies";
import { AssetsTree } from "./assetDetailsTree";

const asset = {
  name: "Laptop",
  description: "Dell XPS 13",
  serialNumber: "ABC123XYZ",
  model: "XPS 13",
  location: "Office",
  purchaseDate: "2023-10-26",
  value: 1200,
};
const AssetTabsComponent: React.FC<{ devHeight: number }> = ({ devHeight }) => {
  const [selectedTab, setSelectedTab] = useState("summary");
  const navRef = useRef<HTMLUListElement>(null);
  const [totalHeight, setTotalHeight] = useState<number>(0);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (navRef.current) {
      setTotalHeight(navRef.current.offsetHeight + devHeight + 45);
    }
  }, [devHeight]);

  return (
    <>
      <ul
        ref={navRef}
        className="nav nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder"
        id="myTabs"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link text-gray tab-text ${
              selectedTab === "summary" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-summary"
            data-bs-toggle="tab"
            data-bs-target="#summary"
            type="button"
            role="tab"
            onClick={() => handleTabClick("summary")}
          >
            <i className="bi bi-journal-text me-2"></i>
            Summary
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link tab-text text-gray ${
              selectedTab === "details" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-details"
            data-bs-toggle="tab"
            data-bs-target="#details"
            type="button"
            role="tab"
            onClick={() => handleTabClick("details")}
          >
            <i className="bi bi-journals me-2"></i>
            Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link text-gray tab-text ${
              selectedTab === "tickets" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-ticket"
            data-bs-toggle="tab"
            data-bs-target="#tickets"
            type="button"
            role="tab"
            onClick={() => handleTabClick("tickets")}
          >
            <i className="bi bi-ticket-perforated me-2"></i>
            Tickets
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link text-gray tab-text ${
              selectedTab === "apps" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-apps"
            data-bs-toggle="tab"
            data-bs-target="#apps"
            type="button"
            role="tab"
            onClick={() => handleTabClick("apps")}
          >
            <i className="bi bi-window-stack me-2"></i>
            Apps
          </button>
        </li>
        {/* <li className="nav-item" role="presentation">
          <button
            className={`nav-link text-gray tab-text ${
              selectedTab === "policies" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-policies"
            data-bs-toggle="tab"
            data-bs-target="#policies"
            type="button"
            role="tab"
            onClick={() => handleTabClick("policies")}
          >
            <i className="bi bi-window-x me-2"></i>
            Policies
          </button>
        </li> */}
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link text-gray tab-text ml-2 ${
              selectedTab === "tree" ? "active text-active-bold" : ""
            } me-6`}
            id="tab-tree"
            data-bs-toggle="tab"
            data-bs-target="#tree"
            type="button"
            role="tab"
            onClick={() => handleTabClick("Tree")}
          >
            <i className="bi bi-diagram-2 me-2"></i>
            Tree
          </button>
        </li>
      </ul>
      <div className="row">
        <div
          className={`none-scroll-width vertical-scroll ${
            selectedTab === "summary" ? "col-8" : "col-12"
          }`}
          style={{
            height: `calc(100vh - var(--bs-app-header-height) - ${totalHeight}px) `,
          }}
        >
          <div className="tab-content h-100 p-0">
            <div
              className={`tab-pane fade ${
                selectedTab === "summary" ? "show active" : ""
              }`}
              id="summary"
              role="tabpanel"
            >
              <AssetSummaryComponent />
            </div>
            <div
              className={`tab-pane fade ${
                selectedTab === "details" ? "show active" : ""
              }`}
              id="details"
              role="tabpanel"
            >
              <AssetDetailsComponent devHeight={totalHeight} />
            </div>
            <div
              className={`tab-pane fade ${
                selectedTab === "tickets" ? "show active" : ""
              }`}
              id="tickets"
              role="tabpanel"
            >
              <div className="row none-scroll-width vertical-scroll">
                <TicketPageWrapper />
              </div>
            </div>
            <div
              className={`tab-pane fade ${
                selectedTab === "apps" ? "show active" : ""
              }`}
              id="apps"
              role="tabpanel"
            >
              <AssetAppsComponent />
            </div>
            {/* <div
              className={`tab-pane fade ${
                selectedTab === "policies" ? "show active" : ""
              }`}
              id="policies"
              role="tabpanel"
            >
              <AssetPoliciesComponent />
            </div> */}
            <div
              className={`tab-pane fade ${
                selectedTab === "tree" ? "show active" : ""
              }`}
              id="tree"
              role="tabpanel"
            >
              <AssetsTree />
            </div>
          </div>
        </div>

        {selectedTab === "summary" && (
          <div
            className="col-4"
            style={{ backgroundColor: "rgba(246,248,251,255)" }}
          >
            <AssetHistoryComponent devHeight={totalHeight} />
          </div>
        )}
      </div>
    </>
  );
};

export { AssetTabsComponent };
