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
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { selectValueType } from "../../types/dashboard";
import { StaticDataType } from "../../types/filtersAtomType";
import { DatetimePicker } from "../../components/form/datetimePicker";
import { GetAntitheftType } from "../../types/antitheftTypes";
import { GetAntitheftActionAPI } from "../../config/ApiCalls";
import { DeafultComponent } from "../../components/voice-recorder/defaultComponent";

const ScreenshotGalleryDashboard = ({ computerId }: { computerId: number }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const actionTypeId = (staticData.actionTypes || []).find((action) =>
    action.anttype.toLowerCase().includes("screenshot")
  )?.id;

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>({
    value: computerId,
    label:
      compOptions.find((option) => option.value === computerId)?.label || "",
  });

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
  };

  const handleGoClick = async () => {
    if (!selectedDevice?.value || actionTypeId === undefined) return;

    const reqData: GetAntitheftType = {
      computers_id: selectedDevice.value,
      action_type: actionTypeId,
      ...(startDate && { start_date: new Date(startDate) }),
      ...(endDate && { end_date: new Date(endDate) }),
    };

    try {
      const res = await GetAntitheftActionAPI(reqData);
      if (res?.data && Array.isArray(res.data)) {
        const screenshots = res.data.map((item: any) => ({
          url: item.value,
        }));

        setSelectedComputerScreenshots({
          computerName: selectedDevice.label,
          screenshots,
        });

        setStartDate("");
        setEndDate("");
      } else {
        setSelectedComputerScreenshots({
          computerName: selectedDevice.label,
          screenshots: [],
        });
      }
    } catch (err) {
      console.error("Failed to load screenshots:", err);
    }
  };

  const [selectedComputerScreenshots, setSelectedComputerScreenshots] =
    useState<{
      computerName: string;
      screenshots: { url: string }[];
    } | null>(null);

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
    if (parentRef.current) {
      setParentHeight(parentRef.current.offsetHeight);
    }
  }, [divRef.current, parentRef.current]);

  useEffect(() => {
    const fetchScreenshot = async () => {
      if (!selectedDevice?.value || actionTypeId === undefined) return;

      const reqData: GetAntitheftType = {
        computers_id: selectedDevice.value,
        action_type: actionTypeId,
        ...(startDate && { start_date: new Date(startDate) }),
        ...(endDate && { end_date: new Date(endDate) }),
      };

      try {
        const res = await GetAntitheftActionAPI(reqData);
        if (res?.data && Array.isArray(res.data)) {
          const screenshots = res.data.map((item: any) => ({
            url: item.value,
          }));

          setSelectedComputerScreenshots({
            computerName: selectedDevice.label,
            screenshots,
          });
        } else {
          setSelectedComputerScreenshots({
            computerName: selectedDevice.label,
            screenshots: [],
          });
        }
      } catch (err) {
        console.error("Failed to load screenshots:", err);
      }
    };

    fetchScreenshot();
  }, [selectedDevice]);

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
      <div className="row d-flex custom-main-container h-100" ref={parentRef}>
        <div ref={divRef}>
          <div className="row gx-5 gy-2">
            <div className="col-12 col-md-5 col-lg-3">
              <div className="d-flex flex-column justify-content-end h-100">
                <label className="custom-label">Computer</label>
                <CustomReactSelect
                  options={compOptions}
                  value={selectedDevice}
                  onChange={handleDeviceChange}
                  placeholder="Select Device"
                  isClearable
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-8 d-flex justify-content-end align-items-end">
              <div className="row gx-2 gy-2">
                <div className="col-12 col-sm-5">
                  <label className="custom-label">From</label>
                  <DatetimePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="col-12 col-sm-5">
                  <label className="custom-label">To</label>
                  <DatetimePicker date={endDate} setDate={setEndDate} />
                </div>
                <div className="col-12 col-sm-2 d-flex align-items-end">
                  <button
                    className="btn custom-btn bg-primary text-white  p-2 p-md-3"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={handleGoClick}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-1 col-lg-1 d-flex justify-content-end align-items-end">
              <button className="btn custom-btn p-2 p-md-3">
                <FiCamera className="fs-2" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={{
            height: `calc(${parentHeight}px - ${height}px)`,
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
                <DeafultComponent
                  text={`No screenshots available for ${selectedComputerScreenshots?.computerName}.`}
                />
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DeafultComponent
                text={"Select a computer to display its screenshots."}
              />
            </div>
          )}
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { ScreenshotGalleryDashboard };
