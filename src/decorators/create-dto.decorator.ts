import 'reflect-metadata';

export const CREATE_DTO_KEY = 'createDto';

export function CreateDto(dto: any): ClassDecorator & MethodDecorator {
  return (target: NonNullable<unknown>, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(CREATE_DTO_KEY, dto, target, propertyKey);
    } else {
      Reflect.defineMetadata(CREATE_DTO_KEY, dto, target);
    }
  };
}
