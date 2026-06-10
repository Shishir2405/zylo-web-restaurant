export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export type SuccessResult<T> = {
  remote: string;
  status?: number;
  message?: string;
  data: T;
  errors?: any;
  // Populated when the backend emits a Pagination response header
  // (PagedList endpoints). Header is exposed via CORS.
  pagination?: PaginationMeta;
};

export type ErrorResult = {
  remote: string;
  status: number;
  message: string | null;
  data?: any;
  errors?: any;
};

export type GetListWithPagination<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: T;
  total_unread_messages_count?: number;
};
