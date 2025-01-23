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

export type SoftwareHistoryType = {
  software: string; //name
  computers_id: string; //it is a name
  // mid: string; //serial number
  url: string;
  destination: string;
  variables: string;
  status: string;
  users_id: string; //it is a name
  created_at: string; // created at
};
