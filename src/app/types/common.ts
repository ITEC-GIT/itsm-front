export interface PaginatedResponse<T> {
  count: number;
  totalCount: number;
  data: T[];
}

export interface ColumnVisibility {
  [key: string]: boolean;
}
