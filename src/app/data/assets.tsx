import { useState } from "react";
import {
  AssetsHistoryType,
  GetAllAssetsRequestType as FilterType,
} from "../types/assetsTypes";
import { TableColumn } from "react-data-table-component";
import { Link } from "react-router-dom";
import { getBackgroundColor } from "../../utils/custom";
import {
  columnLargeWidth,
  columnXLargeWidth,
  columnXXLargeWidth,
  columnXXXLargeWidth,
} from "./dataTable";
import { VscTools } from "react-icons/vsc";
import {
  FaComputer,
  FaPlug,
  FaRegCircle,
  FaPhone,
  FaSimCard,
  FaNetworkWired,
} from "react-icons/fa6";
import { LuPrinter, LuMonitor } from "react-icons/lu";
import {
  MdDevices,
  MdLocalDrink,
  MdOutlineCable,
  MdOutlineDeviceUnknown,
  MdOutlineRoomPreferences,
} from "react-icons/md";
import { GrStorage } from "react-icons/gr";
import { BsHddRack, BsModem } from "react-icons/bs";
import { SiInkdrop } from "react-icons/si";
import { ActionModal } from "../components/modal/ActionModal";
import { useAtom } from "jotai";
import { staticDataAtom } from "../atoms/app-routes-global-atoms/approutesAtoms";

export const activeFilters = ["computersFilter", "AssetCategoriesFilter"];

const colors = [
  "#f7c1c1",
  "#d4e6a8",
  "#fadcbf",
  "#fae4ae",
  "#e6e6a8",
  "#f7e6c1",
  "#fde9b3",
  "#d9d3cb",
  "#f7c1c9",
  "#d4e6a8",
  "#fadcba",
  "#fae4ad",
  "#e0e0e9",
  "#f7e6c8",
  "#fde9b0",
  "#d9d3cf",
  "#e0e0e0",
];

export const getColumns = (
  triggerFilters: React.Dispatch<React.SetStateAction<FilterType>>
): TableColumn<AssetsHistoryType>[] =>
  [
    {
      name: "",
      width: columnXXLargeWidth,
      cell: (row: AssetsHistoryType) => {
        const [showActionModal, setShowActionModal] = useState(false);
        const [staticData] = useAtom(staticDataAtom);

        const assetCategories =
          staticData["assetCategories" as keyof typeof staticData] || [];
        const backgroundColor = getBackgroundColor(
          row.category.name,
          assetCategories,
          colors
        );
        return (
          <div className="d-flex justify-content-between w-100">
            <div>
              <input
                type="checkbox"
                // checked={selectedRows.has(row.id)}
                // onChange={() => toggleRowSelection(row.id)}
              />

              <button
                type="button"
                className={`btn btn-link p-0 ms-2`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Action"
                onClick={() => setShowActionModal(!showActionModal)}
              >
                <VscTools
                  style={{
                    fontSize: "20px",
                    color: "rgb(170 161 146)",
                  }}
                />
              </button>
            </div>

            <span
              className="category-span "
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {assignIcon(row.category.name.toLowerCase()) || (
                <i className="fa-thin fa-question"></i>
              )}
            </span>
            {showActionModal && (
              <ActionModal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                category={row.category.name.toLowerCase()}
                assetId={row.id}
              />
            )}
          </div>
        );
      },
      id: "settings",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Device
        </span>
      ),
      selector: (row: AssetsHistoryType) => row.name,
      sortable: true,
      width: columnXXXLargeWidth,
      cell: (row: AssetsHistoryType) => {
        return (
          <div className="d-flex justify-content-between w-100">
            <Link
              to={`/assets/${row.id}`}
              title={row.name}
              style={{ color: "blue", textDecoration: "none" }}
            >
              {row.name}
            </Link>
          </div>
        );
      },
      id: "name",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Category
        </span>
      ),
      selector: (row: AssetsHistoryType) => row.category.name.toLowerCase(),
      sortable: true,
      width: columnXXLargeWidth,

      id: "category",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Type
        </span>
      ),
      width: columnXLargeWidth,
      selector: (row: AssetsHistoryType) => row.type,
      sortable: true,
      id: "type",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Model
        </span>
      ),
      width: columnLargeWidth,
      selector: (row: AssetsHistoryType) => row.model,
      sortable: true,
      cell: (row: AssetsHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.model}
        >
          {row.model}
        </span>
      ),
      id: "model",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Manufacturer
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: AssetsHistoryType) => row.model,
      sortable: true,
      cell: (row: AssetsHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.model}
        >
          {row.manufacturer}
        </span>
      ),
      id: "manufacturer",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Serial Number
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: AssetsHistoryType) => row.serial_number,
      sortable: true,
      cell: (row: AssetsHistoryType) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.serial_number}
          className="url-cell"
        >
          {row.serial_number}
        </span>
      ),
      id: "serial_number",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Parent Asset
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: AssetsHistoryType) => {
        row.computer?.name;
      },
      sortable: true,
      cell: (row: AssetsHistoryType) => (
        <span
          className="cursor-pointer"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={row.computer?.name}
          onClick={() => triggerFilters({ computer: row.computer.id })}
        >
          {row.computer?.name}
        </span>
      ),
      id: "computer",
    },
    {
      name: (
        <span>
          <span style={{ color: "#f0f0f0" }}>|</span> Modified date
        </span>
      ),
      width: columnXXLargeWidth,
      selector: (row: AssetsHistoryType) => row.date_mode,
      sortable: true,
      cell: (row: AssetsHistoryType) => {
        const formattedDate = new Date(row.date_mode).toLocaleDateString(
          "en-GB"
        );
        return (
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={row.date_mode}
          >
            {formattedDate}
          </span>
        );
      },
      id: "date_mod",
    },
  ].filter(Boolean) as TableColumn<AssetsHistoryType>[];

export const AppButtons = [{ id: 3, text: "Software", icon: "bi-window" }];

export const DetailsButtons = [
  { id: 1, text: "Hardware & misc", icon: "bi bi-gear" },
  { id: 2, text: "Network ports", icon: "bi bi-ethernet" },
  { id: 3, text: "Antivirus", icon: "bi-shield-x" },
  { id: 4, text: "Operating System", icon: "bi-gear-wide-connected" },
  { id: 5, text: "Disk volume", icon: "bi bi-hdd-stack" },
];

export const AssetFields = [
  {
    id: 1,
    key: "name",
    type: "input",
    label: "Name",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 2,
    key: "location",
    type: "select",
    label: "Location",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 3,
    key: "technicianInCharge",
    type: "select",
    label: "Technician in charge",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 4,
    key: "groupInCharge",
    type: "select",
    label: "Group in charge",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 5,
    key: "alternateUsernameNumber",
    type: "input",
    label: "Alternate username number",
    category: ["Computer", "Network device", "Devices", "Printer", "Phone"],
    group: "Ownership",
  },
  {
    id: 6,
    key: "alternateUsername",
    type: "input",
    label: "Alternate username",
    category: ["Computer", "Network device", "Devices", "Printer", "Phone"],
    group: "Ownership",
  },
  {
    id: 7,
    key: "serialNumber",
    type: "input",
    label: "Serial number",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 8,
    key: "inventoryNumber",
    type: "input",
    label: "Inventory number",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 9,
    key: "DevicesBrand",
    type: "input",
    label: "Brand",
    category: ["Devices"],
    group: "Basic Information",
  },
  {
    id: 10,
    key: "user",
    type: "select",
    label: "User",
    category: ["General"],
    group: "Ownership",
  },
  {
    id: 11,
    key: "group",
    type: "select",
    label: "Group",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 12,
    key: "monitorType",
    type: "select",
    label: "Type",
    category: ["Monitor"],
    group: "Basic Information",
  },
  {
    id: 13,
    key: "status",
    type: "select",
    label: "Status",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 14,
    key: "managementType",
    type: "select",
    label: "Management type",
    category: ["Computer", "Monitor", "Devices", "Printer", "Phone"],
    group: "More Information",
  },
  {
    id: 15,
    key: "uuid",
    type: "input",
    label: "UUID",
    category: ["General"],
    group: "Basic Information",
  },
  {
    id: 16,
    key: "snmpCredential",
    type: "select",
    label: "SNMP credential",
    category: ["Network device", "Printer"],
    group: "More Information",
  },
  {
    id: 17,
    key: "manufacturer",
    type: "select",
    label: "Manufacturer",
    category: ["General"],
    group: "More Information",
  },
  {
    id: 18,
    key: "sysdescr",
    type: "input",
    label: "Sysdescr",
    category: ["Network device", "Printer"],
    group: "More Information",
  },
  {
    id: 19,
    key: "network",
    type: "select",
    label: "Network",
    category: ["Computer", "Printer"],
    group: "More Information",
  },
  {
    id: 20,
    key: "memory",
    type: "number",
    label: "Memory",
    category: ["Printer"],
    group: "More Information",
  },
  {
    id: 21,
    key: "initialPageCounter",
    type: "number",
    label: "Initial page counter",
    category: ["Pinter"],
    group: "More Information",
  },
  {
    id: 22,
    key: "currentPageCounter",
    type: "number",
    label: "Current counter of pages",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 23,
    key: "numberOfLines",
    type: "number",
    label: "Number of lines",
    category: ["Phone"],
    group: "More Information",
  },
  {
    id: 24,
    key: "phonePowerSupplyType",
    type: "select",
    label: "Phone power supply type",
    category: ["Phone"],
    group: "More Information",
  },
  {
    id: 25,
    key: "pictures",
    type: "upload",
    label: "Pictures",
    category: ["Monitor", "Software", "Cartridge", "Consumable"],
    group: "Uploads",
  },
  {
    id: 26,
    key: "stockTarget",
    type: "number",
    label: "Stock target",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 27,
    key: "alertThreshold",
    type: "number",
    label: "Alert threshold",
    category: ["Computer"],
    group: "More Information",
  },
  {
    id: 28,
    key: "reference",
    type: "input",
    label: "Reference",
    category: ["Cartridge", "Consumable"],
    group: "More Information",
  },
  {
    id: 29,
    key: "computerModel",
    type: "select",
    label: "Model",
    category: ["Computer"],
    group: "Basic Information",
  },
  {
    id: 30,
    key: "computerType",
    type: "select",
    label: "Type",
    category: ["Computer"],
    group: "Basic Information",
  },
  {
    id: 31,
    key: "size",
    type: "number",
    label: "Size",
    category: ["Monitor"],
    group: "More Information",
  },
  {
    id: 32,
    key: "monitorPorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Monitor"],
    group: "Connectivity",
    options: [
      { value: "USB", label: "USB" },
      { value: "HDMI", label: "HDMI" },
      { value: "Ethernet", label: "Ethernet" },
      { value: "Audio", label: "Audio" },
    ],
  },
  {
    id: 33,
    key: "monitorModel",
    type: "select",
    label: "Model",
    category: ["Monitor"],
    group: "Basic Information",
  },
  {
    id: 34,
    key: "publisher",
    type: "select",
    label: "Publisher",
    category: ["Software"],
    group: "More Information",
  },
  {
    id: 35,
    key: "softwareCategory",
    type: "select",
    label: "Software category",
    category: ["Software"],
    group: "Basic Information",
  },
  {
    id: 36,
    key: "AssociableToTicket",
    type: "checkboxGroup",
    label: "Associable to a ticket",
    category: ["Software"],
    group: "Updates",
  },
  {
    id: 37,
    key: "NetworkType",
    type: "select",
    label: "Type",
    category: ["Network device"],
    group: "Basic Information",
  },
  {
    id: 38,
    key: "NetworkModel",
    type: "select",
    label: "Model",
    category: ["Network device"],
    group: "Basic Information",
  },
  {
    id: 39,
    key: "Network",
    type: "select",
    label: "Network",
    category: ["Network device"],
    group: "More Information",
  },
  {
    id: 40,
    key: "Memory",
    type: "select",
    label: "Memory (Mio)",
    category: ["Network device"],
    group: "More Information",
  },
  {
    id: 41,
    key: "DevicesType",
    type: "select",
    label: "Type",
    category: ["Devices"],
    group: "Basic Information",
  },
  {
    id: 100,
    key: "DevicesModel",
    type: "select",
    label: "Model",
    category: ["Devices"],
    group: "Basic Information",
  },
  {
    id: 42,
    key: "CurrentCounterOfPages",
    type: "number",
    label: "Current counter of pages",
    category: ["Printer"],
    group: "More Information",
  },
  {
    id: 43,
    key: "PrinterPorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Printer"],
    group: "Connectivity",
    options: [
      { value: "Serail", label: "Serail" },
      { value: "Parallel", label: "Parallel" },
      { value: "USB", label: "USB" },
      { value: "Ethernet", label: "Ethernet" },
      { value: "Wifi", label: "Wifi" },
    ],
  },
  {
    id: 44,
    key: "PrinterType",
    type: "select",
    label: "Type",
    category: ["Printer"],
    group: "Basic Information",
  },
  {
    id: 45,
    key: "PrinterModel",
    type: "select",
    label: "Model",
    category: ["Printer"],
    group: "Basic Information",
  },
  {
    id: 46,
    key: "Alert threshold",
    type: "number",
    label: "Alert threshold",
    category: ["Cartridge", "Consumable"],
    group: "More Information",
  },
  {
    id: 47,
    key: "CartridgeType",
    type: "select",
    label: "Type",
    category: ["Cartridge"],
    group: "Basic Information",
  },
  {
    id: 48,
    key: "Stock target",
    type: "number",
    label: "Stock target",
    category: ["Cartridge", "Consumable"],
    group: "Basic Information",
  },
  {
    id: 49,
    key: "ConsumableType",
    type: "select",
    label: "Type",
    category: ["Consumable"],
    group: "Basic Information",
  },
  {
    id: 50,
    key: "PhonePorts",
    type: "checkboxGroup",
    label: "Ports",
    category: ["Phone"],
    group: "Connectivity",
    options: [
      { value: "Headset", label: "Headset" },
      { value: "Speaker", label: "Speaker" },
    ],
  },
  {
    id: 51,
    key: "PhoneType",
    type: "select",
    label: "Type",
    category: ["Phone"],
    group: "Basic Information",
  },
  {
    id: 52,
    key: "PhoneModel",
    type: "select",
    label: "Model",
    category: ["Phone"],
    group: "Basic Information",
  },
  {
    id: 53,
    key: "PhoneBrand",
    type: "select",
    label: "Brand",
    category: ["Phone"],
    group: "Basic Information",
  },
  {
    id: 54,
    key: "RackType",
    type: "select",
    label: "Type",
    category: ["Rack"],
    group: "Basic Information",
  },
  {
    id: 55,
    key: "RackModel",
    type: "select",
    label: "Model",
    category: ["Rack"],
    group: "Basic Information",
  },
  {
    id: 56,
    key: "ServerRoom",
    type: "select",
    label: "Server Room",
    category: ["Rack"],
    group: "Room Details",
  },
  {
    id: 58,
    key: "DoorOrientationRoom",
    type: "select",
    label: "Door orientation in room",
    category: ["Rack"],
    group: "Room Details",
    options: [
      { label: "North", value: "North" },
      { label: "South", value: "South" },
      { label: "East", value: "East" },
      { label: "West", value: "West" },
    ],
  },
  {
    //ask about this
    id: 57,
    key: "PositionRoom",
    type: "input",
    label: "Position in room",
    category: ["Rack"],
    group: "Room Details",
  },
  {
    id: 59,
    key: "PositionRoom",
    type: "input",
    label: "Position in room",
    category: ["Rack"],
    group: "Room Details",
  },
  {
    id: 61,
    key: "Width",
    type: "number",
    label: "Width",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 62,
    key: "Height",
    type: "number",
    label: "Height",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 63,
    key: "Depth",
    type: "number",
    label: "Depth",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 64,
    key: "NumberOfUnits",
    type: "number",
    label: "Number of units",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 65,
    key: "Max. power",
    type: "number",
    label: "Max. power (in watts)",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 66,
    key: "Measured power",
    type: "number",
    label: "Measured power (in watts)",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 67,
    key: "Max. weight",
    type: "number",
    label: "Max. weight",
    category: ["Rack"],
    group: "Asset Metrics",
  },
  {
    id: 68,
    key: "Power supplies",
    type: "number",
    label: "Power supplies",
    category: ["Enclosure"],
    group: "Asset Metrics",
  },
  {
    id: 69,
    key: "EnclosureModel",
    type: "select",
    label: "Model",
    category: ["Enclosure"],
    group: "Basic Information",
  },
  {
    id: 70,
    key: "PDUModel",
    type: "select",
    label: "Model",
    category: ["PDU"],
    group: "Basic Information",
  },
  {
    id: 71,
    key: "PDUType",
    type: "select",
    label: "Type",
    category: ["PDU"],
    group: "Basic Information",
  },
  {
    id: 72,
    key: "PassiveModel",
    type: "select",
    label: "Model",
    category: ["Passive device"],
    group: "Basic Information",
  },
  {
    id: 73,
    key: "PassiveType",
    type: "select",
    label: "Type",
    category: ["Passive device"],
    group: "Basic Information",
  },
  {
    id: 74,
    key: "PINCODE",
    type: "password",
    label: "PIN code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 75,
    key: "PIN2CODE",
    type: "password",
    label: "PIN2 code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 76,
    key: "PUKCODE",
    type: "password",
    label: "PUK code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 77,
    key: "PUK2CODE",
    type: "password",
    label: "PUK2 code",
    category: ["Simcard"],
    group: "Credentials",
  },
  {
    id: 78,
    key: "Line",
    type: "select",
    label: "Line",
    category: ["Simcard"],
    group: "Basic Information",
  },
  {
    id: 79,
    key: "SimcardType",
    type: "input",
    label: "Type",
    category: ["Simcard"],
    group: "Basic Information",
  },
  {
    id: 80,
    key: "SimcardComponent",
    type: "select",
    label: "Component",
    category: ["Simcard"],
    group: "Basic Information",
  },
  {
    id: 81,
    key: "Mobile Subscriber Identification Number",
    type: "input",
    label: "Mobile Subscriber Identification Number",
    category: ["Simcard"],
    group: "Basic Information",
    note: "MSIN is the least 8 or 10 digits og IMSI ",
  },
  {
    id: 82,
    key: "Comments",
    type: "textArea",
    label: "Comments",
    category: ["General"],
    group: "More Information",
  },
];

export const Steps = [
  {
    id: 1,
    title: "Ownership",
    iconClass: "fa-solid fa-user-shield",
  },
  {
    id: 2,
    title: "Basic Information",
    iconClass: "fa-solid fa-circle-info",
  },
  {
    id: 3,
    title: "More Information",
    iconClass: "fa-solid fa-file-lines",
  },
  {
    id: 4,
    title: "Connectivity",
    iconClass: "fa-solid fa-wifi",
  },
  {
    id: 5,
    title: "Uploads",
    iconClass: "fa-solid fa-upload",
  },
  {
    id: 6,
    title: "Room Details",
    iconClass: "fa-solid fa-house",
  },
  {
    id: 7,
    title: "Asset Metrics",
    iconClass: "fa-solid fa-chart-line",
  },
  {
    id: 8,
    title: "Credentials",
    iconClass: "fa-solid fa-id-card",
  },
  {
    id: 9,
    title: "Submission",
    iconClass: "fa-solid fa-circle-check",
  },
];

const assignIcon = (categoryName: string) => {
  if (categoryName.toLowerCase().includes("computer"))
    return <FaComputer className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("printer"))
    return <LuPrinter className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("monitor"))
    return <LuMonitor className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("software"))
    return <i className="fa-brands fa-uncharted table-icon-color"></i>;
  if (categoryName.toLowerCase().includes("network"))
    return <FaNetworkWired className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("devices"))
    return <MdDevices className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("cartridge"))
    return <SiInkdrop className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("consumable"))
    return <MdLocalDrink className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("racks"))
    return <BsHddRack className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("enclosures"))
    return <MdOutlineRoomPreferences className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("pdus"))
    return <FaPlug className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("passive"))
    return <FaRegCircle className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("unmanaged"))
    return <MdOutlineDeviceUnknown className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("cables"))
    return <MdOutlineCable className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("phone"))
    return <FaPhone className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("simcard"))
    return <FaSimCard className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("storage"))
    return <GrStorage className="table-icon-color" />;
  if (categoryName.toLowerCase().includes("modem"))
    return <BsModem className="table-icon-color" />;
  return <i className="fa-thin fa-question table-icon-color"></i>;
};

export const Actions: Record<
  string,
  {
    key: string;
    id: number;
    labels: { name: string; icon: string; excludedCategories?: string[] }[];
  }
> = {
  "Anti-Theft Actions": {
    id: 1,
    key: "Anti-Theft Actions",
    labels: [
      {
        name: "Take Screenshot",
        icon: "https://img.icons8.com/?size=50&id=13371&format=png&color=000000",
      },
      {
        name: "Take Camera Picture",
        icon: "https://img.icons8.com/?size=50&id=20859&format=png&color=000000",
      },
      {
        name: "Voice Record (5min)",
        icon: "https://img.icons8.com/?size=50&id=MewtzptWEsk5&format=png&color=000000",
      },
      {
        name: "Open Location",
        icon: "https://img.icons8.com/?size=50&id=13778&format=png&color=000000",
      },
      {
        name: "Encrypt",
        icon: "https://img.icons8.com/?size=50&id=12324&format=png&color=000000",
      },
    ],
  },
  "Co-Reach Actions": {
    id: 2,
    key: "Co-Reach Actions",
    labels: [
      {
        name: "VNC",
        icon: "https://img.icons8.com/?size=50&id=9MJf0ngDwS8z&format=png&color=000000",
      },
      {
        name: "SSH",
        icon: "https://img.icons8.com/?size=50&id=19292&format=png&color=000000",
      },
      {
        name: "Send Command",
        icon: "https://img.icons8.com/?size=50&id=1PZDx02Lg0Is&format=png&color=000000",
      },
      {
        name: "Software Install",
        icon: "https://img.icons8.com/?size=50&id=18363&format=png&color=000000",
      },
      {
        name: "Performance Monitoring",
        icon: "https://img.icons8.com/?size=50&id=EIn9Yb82LfeM&format=png&color=000000",
      },
    ],
  },
  "More Actions": {
    id: 3,
    key: "More Actions",
    labels: [
      {
        name: "Add a document",
        icon: "https://img.icons8.com/?size=50&id=CQRMBNqHIi78&format=png&color=000000",
        excludedCategories: ["pdus", "enclosures", "racks", "passivedevices"],
      },
      {
        name: "Add note",
        icon: "https://img.icons8.com/?size=50&id=vDaHd0NhMQuc&format=png&color=000000",
        excludedCategories: ["pdus", "enclosures", "racks", "passivedevices"],
      },
    ],
  },
};

export const AssetCategoryActions: Record<string, string[]> = {
  computers: ["Anti-Theft Actions", "Co-Reach Actions", "More Actions"],
  monitors: ["More Actions"],
  software: ["More Actions"],
  networkdevice: ["More Actions"],
  devices: ["More Actions"],
  printers: ["More Actions"],
  cartridgemodels: ["More Actions"],
  consumablemodels: ["More Actions"],
  phone: ["More Actions"],
  racks: ["More Actions"],
  enclosures: ["More Actions"],
  pdus: ["More Actions"],
  passivedevices: ["More Actions"],
  simcard: ["More Actions"],
  modems: ["More Actions"],
  storages: ["More Actions"],
  usbdevices: ["More Actions"],
};

export const getAvailableActions = (category: string) => {
  const actionCategories = AssetCategoryActions[category] || [];

  const availableActions = actionCategories.reduce((acc, actionCategory) => {
    if (Actions[actionCategory]) {
      acc[actionCategory] = {
        key: Actions[actionCategory].key,
        labels: Actions[actionCategory].labels.filter(
          (label) =>
            !label.excludedCategories ||
            !label.excludedCategories.includes(category)
        ),
      };
    }
    return acc;
  }, {} as Record<string, { key: string; labels: { name: string; icon: string }[] }>);

  return availableActions;
};
