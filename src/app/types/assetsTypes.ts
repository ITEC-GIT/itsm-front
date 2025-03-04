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
