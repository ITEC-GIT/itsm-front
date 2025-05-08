import { useAtomValue } from "jotai";
import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../types/filtersAtomType";
import { CustomReactSelect } from "../../components/form/custom-react-select";
import { selectValueType } from "../../types/dashboard";
import {
  ExecuteAntitheftActionType,
  GetAntitheftType,
} from "../../types/antitheftTypes";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ModalComponent } from "../../components/modal/ModalComponent";
import {
  ExecuteAntitheftActionAPI,
  GetAntitheftActionAPI,
} from "../../config/ApiCalls";

interface CommandOption {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

const commandOptions: CommandOption[] = [
  {
    id: "lock",
    label: "🔒 Lock Screen",
    description: "Instantly lock the device screen.",
  },
  {
    id: "shutdown",
    label: "⏻ Shutdown",
    description: "Shutdown the device immediately.",
  },
  { id: "restart", label: "🔁 Restart", description: "Restart the device." },
  {
    id: "message",
    label: "💬 Show Message",
    description: "Display a message to the user.",
  },
  {
    id: "alarm",
    label: "🚨 Play Alarm",
    description: "Emit a loud sound to locate the device.",
  },
  {
    id: "wipe",
    label: "🗑️ Wipe Folder",
    description: "Delete contents from specified folders.",
  },
  {
    id: "disable_usb",
    label: "🔌 Disable USB",
    description: "Block USB ports usage.",
  },
  {
    id: "run_script",
    label: "📜 Run Script",
    description: "Execute a custom script remotely.",
  },
];

const AntiTheftCommandsPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const actionTypeId = (staticData.actionTypes || []).find((action) =>
    action.anttype.toLowerCase().includes("command")
  )?.id;

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [customScript, setCustomScript] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
  };

  const handleExecute = async () => {
    if (!selectedDevice?.value) {
      setErrorModalOpen(true);
      return;
    }

    if (actionTypeId === undefined || isExecuting) return;

    setIsExecuting(true);

    const data: ExecuteAntitheftActionType = {
      mid: selectedDevice.value,
      action_type: actionTypeId,
      params: "", //ask about this
      users_id: Number(Cookies.get("user")),
    };

    try {
      const res = await ExecuteAntitheftActionAPI(data);
      if (res.status === 200 || res.status === 201) {
        toast.success(
          "Your command is being processed. This may take up to a minute."
        );
      } else {
        console.error("Failed to execute your command");
        toast.error("Command action failed to execute.");
      }
    } catch (err) {
      console.error("Error executing action:", err);
      toast.error("Unexpected error occurred while processing.");
    } finally {
      setIsExecuting(false);
    }
  };

  const renderInputFields = () => {
    switch (selectedCommand) {
      case "message":
        return (
          <div className="mt-4">
            <label className="form-label">Enter Message to Show</label>
            <textarea
              className="form-control"
              rows={3}
              value={customMessage}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setCustomMessage(e.target.value)
              }
              placeholder="Your message here..."
            ></textarea>
          </div>
        );
      case "run_script":
        return (
          <div className="mt-4">
            <label className="form-label">Enter Script</label>
            <textarea
              className="form-control"
              rows={6}
              value={customScript}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setCustomScript(e.target.value)
              }
              placeholder="#!/bin/bash\necho Hello World"
            ></textarea>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (divRef.current) {
      console.log(divRef.current.offsetHeight);
      setHeight(divRef.current.offsetHeight);
    }
    if (parentRef.current) {
      console.log(parentRef.current.offsetHeight);
      setParentHeight(parentRef.current.offsetHeight);
    }
  }, [divRef.current, parentRef.current]);

  useEffect(() => {
    const divEl = divRef.current;
    const parentEl = parentRef.current;

    if (!divEl && !parentEl) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight((entry.target as HTMLElement).offsetHeight);
      }
    });

    if (divEl) observer.observe(divEl);
    if (parentEl) observer.observe(parentEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="card-container h-100 d-flex flex-column pt-3 pb-3"
      ref={parentRef}
    >
      <div className="row d-flex custom-main-container custom-container-height">
        <div ref={divRef}>
          <div className="col-12 mb-4">
            <h2 className="mb-0 me-auto">🛡️ Anti-Theft Commands</h2>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <label className="custom-label">Computer</label>
            <CustomReactSelect
              options={compOptions}
              value={selectedDevice}
              onChange={handleDeviceChange}
              placeholder="Select Device"
              isDisabled={isExecuting}
              isClearable
            />
          </div>
        </div>

        <div
          className="vertical-scroll py-5"
          style={{
            height: `calc(${parentHeight}px - 40px - ${height}px)`,
          }}
        >
          <div className="row g-3">
            {commandOptions.map(({ id, label, description, icon }) => (
              <div className="col-12 col-sm-4 col-md-3" key={id}>
                <div
                  className={`card stat-box ${
                    selectedCommand === id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedCommand(id)}
                  style={{ cursor: "pointer", height: "110px" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      {icon && <i className={`bi ${icon} me-2`}></i>}
                      {label}
                    </h5>
                    <p className="card-text small text-muted">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {renderInputFields()}

          <div className="mt-4 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              disabled={!selectedCommand || isExecuting}
              onClick={handleExecute}
            >
              Execute Command
            </button>
          </div>
        </div>
      </div>
      {errorModalOpen && (
        <ModalComponent
          isOpen={true}
          onConfirm={() => setErrorModalOpen(false)}
          onCancel={() => setErrorModalOpen(false)}
          message={`<h5 className="modal-title text-warning mb-1">
          You should select a computer to complete the command execution.
        </h5>`}
          type="warning"
        />
      )}
    </div>
  );
};

export { AntiTheftCommandsPage };
