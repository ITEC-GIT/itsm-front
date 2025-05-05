import React, { useEffect, useRef, useState } from "react";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { DatePicker } from "../../components/form/datePicker";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { VoiceCardComponent } from "../../components/voice-recorder/voiceRecorderComponent";
import { DatetimePicker } from "../../components/form/datetimePicker";
import { FiCamera } from "react-icons/fi";
import { DeafultVoiceCardComponent } from "../../components/voice-recorder/defaultComponent";
import { MdOutlineKeyboardVoice } from "react-icons/md";

const dummyData = [
  {
    computerName: "Salameh-PC",
    recordings: [
      { audio: "/media/audio/audio1.mp3" },
      { audio: "/media/audio/audio2.mp3" },
      { audio: "/media/audio/audio1.mp3" },
      { audio: "/media/audio/audio2.mp3" },
    ],
  },
  {
    computerName: "PC-202",
    recordings: Array(8).fill({ audio: "/media/audio/audio1.mp3" }),
  },
  {
    computerName: "PC-303",
    recordings: Array(3).fill({ audio: "/media/audio/audio1.mp3" }),
  },
];

const VoiceRecordingsPage = () => {
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

  const getPlaceholderText = () => {
    if (!selectedDevice) {
      return "Select a computer to display its recordings";
    }
    // if (recordings.length === 0) {
    //   return `No audio recordings found for ${selectedDevice.name}.`;
    // }
    return "";
  };

  const selectedComputerData = dummyData.find(
    (comp) => comp.computerName === selectedDevice?.label
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
              <h2 className="mb-0">🎙️ Voice Recordings</h2>
              <button className="btn custom-btn p-5">
                <MdOutlineKeyboardVoice className="fs-2" />
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

          {selectedComputerData && (
            <div className="d-flex gap-2 align-items-center mb-3">
              <h4 className="mb-0">{selectedComputerData.computerName}</h4>
              <span className="badge bg-primary text-white">
                {selectedComputerData.recordings.length} Voice Recorder
                {selectedComputerData.recordings.length !== 1 && "s"}
              </span>
            </div>
          )}
        </div>

        <div
          className="row vertical-scroll none-scroll-width p-5"
          style={{
            height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
            overflowY: "auto",
          }}
        >
          {selectedComputerData ? (
            <div className="col-12 h-100">
              <div className="row">
                {selectedComputerData.recordings.map((recording, i) => (
                  <div
                    key={i}
                    className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                  >
                    <VoiceCardComponent audioUrl={recording.audio} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DeafultVoiceCardComponent text={getPlaceholderText()} />
            </div>
          )}
        </div>
      </div>
    </div>
    // </AnimatedRouteWrapper>
  );
};

export { VoiceRecordingsPage };
