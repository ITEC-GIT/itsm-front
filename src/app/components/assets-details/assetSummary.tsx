import React from "react";
import { StatCard } from "./assetCard";

const AssetSummaryComponent = () => {
  return (
    <>
      <div
        className="row vertical-scroll p-2"
        // style={{ backgroundColor: "rgba(246,248,251,255)" }}
      >
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-cpu text-muted'>&nbsp;CPU</i> <span class='text-dark fw-bold'> 2.2 GHz </span>`}
            center={8}
            strokeColor={"#ff80ed"}
          />
        </div>
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-sd-card-fill text-muted'>&nbsp;Memory</i> <span class='text-dark fw-bold'> 2.2 GB </span>`}
            center={23}
            rightBottom={`<div > <i class='text-muted'>Available </i> <span class='text-dark fw-bold'> 18.4 GB </span></div>`}
            strokeColor={"#bada55"}
          />
        </div>
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-link-45deg text-muted'>&nbsp;Patch Status</i>`}
            center={`<div class="icon-element">
                      <i class="bi bi-check-circle-fill patch-status-icon-green"></i>
                    </div>
                  `}
            rightBottom={`<span class='text-dark fw-bold'>Fully Patched </span>`}
          />
        </div>
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-shield-shaded text-muted'>&nbsp;Antivirus</i>`}
            center={` <div class='d-flex flex-column align-items-center'>
                        <div class='icon-element'>
                          <i class='bi bi-shield-shaded icon-green'></i>
                        </div>
                        <span class='icon-label'>Window Defender</span>
                        <span class='icon-status'>Active - UP TO DATE</span>
                      </div>
                   `}
          />
        </div>
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-shield-shaded text-muted'>&nbsp;Antivirus</i>`}
            center={` <div class='d-flex flex-column align-items-center'>
                        <div class='icon-element'>
                          <i class='bi bi-shield-shaded icon-green'></i>
                        </div>
                        <span class='icon-label'>Window Defender</span>
                        <span class='icon-status'>Active - UP TO DATE</span>
                      </div>
                   `}
          />
        </div>
        <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
          <StatCard
            leftTop={`<i class='bi bi-database-fill-check text-muted'>&nbsp;Backup Status</i>`}
            center={`<div class='icon-element'>
                        <i class='bi bi-boxes text-muted muted-icon-size'></i>
                      </div>`}
            rightBottom={`<span class='text-dark fw-bold'>Not Installed</span>`}
          />
        </div>
        <div className="col-12">
          <StatCard
            leftTop={`<i class='bi bi-fire text-muted'>&nbsp;Firewall Status</i>`}
            center={`<div class="icon-element">
                      <i class="bi bi-check-circle-fill patch-status-icon-green"></i>
                    </div>
                  `}
            rightBottom={`<span class='text-dark fw-bold'>Not Installed</span>`}
          />
        </div>
      </div>
      {/* <div className="row mt-5">
       
        </div>
        <div className="col-3">
          <div className="card rounded-3" style={{ height: "200px" }}>
            <div className="card-body d-flex flex-column align-items-center">
              <i className="bi bi-shield-lock text-muted"></i>
              <span className="text-muted mt-3">No antivirus found</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-6">
          <div className="card rounded-3">
            <div className="card-body">
              <div className="d-flex align-items-center text-muted">
                <i className="bi bi-cloud-arrow-down fs-4"></i>
                <span className="ms-2 fw-bold">Net Traffic</span>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-cloud-arrow-down-fill text-success"></i>
                  <span className="ms-2 fs-5 fw-bold">29.549 Kbps</span>
                  <span className="text-muted small">DOWNLOAD</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-cloud-arrow-up-fill text-primary"></i>
                  <span className="ms-2 fs-5 fw-bold">24.538 Kbps</span>
                  <span className="text-muted small">UPLOAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export { AssetSummaryComponent };
