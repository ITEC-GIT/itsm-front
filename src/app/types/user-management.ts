export type RolesType = {
  id: number;
  name: string;
  permissions: string;
  users: number;
};

export type GroupsType = {
  id: number;
  name: string;
  description: string;
  members: number;
  isInputRow?: boolean;
};

export type DepartmentsType = {
  id: number;
  name: string;
  members: number;
  isInputRow?: boolean;
};

export type LocationsType = {
  id: number;
  name: string;
  address: string;
  state: string;
  departments: number;
  employees: number;
  isInputRow?: boolean;
};

export type AliasesType = {
  id: number;
  alias: string;
  computer: string;
  isInputRow?: boolean;
};

export type UsersType = {
  id: number;
  name: string;
  department: string[];
  group: string[];
  location: string[];
  supervisedBy: string;
  isActive: boolean;
};

export type FieldRulesType = {
  id: number;
  name: string;
  rule: string;
  usedInTabs: string[];
  isInputRow?: boolean;
};
