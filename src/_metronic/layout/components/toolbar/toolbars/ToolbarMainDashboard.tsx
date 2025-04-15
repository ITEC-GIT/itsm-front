import clsx from "clsx";
import Select from "react-select";
import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLayout } from "../../../core";
import { staticDataAtom } from "../../../../../app/atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../../../../app/types/filtersAtomType";
import { selectValueType } from "../../../../../app/types/dashboard";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";

const ToolbarMainDashboard = () => {
  const { classes } = useLayout();
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [selectedDeviceAtom, setSelectedDeviceAtom] = useAtom(
    selectedComputerDashboardAtom
  );

  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);
  const [selectedBranch, setSelectedBranch] = useState<selectValueType | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<selectValueType | null>(
    null
  );
  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );
  const locationOptions = useMemo(
    () =>
      (staticData.Locations || []).map((location: any) => ({
        value: location.id ? Number(location.id) : 0,
        label: location.name || "",
      })),
    [staticData]
  );

  const userOptions = useMemo(() => {
    return (staticData.requesters || [])
      .filter(
        (device) => !selectedBranch || device.branch_id === selectedBranch.value
      )
      .map((device) => ({
        value: device.id ? Number(device.id) : 0,
        label: device.name || "",
      }));
  }, [staticData, selectedBranch]);

  const compOptions = useMemo(() => {
    return (staticData.computers || [])
      .filter(
        (device) => !selectedBranch || device.branchid === selectedBranch.value
        //&&
        // device.requesterid === selectedUser?.value
      )
      .map((device) => ({
        value: device.id ? Number(device.id) : 0,
        label: device.name || "",
      }));
  }, [staticData, selectedBranch]);

  const handleBranchChange = (newValue: selectValueType | null) => {
    setSelectedBranch(newValue);
    setSelectedUser(null);
    setSelectedDevice(null);
  };

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);

    if (newValue === null) {
      setSelectedDeviceAtom(undefined);
    } else {
      setSelectedDeviceAtom(Number(newValue.value));
    }

    setActiveView(null);
  };

  return (
    <div className="row justify-content-end mt-2 ">
      <div className="col-4 col-lg-3 col-xl-2">
        <Select
          options={locationOptions}
          value={selectedBranch}
          onChange={handleBranchChange}
          placeholder="Select Branch"
          isClearable
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 3000,
            }),
          }}
        />
      </div>

      <div className="col-4 col-lg-3 col-xl-2">
        <Select
          options={userOptions}
          value={selectedUser}
          onChange={(newValue) => setSelectedUser(newValue)}
          placeholder="Select User"
          isClearable
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 3000,
            }),
          }}
        />
      </div>

      <div className="col-4 col-lg-3 col-xl-2">
        <Select
          options={compOptions}
          value={selectedDevice}
          onChange={handleDeviceChange}
          placeholder="Select Device"
          isClearable
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 3000,
            }),
          }}
        />
      </div>
    </div>
  );
};

export { ToolbarMainDashboard };
