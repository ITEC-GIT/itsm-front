import { PaginatedResponse } from "./common";

export type CreateSoftInstRequestType = {
  mid: string;
  computers_id: number;
  name: string;
  url: string;
  destination: string;
  arguments: string;
};

export type SoftwareHistoryType = {
  id: number;
  software: string; //name
  computers_id: string; //it is a name
  // mid: string; //serial number
  url: string;
  destination: string;
  arguments: string;
  status: string;
  users_id: string; //it is a name
  created_at: string; // created at
};

export type SoftwareInstallationResponseType =
  PaginatedResponse<SoftwareHistoryType>;
