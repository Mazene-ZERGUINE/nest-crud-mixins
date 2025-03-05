import 'reflect-metadata';

export const RESPONSE_DTO_KEY = 'responseDto';

export function ResponseDto(dto: any, transformFn?: (data: any) => any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(RESPONSE_DTO_KEY, { dto, transformFn }, target);
  };
}
