/**
 * Abstract base class for entities in the Mixins CRUD framework.
 * This class provides functionality for managing entity relations and retrieving entity metadata.
 */
export abstract class MixinsCrudEntity {
  /**
   * Constructor that sets the entity name dynamically based on the class name.
   */
  constructor() {
    Object.defineProperty(this, 'entityName', {
      value: this.constructor.name,
      writable: false,
      enumerable: true,
    });
  }

  /**
   * Stores the relations of the entity for query building.
   * These relations will be used when fetching related data.
   */
  protected _entityRelation: string[] = [];

  /**
   * Defines the relations for the entity.
   * @param relations - An array of related entity names (as strings).
   */
  setRelations(relations: string[]) {
    this._entityRelation = relations;
  }

  /**
   * Retrieves the list of relations defined for this entity.
   * @returns An array of relation names.
   */
  getRelations(): string[] {
    return this._entityRelation;
  }

  /**
   * Retrieves the entity's class name dynamically.
   * This is useful for logging, debugging, or error handling.
   * @returns The name of the entity class.
   */
  getEntityName(): string {
    return this.constructor.name;
  }
}
