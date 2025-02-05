import clsx from "clsx";
import Select from "react-select";
import { useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import { useLayout } from "../../../core";
import { staticDataAtom } from "../../../../../app/atoms/filters-atoms/filtersAtom";
import { StaticDataType } from "../../../../../app/types/filtersAtomType";

const ToolbarMainDashboard = () => {
  const { classes } = useLayout();
  const [selectedBranch, setSelectedBranch] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const staticData = useAtomValue(staticDataAtom) as unknown as StaticDataType;

  const depOptions =
    staticData["Departments"]?.map((department) => ({
      value: "id" in department ? Number(department?.id) : 0,
      label: "name" in department ? String(department?.name) : "",
    })) || [];

  const userOptions =
    staticData["assignees"]?.map((assignee) => ({
      value: "id" in assignee ? Number(assignee?.id) : 0,
      label: "name" in assignee ? String(assignee?.name) : "",
    })) || [];

  const compOptions =
    staticData["Computers"]?.map((device) => ({
      value: "id" in device ? Number(device?.id) : 0,
      label: "name" in device ? String(device?.name) : "",
    })) || [];

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

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
        />

        <Select
          className="select-dashboard"
          options={userOptions}
          value={selectedUser}
          onChange={(newValue) => setSelectedUser(newValue)}
          placeholder="Select User"
        />

        <Select
          className="select-dashboard"
          options={compOptions}
          value={selectedDevice}
          onChange={setSelectedDevice}
          placeholder="Select Device"
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
