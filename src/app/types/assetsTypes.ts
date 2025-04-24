export type AssetsHistoryType = {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  hash: string;
  manufacturer: string;
  serial_number: string;
  model: string;
  type: string;
  computer: {
    id: number;
    name: string;
  };
  date_mode: string;
};

export type AssetSoftwaresType = {
  id: number;
  name: string;
  hash: string;
  version: string;
  architecture: string;
  category: string;
  install_date: string;
  publisher: string;
};

export type GetAllAssetsRequestType = {
  computer?: number;
  idgt?: number;
};

export type AssetDetails = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  specific_attributes: [];
  computer: {
    id: number;
    name: string;
  };
  notes: {};
  date_mode: string;
};

export type ComputerDetails = {
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
  status: "Active" | "Inactive" | string;
  public_ip: string;
  tags: string[];
  history: { date: string; action: string; user: string }[];
};

export interface CategoryOption {
  value: string;
  label: string;
}
export interface AssetsField {
  id: number;
  key: string;
  type: string; //"input" | "select" |  "number" | "upload";
  label: string;
  category: string[];
  group: string;
  options?: CategoryOption[];
  note?: string;
}

export interface FieldValues {
  [key: string]: boolean;
}

export type GetAssetSoftwaresType = {
  computer?: number;
};
