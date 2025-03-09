import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * A service class that provides a fluent interface for dynamically building complex
 * SQL queries using TypeORM's `SelectQueryBuilder`. It allows applying filters, ordering,
 * pagination, search, date filters, soft deletion, and more.
 *
 * @template ENTITY - The entity type for which the query builder is used.
 */
export class QueryBuilderService<ENTITY extends ObjectLiteral> {
  /**
   * Initializes the query builder service with a given TypeORM `SelectQueryBuilder`.
   * @param queryBuilder - The TypeORM query builder instance.
   */
  constructor(private queryBuilder: SelectQueryBuilder<ENTITY>) {}

  /**
   * Applies filtering conditions to the query based on provided key-value pairs.
   *
   * @param filters - A record of field-value pairs to filter the results.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyFilters({ status: 'active', category: 'tech' });
   * ```
   */
  applyFilters(filters?: Record<string, any>) {
    if (!filters) return this;

    Object.keys(filters).forEach((key) => {
      this.queryBuilder.andWhere(`entity.${key} = :${key}`, {
        [key]: filters[key],
      });
    });

    return this;
  }

  /**
   * Applies sorting to the query based on provided fields and their respective order.
   *
   * @param orderBy - An array of objects defining fields and their sorting order (`ASC` or `DESC`).
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyOrderBy([{ field: 'createdAt', order: 'DESC' }]);
   * ```
   */
  applyOrderBy(orderBy?: { field: string; order?: 'ASC' | 'DESC' }[]) {
    if (!orderBy || orderBy.length === 0) return this;

    orderBy.forEach(({ field, order }) => {
      this.queryBuilder.addOrderBy(`entity.${field}`, order || 'ASC');
    });

    return this;
  }

  /**
   * Selects specific fields from the entity and its relations.
   *
   * @param selectFields - An array of entity fields to select.
   * @param relations - An array of relation names to include in the selection.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applySelectFields(['id', 'name'], ['profile']);
   * ```
   */
  applySelectFields(selectFields?: string[], relations?: string[]) {
    if (!selectFields || selectFields.length === 0) return this;

    const selectedFields = new Set(selectFields);

    relations?.forEach((relation) => {
      this.queryBuilder.addSelect(`${relation}.id`);
      this.queryBuilder.addSelect(`${relation}.bio`);
    });

    selectedFields.forEach((field) => {
      this.queryBuilder.addSelect(field.includes('.') ? field : `entity.${field}`);
    });

    return this;
  }

  /**
   * Applies pagination by setting `limit` and `offset` values.
   *
   * @param pagination - An object containing `limit` (number of results) and `offset` (starting position).
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyPagination({ limit: 10, offset: 20 });
   * ```
   */
  applyPagination(pagination?: { limit?: number; offset?: number }) {
    if (!pagination || !pagination.limit) return this;

    this.queryBuilder.limit(pagination.limit).offset(pagination.offset || 0);

    return this;
  }

  /**
   * Applies search conditions to multiple fields using a `LIKE` SQL clause.
   *
   * @param search - An object containing the `value` to search and an array of `searchFields` to search within.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applySearch({ searchFields: ['title', 'description'], value: 'typescript' });
   * ```
   */
  applySearch(search?: { searchFields?: string[]; value?: string }) {
    if (!search?.value || !search.searchFields?.length) return this;

    search.searchFields.forEach((field, index) => {
      this.queryBuilder.orWhere(`${index === 0 ? '' : 'OR'} entity.${field} LIKE :search`, {
        search: `%${search.value}%`,
      });
    });

    return this;
  }

  /**
   * Applies a date range filter to the query.
   *
   * @param date - An object defining the date `field` and the `from` and `to` range values.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyDateFilter({ field: 'createdAt', from: '2024-01-01', to: '2024-12-31' });
   * ```
   */
  applyDateFilter(date?: { field: string; from?: string; to?: string }) {
    if (!date?.field || !date.from || !date.to) return this;

    this.queryBuilder.andWhere(`entity.${date.field} BETWEEN :from AND :to`, {
      from: date.from,
      to: date.to,
    });

    return this;
  }

  /**
   * Includes soft-deleted records in the query results.
   *
   * @param includeDeleted - A boolean indicating whether to include soft-deleted records.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyIncludeDeleted(true);
   * ```
   */
  applyIncludeDeleted(includeDeleted?: boolean) {
    if (includeDeleted) {
      this.queryBuilder.withDeleted();
    }

    return this;
  }

  /**
   * Filters records based on whether a specific field is `NULL` or `NOT NULL`.
   *
   * @param isNull - An object defining the `field` to check and a boolean `isNull` flag.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyIsNull({ field: 'deletedAt', isNull: true });
   * ```
   */
  applyIsNull(isNull?: { field: string; isNull: boolean }) {
    if (!isNull?.field) return this;

    this.queryBuilder.andWhere(`entity.${isNull.field} IS ${isNull.isNull ? 'NULL' : 'NOT NULL'}`);

    return this;
  }

  /**
   * Applies `GROUP BY` and optional `HAVING` conditions to the query.
   *
   * @param groupBy - An object defining the `field` to group by and an optional `having` condition.
   * @returns The current instance of `QueryBuilderService` for method chaining.
   *
   * @example
   * ```ts
   * queryBuilderService.applyGroupBy({ field: 'category', having: { condition: 'COUNT(*) >', value: 10 } });
   * ```
   */
  applyGroupBy(groupBy?: { field: string; having?: { condition: string; value: number } }) {
    if (!groupBy?.field) return this;

    this.queryBuilder.groupBy(`entity.${groupBy.field}`);

    if (groupBy.having) {
      this.queryBuilder.having(`${groupBy.having.condition} :value`, {
        value: groupBy.having.value,
      });
    }

    return this;
  }

  /**
   * Retrieves the configured `SelectQueryBuilder` instance.
   *
   * @returns The configured `SelectQueryBuilder<ENTITY>` instance.
   */
  getQueryBuilder(): SelectQueryBuilder<ENTITY> {
    return this.queryBuilder;
  }
}
