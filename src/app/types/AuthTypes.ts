export type ErrorResponse = {
  response?: {
    data?: any;
  };
};

export type UserAtomType = {
  access_token: string,
  user_id:string,
  user_name:string,
  expires_at:string
};

export const initialUserState: UserAtomType = {
  access_token: "",
  user_id:"",
  user_name:"",
  expires_at:""

};
