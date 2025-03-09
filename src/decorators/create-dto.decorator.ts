import 'reflect-metadata';

/**
 * Metadata key for storing the Create DTO.
 */
export const CREATE_DTO_KEY = 'createDto';

/**
 * Decorator that assigns a DTO (Data Transfer Object) to be used for entity creation.
 * This decorator can be applied at both the **class level** and **method level**.
 *
 * - At the **class level**, it sets the default Create DTO for the entire controller.
 * - At the **method level**, it allows specifying a different Create DTO for specific endpoints.
 *
 * The DTO is stored using Reflect Metadata and can be retrieved later using `Reflect.getMetadata(CREATE_DTO_KEY, target)`.
 *
 * @example **Usage at the class level**:
 * ```ts
 * @CreateDto(CreateUserDto)
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {}
 * ```
 *
 * @example **Usage at the method level**:
 * ```ts
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {
 *   @CreateDto(SpecialUserDto)
 *   @Post('special')
 *   createSpecialUser(@Body() createDto: SpecialUserDto) {
 *     return this.service.createEntity(createDto);
 *   }
 * }
 * ```
 *
 * @param dto - The DTO class that will be used for validation and transformation.
 * @returns A decorator function that stores metadata for class or method.
 */
export function CreateDto(dto: any): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(CREATE_DTO_KEY, dto, target, propertyKey);
    } else {
      Reflect.defineMetadata(CREATE_DTO_KEY, dto, target);
    }
  };
}
