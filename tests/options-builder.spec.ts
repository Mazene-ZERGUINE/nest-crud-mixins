import { FilterOptionsBuilder } from '../src/utils/filter-options-builder';
import { OrderByOptions } from '../src/core/interfaces/filter-options';

describe('FilterOptionsBuilder', () => {
  let builder: FilterOptionsBuilder;

  beforeEach(() => {
    builder = new FilterOptionsBuilder();
  });

  it('should initialize with default values', () => {
    const options = builder.build();

    expect(options.filters).toEqual({});
    expect(options.orderBy).toEqual([]);
    expect(options.selectFields).toEqual([]);
    expect(options.pagination).toEqual({});
    expect(options.search).toEqual({});
    expect(options.date).toEqual({ field: '' });
    expect(options.includeDeleted).toBe(false);
    expect(options.isNull).toEqual({ field: '', isNull: false });
    expect(options.groupBy).toEqual({ field: '' });
  });

  it('should set filters correctly', () => {
    builder.setFilters({ name: 'John' });
    expect(builder.build().filters).toEqual({ name: 'John' });
  });

  it('should set order by correctly', () => {
    const orderBy: OrderByOptions[] = [{ field: 'createdAt', order: 'DESC' }];
    builder.setOrderBy(orderBy);
    expect(builder.build().orderBy).toEqual(orderBy);
  });

  it('should set select fields correctly', () => {
    builder.setSelectFields(['id', 'name']);
    expect(builder.build().selectFields).toEqual(['id', 'name']);
  });

  it('should set pagination correctly', () => {
    builder.setPagination(10, 5);
    expect(builder.build().pagination).toEqual({ limit: 10, offset: 5 });
  });

  it('should set search correctly', () => {
    builder.setSearch(['name'], 'John');
    expect(builder.build().search).toEqual({ searchFields: ['name'], value: 'John' });
  });

  it('should set date range correctly', () => {
    builder.setDateRange('createdAt', '2024-03-01', '2024-03-10');
    expect(builder.build().date).toEqual({
      field: 'createdAt',
      from: '2024-03-01',
      to: '2024-03-10',
    });
  });

  it('should set includeDeleted correctly', () => {
    builder.setIncludeDeleted(true);
    expect(builder.build().includeDeleted).toBe(true);
  });

  it('should set isNull correctly', () => {
    builder.setIsNull('deletedAt', true);
    expect(builder.build().isNull).toEqual({ field: 'deletedAt', isNull: true });
  });

  it('should set groupBy correctly', () => {
    builder.setGroupBy('id', { condition: 'COUNT(id) >', value: 5 });
    expect(builder.build().groupBy).toEqual({
      field: 'id',
      having: { condition: 'COUNT(id) >', value: 5 },
    });
  });
});
