type Assignee = {
  id: number;
  name: string;
  firstname: string | null;
  Avatar: string | null;
  is_admin: 0 | 1;
  Department: string;
  branch_id: number;
};

type Requester = {
  id: number;
  name: string;
  firstname: string | null;
  Avatar: string | null;
  is_admin: 0 | 1;
  Department: string;
  branch_id: number;
};

type Computer = {
  id: number;
  name: string;
  label: string;
  value: string;
  branchid: number;
};

type Location = {
  id: number;
  name: string;
  label: string;
  value: string;
};

export interface StaticDataType {
  computers: Computer[];
  Departments: [];
  "Initialized softwares": number;
  Locations: Location[];
  "Received softwares": number;
  SoftwareStatus: [];
  assignees: Assignee[];
  priorityOptions: [];
  requesters: Requester[];
  statusOptions: [];
  typeOptions: [];
  urgencyOptions: [];
}
