import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import { useAtomValue } from "jotai";
import "swiper/css";
import "swiper/css/navigation";

import { ZoomableImage } from "../../components/screenshots/zoomableimage";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { selectValueType } from "../../types/dashboard";
import { StaticDataType } from "../../types/filtersAtomType";
import { DatetimePicker } from "../../components/form/datetimePicker";
import {
  ExecuteAntitheftActionAPI,
  GetAntitheftActionAPI,
} from "../../config/ApiCalls";
import {
  ExecuteAntitheftActionType,
  GetAntitheftType,
} from "../../types/antitheftTypes";
import { DeafultComponent } from "../../components/voice-recorder/defaultComponent";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ModalComponent } from "../../components/modal/ModalComponent";

const CameraPictureGalleryPage = () => {
  const waitingPlaceholder = {
    url: "/media/svg/image-processing.png",
    isPlaceholder: true,
  };

  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const actionTypeId = (staticData.actionTypes || []).find((action) =>
    action.anttype.toLowerCase().includes("camera_picture")
  )?.id;

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );

  const [selectedComputerCameraPictures, setSelectedComputerCameraPictures] =
    useState<{
      computerName: string;
      cameraPictures: { url: string; isPlaceholder?: boolean }[];
    } | null>(null);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

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
        const cameraPictures = res.data.map((item: any) => ({
          url: item.value,
        }));

        setSelectedComputerCameraPictures({
          computerName: selectedDevice.label,
          cameraPictures,
        });

        setStartDate("");
        setEndDate("");
      } else {
        setSelectedComputerCameraPictures({
          computerName: selectedDevice.label,
          cameraPictures: [],
        });
      }
    } catch (err) {
      console.error("Failed to load camera pictures:", err);
    }
  };

  const handleExecuteCameraPicture = async () => {
    if (!selectedDevice?.value) {
      setErrorModalOpen(true);
      return;
    }

    if (actionTypeId === undefined || isCapturing) return;

    setIsCapturing(true);

    const data: ExecuteAntitheftActionType = {
      mid: selectedDevice.value,
      action_type: actionTypeId,
      users_id: Number(Cookies.get("user")),
    };

    try {
      const res = await ExecuteAntitheftActionAPI(data);
      if (res.status === 200 || res.status === 201) {
        toast.success(
          "Your camera picture is being processed. This may take up to a minute."
        );
        setSelectedComputerCameraPictures((prev) => ({
          computerName: selectedDevice.label,
          cameraPictures: [waitingPlaceholder, ...(prev?.cameraPictures || [])],
        }));

        await new Promise((resolve) => setTimeout(resolve, 65000));

        const fetchCameraPictures = async () => {
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
              const newCameraPictures = res.data.map((item: any) => ({
                url: item.value,
              }));

              setSelectedComputerCameraPictures({
                computerName: selectedDevice.label,
                cameraPictures: newCameraPictures,
              });
            }
          } catch (err) {
            console.error("Failed to load camera pictures:", err);
            toast.error("Failed to retrieve camera pictures.");
          }
        };

        fetchCameraPictures();
      } else {
        console.error("Failed to execute camera picture action");
        toast.error("Camera picture action failed to execute.");
      }
    } catch (err) {
      console.error("Error executing action:", err);
      toast.error("Unexpected error occurred while processing.");
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, [divRef.current]);

  useEffect(() => {
    const fetchCameraPicture = async () => {
      if (!selectedDevice?.value || actionTypeId === undefined) return;

      const reqData: GetAntitheftType = {
        computers_id: selectedDevice.value,
        action_type: actionTypeId,
        ...(startDate.trim() && { start_date: new Date(startDate) }),
        ...(endDate.trim() && { end_date: new Date(endDate) }),
      };

      try {
        const res = await GetAntitheftActionAPI(reqData);
        if (res?.data && Array.isArray(res.data)) {
          const cameraPictures = res.data.map((item: any) => ({
            url: item.value,
          }));

          setSelectedComputerCameraPictures({
            computerName: selectedDevice.label,
            cameraPictures,
          });
        } else {
          setSelectedComputerCameraPictures({
            computerName: selectedDevice.label,
            cameraPictures: [],
          });
        }
      } catch (err) {
        console.error("Failed to load camera pictures:", err);
      }
    };

    fetchCameraPicture();
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
    // <AnimatedRouteWrapper>
    <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
      <div className="row d-flex custom-main-container custom-container-height">
        <div className="p-5" ref={divRef}>
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
              <h2 className="mb-0">📸 Camera Pictures</h2>
              <button
                className="btn custom-btn p-5"
                onClick={handleExecuteCameraPicture}
                disabled={isCapturing}
                title={
                  isCapturing
                    ? "Camera picture is being captured..."
                    : "Capture picture"
                }
              >
                <FiCamera className="fs-2" />
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 col-md-5 mb-3 mb-md-0">
              <div className="row">
                <div className="col-12 col-md-7">
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
            </div>

            <div className="col-12 col-md-7 ">
              <div className="row">
                {/* <div className="col-12 col-md-1"></div> */}
                <div className="col-5 col-md-5">
                  <label className="custom-label">From</label>
                  <DatetimePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="col-5 col-md-5">
                  <label className="custom-label">To</label>
                  <DatetimePicker date={endDate} setDate={setEndDate} />
                </div>
                <div className="col-2 col-md-2  d-flex align-items-end justify-content-end">
                  <button
                    className="btn btn-sm btn-primary "
                    style={{ whiteSpace: "nowrap" }}
                    onClick={handleGoClick}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedDevice ? (
            selectedComputerCameraPictures &&
            selectedComputerCameraPictures.cameraPictures.length > 0 ? (
              <div className="d-flex gap-2 align-items-center mt-3">
                <h4 className="mb-0">
                  {selectedComputerCameraPictures.computerName}
                </h4>
                <span className="badge text-white bg-primary">
                  {selectedComputerCameraPictures.cameraPictures.length} Camera
                  picture
                  {selectedComputerCameraPictures.cameraPictures.length !== 1 &&
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
            selectedComputerCameraPictures &&
            selectedComputerCameraPictures.cameraPictures.length > 0 ? (
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
                  {selectedComputerCameraPictures.cameraPictures.map(
                    (img, i) => (
                      <SwiperSlide key={`${img.url}-${i}`}>
                        {img.isPlaceholder ? (
                          <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <img
                              src={img.url}
                              alt="Waiting"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />

                            <p className="text-muted text-center mt-3">
                              Camera Picture in progress...
                              <br />
                              Please wait.
                            </p>
                          </div>
                        ) : (
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
                        )}
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <DeafultComponent
                  text={`No camera pictures available for ${selectedComputerCameraPictures?.computerName}.`}
                />
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DeafultComponent
                text={"Select a computer to display its camera pictures."}
              />
            </div>
          )}
        </div>
      </div>
      {errorModalOpen && (
        <ModalComponent
          isOpen={true}
          onConfirm={() => setErrorModalOpen(false)}
          onCancel={() => setErrorModalOpen(false)}
          message={`<h5 className="modal-title text-warning mb-1">
    You should select a computer to complete the camera picture
  </h5>`}
          type="warning"
        />
      )}
    </div>
    // {/* </AnimatedRouteWrapper> */}
  );
};

export { CameraPictureGalleryPage };
