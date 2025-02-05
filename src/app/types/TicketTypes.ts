interface TicketResponse {
    count: number;
    totalcount: number;
    data: any;
  }
interface Assignee {
    id: number;
    name: string;
    avatar?: string;
  }
export type { TicketResponse, Assignee };
