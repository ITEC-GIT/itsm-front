export interface ApiRequestBody {
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
}

export interface UpdateTicketRequestBody {
  id: number;
  status?: number;
  urgency?: number;
  priority?: number;
  type?: number;
  due_date?: string;
  assignee_id?: number[]; // Changed from `[number]` to `number[]` for correct array syntax
}

export interface UpdateTicketReplyRequestBody {
  itemtype: string;
  items_id: number;
  content: string;
}
