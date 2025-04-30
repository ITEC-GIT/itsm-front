import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { DatePicker } from "../../components/form/datePicker";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { DefaultImage } from "../../components/screenshots/defaultImage";
import { ZoomableImage } from "../../components/screenshots/zoomableimage";
import { FiCamera } from "react-icons/fi";
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

const ScreenshotGallery = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [selectedDeviceAtom, setSelectedDeviceAtom] = useAtom(
    selectedComputerDashboardAtom
  );

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    selectedDeviceAtom
      ? {
          value: selectedDeviceAtom,
          label:
            compOptions.find((option) => option.value === selectedDeviceAtom)
              ?.label || "",
        }
      : null
  );

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
    setSelectedDeviceAtom(newValue ? Number(newValue.value) : undefined);
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
    <AnimatedRouteWrapper>
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

            <div className="row justify-content-between align-items-center">
              <div className="col-3">
                <label className="custom-label">Computer</label>
              </div>
              <div className="col-9 d-flex justify-content-end gap-2">
                <div className="col-4">
                  <label className="custom-label">From</label>
                </div>
                <div className="col-4">
                  <label className="custom-label">To</label>
                </div>
                <div className="col-1 d-flex align-items-center justify-content-start mt-2"></div>
              </div>
            </div>

            <div className="row justify-content-between align-items-center mb-4">
              <div className="col-3">
                <CustomReactSelect
                  options={compOptions}
                  value={selectedDevice}
                  onChange={handleDeviceChange}
                  placeholder="Select Device"
                  isClearable
                />
              </div>
              <div className="col-9 d-flex justify-content-end gap-2">
                <div className="col-4">
                  <DatetimePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="col-4">
                  <DatetimePicker date={endDate} setDate={setEndDate} />
                </div>
                <div className="col-1 d-flex justify-content-end">
                  <button className="btn btn-sm btn-primary" onClick={() => {}}>
                    Go
                  </button>
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
                    {selectedComputerScreenshots.screenshots.length !== 1 &&
                      "s"}
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
    </AnimatedRouteWrapper>
  );
};

export { ScreenshotGallery };
