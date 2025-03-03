export interface ICrudControllerInterface<DTO, RESPONSE_DTO> {
  create(createDto: DTO): Promise<RESPONSE_DTO | void>;
  getAll(): Promise<RESPONSE_DTO[]>;
  getOne(id: number | string): Promise<RESPONSE_DTO | undefined>;
  delete(id: number | string): Promise<void>;
  update(id: number | string, updateDto: DTO): Promise<RESPONSE_DTO | void>;
  partialUpdate(id: number | string, updateDto: DTO): Promise<RESPONSE_DTO | void>;
}
