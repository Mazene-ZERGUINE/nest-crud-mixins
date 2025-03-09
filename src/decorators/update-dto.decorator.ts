import 'reflect-metadata';

/**
 * Metadata key for storing the Update DTO configuration.
 */
export const UPDATE_DTO_KEY = 'updateDto';

/**
 * Decorator that assigns an Update DTO (Data Transfer Object) for request validation.
 *
 * This decorator can be applied at both the **class level** and **method level**:
 * - At the **class level**, it defines a default update DTO for all update operations in the controller.
 * - At the **method level**, it allows specifying a different update DTO for specific endpoints.
 *
 * The metadata is stored using `Reflect Metadata` and can be retrieved via `Reflect.getMetadata(UPDATE_DTO_KEY, target)`.
 *
 * @example **Usage at the class level**:
 * ```ts
 * @UpdateDto(UpdateUserDto)
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {}
 * ```
 *
 * @example **Usage at the method level**:
 * ```ts
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {
 *   @UpdateDto(UpdateUserDto)
 *   @Put(':id')
 *   async updateUser(@Param('id') id: number, @Body() updateDto: UpdateUserDto): Promise<UserEntity> {
 *     return this.service.updateEntity(id, updateDto);
 *   }
 * }
 * ```
 *
 * @param dto - The DTO class used for request validation when updating entities.
 * @returns A decorator function that stores metadata for class or method update requests.
 */
export function UpdateDto(dto: any): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // Apply Update DTO metadata at the method level
      Reflect.defineMetadata(UPDATE_DTO_KEY, dto, target, propertyKey);
    } else {
      // Apply Update DTO metadata at the class level
      Reflect.defineMetadata(UPDATE_DTO_KEY, dto, target);
    }
  };
}
