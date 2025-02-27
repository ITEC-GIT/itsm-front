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
            className="nav-link  tab-text active text-active-dark me-6"
            id="tab-summary"
            data-bs-toggle="tab"
            data-bs-target="#summary"
            type="button"
            role="tab"
          >
            Summary
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link tab-text text-active-dark me-6"
            id="tab-details"
            data-bs-toggle="tab"
            data-bs-target="#details"
            type="button"
            role="tab"
          >
            Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link tab-text text-active-dark me-6"
            id="tab-apps"
            data-bs-toggle="tab"
            data-bs-target="#apps"
            type="button"
            role="tab"
          >
            Apps
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link tab-text text-active-dark me-6"
            id="tab-policies"
            data-bs-toggle="tab"
            data-bs-target="#policies"
            type="button"
            role="tab"
          >
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
            <div className="tab-pane fade" id="apps" role="tabpanel">
              Apps Content
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
