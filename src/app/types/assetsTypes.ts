export type AssetsHistoryType = {
  id: number;
  name: string;
  entity: string;
  serial_number: string;
  model: string;
  location: string;
  last_update: string;
  component_processor: string;
  type: string;
  project: string;
  address: string;
  inventory_number: string;
  alternate_username_number: string;
  action: string;
  status: string;
  public_ip: string;
};

export type GetAllAssetsRequestType = {
  user?: number;
  computer?: number;
  status?: string;
  order?: string;
  date_from?: string;
  date_to?: string;
  range?: string;
  idgt?: number;
};

export type AssetDetails = {
  id: string;
  name: string;
  entity: string;
  serial_number: string;
  model: string;
  location: string;
  component_processor: string;
  last_update: string;
  type: "Server" | "Laptop" | string;
  project: string;
  address: string;
  inventory_number: string;
  alternate_username_number: string;
  status: "Active" | "Inactive" | string; // Adjust status types
  public_ip: string;
  tags: string[];
  history: { date: string; action: string; user: string }[];
};

export const AppButtons = [
  { id: 1, text: "Windows Service", icon: "bi-gear" },
  { id: 2, text: "All Processes", icon: "bi-list" },
  { id: 3, text: "Software", icon: "bi-window" },
  { id: 4, text: "Managed Software", icon: "bi-code-slash" },
  { id: 5, text: "Registry Editor", icon: "bi-box" },
  { id: 6, text: "File Explorer", icon: "bi-folder" },
];

export const PoliciesButtons = [
  { id: 1, text: "Intelligent Alerting", icon: "bi-stars" },
  { id: 2, text: "Alert Management", icon: "bi-exclamation-diamond" },
  { id: 3, text: "Patch Management", icon: "bi-bandaid" },
  { id: 4, text: "Scheduled Actions", icon: "bi-code-slash" },
  { id: 5, text: "Antivirus", icon: "bi-shield-x" },
  { id: 6, text: "Software Management", icon: "bi-folder" },
  { id: 7, text: "Remote Desktop", icon: "bi-window" },
  { id: 8, text: "System Tray", icon: "bi-window-desktop" },
  { id: 9, text: "Asset Onboarding", icon: "bi-collection" },
  { id: 10, text: "Maintenance Mode", icon: "bi-cone-striped" },
];
