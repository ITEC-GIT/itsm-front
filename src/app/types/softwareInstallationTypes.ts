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
  software: string;
  computer_name: string;
  // mid: string; //serial number
  url: string;
  destination: string;
  arguments: string;
  status: string;
  user_name: string;
  created_at: string;
};

export type SoftwareInstallationResponseType =
  PaginatedResponse<SoftwareHistoryType>;

export type GetAllSoftwareInstallationRequestType = {
  user?: number;
  computer?: number;
  status?: string;
  order?: string;
  date_from?: string;
  date_to?: string;
  range?: string;
  idgt?: number;
};
