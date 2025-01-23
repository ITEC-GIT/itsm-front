export type CreateSoftInstRequestType = {
  mid: string;
  computers_id: number;
  name: string;
  url: string;
  destination: string;
  arguments: string;
};

export type SelectDeviceType = {
  id: number;
  name: string;
  serial: string;
};
