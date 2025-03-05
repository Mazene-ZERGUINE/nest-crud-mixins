export interface FilterOptions {
  orderBy?: OrderByOptions[];
  filters?: Record<string, any>;
  selectFields?: string[];

  pagination?: PaginationOptions;
  search?: SearchOptions;
  date?: DateFilterOptions;

  includeDeleted?: boolean;
  isNull?: NullableFilterOptions;
  groupBy?: GroupByFilterOptions;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface SearchOptions {
  searchFields?: string[];
  value?: string;
}

export interface DateFilterOptions {
  field: string;
  from?: string;
  to?: string;
}

export interface NullableFilterOptions {
  field: string;
  isNull: boolean;
}

export interface GroupByFilterOptions {
  field: string;
  having?: { condition: string; value: number };
}

export interface OrderByOptions {
  field: string;
  order?: 'ASC' | 'DESC';
}
