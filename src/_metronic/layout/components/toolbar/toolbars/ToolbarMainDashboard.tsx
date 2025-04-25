import clsx from "clsx";
import Select from "react-select";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { useLayout } from "../../../core";
import { staticDataAtom } from "../../../../../app/atoms/app-routes-global-atoms/approutesAtoms";
import { StaticDataType } from "../../../../../app/types/filtersAtomType";
import { selectValueType } from "../../../../../app/types/dashboard";
import {
  activeDashboardViewAtom,
  selectedComputerDashboardAtom,
} from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";
import { CustomReactSelect } from "../../../../../app/components/form/custom-react-select";

const ToolbarMainDashboard = () => {
  const { classes } = useLayout();
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [selectedDeviceAtom, setSelectedDeviceAtom] = useAtom(
    selectedComputerDashboardAtom
  );

  const [activeView, setActiveView] = useAtom(activeDashboardViewAtom);
  // const [selectedBranch, setSelectedBranch] = useState<selectValueType | null>(
  //   null
  // );

  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );

  const compOptions = (staticData.computers || []).map((device) => ({
    value: device.id ? Number(device.id) : 0,
    label: device.name || "",
  }));

  // const locationOptions = useMemo(
  //   () =>
  //     (staticData.Locations || []).map((location: any) => ({
  //       value: location.id ? Number(location.id) : 0,
  //       label: location.name || "",
  //     })),
  //   [staticData]
  // );

  // const userOptions = useMemo(() => {
  //   return (staticData.requesters || [])
  //     .filter(
  //       (device) => !selectedBranch || device.branch_id === selectedBranch.value
  //     )
  //     .map((device) => ({
  //       value: device.id ? Number(device.id) : 0,
  //       label: device.name || "",
  //     }));
  // }, [staticData, selectedBranch]);

  // const compOptions = useMemo(() => {
  //   return (staticData.computers || [])
  //     .filter(
  //       (device) => !selectedBranch || device.branchid === selectedBranch.value
  //       //&&
  //       // device.requesterid === selectedUser?.value
  //     )
  //     .map((device) => ({
  //       value: device.id ? Number(device.id) : 0,
  //       label: device.name || "",
  //     }));
  // }, [staticData, selectedBranch]);

  // const handleBranchChange = (newValue: selectValueType | null) => {
  //   setSelectedBranch(newValue);
  //   setSelectedDevice(null);
  // };

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
      {/* <div className="col-4 col-lg-3 col-xl-2">
        <Select
          options={locationOptions}
          value={selectedBranch}
          onChange={handleBranchChange}
          placeholder="Select Department"
          isClearable
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 3000,
            }),
          }}
        />
      </div> */}

      <div className="col-4 col-lg-3 col-xl-2">
        <CustomReactSelect
          options={compOptions}
          value={selectedDevice}
          onChange={handleDeviceChange}
          placeholder="Select Device"
          isClearable
        />
      </div>
    </div>
  );
};

export { ToolbarMainDashboard };
