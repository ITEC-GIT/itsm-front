export interface PaginatedResponse<T> {
  count: number;
  totalCount: number;
  data: T[];
}
