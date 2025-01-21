export type DeviceType = {
  id: string;
  name: string;
  hostname: string;
  isConnected: boolean;
  isActive: boolean;
  lastConnected: string;
};

export type HistoryType = {
  device: string;
  software: string;
  destination: string;
  variables: string;
  status: string;
  user: string;
};
