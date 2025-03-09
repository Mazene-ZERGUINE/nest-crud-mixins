import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class QueryBuilderService<ENTITY extends ObjectLiteral> {
  constructor(private queryBuilder: SelectQueryBuilder<ENTITY>) {}

  applyFilters(filters?: Record<string, any>) {
    if (!filters) return this;

    Object.keys(filters).forEach((key) => {
      this.queryBuilder.andWhere(`entity.${key} = :${key}`, {
        [key]: filters[key],
      });
    });

    return this;
  }

  applyOrderBy(orderBy?: { field: string; order?: 'ASC' | 'DESC' }[]) {
    if (!orderBy || orderBy.length === 0) return this;

    orderBy.forEach(({ field, order }) => {
      this.queryBuilder.addOrderBy(`entity.${field}`, order || 'ASC');
    });

    return this;
  }

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

  applyPagination(pagination?: { limit?: number; offset?: number }) {
    if (!pagination || !pagination.limit) return this;

    this.queryBuilder.limit(pagination.limit).offset(pagination.offset || 0);

    return this;
  }

  applySearch(search?: { searchFields?: string[]; value?: string }) {
    if (!search?.value || !search.searchFields?.length) return this;

    search.searchFields.forEach((field, index) => {
      this.queryBuilder.orWhere(`${index === 0 ? '' : 'OR'} entity.${field} LIKE :search`, {
        search: `%${search.value}%`,
      });
    });

    return this;
  }

  applyDateFilter(date?: { field: string; from?: string; to?: string }) {
    if (!date?.field || !date.from || !date.to) return this;

    this.queryBuilder.andWhere(`entity.${date.field} BETWEEN :from AND :to`, {
      from: date.from,
      to: date.to,
    });

    return this;
  }

  applyIncludeDeleted(includeDeleted?: boolean) {
    if (includeDeleted) {
      this.queryBuilder.withDeleted();
    }

    return this;
  }

  applyIsNull(isNull?: { field: string; isNull: boolean }) {
    if (!isNull?.field) return this;

    this.queryBuilder.andWhere(`entity.${isNull.field} IS ${isNull.isNull ? 'NULL' : 'NOT NULL'}`);

    return this;
  }

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

  getQueryBuilder(): SelectQueryBuilder<ENTITY> {
    return this.queryBuilder;
  }
}
