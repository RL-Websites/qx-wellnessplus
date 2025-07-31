export interface IPaging {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  pageCount?: number;
  data?: Array<any>;
}
