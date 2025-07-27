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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: Pagination;
}

export interface SingleApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
