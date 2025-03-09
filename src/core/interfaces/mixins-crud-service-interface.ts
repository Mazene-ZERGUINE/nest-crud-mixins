import { DeepPartial } from 'typeorm';
import { FilterOptions } from './filter-options';

/**
 * Generic CRUD service interface for managing entities.
 * This interface provides methods for creating, retrieving, updating,
 * and deleting entities in a TypeORM-based repository.
 *
 * @template ENTITY - The entity type that the service operates on.
 */
export interface IMixinsCrudService<ENTITY> {
  /**
   * Creates a new entity in the database.
   *
   * @param entity - A partial object containing the entity data to be created.
   * @returns A promise that resolves to the created entity.
   */
  createEntity(entity: DeepPartial<ENTITY>): Promise<ENTITY>;

  /**
   * Retrieves all entities from the database with optional filtering.
   *
   * @param filterOptions - Optional filters, sorting, pagination, and selection criteria.
   * @returns A promise that resolves to an array of entities matching the filter criteria.
   */
  findAllEntities(filterOptions?: FilterOptions): Promise<ENTITY[]>;

  /**
   * Finds a single entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity (string or number).
   * @returns A promise that resolves to the entity if found, otherwise `null`.
   */
  findEntity(id: string | number): Promise<ENTITY | null>;

  /**
   * Deletes an entity permanently from the database.
   *
   * @param id - The unique identifier of the entity to be deleted.
   * @returns `void` (the entity is deleted without returning data).
   */
  deleteEntity(id: string | number): void;

  /**
   * Soft deletes an entity by marking it as deleted without removing it from the database.
   * Useful for cases where entities need to be recoverable.
   *
   * @param id - The unique identifier of the entity to be soft deleted.
   * @returns A promise that resolves once the entity has been marked as deleted.
   */
  softDeleteEntity(id: string | number): Promise<void>;

  /**
   * Updates an existing entity with new data.
   *
   * @param id - The unique identifier of the entity to be updated.
   * @param entity - A partial object containing the updated data.
   * @returns A promise that resolves to the updated entity, or `null` if not found.
   */
  updateEntity(id: string | number, entity: any): Promise<ENTITY | null>;
}
