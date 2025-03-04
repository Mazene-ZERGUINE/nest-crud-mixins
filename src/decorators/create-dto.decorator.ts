import 'reflect-metadata';

export const CREATE_DTO_KEY = 'createDto';
export function CreateDto(dto: any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CREATE_DTO_KEY, dto, target);
  };
}
