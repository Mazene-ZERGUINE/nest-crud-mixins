import 'reflect-metadata';

/**
 * Metadata key for storing the Response DTO configuration.
 */
export const RESPONSE_DTO_KEY = 'responseDto';

/**
 * Decorator that assigns a DTO (Data Transfer Object) for response transformation.
 *
 * This decorator can be applied at both the **class level** and **method level**.
 *
 * - At the **class level**, it defines a default response DTO for the entire controller.
 * - At the **method level**, it allows specifying a different response DTO for specific endpoints.
 * - An **optional transformation function** can be provided to modify the output format.
 *
 * The metadata stored via `Reflect Metadata` can be retrieved using `Reflect.getMetadata(RESPONSE_DTO_KEY, target)`.
 *
 * @example **Usage at the class level**:
 * ```ts
 * @ResponseDto(ResponseUserDto)
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {}
 * ```
 *
 * @example **Usage at the method level with transformation function**:
 * ```ts
 * export class UserController extends MixinsCrudController<UserEntity, UserService> {
 *   @ResponseDto(ResponseUserDto, (data) => ({
 *     success: true,
 *     message: 'User retrieved successfully',
 *     data,
 *   }))
 *   @Get(':id')
 *   async getUser(@Param('id') id: number): Promise<ResponseUserDto> {
 *     return this.service.findEntity(id);
 *   }
 * }
 * ```
 *
 * @param dto - The DTO class used for transforming response data.
 * @param transformFn - Optional function to customize the response format.
 * @returns A decorator function that stores metadata for class or method responses.
 */
export function ResponseDto(
  dto: any,
  transformFn?: (data: any) => any,
): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // Apply response DTO metadata at the method level
      Reflect.defineMetadata(RESPONSE_DTO_KEY, { dto, transformFn }, target, propertyKey);
    } else {
      // Apply response DTO metadata at the class level
      Reflect.defineMetadata(RESPONSE_DTO_KEY, { dto, transformFn }, target);
    }
  };
}
