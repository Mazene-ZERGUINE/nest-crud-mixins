/**
 * Interface for entities that support dynamic relations and response DTO transformations.
 */
export interface IMixinsCrudEntity {
  /**
   * Registers related entities that should be loaded with this entity.
   * @param relation - An array of relation names to be included in queries.
   * @example
   * ```typescript
   * userEntity.registerRelations(['profile', 'posts']);
   * ```
   */
  registerRelations(relation: string[]): void;

  /**
   * Retrieves the list of registered relations for this entity.
   * @returns An array of relation names.
   * @example
   * ```typescript
   * const relations = userEntity.getRelations();
   * console.log(relations); // ['profile', 'posts']
   * ```
   */
  getRelations(): string[];
}
