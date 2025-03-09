/**
 * FilterOptionsBuilder - A builder class for constructing query filter options
 *
 * This class provides a fluent interface to build filter options for database queries.
 * It follows the builder pattern to allow chaining methods for constructing complex
 * filter criteria including pagination, sorting, field selection, and various filters.
 *
 * @example
 * const filterOptions = new FilterOptionsBuilder()
 *   .setFilters({ status: 'active' })
 *   .setOrderBy([{ field: 'createdAt', direction: 'DESC' }])
 *   .setPagination(10, 0)
 *   .build();
 */
import { FilterOptions, OrderByOptions } from '../core/interfaces/filter-options';

export class FilterOptionsBuilder {
  /** The filter options object being built */
  private readonly options: FilterOptions = {};

  /**
   * Creates a new FilterOptionsBuilder with default empty options
   */
  constructor() {
    this.options = {
      filters: {},
      orderBy: [],
      selectFields: [],
      pagination: {},
      search: {},
      date: {
        field: '',
      },
      includeDeleted: false,
      isNull: {
        field: '',
        isNull: false,
      },
      groupBy: {
        field: '',
      },
    };
  }

  /**
   * Sets the filter criteria for exact matches
   *
   * @param filters - An object with field names as keys and filter values
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setFilters({ status: 'active', category: 'product' });
   */
  setFilters(filters: Record<string, any>): this {
    this.options.filters = filters;
    return this;
  }

  /**
   * Sets the sorting criteria for the query results
   *
   * @param orderBy - An array of OrderByOptions objects specifying fields and sort directions
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setOrderBy([
   *   { field: 'createdAt', direction: 'DESC' },
   *   { field: 'name', direction: 'ASC' }
   * ]);
   */
  setOrderBy(orderBy: OrderByOptions[]): this {
    this.options.orderBy = orderBy;
    return this;
  }

  /**
   * Specifies which fields to include in the query results
   *
   * @param selectFields - An array of field names to include in the results
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setSelectFields(['id', 'name', 'email']);
   */
  setSelectFields(selectFields: string[]): this {
    this.options.selectFields = selectFields;
    return this;
  }

  /**
   * Sets pagination parameters for the query
   *
   * @param limit - The maximum number of records to return
   * @param offset - The number of records to skip
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setPagination(10, 20); // Get records 21-30
   */
  setPagination(limit: number, offset: number): this {
    this.options.pagination = { limit, offset };
    return this;
  }

  /**
   * Configures full-text search across specified fields
   *
   * @param searchFields - Array of field names to search in
   * @param value - The search term or phrase
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setSearch(['name', 'description'], 'keyword');
   */
  setSearch(searchFields: string[], value: string): this {
    this.options.search = { searchFields, value };
    return this;
  }

  /**
   * Sets a date range filter on a specific date field
   *
   * @param field - The date field name to filter on
   * @param from - Start date in string format (inclusive)
   * @param to - End date in string format (inclusive)
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setDateRange('createdAt', '2023-01-01', '2023-12-31');
   */
  setDateRange(field: string, from: string, to: string): this {
    this.options.date = { field, from, to };
    return this;
  }

  /**
   * Specifies whether to include soft-deleted records in the results
   *
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setIncludeDeleted(true); // Include soft-deleted items
   */
  setIncludeDeleted(includeDeleted: boolean): this {
    this.options.includeDeleted = includeDeleted;
    return this;
  }

  /**
   * Sets a filter to check if a field is null or not null
   *
   * @param field - The field name to check for null/not null
   * @param isNull - If true, matches NULL values; if false, matches NOT NULL values
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setIsNull('deletedAt', true); // Find items with deletedAt being NULL
   */
  setIsNull(field: string, isNull: boolean): this {
    this.options.isNull = { field, isNull };
    return this;
  }

  /**
   * Configures grouping with optional HAVING clause
   *
   * @param field - The field name to group by
   * @param having - Optional having clause with condition and value
   * @returns The builder instance for method chaining
   *
   * @example
   * builder.setGroupBy('category', { condition: '>', value: 5 });
   */
  setGroupBy(field: string, having?: { condition: string; value: number }): this {
    this.options.groupBy = { field, having };
    return this;
  }

  /**
   * Builds and returns the complete FilterOptions object
   *
   * @returns The constructed FilterOptions object
   *
   * @example
   * const filterOptions = builder.build();
   */
  build(): FilterOptions {
    return this.options;
  }
}
