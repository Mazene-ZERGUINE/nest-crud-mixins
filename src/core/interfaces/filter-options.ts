/**
 * Defines options for filtering and sorting basic crud queries results in the CRUD service.
 * to be used in the crud controller
 */
export interface FilterOptions {
  /**
   * Specifies the fields and sorting order (ascending/descending) for ordering query results.
   */
  orderBy?: OrderByOptions[];

  /**
   * Defines key-value pairs for filtering records.
   */
  filters?: Record<string, any>;

  /**
   * Specifies which fields should be included in the response.
   * Example: `['id', 'name', 'email']`
   */
  selectFields?: string[];

  /**
   * Enables pagination for query results.
   * Example: `{ limit: 10, offset: 20 }`
   */
  pagination?: PaginationOptions;

  /**
   * Enables text-based search filtering across specified fields.
   * Example: `{ searchFields: ['title', 'description'], value: 'nestjs' }`
   */
  search?: SearchOptions;

  /**
   * Filters records based on a date range.
   * Example: `{ field: 'createdAt', from: '2024-03-01', to: '2024-03-10' }`
   */
  date?: DateFilterOptions;

  /**
   * Includes soft-deleted records in the query results.
   * If `true`, results will include both active and deleted records.
   */
  includeDeleted?: boolean;

  /**
   * Filters records based on whether a field is null or not.
   * Example: `{ field: 'deletedAt', isNull: true }` (Returns non-deleted records)
   */
  isNull?: NullableFilterOptions;

  /**
   * Groups results by a specific field.
   * Example: `{ field: 'category', having: { condition: 'COUNT(*) >', value: 10 } }`
   */
  groupBy?: GroupByFilterOptions;
}

/**
 * Defines pagination options for query results.
 */
export interface PaginationOptions {
  /**
   * The number of records to return per page.
   */
  limit?: number;

  /**
   * The number of records to skip before starting to return results.
   */
  offset?: number;
}

/**
 * Defines options for performing a text-based search.
 */
export interface SearchOptions {
  /**
   * The fields where the search should be applied.
   */
  searchFields?: string[];

  /**
   * The search term to be matched against the specified fields.
   */
  value?: string;
}

/**
 * Defines filtering options based on date ranges.
 */
export interface DateFilterOptions {
  /**
   * The field to apply the date filter on (e.g., `createdAt`, `updatedAt`).
   */
  field: string;

  /**
   * The start date for filtering records.
   * Example format: `'YYYY-MM-DD'`
   */
  from?: string;

  /**
   * The end date for filtering records.
   * Example format: `'YYYY-MM-DD'`
   */
  to?: string;
}

/**
 * Defines options for filtering records where a field is null or not null.
 */
export interface NullableFilterOptions {
  /**
   * The field to check for null values.
   */
  field: string;

  /**
   * If `true`, filters records where the field is NULL.
   * If `false`, filters records where the field is NOT NULL.
   */
  isNull: boolean;
}

/**
 * Defines options for grouping query results.
 */
export interface GroupByFilterOptions {
  /**
   * The field to group records by.
   */
  field: string;

  /**
   * Defines conditions for filtering grouped results.
   * Example: `{ condition: 'COUNT(*) >', value: 10 }` filters groups having more than 10 records.
   */
  having?: { condition: string; value: number };
}

/**
 * Defines sorting options for query results.
 */
export interface OrderByOptions {
  /**
   * The field to order the results by.
   */
  field: string;

  /**
   * Sorting order: `'ASC'` for ascending, `'DESC'` for descending.
   * Default is `'ASC'` if not specified.
   */
  order?: 'ASC' | 'DESC';
}
