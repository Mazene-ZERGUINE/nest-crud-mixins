export interface IMixinsCrudService<DTO, ENTITY> {
  createEntity(dto: DTO): Promise<ENTITY | void>;
  findAllEntities(): Promise<ENTITY[]>;
  findEntity(id: number | string): Promise<ENTITY | null>;
  deleteEntity(id: number | string): Promise<void>;
  partialUpdate(id: number | string, dto: DTO): Promise<ENTITY>;
}
