import { FilterOptions, OrderByOptions } from '../core/interfaces/filter-options';

export class FilterOptionsBuilder {
  private readonly options: FilterOptions = {};

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

  setFilters(filters: Record<string, any>): this {
    this.options.filters = filters;
    return this;
  }

  setOrderBy(orderBy: OrderByOptions[]): this {
    this.options.orderBy = orderBy;
    return this;
  }

  setSelectFields(selectFields: string[]): this {
    this.options.selectFields = selectFields;
    return this;
  }

  setPagination(limit: number, offset: number): this {
    this.options.pagination = { limit, offset };
    return this;
  }

  setSearch(searchFields: string[], value: string): this {
    this.options.search = { searchFields, value };
    return this;
  }

  setDateRange(field: string, from: string, to: string): this {
    this.options.date = { field, from, to };
    return this;
  }

  setIncludeDeleted(includeDeleted: boolean): this {
    this.options.includeDeleted = includeDeleted;
    return this;
  }

  setIsNull(field: string, isNull: boolean): this {
    this.options.isNull = { field, isNull };
    return this;
  }

  setGroupBy(field: string, having?: { condition: string; value: number }): this {
    this.options.groupBy = { field, having };
    return this;
  }

  build(): FilterOptions {
    return this.options;
  }
}
