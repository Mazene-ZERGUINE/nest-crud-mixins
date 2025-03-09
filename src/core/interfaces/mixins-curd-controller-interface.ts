import { DeepPartial } from 'typeorm';
import { FilterOptions } from './filter-options';

/**
 * Generic CRUD controller interface for handling API requests.
 * This interface defines standard methods for creating, retrieving,
 * updating, and deleting entities while allowing customization via filters.
 *
 * @template ENTITY - The entity type that the controller operates on.
 */
export interface IMixinsCrudControllerInterface<ENTITY> {
  /**
   * Optional filter options that can be applied globally to all queries.
   */
  filterOptions?: FilterOptions;

  /**
   * Creates a new entity in the database.
   *
   * @param createDto - A partial object containing the entity data to be created.
   * @returns A promise that resolves to the created entity.
   */
  create(createDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;

  /**
   * Retrieves all entities with optional filtering.
   *
   * @returns A promise that resolves to an array of entities.
   */
  getAll(): Promise<DeepPartial<ENTITY>[]>;

  /**
   * Retrieves a single entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity (string or number).
   * @returns A promise that resolves to the entity if found, otherwise `undefined`.
   */
  getOne(id: number | string): Promise<DeepPartial<ENTITY> | undefined>;

  /**
   * Deletes an entity permanently from the database.
   *
   * @param id - The unique identifier of the entity to be deleted.
   * @returns A promise that resolves once the deletion is complete.
   */
  delete(id: number | string): Promise<void>;

  /**
   * Updates an existing entity with new data.
   *
   * @param id - The unique identifier of the entity to be updated.
   * @param updateDto - A partial object containing the updated data.
   * @returns A promise that resolves to the updated entity.
   */
  update(id: number | string, updateDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;

  /**
   * Partially updates an existing entity with new data.
   *
   * @param id - The unique identifier of the entity to be updated.
   * @param updateDto - A partial object containing the fields to be updated.
   * @returns A promise that resolves to the updated entity.
   */
  partialUpdate(id: number | string, updateDto: DeepPartial<ENTITY>): Promise<DeepPartial<ENTITY>>;
}
