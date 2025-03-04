import { plainToInstance } from 'class-transformer';

export class EntityToDtoMapper {
  /**
   * Maps an entity object to the given DTO class using `class-transformer`
   * @param DtoClass - The Response DTO class
   * @param entity - The entity instance
   * @returns An instance of the DTO with mapped fields
   */
  static map<T>(DtoClass: new () => T, entity: any): T {
    if (!DtoClass || !entity) return entity;
    return plainToInstance(DtoClass, entity, { excludeExtraneousValues: true });
  }
}
