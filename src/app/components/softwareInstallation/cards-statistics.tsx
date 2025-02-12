import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { useEffect, useState } from "react";
import { StaticDataType } from "../../types/filtersAtomType";

// Assuming the structure of staticData
type StaticData = {
  "Initialized softwares": number;
  "Received softwares": number;
};

const CardsStat = () => {
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  return (
    <div className="row g-4 justify-content-center">
      <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <div
          className="card shadow-sm p-3 mb-4"
          style={{ borderRadius: "10px" }}
        >
          <div className="row align-items-center">
            <div className="col-auto text-center">
              <div
                className="d-flex justify-content-center align-items-center bg-primary text-white rounded-circle"
                style={{ width: "50px", height: "50px" }}
              >
                <i
                  className="bi bi-arrow-90deg-up text-dark"
                  style={{ fontSize: "24px" }}
                ></i>
              </div>
            </div>
            <div className="col">
              <h5 className="mb-1">initialized Software</h5>
              <h6 className="text-muted">
                {staticData["Initialized softwares"] ?? 0}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <div
          className="card shadow-sm p-3 mb-4"
          style={{ borderRadius: "10px" }}
        >
          <div className="row align-items-center">
            <div className="col-auto text-center">
              <div
                className="d-flex justify-content-center align-items-center bg-primary text-white rounded-circle"
                style={{ width: "50px", height: "50px" }}
              >
                <i
                  className="bi bi-download text-dark"
                  style={{ fontSize: "24px" }}
                ></i>
              </div>
            </div>
            <div className="col">
              <h5 className="mb-1">Received Software</h5>
              <h6 className="text-muted">
                {staticData["Received softwares"] ?? 0}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsStat };
