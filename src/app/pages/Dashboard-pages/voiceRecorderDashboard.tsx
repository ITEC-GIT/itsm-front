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
import { GetAntitheftActionAPI } from "../../config/ApiCalls";
import { GetAntitheftType } from "../../types/antitheftTypes";

const VoiceRecordingsDashboard = ({ computerId }: { computerId: number }) => {
  const divRef = useRef<HTMLDivElement>(null);
  // const [height, setHeight] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const actionTypeId = (staticData.actionTypes || []).find((action) =>
    action.anttype.toLowerCase().includes("voice_record")
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

    if (!newValue) {
      setSelectedComputerVoiceRecords(null);
      setStartDate("");
      setEndDate("");
    }
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

  const [selectedComputerVoiceRecords, setSelectedComputerVoiceRecords] =
    useState<{
      computerName: string;
      recordings: { url: string }[];
    } | null>(null);

  useEffect(() => {
    const fetchVoiceRecords = async () => {
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
          const recordings = res.data.map((item: any) => ({
            url: item.value,
          }));

          setSelectedComputerVoiceRecords({
            computerName: selectedDevice.label,
            recordings: recordings,
          });
        } else {
          setSelectedComputerVoiceRecords({
            computerName: selectedDevice.label,
            recordings: [],
          });
        }
      } catch (err) {
        console.error("Failed to load recordings:", err);
      }
    };

    fetchVoiceRecords();
  }, [selectedDevice]);

  // useEffect(() => {
  //   if (divRef.current) {
  //     setHeight(divRef.current.offsetHeight);
  //   }
  // }, [divRef.current]);

  // useEffect(() => {
  //   if (!divRef.current) return;

  //   const observer = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       setHeight((entry.target as HTMLElement).offsetHeight);
  //     }
  //   });

  //   observer.observe(divRef.current);

  //   return () => observer.disconnect();
  // }, []);

  return (
    <AnimatedRouteWrapper>
      <div className="row d-flex custom-main-container custom-container-height">
        <div>
          <div className="row mb-3 gx-10 gy-2">
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

            <div className="col-12 col-md-6 col-lg-8 mt-md-2">
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
                    onClick={() => {}}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-1 col-lg-1 d-flex justify-content-end justify-content-md-end align-items-end mt-2 mt-md-0">
              <button className="btn custom-btn p-2 p-md-3">
                <MdOutlineKeyboardVoice className="fs-2" />
              </button>
            </div>
          </div>

          {selectedComputerVoiceRecords && (
            <div className="d-flex gap-2 mb-3">
              <h4 className="mb-0">
                {selectedComputerVoiceRecords.computerName}
              </h4>
              <span className="badge bg-primary text-white">
                {selectedComputerVoiceRecords.recordings.length} Voice Recorder
                {selectedComputerVoiceRecords.recordings.length !== 1 && "s"}
              </span>
            </div>
          )}
        </div>

        <div
          className="d-flex flex-column overflow-auto"
          style={{ maxHeight: "100%" }}
        >
          {selectedComputerVoiceRecords ? (
            selectedComputerVoiceRecords.recordings.length > 0 ? (
              <div className="col-12 h-100">
                <div className="row">
                  {selectedComputerVoiceRecords.recordings.map(
                    (recording: { url: string }, i: number) => (
                      <div
                        key={i}
                        className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                      >
                        <VoiceCardComponent audioUrl={recording.url} />
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <DeafultVoiceCardComponent
                  text={`No voice recordings found for ${selectedComputerVoiceRecords.computerName}.`}
                />
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DeafultVoiceCardComponent text={getPlaceholderText()} />
            </div>
          )}
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { VoiceRecordingsDashboard };
