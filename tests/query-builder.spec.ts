import { Column, Entity, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { QueryBuilderService } from '../src/utils/query-builder-service';

// Sample entity interface for mocking
@Entity()
class TestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  createdAt!: string;
}

describe('QueryBuilderService', () => {
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<TestEntity>>;
  let service: QueryBuilderService<TestEntity>;

  beforeEach(() => {
    queryBuilderMock = {
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      having: jest.fn().mockReturnThis(),
      getQueryAndParameters: jest.fn(),
    } as any;

    service = new QueryBuilderService<TestEntity>(queryBuilderMock);
  });

  it('should apply filters correctly', () => {
    service.applyFilters({ name: 'John' });
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('entity.name = :name', { name: 'John' });
  });

  it('should apply ordering correctly', () => {
    service.applyOrderBy([{ field: 'createdAt', order: 'DESC' }]);
    expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('entity.createdAt', 'DESC');
  });

  it('should apply selection of fields correctly', () => {
    service.applySelectFields(['id', 'name']);
    expect(queryBuilderMock.select).toHaveBeenCalledWith(['entity.id', 'entity.name']);
  });

  it('should apply pagination correctly', () => {
    service.applyPagination({ limit: 10, offset: 5 });
    expect(queryBuilderMock.limit).toHaveBeenCalledWith(10);
    expect(queryBuilderMock.offset).toHaveBeenCalledWith(5);
  });

  it('should apply search correctly', () => {
    service.applySearch({ searchFields: ['name'], value: 'John' });
    expect(queryBuilderMock.orWhere).toHaveBeenCalledWith(' entity.name LIKE :search', {
      search: '%John%',
    });
  });

  it('should apply date filter correctly', () => {
    service.applyDateFilter({ field: 'createdAt', from: '2024-03-01', to: '2024-03-10' });
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'entity.createdAt BETWEEN :from AND :to',
      { from: '2024-03-01', to: '2024-03-10' },
    );
  });

  it('should apply soft delete correctly', () => {
    service.applyIncludeDeleted(true);
    expect(queryBuilderMock.withDeleted).toHaveBeenCalled();
  });

  it('should apply IS NULL filter correctly', () => {
    service.applyIsNull({ field: 'deletedAt', isNull: true });
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith('entity.deletedAt IS NULL');
  });

  it('should apply group by correctly', () => {
    service.applyGroupBy({ field: 'id', having: { condition: 'COUNT(id) >', value: 5 } });
    expect(queryBuilderMock.groupBy).toHaveBeenCalledWith('entity.id');
    expect(queryBuilderMock.having).toHaveBeenCalledWith('COUNT(id) > :value', { value: 5 });
  });
});
