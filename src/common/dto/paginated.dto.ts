export class PaginatedDto<TData> {
  total: number;

  limit: number;

  offset: number;
  
  results: TData[];
}
