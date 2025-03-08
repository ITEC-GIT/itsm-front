import clsx from "clsx";
import { useLayout } from "../../../_metronic/layout/core";
import Select from "react-select";
import { useAtom } from "jotai";
import { staticDataAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { useEffect, useState } from "react";

const ItsmToolbar = () => {
    const { classes } = useLayout();
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [staticData] = useAtom(staticDataAtom);

    console.log("staticData ==>>", staticData);

    const [data, setData] = useState({
        Computers: [],
        Departments: [],
        assignees: [],
    });

    // useEffect(() => {
    //   if (staticData && typeof staticData === "object") {
    //     setData(staticData as StaticData);
    //   }
    // }, [staticData]);
    // const branchOptions =
    //   staticData?.Departments?.map(
    //     (department: { id: number; name: string }) => ({
    //       value: department.id,
    //       label: department.name,
    //     })
    //   ) || [];
    // const userOptions =
    //   staticData[0]?.assignees?.map((assignee) => ({
    //     value: assignee.id,
    //     label: assignee.name,
    //   })) || [];

    // const deviceOptions =
    //   staticData[0]?.Computers?.map((device) => ({
    //     value: device.id,
    //     label: device.name,
    //   })) || [];

    return (
        <div
            id="kt_app_toolbar_container"
            className={clsx("app-container ", classes.toolbarContainer.join(" "))}
        >
            <div className="d-flex">
                <Select
                    //options={branchOptions}
                    value={selectedBranch}
                    onChange={setSelectedBranch}
                    placeholder="Select Branch"
                />

                <Select
                    //options={userOptions}
                    value={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="Select User"
                />

                <Select
                    //options={deviceOptions}
                    value={selectedDevice}
                    onChange={setSelectedDevice}
                    placeholder="Select Device"
                />

                <div className="search-input-wrapper">
                    <input
                        type="text"
                        id="search-input"
                        className="form-control search-input"
                        placeholder="Search..."
                        // onChange={handleSearchChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ItsmToolbar;
