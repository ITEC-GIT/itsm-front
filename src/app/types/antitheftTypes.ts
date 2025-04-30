export type ExecuteAntitheftType = {
  mid: number;
  action_type: string;
  params: string;
  status: string;
  users_id: number;
};

export type GetAntitheftType = {
  computers_id: number;
  start_date: Date;
  end_date: Date;
};
