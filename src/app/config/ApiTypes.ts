export type ApiRequestBody = {
  status?: string;
  urgency?: string;
  priority?: string;
  type?: string;
  requester?: string;
  area_id?: string;
  assignee?: string;
  from?: string;
  to?: string;
  range: string;
  order: string;
  idgt?: number;
  opening_date: {
    from?: string;
    to?: string;
  };
};
export type UpdateTicketRequestBody = {
  id: number;
  status?: number;
  urgency?: number;
  priority?: number;
  type?: number;
  due_date?: string;
  assignee_id?: number;
};