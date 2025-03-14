import { ProgressBar } from "../form/progressBar";
import { StatCard } from "./assetCard";

const AssetSummaryComponent = () => {
  return (
    <div
      className="row none-scroll-width vertical-scroll"
      style={{ padding: "5px" }}
    >
      <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
        <StatCard
          leftTop={`<i class='bi bi-cpu text-muted'>&nbsp;CPU</i> <span class='text-dark fw-bold'> 2.2 GHz </span>`}
          center={80}
          strokeColor={{ start: "#800020", end: "#ff69b4" }}
        />
      </div>
      <div className="col-md-5 col-lg-4 col-xl-4 mb-3">
        <StatCard
          leftTop={`<i class='bi bi-sd-card-fill text-muted'>&nbsp;Memory</i> <span class='text-dark fw-bold'> 2.2 GB </span>`}
          center={23}
          rightBottom={`<div > <i class='text-muted'>Available </i> <span class='text-dark fw-bold'> 18.4 GB </span></div>`}
          strokeColor={{ start: "#2596be", end: "#00ff00" }}
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
          center={` <div class="d-flex align-items-center mb-3">
                <div class="net-traffic-element rounded-circle download" >
                    <i class="bi bi-arrow-down text-white "></i>
                </div>
                <div>
                    <strong class="fs-5">236.024 Kbps</strong>
                    <small class="text-muted d-block">DOWNLOAD</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <div class="net-traffic-element rounded-circle upload">
                    <i class="bi bi-arrow-up text-white"></i>
                </div>
                <div>
                    <strong class="fs-5">1.092 Mbps</strong>
                    <small class="text-muted d-block">UPLOAD</small>
                </div>
            </div>`}
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
      <div className="col-12 mb-3">
        <StatCard
          leftTop={`<i class='bi bi-fire text-muted'>&nbsp;Firewall Status</i>`}
          center={`<div class="icon-element">
                      <i class="bi bi-check-circle-fill patch-status-icon-green"></i>
                    </div>
                  `}
          rightBottom={`<span class='text-dark fw-bold'>Not Installed</span>`}
        />
      </div>
      <div className="col-12 mb-3">
        <StatCard
          leftTop={`<i class='bi bi bi-nvme text-muted'>&nbsp; Disk</i>
            <span>758.87 GB</span> <i class='text-muted'>Of &nbsp;</i><span>864.96 GB</span><i class='text-muted'> &nbsp;Available</i>`}
          center={
            <ProgressBar
              used={758.87}
              total={864.96}
              gradientColor="linear-gradient(to right, #ff7e5f, #feb47b)"
            />
          }
        />
      </div>
    </div>
  );
};

export { AssetSummaryComponent };
