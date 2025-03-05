import 'reflect-metadata';
export const UPDATE_DTO_KEY = 'updateDto';

export function UpdateDto(dto: any): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(UPDATE_DTO_KEY, dto, target, propertyKey);
    } else {
      Reflect.defineMetadata(UPDATE_DTO_KEY, dto, target);
    }
  };
}
