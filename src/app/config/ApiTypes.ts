export type ApiRequestBody = {
    status: string;
    urgency: string;
    priority: string;
    type: string;
    requester: string;
    branch: string;
    assignee: string;
    from: string;
    to: string;
    range: string;
    order: string;
    idgt?: number;
  };