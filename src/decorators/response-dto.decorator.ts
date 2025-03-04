import 'reflect-metadata';

export const RESPONSE_DTO_KEY = 'responseDto';

export function ResponseDto(dto: any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(RESPONSE_DTO_KEY, dto, target);
  };
}
