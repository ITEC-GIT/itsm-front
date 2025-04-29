import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
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

type ComputerScreenshots = {
  computerName: string;
  screenshots: string[];
};

const dummyData: ComputerScreenshots[] = [
  {
    computerName: "PC-101",
    screenshots: [
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
    ],
  },
  {
    computerName: "PC-202",
    screenshots: [
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
    ],
  },
  {
    computerName: "PC-303",
    screenshots: [
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
      "media/svg/Screenshot (1439).png",
    ],
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

    if (newValue === null) {
      setSelectedDeviceAtom(undefined);
    } else {
      setSelectedDeviceAtom(Number(newValue.value));
    }
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex custom-main-container custom-container-height">
          <div className="p-5" ref={divRef}>
            <div className="col-12 mb-4">
              <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
                <h2 className="mb-0">📸 Screenshots</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <label className="custom-label">Computer</label>
                <CustomReactSelect
                  options={compOptions}
                  value={selectedDevice}
                  onChange={handleDeviceChange}
                  placeholder="Select Device"
                  isClearable
                />
              </div>
              <div className="col-4">
                <label className="custom-label">From</label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="col-4">
                <label className="custom-label">To</label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>

          <div
            className="row vertical-scroll none-scroll-width p-5"
            style={{
              height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
            }}
          >
            {dummyData.map((computer, index) => (
              <div key={index} className="col-12 mb-5">
                <div className="d-flex gap-2 align-items-center mb-3">
                  <h4 className="mb-0">{computer.computerName}</h4>
                  <span className="badge bg-primary text-white">
                    {computer.screenshots.length} Screenshot
                    {computer.screenshots.length !== 1 && "s"}
                  </span>
                </div>

                <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation
                  modules={[Navigation]}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  style={{ paddingBottom: "2rem" }}
                >
                  {computer.screenshots.map((src, i) => (
                    <SwiperSlide key={i}>
                      <motion.img
                        src={src}
                        alt={`Screenshot ${i + 1}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { ScreenshotGallery };
