import React, { useEffect, useRef, useState } from "react";
import { selectValueType } from "../../types/dashboard";
import { useAtom, useAtomValue } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { VoiceCardComponent } from "../../components/voice-recorder/voiceRecorderComponent";
import { DatetimePicker } from "../../components/form/datetimePicker";
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

const VoiceRecordingsPage = () => {
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
      return "Select a computer to display its recordings.";
    }
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
              <button
                className="btn custom-btn p-5"
                onClick={handleExecuteVoiceRecord}
                disabled={isRecording}
                title={isRecording ? "Processing..." : "Start voice recording"}
              >
                <MdOutlineKeyboardVoice className="fs-2" />
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
            selectedComputerVoiceRecords &&
            selectedComputerVoiceRecords.recordings.length > 0 ? (
              <div className="d-flex gap-2 align-items-center mb-3">
                <h4 className="mb-0">
                  {selectedComputerVoiceRecords.computerName}
                </h4>
                <span className="badge bg-primary text-white">
                  {selectedComputerVoiceRecords.recordings.length} Voice
                  Recorder
                  {selectedComputerVoiceRecords.recordings.length !== 1 && "s"}
                </span>
              </div>
            ) : (
              <></>
            )
          ) : null}
        </div>

        <div
          className="row vertical-scroll none-scroll-width p-5"
          style={{
            height: `calc(100vh - var(--bs-app-header-height) - 30px - ${height}px)`,
            overflowY: "auto",
          }}
        >
          {selectedComputerVoiceRecords ? (
            selectedComputerVoiceRecords.recordings.length > 0 ? (
              <div className="col-12 h-100">
                <div className="row">
                  {selectedComputerVoiceRecords.recordings.map(
                    (
                      recording: { url: string; isPlaceholder?: boolean },
                      i: number
                    ) =>
                      recording.isPlaceholder ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
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
    // </AnimatedRouteWrapper>
  );
};

export { VoiceRecordingsPage };
