import { IMixinsCrudService } from './interfaces/mixins-crud-service-interface';
import { MixinsCrudEntity } from './mixins-crud-entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FilterOptions } from './interfaces/filter-options';
import { QueryBuilderService } from '../utils/query-builder-service';
import { LoggerUtils } from '../utils/logger.utils'; // ✅ Add Logger for debugging

export abstract class MixinsCrudService<ENTITY extends MixinsCrudEntity>
  implements IMixinsCrudService<ENTITY>
{
  protected constructor(
    private readonly repository: Repository<ENTITY>,
    private readonly entity: ENTITY,
  ) {}

  private readonly relations: string[] = this.entity.getRelations();

  /**
   * Creates a new entity and saves it to the database.
   * @param entity The entity data to create.
   * @returns The created entity.
   */
  async createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY> {
    try {
      const newEntity: ENTITY = this.repository.create(entity);
      return await this.repository.save(newEntity);
    } catch (error) {
      LoggerUtils.logError(`Failed to create entity ${this.entity.getEntityName()}`, error);
      throw new InternalServerErrorException(
        `Failed to create entity ${this.entity.getEntityName()}`,
      );
    }
  }

  /**
   * Deletes an entity permanently.
   * @param id The entity ID to delete.
   */
  async deleteEntity(id: string | number): Promise<void> {
    try {
      const entity = await this.findEntity(id);
      if (!entity) {
        LoggerUtils.logError(`Entity ${this.entity.getEntityName()} with ID ${id} not found`);
        throw new NotFoundException(
          `Entity ${this.entity.getEntityName()} with ID ${id} not found`,
        );
      }
      await this.repository.delete(id);
    } catch (error) {
      LoggerUtils.logError('Error deleting entity', error);
      throw error; // ✅ Preserve stack trace
    }
  }

  /**
   * Soft deletes an entity (marks it as deleted instead of removing it from the database).
   * @param id The entity ID to soft delete.
   */
  async softDeleteEntity(id: string | number): Promise<void> {
    try {
      const entity = await this.findEntity(id);
      if (!entity) {
        LoggerUtils.logError(`Entity ${this.entity.getEntityName()} with ID ${id} not found`);
        throw new NotFoundException(
          `Entity ${this.entity.getEntityName()} with ID ${id} not found`,
        );
      }
      await this.repository.softDelete(id);
    } catch (error) {
      LoggerUtils.logError('Error soft deleting entity', error);
      throw error;
    }
  }

  /**
   * Retrieves all entities with optional filtering, sorting, and pagination.
   * @param filterOptions Optional filters for the query.
   * @returns A list of matching entities.
   */
  async findAllEntities(filterOptions?: FilterOptions): Promise<ENTITY[]> {
    try {
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
    } catch (error) {
      LoggerUtils.logError(`Error retrieving entities for ${this.entity.getEntityName()}`, error);
      throw new InternalServerErrorException(
        `Failed to retrieve entities for ${this.entity.getEntityName()}`,
      );
    }
  }

  /**
   * Finds a specific entity by its ID.
   * @param id The ID of the entity to find.
   * @returns The entity, if found.
   */
  async findEntity(id: string | number): Promise<ENTITY | null> {
    try {
      const searchCriteria = {
        ['id']: id as unknown,
      } as FindOptionsWhere<ENTITY>;

      const entity = await this.repository.findOne({
        where: searchCriteria,
        relations: this.relations,
      });

      if (!entity) {
        LoggerUtils.logError(`Entity ${this.entity.getEntityName()} with ID ${id} not found`);
        throw new NotFoundException(
          `Entity ${this.entity.getEntityName()} with ID ${id} not found`,
        );
      }

      return entity;
    } catch (error) {
      LoggerUtils.logError(`Error finding entity with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Updates an existing entity with new data.
   * @param id The ID of the entity to update.
   * @param updateDto The data to update the entity with.
   * @returns The updated entity.
   */
  async updateEntity(id: string | number, updateDto: DeepPartial<ENTITY>): Promise<ENTITY | null> {
    try {
      const entity = await this.findEntity(id);
      if (!entity) {
        LoggerUtils.logError(`Entity ${this.entity.getEntityName()} with ID ${id} not found`);
        throw new NotFoundException(
          `Entity ${this.entity.getEntityName()} with ID ${id} not found`,
        );
      }
      const updatedEntity = this.repository.merge(entity, updateDto);
      return await this.repository.save(updatedEntity);
    } catch (error) {
      LoggerUtils.logError(
        `Error updating entity ${this.entity.getEntityName()} with ID ${id}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Restores a soft-deleted entity.
   * @param id The ID of the entity to restore.
   */
  async restoreEntity(id: number): Promise<void> {
    try {
      const entity = await this.findEntity(id);
      await this.repository.restore(id);
    } catch (error) {
      LoggerUtils.logError(`Error restoring entity with ID ${id}`, error);
      throw error;
    }
  }
}
