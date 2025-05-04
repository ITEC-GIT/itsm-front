import { useAtom } from "jotai";
import { selectedComputerInfoAtom } from "../../atoms/assets-atoms/assetAtoms";
import { ProgressBar } from "../form/progressBar";
import { StatCard } from "./assetCard";
import { useEffect, useState } from "react";
import { GetComputerMetricsAPI } from "../../config/ApiCalls";
import { CircularSpinner } from "../spinners/circularSpinner";
import { mapMetricsToObject } from "../../../utils/metricsMapping";

const AssetSummaryComponent = () => {
  const [selectedComputerInfo] = useAtom(selectedComputerInfoAtom);
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [firewallProfiles, setFirewallProfiles] = useState<
    { STATUS: string; PROFILE: string }[]
  >([]);

  const [antivirusList, setAntivirusList] = useState<
    { NAME: string; ENABLED: string }[]
  >([]);

  const [warrantyValid, setWarrantyValid] = useState<boolean | null>(null);
  const [warrantyExpiration, setWarrantyExpiration] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!selectedComputerInfo?.id) return;

    setIsLoading(true);
    GetComputerMetricsAPI(selectedComputerInfo.id)
      .then((data) => {
        const metricArray = data?.data?.metrics?.metric || [];
        console.log(metricArray);
        setMetrics(mapMetricsToObject(metricArray));

        const firewallData = data?.data?.firewall?.specific_attributes || [];
        setFirewallProfiles(firewallData);

        const antivirusData = data?.data?.antivirus?.specific_attributes || [];
        setAntivirusList(antivirusData);

        const expirationDate = data?.data?.antivirus?.warranty_expiration;
        if (expirationDate) {
          setWarrantyExpiration(expirationDate);
          setWarrantyValid(new Date(expirationDate) < new Date());
        }
      })
      .finally(() => setIsLoading(false));
  }, [selectedComputerInfo?.id]);

  return (
    <div
      className="row none-scroll-width vertical-scroll"
      style={{ padding: "5px" }}
    >
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <CircularSpinner />
        </div>
      ) : (
        <>
          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-cpu text-muted'>&nbsp;CPU</i> <span class='text-dark fw-bold'> ${
                (Number(metrics["clock-speed-mhz"]) / 1000).toFixed(2) || "-"
              } GHz </span>`}
              center={Number(metrics["processor-utility"] || 0)}
              strokeColor={{ start: "#800020", end: "#ff69b4" }}
            />
          </div>
          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-cpu text-muted'>&nbsp;CPU Model</i>`}
              center={`<div class="text-center fw-bold bg-orange p-2 rounded-lg">${
                metrics["cpu-model"]
                  ? metrics["cpu-model"].split("@")[0].trim()
                  : "N/A"
              }</div>`}
            />
          </div>
          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-sd-card-fill text-muted'>&nbsp;Memory</i> <span class='text-dark fw-bold'>${(
                Number(metrics["memory_usage"] || 0) /
                100 /
                Number(metrics["Physical Memory"] || 1)
              ).toFixed(2)}% </span>`}
              center={Number(metrics["memory_usage"] || 0)}
              rightBottom={`<div><i class='text-muted'>Total </i> <span class='text-dark fw-bold'>${Number(
                metrics["Physical Memory"] || 0
              ).toFixed(2)} GB</span></div>`}
              strokeColor={{ start: "#2596be", end: "#00ff00" }}
            />
          </div>

          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-patch-check text-muted'></i>&nbsp;Warranty Status`}
              center={`
      <div class='d-flex flex-column align-items-center'>
        <div class='icon-element'>
         <i class='bi ${
           warrantyValid
             ? "bi-check-circle-fill patch-status-icon-green"
             : "bi-x-circle-fill patch-status-icon-red"
         } '></i>
</div>
<span class='icon-status'>${warrantyValid ? "Active until " : "Expired on "}${
                warrantyExpiration
                  ? new Date(warrantyExpiration).toLocaleDateString()
                  : ""
              }</span>


      </div>
    `}
            />
          </div>

          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-shield-shaded text-muted'>&nbsp;Interface</i>`}
              center={` <div class="d-flex align-items-center mb-3">
                <div class="net-traffic-element rounded-circle download" >
                    <i class="bi bi-arrow-down text-white "></i>
                </div>
                <div>
                    <strong class="fs-6">${parseFloat(
                      metrics[
                        "int#=1-name=realtek-gaming-gbe-family-controllerbytes-received/sec-kb/sec"
                      ] || "0"
                    ).toFixed(2)} KBps</strong>
                    <small class="text-muted d-block">DOWNLOAD</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <div class="net-traffic-element rounded-circle upload">
                    <i class="bi bi-arrow-up text-white"></i>
                </div>
                <div>
                     <strong class="fs-6">${parseFloat(
                       metrics[
                         "int#=1-name=realtek-gaming-gbe-family-controllerbytes-sent/sec-kb/sec"
                       ] || "0"
                     ).toFixed(2)} KBps</strong>
                    <small class="text-muted d-block">UPLOAD</small>
                </div>
            </div>`}
            />
          </div>
          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <StatCard
              center={` <div class="d-flex align-items-center mb-3">
                <div class="net-traffic-element rounded-circle download" >
                    <i class="bi bi-cpu-fill text-white "></i>
                </div>
                <div>
                    <strong class="fs-5">${
                      metrics["logical-processors"] || "N/A"
                    }</strong>
                    <small class="text-muted d-block">Logical Processors</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <div class="net-traffic-element rounded-circle upload">
                    <i class="bi bi-collection-fill text-white"></i>
                </div>
                <div>
                    <strong class="fs-5">${
                      metrics["physical-cores"] || "N/A"
                    }</strong>
                    <small class="text-muted d-block">Physical Cores</small>
                </div>
            </div>`}
            />
          </div>

          <div className="col-12 mb-3">
            <StatCard
              isCenter={false}
              leftTop={`<i class='bi bi-shield-shaded text-muted'></i>&nbsp;Antivirus Status`}
              center={
                antivirusList.length > 0
                  ? `
        <div class="row g-3">
          ${antivirusList
            .map(
              (antivirus) => `
            <div class="col-12 col-sm-6 col-lg-4">
              <div class="d-flex align-items-center gap-3 p-3">
                <i class="bi ${
                  antivirus.ENABLED === "1"
                    ? "bi-check-circle-fill patch-status-icon-green"
                    : "bi-x-circle-fill patch-status-icon-red"
                } fs-5"></i>
                <div>
                  <div class="fw-bold">${antivirus.NAME || "Unnamed AV"}</div>
                  <small class="text-muted">${
                    antivirus.ENABLED === "1" ? "ENABLED" : "DISABLED"
                  }</small>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>`
                  : `<div class='text-muted'>No antivirus data available</div>`
              }
            />
          </div>

          <div className="col-12 mb-3">
            <StatCard
              isCenter={false}
              leftTop={`<i class='bi bi-fire text-muted'>&nbsp;Firewall Status</i>`}
              center={
                firewallProfiles.length > 0
                  ? `
      <div class="row g-3">
        ${firewallProfiles
          .map(
            (profile) => `
            <div class="col-12 col-sm-6 col-lg-4">
              <div class="d-flex align-items-center gap-3 p-3 ">
                <i class="bi ${
                  profile.STATUS === "on"
                    ? "bi-check-circle-fill patch-status-icon-green"
                    : "bi-x-circle-fill patch-status-icon-red"
                } fs-5"></i>
                <div>
                  <div class="fw-bold">${profile.PROFILE}</div>
                  <small class="text-muted">${profile.STATUS.toUpperCase()}</small>
                </div>
              </div>
            </div>
          `
          )
          .join("")}
      </div>`
                  : `<div class='text-muted'>No firewall data available</div>`
              }
            />
          </div>

          {/* <div className="col-12 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-fire text-muted'>&nbsp;Firewall Status</i>`}
              center={`<div class="icon-element">
                      <i class="bi bi-check-circle-fill patch-status-icon-green"></i>
                    </div>
                  `}
              rightBottom={`<span class='text-dark fw-bold'>Not Installed</span>`}
            />
          </div> */}
          <div className="col-12 mb-3">
            <StatCard
              leftTop={`<i class='bi bi-nvme text-muted'>&nbsp; Disk</i>
    <span>${(+metrics["disk_free_c"] / 1024 ** 3).toFixed(2)} GB</span> 
    <i class='text-muted'> Of </i>
    <span>${(+metrics["disk_total_c"] / 1024 ** 3).toFixed(2)} GB</span>
    <i class='text-muted'> Available</i>`}
              center={
                <ProgressBar
                  type={metrics["disk_type_c"]}
                  used={
                    (+metrics["disk_total_c"] - +metrics["disk_free_c"]) /
                    1024 ** 3
                  }
                  total={+metrics["disk_total_c"] / 1024 ** 3}
                  gradientColor="linear-gradient(to right, #ff7e5f, #feb47b)"
                  name="C"
                />
              }
            />
          </div>
          {metrics["disk_total_d"] && (
            <div className="col-12 mb-3">
              <StatCard
                leftTop={`<i class='bi bi-nvme text-muted'>&nbsp; Disk </i>
    <span>${(+metrics["disk_free_d"] / 1024 ** 3).toFixed(2)} GB</span> 
    <i class='text-muted'> Of </i>
    <span>${(+metrics["disk_total_d"] / 1024 ** 3).toFixed(2)} GB</span>
    <i class='text-muted'> Available</i>`}
                center={
                  <ProgressBar
                    type={metrics["disk_type_d"]}
                    used={
                      (+metrics["disk_total_d"] - +metrics["disk_free_d"]) /
                      1024 ** 3
                    }
                    total={+metrics["disk_total_d"] / 1024 ** 3}
                    gradientColor="linear-gradient(to right,rgb(13, 241, 181),rgb(24, 209, 206))"
                    name="D"
                  />
                }
              />
            </div>
          )}
          <div className="col-12 mb-3">
            <StatCard
              isCenter={false}
              leftTop={`<i class='bi bi-layers text-muted'>&nbsp;System Summary</i>`}
              center={`<div class="d-flex align-items-center flex-wrap justify-content-between gap-5 px-2 w-100">
      <div class="d-flex align-items-center gap-3">
        <div class="icon-element  text-white mx-auto mb-1 bg-green">
          <i class="bi bi-cpu fs-2 text-white"></i>
        </div>
        <div>
          <div class="fw-bold">${metrics["total-processes"] || "0"}</div>
          <small class="text-muted">Processes</small>
        </div>
        
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="icon-element  text-white mx-auto mb-1 bg-blue">
          <i class="bi bi-threads fs-2 text-white"></i>
        </div>
        <div>
          <div class="fw-bold">${metrics["total-threads"] || "0"}</div>
          <small class="text-muted">Threads</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="icon-element text-white mx-auto mb-1 bg-orange">
          <i class="bi bi-diagram-3-fill fs-2 text-white"></i>
        </div>
        <div>
          <div class="fw-bold">${metrics["total-handles"] || "0"}</div>
          <small class="text-muted">Handles</small>
        </div>
      </div>
    </div>`}
              rightBottom={`<div class='text-center text-muted mt-2'>
      <i class="bi bi-clock-history me-1 text-white"></i>
      <span class='fw-bold'>Uptime:</span> ${metrics["uptime"] || ""}
    </div>`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export { AssetSummaryComponent };
