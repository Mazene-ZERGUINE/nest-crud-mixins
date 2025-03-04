import 'reflect-metadata';
export const UPDATE_DTO_KEY = 'updateDto';

export function UpdateDto(dto: any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(UPDATE_DTO_KEY, dto, target);
  };
}
