export type SelectDeviceType = {
  id: number;
  name: string;
  serial: string;
  locations_id: number;
};

export type DeviceRemoteConsoleType = {
  id: string;
  name: string;
  hostname: string;
  isConnected: boolean;
  isActive: boolean;
  lastConnected: string;
};
