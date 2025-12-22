export interface ApiSuccessSingle<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export interface ApiSuccessList<T> {
  status: "success" | "error";
  message?: string;
  pagination: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  data: T[];
}

export type ApiResponseSingle<T> = ApiSuccessSingle<T>;
export type ApiResponseList<T> = ApiSuccessList<T>;
