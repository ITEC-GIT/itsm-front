export interface PaginatedResponse<T> {
  count: number;
  totalCount: number;
  data: T[];
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export type FilterType = {
  user?: number;
  computer?: number;
  status?: string;
  order?: string;
  date_from?: string;
  date_to?: string;
  range?: string;
  idgt?: number;
};

export type OptionsType = {
  value: number;
  label: string;
};

export type BasicType = {
  id: number;
  name: string;
};

export interface PrivateIpSchema {
  id: number;
  private_ip_address: string;
  mid: number;
}
