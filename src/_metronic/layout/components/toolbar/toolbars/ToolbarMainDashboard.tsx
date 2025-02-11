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
  const [selectedUser, setSelectedUser] = useState<selectValueType | null>(
    null
  );
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

  const userOptions = (staticData["requesters"] || [])
    // .filter((user) => !selectedBranch || user.branchid === selectedBranch.value)
    .map((requester) => ({
      value: "id" in requester ? Number(requester?.id) : 0,
      label: "name" in requester ? String(requester?.name) : "",
    }));

  const filteredDevices = (staticData["Computers"] || []).filter((device) => {
    if (selectedBranch && selectedUser) {
      return (
        device.branchid === selectedBranch.value
        // &&
        // device.requesterid === selectedUser.value
      );
    }
    if (selectedBranch) {
      return device.branchid === selectedBranch.value;
    }
    // if (selectedUser) {
    //   return device.requesterid === selectedUser.value;
    // }
    return true;
  });

  const compOptions = filteredDevices.map((device) => ({
    value: device.id,
    label: device.name,
  }));

  const handleBranchChange = (newValue: selectValueType | null) => {
    setSelectedBranch(newValue);
    setSelectedUser(null);
    setSelectedDevice(null);
  };

  const handleUserChange = (newValue: selectValueType | null) => {
    setSelectedUser(newValue);
    setSelectedDevice(null);
  };

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
        <div>
          <Select
            className="select-dashboard"
            options={depOptions}
            value={selectedBranch}
            onChange={handleBranchChange}
            placeholder="Select Branch"
            isClearable
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
        </div>

        <div>
          <Select
            className="select-dashboard"
            options={userOptions}
            value={selectedUser}
            onChange={handleUserChange}
            placeholder="Select User"
            isClearable
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
        </div>

        <div>
          <Select
            className="select-dashboard"
            options={compOptions}
            value={selectedDevice}
            onChange={handleDeviceChange}
            placeholder="Select Device"
            isClearable
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
        </div>

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
