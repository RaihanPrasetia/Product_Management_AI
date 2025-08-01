export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiParams {
  page?: number;
  limit?: number;
  name_contains?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ApiResponse<T> extends MessageResponse {
  data: T[];
  pagination?: Pagination;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
export interface SingleApiResponse<T> extends MessageResponse {
  data: T;
}
