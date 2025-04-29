import React, { useEffect, useRef, useState } from "react";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { DatePicker } from "../../components/form/datePicker";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { selectedComputerDashboardAtom } from "../../atoms/dashboard-atoms/dashboardAtom";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { VoiceCard } from "../../components/voice-recorder/voiceRecorder";

// Dummy structure now grouped by computer
const dummyData = [
  {
    computerName: "PC-101",
    recordings: Array(5).fill({}), // 5 recordings
  },
  {
    computerName: "PC-202",
    recordings: Array(8).fill({}), // 8 recordings
  },
  {
    computerName: "PC-303",
    recordings: Array(3).fill({}), // 3 recordings
  },
];

const VoiceRecordingsPage = () => {
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
          {/* Header and Filters */}
          <div className="p-5" ref={divRef}>
            <div className="col-12 mb-4">
              <div className="d-flex justify-content-between flex-wrap align-items-center gap-3">
                <h2 className="mb-0">🎙️ Voice Recordings</h2>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label className="custom-label">Computer</label>
                <CustomReactSelect
                  options={compOptions}
                  value={selectedDevice}
                  onChange={handleDeviceChange}
                  placeholder="Select Device"
                  isClearable
                />
              </div>
              <div className="col-12 col-md-4 mb-3">
                <label className="custom-label">From</label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="col-12 col-md-4 mb-3">
                <label className="custom-label">To</label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>

          {/* Voice Recordings List */}
          <div
            className="row vertical-scroll none-scroll-width p-5"
            style={{
              height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
              overflowY: "auto",
            }}
          >
            {dummyData.map((computer, index) => (
              <div key={index} className="col-12 mb-5">
                <div className="d-flex gap-2 align-items-center mb-3">
                  <h4 className="mb-0">{computer.computerName}</h4>
                  <span className="badge bg-success text-white">
                    {computer.recordings.length} Voice Recorder
                    {computer.recordings.length !== 1 && "s"}
                  </span>
                </div>

                <div className="row g-4">
                  {computer.recordings.map((_, i) => (
                    <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <VoiceCard />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { VoiceRecordingsPage };
