type Assignee = {
  id: number;
  name: string;
  firstname: string | null;
  Avatar: string | null;
  is_admin: 0 | 1;
  Department: string;
};

type Requester = {
  id: number;
  name: string;
  firstname: string | null;
  Avatar: string | null;
  is_admin: 0 | 1;
  Department: string;
};

type Computer = {
  id: number;
  name: string;
  label: string;
  value: string;
  branchid: number;
};

export interface StaticDataType {
  Computers: Computer[];
  Departments: {}[];
  "Initialized softwares": number;
  Locations: {}[];
  "Received softwares": number;
  SoftwareStatus: {}[];
  assignees: Assignee[];
  priorityOptions: {}[];
  requesters: Requester[];
  statusOptions: {}[];
  typeOptions: {}[];
  urgencyOptions: {}[];
}
