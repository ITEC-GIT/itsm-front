export type SelectDeviceType = {
  id: number;
  name: string;
  serial: string;
  department_id: number;
};

export type DeviceRemoteConsoleType = {
  id: string;
  name: string;
  hostname: string;
  isConnected: boolean;
  isActive: boolean;
  lastConnected: string;
};

export type DeviceIPAddressType = {
  id: string;
  mid: string;
  ip_address: string;
  private_ip_address: string;
  isp: string;
  city: string;
  country: string;
  unix_timestamp: string;
  created_at: string;
  computers_id: string;
};
