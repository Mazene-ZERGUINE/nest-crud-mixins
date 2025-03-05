import { Expose, plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import { EntityToDtoMapper } from '../src/utils/entity-to-dto.mapper'; // Ensure decorators work in tests

class TestDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;
}

class TestEntity {
  id: number;
  name: string;
  password: string;

  constructor(id: number, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }
}

describe('EntityToDtoMapper', () => {
  it('should map an entity to a DTO instance', () => {
    const entity = new TestEntity(1, 'John Doe', 'secret123');
    const dto = EntityToDtoMapper.map(TestDto, entity);

    expect(dto).toBeInstanceOf(TestDto);
    expect(dto.id).toBe(entity.id);
    expect(dto.name).toBe(entity.name);
  });

  it('should exclude extra properties from the entity', () => {
    const entity = new TestEntity(2, 'Alice Doe', 'hiddenPassword');
    const dto = EntityToDtoMapper.map(TestDto, entity);

    expect(dto).toBeInstanceOf(TestDto);
    expect(dto).toHaveProperty('id', entity.id);
    expect(dto).toHaveProperty('name', entity.name);
    expect((dto as any).password).toBeUndefined();
  });

  it('should return the same entity if DTO class is not provided', () => {
    const entity = new TestEntity(3, 'Bob Doe', 'superSecret');
    const dto = EntityToDtoMapper.map(null as any, entity);

    expect(dto).toBe(entity);
  });

  it('should return the same entity if entity is null or undefined', () => {
    const dto1 = EntityToDtoMapper.map(TestDto, null);
    const dto2 = EntityToDtoMapper.map(TestDto, undefined);

    expect(dto1).toBeNull();
    expect(dto2).toBeUndefined();
  });
});
