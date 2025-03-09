import { IMixinsCrudService } from './interfaces/mixins-crud-service-interface';
import { MixinsCrudEntity } from './mixins-crud-entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FilterOptions } from './interfaces/filter-options';
import { QueryBuilderService } from '../utils/query-builder-service';

export abstract class MixinsCrudService<ENTITY extends MixinsCrudEntity>
  implements IMixinsCrudService<ENTITY>
{
  protected constructor(
    private readonly repository: Repository<ENTITY>,
    private readonly entity: ENTITY,
  ) {}

  private readonly relations: string[] = this.entity.getRelations();

  async createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY> {
    const newEntity: ENTITY = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async deleteEntity(id: string | number): Promise<void> {
    await this.repository.delete(id);
  }

  async softDeleteEntity(id: string | number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findAllEntities(filterOptions?: FilterOptions): Promise<ENTITY[]> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    this.entity.getRelations().forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    return new QueryBuilderService(queryBuilder)
      .applyFilters(filterOptions?.filters)
      .applyOrderBy(filterOptions?.orderBy)
      .applySelectFields(filterOptions?.selectFields, this.entity.getRelations())
      .applyPagination(filterOptions?.pagination)
      .applySearch(filterOptions?.search)
      .applyDateFilter(filterOptions?.date)
      .applyIncludeDeleted(filterOptions?.includeDeleted)
      .applyIsNull(filterOptions?.isNull)
      .applyGroupBy(filterOptions?.groupBy)
      .getQueryBuilder()
      .getMany();
  }

  async findEntity(id: string | number): Promise<ENTITY | null> {
    const searchCriteria = {
      ['id']: id as unknown,
    } as FindOptionsWhere<ENTITY>;
    return await this.repository.findOne({
      where: searchCriteria,
      relations: this.relations,
    });
  }

  async updateEntity(id: string | number, updateDto: DeepPartial<ENTITY>): Promise<ENTITY | null> {
    const entity = await this.findEntity(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    const updatedEntity = this.repository.merge(entity, updateDto);
    return await this.repository.save(updatedEntity);
  }

  async restoreEntity(id: number): Promise<void> {
    await this.repository.restore(id);
  }
}
