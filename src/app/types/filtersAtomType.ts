type Assignee = {
  id: number;
  name: string;
  firstname: string | null;
  Avatar: string | null;
  is_admin: 0 | 1;
  Department: string;
};

export interface StaticDataType {
  Computers: {}[];
  Departments: {}[];
  "Initialized softwares": number;
  Locations: {}[];
  "Received softwares": number;
  SoftwareStatus: {}[];
  assignees: Assignee[];
  priorityOptions: {}[];
  requesters: {}[];
  statusOptions: {}[];
  typeOptions: {}[];
  urgencyOptions: {}[];
}
