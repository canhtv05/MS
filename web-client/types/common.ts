export interface IResponseObject<T> {
  code: string;
  message: string;
  data: T;
  pagination?: IPagination;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  size: number;
  count: number;
  total: number;
}

export interface ClientContext {
  ip: string;
  channel: 'WEB';
  context: string;
}

export interface MultipartFile {
  file: File;
}
