import clsx from "clsx";
import Select from "react-select";
import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import { useLayout } from "../../../core";
import { staticDataAtom } from "../../../../../app/atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../../../../app/types/filtersAtomType";
import { selectValueType } from "../../../../../app/types/dashboard";
import { selectedComputerDashboardAtom } from "../../../../../app/atoms/dashboard-atoms/dashboardAtom";

const ToolbarMainDashboard = () => {
  const { classes } = useLayout();
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;
  const [selctedDeviceAtom, setSelectedDeviceAtom] = useAtom(
    selectedComputerDashboardAtom
  );
  const [selectedBranch, setSelectedBranch] = useState<selectValueType | null>(
    null
  );
  // const [selectedUser, setSelectedUser] = useState<selectValueType | null>(
  //   null
  // );
  const [selectedDevice, setSelectedDevice] = useState<selectValueType | null>(
    null
  );

  const depOptions = [
    { value: 0, label: "All Branches" },
    ...(staticData["Locations"]?.map((location) => ({
      value: "id" in location ? Number(location?.id) : 0,
      label: "name" in location ? String(location?.name) : "",
    })) || []),
  ];

  // const userOptions =
  //   staticData["assignees"]?.map((assignee) => ({
  //     value: "id" in assignee ? Number(assignee?.id) : 0,
  //     label: "name" in assignee ? String(assignee?.name) : "",
  //   })) || [];

  const filteredDevices = staticData["Computers"]?.filter(
    (device) => !selectedBranch || device.branchid === selectedBranch.value
  );

  const compOptions =
    filteredDevices?.map((device) => ({
      value: "id" in device ? Number(device?.id) : 0,
      label: "name" in device ? String(device?.name) : "",
    })) || [];

  const handleDeviceChange = (newValue: selectValueType | null) => {
    setSelectedDevice(newValue);
    setSelectedDeviceAtom(Number(newValue?.value));
  };

  return (
    <div
      id="kt_app_toolbar_container"
      className={clsx("app-container ", classes.toolbarContainer.join(" "))}
    >
      <div className="filters-Container">
        <Select
          className="select-dashboard"
          options={depOptions}
          value={selectedBranch}
          onChange={(newValue) => setSelectedBranch(newValue)}
          placeholder="Select Branch"
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            container: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />

        {/* <Select
          className="select-dashboard"
          options={userOptions}
          value={selectedUser}
          onChange={(newValue) => setSelectedUser(newValue)}
          placeholder="Select User"
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            container: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        /> */}

        <Select
          className="select-dashboard"
          options={compOptions}
          value={selectedDevice}
          onChange={(newValue) => handleDeviceChange(newValue)}
          placeholder="Select Device"
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            container: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />

        {/* <div className="search-input-wrapper">
          <input
            type="text"
            id="search-input"
            className="form-control search-input"
            placeholder="Search..."
            onChange={handleSearchChange}
          />
        </div> */}
      </div>
    </div>
  );
};

export { ToolbarMainDashboard };
