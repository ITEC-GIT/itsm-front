import clsx from "clsx";
import Select from "react-select";
import { useAtom, useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

  const locationOptions = useMemo(
    () => [
      { value: 0, label: "All Branches" },
      ...(staticData.Locations || []).map((location: any) => ({
        value: location.id ? Number(location.id) : 0,
        label: location.name || "",
      })),
    ],
    [staticData]
  );

  const userOptions = useMemo(() => {
    return (
      (staticData.requesters || [])
        // .filter(
        //   (device) => !selectedBranch || device.branchid === selectedBranch.value
        // )
        .map((device) => ({
          value: device.id ? Number(device.id) : 0,
          label: device.name || "",
        }))
    );
  }, [staticData, selectedBranch]);

  const compOptions = useMemo(() => {
    return (staticData.Computers || [])
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

  return (
    <div
      id="kt_app_toolbar_container"
      className={clsx("app-container ", classes.toolbarContainer.join(" "))}
    >
      <div className="filters-Container">
        <div>
          <Select
            className="select-dashboard"
            options={locationOptions}
            value={selectedBranch}
            onChange={(newValue) => setSelectedBranch(newValue)}
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
            onChange={(newValue) => setSelectedUser(newValue)}
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
            onChange={(newValue) => setSelectedDevice(newValue)}
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
