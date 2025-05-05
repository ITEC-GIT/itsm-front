import React, { useEffect, useRef, useState } from "react";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { VoiceCardComponent } from "../../components/voice-recorder/voiceRecorderComponent";
import { DatetimePicker } from "../../components/form/datetimePicker";
import { DeafultVoiceCardComponent } from "../../components/voice-recorder/defaultComponent";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { GetAntitheftActionAPI } from "../../config/ApiCalls";
import { GetAntitheftType } from "../../types/antitheftTypes";

const VoiceRecordingsPage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
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

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );

  const [selectedComputerVoiceRecords, setSelectedComputerVoiceRecords] =
    useState<{
      computerName: string;
      recordings: { url: string }[];
    } | null>(null);

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);

    if (!newValue) {
      setSelectedComputerVoiceRecords(null);
      setStartDate("");
      setEndDate("");
    }
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
        const recordings = res.data.map((item: any) => ({
          url: item.value,
        }));

        setSelectedComputerVoiceRecords({
          computerName: selectedDevice.label,
          recordings,
        });

        setStartDate("");
        setEndDate("");
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

  const getPlaceholderText = () => {
    if (!selectedDevice) {
      return "Select a computer to display its recordings";
    }
    // if (recordings.length === 0) {
    //   return `No audio recordings found for ${selectedDevice.name}.`;
    // }
    return "";
  };

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
            recordings,
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
                    onClick={handleGoClick}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedComputerVoiceRecords && (
            <div className="d-flex gap-2 align-items-center mb-3">
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
          className="row vertical-scroll none-scroll-width p-5"
          style={{
            height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
            overflowY: "auto",
          }}
        >
          {selectedComputerVoiceRecords ? (
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
