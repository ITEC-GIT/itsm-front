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
import { DeafultComponent } from "../../components/voice-recorder/defaultComponent";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import {
  ExecuteAntitheftActionAPI,
  GetAntitheftActionAPI,
} from "../../config/ApiCalls";
import {
  ExecuteAntitheftActionType,
  GetAntitheftType,
} from "../../types/antitheftTypes";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { ModalComponent } from "../../components/modal/ModalComponent";

const VoiceRecordingsDashboard = ({ computerId }: { computerId: number }) => {
  const waitingPlaceholder = {
    url: "",
    isPlaceholder: true,
  };
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);
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

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>({
    value: computerId,
    label:
      compOptions.find((option) => option.value === computerId)?.label || "",
  });

  const [selectedComputerVoiceRecords, setSelectedComputerVoiceRecords] =
    useState<{
      computerName: string;
      recordings: { url: string; isPlaceholder?: boolean }[];
    } | null>(null);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleExecuteVoiceRecord = async () => {
    if (!selectedDevice?.value) {
      setErrorModalOpen(true);
      return;
    }

    if (actionTypeId === undefined || isRecording) return;

    setIsRecording(true);

    const data: ExecuteAntitheftActionType = {
      mid: selectedDevice.value,
      action_type: actionTypeId,
      users_id: Number(Cookies.get("user")),
    };

    try {
      const res = await ExecuteAntitheftActionAPI(data);
      if (res.status === 200 || res.status === 201) {
        toast.success(
          "Your voice recording is being processed. This may take up to a minute."
        );

        setSelectedComputerVoiceRecords((prev) => ({
          computerName: selectedDevice.label,
          recordings: [waitingPlaceholder, ...(prev?.recordings || [])],
        }));

        await new Promise((resolve) => setTimeout(resolve, 65000));

        const reqData: GetAntitheftType = {
          computers_id: selectedDevice.value,
          action_type: actionTypeId,
          ...(startDate && { start_date: new Date(startDate) }),
          ...(endDate && { end_date: new Date(endDate) }),
        };

        try {
          const res = await GetAntitheftActionAPI(reqData);
          if (res?.data && Array.isArray(res.data)) {
            const newVoiceRecords = res.data.map((item: any) => ({
              url: item.value,
            }));

            setSelectedComputerVoiceRecords({
              computerName: selectedDevice.label,
              recordings: newVoiceRecords,
            });
          }
        } catch (err) {
          console.error("Failed to load voice records:", err);
          toast.error("Failed to retrieve voice records.");
        }
      } else {
        console.error("Failed to execute voice record action");
        toast.error("Voice Record action failed to execute.");
      }
    } catch (err) {
      console.error("Error executing action:", err);
      toast.error("Unexpected error occurred while processing.");
    } finally {
      setIsRecording(false);
    }
  };

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

    return "";
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
      console.error("Failed to load screenshots:", err);
    }
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
            recordings: [...recordings, ...recordings],
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
    if (parentRef.current) {
      setParentHeight(parentRef.current.offsetHeight);
    }
  }, [divRef.current, parentRef.current]);

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
            <div className="col-12 col-md-6 col-lg-4 col-xl-3">
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

            <div className="col-12 col-md-5 col-lg-7 col-xl-8 d-flex justify-content-end align-items-end">
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
              <button
                className="btn custom-btn p-2 p-md-3"
                onClick={handleExecuteVoiceRecord}
                disabled={isRecording}
                title={isRecording ? "Processing..." : "Start voice recording"}
              >
                <MdOutlineKeyboardVoice className="fs-2" />
              </button>
            </div>
          </div>

          {selectedDevice ? (
            selectedComputerVoiceRecords &&
            selectedComputerVoiceRecords.recordings.length > 0 ? (
              <div className="d-flex gap-2 align-items-center mt-3 mb-3">
                <h4 className="mb-0">
                  {selectedComputerVoiceRecords.computerName}
                </h4>
                <span className="badge bg-primary text-white">
                  {selectedComputerVoiceRecords.recordings.length} Voice
                  Recording
                  {selectedComputerVoiceRecords.recordings.length !== 1 && "s"}
                </span>
              </div>
            ) : (
              <></>
            )
          ) : null}
        </div>

        <div
          className="row vertical-scroll none-scroll-width"
          style={{
            height: `calc(${parentHeight}px - ${height}px)`,
          }}
        >
          {selectedComputerVoiceRecords ? (
            selectedComputerVoiceRecords.recordings.length > 0 ? (
              // Check if there's at least one real (non-placeholder) recording
              selectedComputerVoiceRecords.recordings.some(
                (r) => !r.isPlaceholder
              ) ? (
                <div className="col-12 h-100">
                  <div className="row">
                    {selectedComputerVoiceRecords.recordings.map(
                      (
                        recording: { url: string; isPlaceholder?: boolean },
                        i: number
                      ) =>
                        recording.isPlaceholder ? (
                          <div
                            key={`placeholder-${i}`}
                            className="d-flex justify-content-center align-items-center h-100"
                          >
                            <DeafultComponent text={`Processing`} />
                          </div>
                        ) : (
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
                // No non-placeholder recordings
                <div className="d-flex justify-content-center align-items-center h-100">
                  <DeafultComponent text={`Processing`} />
                </div>
              )
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <DeafultComponent
                  text={`No voice recordings found for ${selectedComputerVoiceRecords.computerName}.`}
                />
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <DeafultComponent text={getPlaceholderText()} />
            </div>
          )}
        </div>
        {errorModalOpen && (
          <ModalComponent
            isOpen={true}
            onConfirm={() => setErrorModalOpen(false)}
            onCancel={() => setErrorModalOpen(false)}
            message={`<h5 className="modal-title text-warning mb-1">
                  You should select a computer to complete the voice record
                </h5>`}
            type="warning"
          />
        )}
      </div>
    </AnimatedRouteWrapper>
  );
};

export { VoiceRecordingsDashboard };
