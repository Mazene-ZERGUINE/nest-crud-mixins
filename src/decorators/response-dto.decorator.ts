import 'reflect-metadata';

export const RESPONSE_DTO_KEY = 'responseDto';

export function ResponseDto(
  dto: any,
  transformFn?: (data: any) => any,
): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(RESPONSE_DTO_KEY, { dto, transformFn }, target, propertyKey);
    } else {
      Reflect.defineMetadata(RESPONSE_DTO_KEY, { dto, transformFn }, target);
    }
  };
}
