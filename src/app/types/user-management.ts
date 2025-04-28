import { BasicType } from "./common";

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
  location: string;
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

export type UserType = {
  id: number;
  name: string;
  username: string;
  user_category?: "issuer" | "assignee" | "admin";
  email: string;
  profile_image: string | null;
  phone: string | null;
  phone2: string | null;
  mobile: string | null;
  comment: string | null;
  preferred_name: string | null;
  roles: BasicType[];
  department: BasicType | null;
  groups?: BasicType[];
  location?: BasicType;
  title: BasicType | null;
  isActive: boolean;
};

export type UserFormType = UserType & {
  user_password?: string;
};

export type CreateUserType = {
  user_name: string;
  user_password?: string;
  user_category: string;
  locations_id: number;
  departments_id: number;
  user_titles_id: number;
  groups_id: number[];
  is_active: boolean;
  roles_ids: number[];
  profile: {
    preferred_name: string;
    email: string;
    phone: string;
    phone2: string;
    mobile: string;
    profile_image: string;
    comment: string;
    name: string;
  };
};

export type FieldRulesType = {
  id: number;
  name: string;
  rule: string;
  usedInTabs: string[];
  isInputRow?: boolean;
};

export type UserPrerequisitesType = {
  locations: BasicType[];
  departments: BasicType[];
  users: {
    id: number;
    user_name: string;
  }[];
  roles: {
    id: number;
    name: string;
  }[];
  groups: {
    id: number;
    name: string;
    desc: string;
    roles: any[];
  }[];
  user_categories: {
    ISSUER: string;
    ASSIGNEE: string;
    ADMIN: string;
  };
  titles: {
    id: number;
    title: string;
  }[];
};
