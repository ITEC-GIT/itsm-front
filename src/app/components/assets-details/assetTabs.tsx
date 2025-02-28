import TicketPageWrapper from "../../pages/tickets-pages/TicketPageWrapper";
import { AssetDetailsComponent } from "./assetDetails";
import { AssetHistoryComponent } from "./assetHistory";
import { AssetSummaryComponent } from "./assetSummary";

const asset = {
  name: "Laptop",
  description: "Dell XPS 13",
  serialNumber: "ABC123XYZ",
  model: "XPS 13",
  location: "Office",
  purchaseDate: "2023-10-26",
  value: 1200,
};

const AssetTabsComponent = () => {
  return (
    <>
      <ul
        className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap"
        id="myTabs"
        role="tablist"
        style={{ paddingLeft: "10px" }}
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-gray tab-text active text-active-bold me-6"
            id="tab-summary"
            data-bs-toggle="tab"
            data-bs-target="#summary"
            type="button"
            role="tab"
          >
            <i className="bi bi-journal-text me-2"></i>
            Summary
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link tab-text text-gray text-active-bold me-6"
            id="tab-details"
            data-bs-toggle="tab"
            data-bs-target="#details"
            type="button"
            role="tab"
          >
            <i className="bi bi-journals me-2"></i>
            Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-gray tab-text text-active-bold me-6"
            id="tab-ticket"
            data-bs-toggle="tab"
            data-bs-target="#tickets"
            type="button"
            role="tab"
          >
            <i className="bi bi-ticket-perforated me-2"></i>
            Tickets
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-gray tab-text text-active-bold me-6"
            id="tab-apps"
            data-bs-toggle="tab"
            data-bs-target="#apps"
            type="button"
            role="tab"
          >
            <i className="bi bi-window-stack me-2"></i>
            Apps
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link text-gray tab-text text-active-bold me-6"
            id="tab-policies"
            data-bs-toggle="tab"
            data-bs-target="#policies"
            type="button"
            role="tab"
          >
            <i className="bi bi-window-x me-2"></i>
            Policies
          </button>
        </li>
      </ul>
      <div className="row">
        <div className="col-8">
          <div className="tab-content mt-3">
            <div
              className="tab-pane fade show active "
              id="summary"
              role="tabpanel"
            >
              <AssetSummaryComponent />
            </div>
            <div className="tab-pane fade" id="details" role="tabpanel">
              <AssetDetailsComponent asset={asset} />
            </div>
            <div className="tab-pane fade" id="tickets" role="tabpanel">
              <div className="row vertical-scroll">
                <TicketPageWrapper />
              </div>
            </div>
            <div className="tab-pane fade" id="apps" role="tabpanel">
              Apps
            </div>
            <div className="tab-pane fade" id="policies" role="tabpanel">
              Policies Content
            </div>
          </div>
        </div>

        <div
          className="col-4 "
          style={{ backgroundColor: "rgba(246,248,251,255)" }}
        >
          <AssetHistoryComponent />
        </div>
      </div>
    </>
  );
};

export { AssetTabsComponent };
