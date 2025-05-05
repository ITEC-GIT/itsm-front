import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import { useAtom, useAtomValue } from "jotai";
import "swiper/css";
import "swiper/css/navigation";

import { ZoomableImage } from "../../components/screenshots/zoomableimage";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { DefaultImage } from "../../components/screenshots/defaultImage";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { selectValueType } from "../../types/dashboard";
import { StaticDataType } from "../../types/filtersAtomType";
import { DatetimePicker } from "../../components/form/datetimePicker";

export const dummyData = [
  {
    computerName: "Salameh-PC",
    screenshots: [
      {
        url: "media/svg/Screenshot (1439).png",
        w: 1024,
        h: 768,
      },
      {
        url: "media/svg/Screenshot (1439).png",
        w: 800,
        h: 600,
      },
    ],
  },
  {
    computerName: "Computer B",
    screenshots: [
      {
        url: "media/svg/Screenshot (1439).png",
        w: 1280,
        h: 720,
      },
    ],
  },
  {
    computerName: "Computer C",
    screenshots: [],
  },
];

const ScreenshotGalleryPage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
  };

  const selectedComputerScreenshots = dummyData.find(
    (item) => item.computerName === selectedDevice?.label
  );

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, [divRef.current]);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight((entry.target as HTMLElement).offsetHeight);
      }
    });

    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    // <AnimatedRouteWrapper>
    <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
      <div className="row d-flex custom-main-container custom-container-height">
        <div className="p-5" ref={divRef}>
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
              <h2 className="mb-0">📸 Screenshots</h2>
              <button className="btn custom-btn p-5">
                <FiCamera className="fs-2" />
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 col-md-3 d-flex flex-column justify-content-end">
              <label className="custom-label">Computer</label>
              <CustomReactSelect
                options={compOptions}
                value={selectedDevice}
                onChange={handleDeviceChange}
                placeholder="Select Device"
                isClearable
              />
            </div>

            <div className="col-12 col-md-9">
              <div className="d-flex flex-wrap align-items-end gap-3 justify-content-md-end">
                <div className="d-flex flex-column">
                  <label className="custom-label">From</label>
                  <DatetimePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="d-flex flex-column">
                  <label className="custom-label">To</label>
                  <DatetimePicker date={endDate} setDate={setEndDate} />
                </div>
                <div className="align-self-end">
                  <button
                    className="btn btn-sm btn-primary"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => {}}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedDevice ? (
            selectedComputerScreenshots &&
            selectedComputerScreenshots.screenshots.length > 0 ? (
              <div className="d-flex gap-2 align-items-center mt-3">
                <h4 className="mb-0">
                  {selectedComputerScreenshots.computerName}
                </h4>
                <span className="badge text-white bg-primary">
                  {selectedComputerScreenshots.screenshots.length} Screenshot
                  {selectedComputerScreenshots.screenshots.length !== 1 && "s"}
                </span>
              </div>
            ) : (
              <></>
            )
          ) : null}
        </div>

        <div
          className="row p-5"
          style={{
            height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
          }}
        >
          {selectedDevice ? (
            selectedComputerScreenshots &&
            selectedComputerScreenshots.screenshots.length > 0 ? (
              <div className="col-12 mb-5 h-100">
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation
                  modules={[Navigation]}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                  }}
                  style={{ paddingBottom: "2rem", height: "100%" }}
                >
                  {selectedComputerScreenshots.screenshots.map((img, i) => (
                    <SwiperSlide key={i}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <ZoomableImage src={img.url} index={i} />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <DefaultImage />
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DefaultImage />
            </div>
          )}
        </div>
      </div>
    </div>
    // {/* </AnimatedRouteWrapper> */}
  );
};

export { ScreenshotGalleryPage };
