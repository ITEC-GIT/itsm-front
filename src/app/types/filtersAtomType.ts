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

type Branch = {
  id: number;
  label: string;
  value: string;
};

export type FilterValue = { value: string; label: string };

export interface StaticDataType {
  branches: Branch[];
  computers: Computer[];
  locations: Location[];
  installation_status: [];
  assignees: Assignee[];
  priority: [];
  requesters: Requester[];
  status: [];
  type: [];
  urgency: [];
  assetCategories: [];
  software_counts: {};
}
