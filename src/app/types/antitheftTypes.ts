export type ExecuteAntitheftActionType = {
  mid: number;
  action_type: number;
  params?: string;
  status?: string;
  users_id: number;
};

export type GetAntitheftType = {
  computers_id: number;
  action_type: number;
  start_date?: Date;
  end_date?: Date;
};
